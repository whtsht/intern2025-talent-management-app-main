import { EmployeeDatabase } from "./EmployeeDatabase";
import { Employee } from "./Employee";

export class EmployeeDatabaseInMemory implements EmployeeDatabase {
  private employees: Map<string, Employee>;

  constructor() {
    this.employees = new Map<string, Employee>();
    this.employees.set("1", { id: "1", name: "Jane Doe", age: 22 });
    this.employees.set("2", { id: "2", name: "John Smith", age: 28 });
    this.employees.set("3", { id: "3", name: "山田 太郎", age: 27 });
    this.employees.set("4", {
      id: "4",
      name: "佐藤 花子",
      age: 30,
      skills: [
        { name: "JavaScript", level: "触れたことがある" },
        { name: "TypeScript", level: "使いこなすことができる" },
        { name: "React", level: "ある程度は使える" },
      ],
      certifications: ["基本情報技術者試験", "応用情報技術者試験"],
    } as Employee);
  }

  async getEmployee(id: string): Promise<Employee | undefined> {
    return this.employees.get(id);
  }

  async getEmployees(filterText: string): Promise<Employee[]> {
    const employees = Array.from(this.employees.values());
    if (filterText === "") {
      return employees;
    }
    return employees.filter((employee) => employee.name.includes(filterText));
  }
}
