import * as t from "io-ts";

// スキル型（io-ts）
export const SkillT = t.type({
  name: t.string,
  level: t.string,
});

export const EmployeeT = t.intersection([
  t.type({
    id: t.string,
    name: t.string,
    age: t.number,
    department: t.string,
    position: t.string,
  }),
  t.partial({
    skills: t.array(SkillT),
    certifications: t.array(t.string),
  }),
]);
export type Employee = t.TypeOf<typeof EmployeeT>;

// 社員検索用フィルター型
export interface EmployeeFilter {
  name?: string;
  department?: string;
  position?: string;
}
