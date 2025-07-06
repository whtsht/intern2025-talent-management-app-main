"use client";
import { useEffect } from "react";
import useSWR from "swr";
import * as t from "io-ts";
import { isLeft } from "fp-ts/Either";
import { EmployeeCardItem } from "./EmployeeCardItem";
import { Employee, EmployeeT } from "../models/Employee";
import { Box } from "@mui/material";

export type EmployeesContainerProps = {
    filters: { name: string; department: string; position: string };
};

const EmployeesT = t.array(EmployeeT);

const employeesFetcher = async (url: string): Promise<Employee[]> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch employees at ${url}`);
    }
    const body = await response.json();
    const decoded = EmployeesT.decode(body);
    if (isLeft(decoded)) {
        throw new Error(`Failed to decode employees ${JSON.stringify(body)}`);
    }
    return decoded.right;
};

export function EmployeeCardContainer({ filters }: EmployeesContainerProps) {
    const params = new URLSearchParams();
    if (filters.name) params.append("name", filters.name);
    if (filters.department) params.append("department", filters.department);
    if (filters.position) params.append("position", filters.position);
    const { data, error, isLoading } = useSWR<Employee[], Error>(
        `/api/employees?${params.toString()}`,
        employeesFetcher
    );
    useEffect(() => {
        if (error != null) {
            console.error(`Failed to fetch employees filtered by filterText, department, or position`, error);
        }
    }, [error, filters.name, filters.department, filters.position]);
    if (data != null) {
        // card形式
        return (
            <Box
                display="grid"
                gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))"
                gap={2}
            >
                {data.map((employee) => (
                    <EmployeeCardItem employee={employee} key={employee.id} />
                ))}
            </Box>
        );
    }
    if (isLoading) {
        return <p>Loading employees...</p>;
    }
}