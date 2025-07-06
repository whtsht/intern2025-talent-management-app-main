"use client";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import * as t from "io-ts";
import { isLeft } from "fp-ts/Either";
import { Employee, EmployeeT } from "../models/Employee";
import { EmployeeListItem } from "./EmployeeListItem";
import { EmployeeSort, OrderDirection, OrderBy } from "./EmployeeSort";
import { getComparator } from "./utlils/employeeSortUtils";
import { Box, Stack, Pagination } from "@mui/material";

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

export function EmployeeListContainer({ filters }: EmployeesContainerProps) {
  const [order, setOrder] = useState<OrderDirection>("asc");
  const [orderBy, setOrderBy] = useState<OrderBy>("id");
  const [page, setPage] = React.useState(1);
  //1ページあたりの表示人数
  const itemsPerPage = 5;

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
      console.error(
        `Failed to fetch employees filtered by filterText, department, or position`,
        error
      );
    }
  }, [error, filters.name, filters.department, filters.position]);
  if (isLoading) {
    return <p>Loading employees...</p>;
  }

  if (data != null) {
    const sortedEmployees = [...data].sort(getComparator(order, orderBy));
    const pageCount = Math.ceil(sortedEmployees.length / itemsPerPage);
    const paginatedEmployees = sortedEmployees.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );

    return (
      <Box pb={8}>
        <EmployeeSort
          order={order}
          orderBy={orderBy}
          onOrderChange={setOrder}
          onOrderByChange={setOrderBy}
        />
        <Box display="flex" flexDirection="column" gap={1}>
          {paginatedEmployees.map((employee) => (
            <EmployeeListItem employee={employee} key={employee.id} />
          ))}
        </Box>
        <Stack spacing={2} alignItems="center" mt={3}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Stack>
      </Box>
    );
  }

  return null;
}
