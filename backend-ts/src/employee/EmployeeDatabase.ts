import { Employee, EmployeeFilter } from "./Employee";

export interface EmployeeDatabase {
    getEmployee(id: string): Promise<Employee | undefined>
    getEmployees(filters: EmployeeFilter): Promise<Employee[]>
}
