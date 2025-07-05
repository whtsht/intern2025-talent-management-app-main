"use client";
import { useEffect, useState } from "react";
import useSWR from "swr";
import * as t from "io-ts";
import { isLeft } from "fp-ts/Either";
import { Employee, EmployeeT } from "../models/Employee";
import { EmployeeListItem } from "./EmployeeListItem";
import { EmployeeSort, OrderDirection, OrderBy } from "./EmployeeSort";
import { getComparator } from "./utlils/employeeSortUtils";
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


export function EmployeeListContainer({ filterText }: EmployeesContainerProps) {
  const [order, setOrder] = useState<OrderDirection>("asc");
  const [orderBy, setOrderBy] = useState<OrderBy>("id");

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
  if (isLoading) {
    return <p>Loading employees...</p>;
  }

  if (data != null) {
    const sortedEmployees = [...data].sort(getComparator(order, orderBy));

    return (
      <Box>
        <EmployeeSort
          order={order}
          orderBy={orderBy}
          onOrderChange={setOrder}
          onOrderByChange={setOrderBy}
        />
        <Box display="flex" flexDirection="column" gap={1}>
          {sortedEmployees.map((employee) => (
            <EmployeeListItem employee={employee} key={employee.id} />
          ))}
        </Box>
      </Box>
    );
  }

  return null;
}
