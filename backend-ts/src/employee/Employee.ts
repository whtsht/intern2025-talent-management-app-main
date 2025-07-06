import * as t from "io-ts";

// スキル型（io-ts形式）
const SkillT = t.type({
  name: t.string,
  level: t.union([
    t.literal("触れたことがある"),
    t.literal("ある程度は使える"),
    t.literal("使いこなすことができる"),
  ]),
});

// Employee 型（io-ts形式）
export const EmployeeT = t.type({
  id: t.string,
  name: t.string,
  age: t.number,
  skills: t.union([t.array(SkillT), t.undefined]),
  certifications: t.union([t.array(t.string), t.undefined]),
});

export type Skill = t.TypeOf<typeof SkillT>;
export type Employee = t.TypeOf<typeof EmployeeT>;
