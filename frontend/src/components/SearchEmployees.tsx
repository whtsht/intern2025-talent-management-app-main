"use client";
import { Paper, TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState } from "react";
import { EmployeeListContainer } from "./EmployeeListContainer";
import { EmployeeCardContainer } from "./EmployeeCardContainer";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";

export function SearchEmployees() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [view, setView] = useState(searchParams.get("view") || "list");

  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: string | null
  ) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        flex: 1,
        p: 2,
      }}
    >
      <TextField
        placeholder={t('search_placeholder')}
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
      />
      <ToggleButtonGroup
        value={view}
        exclusive
        onChange={handleViewChange}
        aria-label="view mode"
      >
        <ToggleButton value="list" aria-label="list view">
          <ViewListIcon />
        </ToggleButton>
        <ToggleButton value="card" aria-label="card view">
          <ViewModuleIcon />
        </ToggleButton>
      </ToggleButtonGroup>
      {view === "list" ? (
        <EmployeeListContainer
          key="employeesListContainer"
          filterText={searchKeyword}
        />
      ) : (
        <EmployeeCardContainer
          key="employeesCardContainer"
          filterText={searchKeyword}
        />
      )}
    </Paper>
  );
}