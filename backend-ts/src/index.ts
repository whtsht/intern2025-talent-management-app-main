import express, { Request, Response } from "express";
import { EmployeeDatabaseInMemory } from './employee/EmployeeDatabaseInMemory';
import { EmployeeFilter } from './employee/Employee';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = process.env.PORT ?? 8080;
const database = new EmployeeDatabaseInMemory();

app.use(express.json()); // JSONボディパース用

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

app.post("/api/employees", async (req: Request, res: Response) => {
    const { name, age, department, position } = req.body;
    // 必須項目バリデーション
    if (
        typeof name !== "string" ||
        typeof age !== "number" ||
        typeof department !== "string" ||
        typeof position !== "string"
    ) {
        res.status(400).json({ message: "Invalid request body" });
        return;
    }
    const newEmployee = {
        id: uuidv4(),
        name,
        age,
        department,
        position
    };
    try {
        await database.addEmployee(newEmployee);
        res.status(201).json(newEmployee);
    } catch (e) {
        console.error("Failed to add employee", e);
        res.status(500).json({ message: "Failed to add employee" });
    }
});

app.listen(port, () => {
    console.log(`App listening on the port ${port}`);
});
