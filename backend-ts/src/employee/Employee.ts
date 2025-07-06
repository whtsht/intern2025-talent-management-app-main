import * as t from 'io-ts';

export const EmployeeT = t.type({
    id: t.string,
    name: t.string,
    age: t.number,
    department: t.string,
    position: t.string,
});

export type Employee = t.TypeOf<typeof EmployeeT>;

// 社員検索用フィルター型
export interface EmployeeFilter {
    name?: string;
    department?: string;
    position?: string;
}
