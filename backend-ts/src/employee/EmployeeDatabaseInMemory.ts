import { EmployeeDatabase } from "./EmployeeDatabase";
import { Employee, EmployeeFilter } from "./Employee";

export class EmployeeDatabaseInMemory implements EmployeeDatabase {
    private employees: Map<string, Employee>

    // ただのオブジェクトではなく、Mapにすることで複雑な形式でも扱いやすいようにする
    constructor() {
        this.employees = new Map<string, Employee>();
        this.employees.set("1", { id: "1", name: "Jane Doe", age: 22, department: "IT", position: "Engineer" });
        this.employees.set("2", { id: "2", name: "John Smith", age: 28, department: "HR", position: "Manager" });
        this.employees.set("3", { id: "3", name: "山田 太郎", age: 27, department: "Sales", position: "Sales Manager" });
    }

    // constructorで代入したデータを取り出すメソッド
    async getEmployee(id: string): Promise<Employee | undefined> {
        return this.employees.get(id);
    }

    // TODO: 複数パラメータでのfilterに対応する
    async getEmployees(filters: EmployeeFilter): Promise<Employee[]> {
        const employees = Array.from(this.employees.values());
        return employees.filter(employee =>
            (filters.name ? employee.name.includes(filters.name) : true) &&
            (filters.department ? employee.department.includes(filters.department) : true) &&
            (filters.position ? employee.position.includes(filters.position) : true)
        );
    }

    async addEmployee(employee: Employee): Promise<void> {
        this.employees.set(employee.id, employee);
    }
}
