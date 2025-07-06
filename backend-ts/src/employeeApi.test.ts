import request from "supertest";
import express from "express";
import { EmployeeDatabaseInMemory } from "./employee/EmployeeDatabaseInMemory";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(express.json());
const database = new EmployeeDatabaseInMemory();

app.post("/api/employees", async (req, res) => {
  const { name, age, department, position } = req.body;
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
    position,
  };
  try {
    await database.addEmployee(newEmployee);
    res.status(201).json(newEmployee);
  } catch (e) {
    res.status(500).json({ message: "Failed to add employee" });
  }
});

describe("POST /api/employees", () => {
  it("should add a new employee and return 201", async () => {
    const res = await request(app)
      .post("/api/employees")
      .send({
        name: "テスト太郎",
        age: 30,
        department: "開発",
        position: "エンジニア",
      })
      .set("Content-Type", "application/json");
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe("テスト太郎");
  });

  it("should return 400 for invalid body", async () => {
    const res = await request(app)
      .post("/api/employees")
      .send({
        name: "テスト太郎",
        department: "開発",
        position: "エンジニア",
      }) // ageがない
      .set("Content-Type", "application/json");
    expect(res.status).toBe(400);
  });
}); 