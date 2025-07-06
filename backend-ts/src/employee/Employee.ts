import * as t from "io-ts";

// スキル型（io-ts）
export const SkillT = t.type({
  name: t.string,
  level: t.string,
});

export const EmployeeT = t.intersection([
  t.partial({
    skills: t.array(SkillT),
    certifications: t.array(t.string),
  }),
  t.type({
    id: t.string,
    name: t.string,
    age: t.number,
  }),
]);

export type Employee = {
  id: string;
  name: string;
  age: number;
  skills?: { name: string; level: string }[];
  certifications?: string[];
};
