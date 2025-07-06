import express, { Request, Response } from "express";
import { EmployeeDatabaseInMemory } from './employee/EmployeeDatabaseInMemory';
import { EmployeeFilter } from './employee/Employee';

const app = express();
const port = process.env.PORT ?? 8080;
const database = new EmployeeDatabaseInMemory();

// クエリパラメータからstring型のみを安全に取得するユーティリティ関数
function getStringQueryParam(query: any, key: string): string | undefined {
    const value = query[key];
    return typeof value === "string" ? value : undefined;
}

app.get("/api/employees", async (req: Request, res: Response) => {
    const filters: EmployeeFilter = {
        name: getStringQueryParam(req.query, "name"),
        department: getStringQueryParam(req.query, "department"),
        position: getStringQueryParam(req.query, "position"),
    };
    // 型チェック: 配列やオブジェクトが来た場合は400
    if ((req.query.name && typeof req.query.name !== "string") ||
        (req.query.department && typeof req.query.department !== "string") ||
        (req.query.position && typeof req.query.position !== "string")) {
            
        res.status(400).send();
        return;
    }
    try {
        const employees = await database.getEmployees(filters);
        res.status(200).send(JSON.stringify(employees));
    } catch (e) {
        console.error(`Failed to load the users filtered by`, filters, e);
        res.status(500).send();
    }
});

app.get("/api/employees/:userId", async (req: Request, res: Response) => {
    const userId = req.params.userId;
    try {
        const employee = await database.getEmployee(userId);
        if (employee == undefined) {
            res.status(404).send();
            return;
        }
        res.status(200).send(JSON.stringify(employee));
    } catch (e) {
        console.error(`Failed to load the user ${userId}.`, e);
        res.status(500).send();
    }
});

app.listen(port, () => {
    console.log(`App listening on the port ${port}`);
});
