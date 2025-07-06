import * as t from "io-ts";

// スキル型（io-ts）
export const SkillT = t.type({
  name: t.string,
  level: t.string, // 柔軟にするなら自由入力形式でもOK
});

export const EmployeeT = t.type({
  id: t.string,
  name: t.string,
  age: t.number,
});

export const OptionalEmployeePropsT = t.partial({
  skills: t.array(SkillT),
  certifications: t.array(t.string),
});

export const FullEmployeeT = t.intersection([
  EmployeeT,
  OptionalEmployeePropsT,
]);

export type Skill = t.TypeOf<typeof SkillT>;
export type Employee = t.TypeOf<typeof FullEmployeeT>;
