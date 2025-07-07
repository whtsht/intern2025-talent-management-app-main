import { EmployeeDatabase } from "./EmployeeDatabase";
import { Employee } from "./Employee";

export class EmployeeDatabaseInMemory implements EmployeeDatabase {
    private employees: Map<string, Map<string, Employee>>

    constructor() {
        this.employees = new Map<string, Map<string, Employee>>();
        
        // Create test data for default user
        const defaultUserId = "test-user";
        const defaultEmployees = new Map<string, Employee>();
        defaultEmployees.set("1", { id: "1", name: "Jane Doe", age: 22 });
        defaultEmployees.set("2", { id: "2", name: "John Smith", age: 28 });
        defaultEmployees.set("3", { id: "3", name: "山田 太郎", age: 27 });
        this.employees.set(defaultUserId, defaultEmployees);
    }

    async getEmployee(id: string, userId: string): Promise<Employee | undefined> {
        const userEmployees = this.employees.get(userId);
        if (!userEmployees) {
            return undefined;
        }
        return userEmployees.get(id);
    }

    async getEmployees(filterText: string, userId: string): Promise<Employee[]> {
        const userEmployees = this.employees.get(userId);
        if (!userEmployees) {
            return [];
        }
        
        const employees = Array.from(userEmployees.values());
        if (filterText === "") {
            return employees;
        }
        return employees.filter(employee => employee.name.includes(filterText));
    }
}
