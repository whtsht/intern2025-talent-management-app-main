import React from "react";
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

export type OrderDirection = "asc" | "desc";
export type OrderBy = "id" | "name" | "age";

export interface EmployeeSortProps {
  order: OrderDirection;
  orderBy: OrderBy;
  onOrderChange: (order: OrderDirection) => void;
  onOrderByChange: (orderBy: OrderBy) => void;
}

export function EmployeeSort({
  order,
  orderBy,
  onOrderChange,
  onOrderByChange,
}: EmployeeSortProps) {
  const handleOrderChange = (
    event: React.MouseEvent<HTMLElement>,
    newOrder: OrderDirection | null
  ) => {
    if (newOrder !== null) {
      onOrderChange(newOrder);
    }
  };

  return (
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
          onChange={(e) => onOrderByChange(e.target.value as OrderBy)}
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
        <ToggleButton value="asc">昇順</ToggleButton>
        <ToggleButton value="desc">降順</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}