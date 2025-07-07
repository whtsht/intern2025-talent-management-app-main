import { Employee } from "./Employee";

export interface EmployeeDatabase {
    getEmployee(id: string, userId: string): Promise<Employee | undefined>
    getEmployees(filterText: string, userId: string): Promise<Employee[]>
}
