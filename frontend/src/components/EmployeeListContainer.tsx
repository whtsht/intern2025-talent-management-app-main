"use client";
import { useEffect, useState } from "react";
import useSWR from "swr";
import * as t from "io-ts";
import { isLeft } from "fp-ts/Either";
import { Employee, EmployeeT } from "../models/Employee";
import { EmployeeListItem } from "./EmployeeListItem";
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

export type EmployeesContainerProps = {
  filterText: string;
};

type OrderDirection = "asc" | "desc";
type OrderBy = "id" | "name" | "age";

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

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(
  order: OrderDirection,
  orderBy: OrderBy
): (a: Employee, b: Employee) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

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

  const handleOrderChange = (
    event: React.MouseEvent<HTMLElement>,
    newOrder: OrderDirection | null
  ) => {
    if (newOrder !== null) {
      setOrder(newOrder);
    }
  };

  if (isLoading) {
    return <p>Loading employees...</p>;
  }

  if (data != null) {
    const sortedEmployees = [...data].sort(getComparator(order, orderBy));

    return (
      <Box>
        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          gap={2}
          mb={2}
        >
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="sort-by-label">ソート順</InputLabel>
            <Select
              labelId="sort-by-label"
              value={orderBy}
              label="ソート順"
              onChange={(e) => setOrderBy(e.target.value as OrderBy)}
            >
              <MenuItem value="id">ID</MenuItem>
              <MenuItem value="name">名前</MenuItem>
              <MenuItem value="age">年齢</MenuItem>
            </Select>
          </FormControl>
          <ToggleButtonGroup
            value={order}
            exclusive
            onChange={handleOrderChange}
            size="small"
          >
            <ToggleButton value="asc">
              昇順
            </ToggleButton>
            <ToggleButton value="desc">
              降順
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
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
