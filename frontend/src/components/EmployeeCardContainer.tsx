"use client";
import { useEffect } from "react";
import useSWR from "swr";
import * as t from "io-ts";
import { isLeft } from "fp-ts/Either";
import { EmployeeCardItem } from "./EmployeeCardItem";
import { Employee, EmployeeT } from "../models/Employee";
import { Box } from "@mui/material";

export type EmployeesContainerProps = {
    filterText: string;
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

export function EmployeeCardContainer({ filterText, }: EmployeesContainerProps) {
    const encodedFilterText = encodeURIComponent(filterText);
    const { data, error, isLoading } = useSWR<Employee[], Error>(
        `/api/employees?filterText=${encodedFilterText}`,
        employeesFetcher
    );
    useEffect(() => {
        if (error != null) {
            console.error(`Failed to fetch employees filtered by filterText`, error);
        }
    }, [error, filterText]);
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