import { EmployeeDatabase } from "./EmployeeDatabase";
import { Employee, EmployeeFilter } from "./Employee";

export class EmployeeDatabaseInMemory implements EmployeeDatabase {
  private employees: Map<string, Employee>;

  // ただのオブジェクトではなく、Mapにすることで複雑な形式でも扱いやすいようにする
  constructor() {
    this.employees = new Map<string, Employee>();
    this.employees.set("1", {
      id: "1",
      name: "Jane Doe",
      age: 22,
      department: "IT",
      position: "Engineer",
    });
    this.employees.set("2", {
      id: "2",
      name: "John Smith",
      age: 28,
      department: "HR",
      position: "Manager",
    });
    this.employees.set("3", {
      id: "3",
      name: "山田 太郎",
      age: 27,
      department: "Sales",
      position: "Sales Manager",
    });
    this.employees.set("4", {
      id: "4",
      name: "Alice Johnson",
      age: 35,
      department: "Finance",
      position: "Accountant",
    });

    this.employees.set("5", {
      id: "5",
      name: "Robert Brown",
      age: 41,
      department: "IT",
      position: "Tech Lead",
      skills: [
        { name: "Node.js", level: "Advanced" },
        { name: "Docker", level: "Intermediate" },
      ],
      certifications: ["Certified Kubernetes Administrator"],
    });

    this.employees.set("6", {
      id: "6",
      name: "佐藤 美咲",
      age: 30,
      department: "Design",
      position: "UI/UX Designer",
      skills: [
        { name: "Figma", level: "Advanced" },
        { name: "Illustrator", level: "Advanced" },
      ],
    });

    this.employees.set("7", {
      id: "7",
      name: "Tom Wilson",
      age: 26,
      department: "Marketing",
      position: "Analyst",
    });

    this.employees.set("8", {
      id: "8",
      name: "Emily White",
      age: 29,
      department: "IT",
      position: "QA Engineer",
      certifications: ["ISTQB Foundation Level"],
    });

    this.employees.set("9", {
      id: "9",
      name: "伊藤 拓海",
      age: 33,
      department: "Product",
      position: "Product Manager",
      skills: [
        { name: "Agile", level: "Advanced" },
        { name: "Jira", level: "Intermediate" },
      ],
    });

    this.employees.set("10", {
      id: "10",
      name: "Chen Li",
      age: 31,
      department: "Data Science",
      position: "Data Analyst",
      skills: [
        { name: "Python", level: "Advanced" },
        { name: "SQL", level: "Advanced" },
      ],
      certifications: ["Google Data Analytics"],
    });
  }

  // constructorで代入したデータを取り出すメソッド
  async getEmployee(id: string): Promise<Employee | undefined> {
    return this.employees.get(id);
  }

  // TODO: 複数パラメータでのfilterに対応する
  async getEmployees(filters: EmployeeFilter): Promise<Employee[]> {
    const employees = Array.from(this.employees.values());
    return employees.filter(
      (employee) =>
        (filters.name ? employee.name.includes(filters.name) : true) &&
        (filters.department
          ? employee.department.includes(filters.department)
          : true) &&
        (filters.position ? employee.position.includes(filters.position) : true)
    );
  }
}
