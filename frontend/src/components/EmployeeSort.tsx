import React from "react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
        <InputLabel id="sort-by-label">{t('search_sort')}</InputLabel>
        <Select
          labelId="sort-by-label"
          value={orderBy}
          label={t('search_sort')}
          onChange={(e) => onOrderByChange(e.target.value as OrderBy)}
        >
          <MenuItem value="id">ID</MenuItem>
          <MenuItem value="name">{t('sort_name')}</MenuItem>
          <MenuItem value="age">{t('sort_age')}</MenuItem>
        </Select>
      </FormControl>
      <ToggleButtonGroup
        value={order}
        exclusive
        onChange={handleOrderChange}
        size="small"
      >
        <ToggleButton value="asc">{t('sort_asc')}</ToggleButton>
        <ToggleButton value="desc">{t('sort_desc')}</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}