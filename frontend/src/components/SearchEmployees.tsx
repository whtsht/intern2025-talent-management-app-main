"use client";
import { Paper, TextField, ToggleButton, ToggleButtonGroup, Select, MenuItem, InputLabel, FormControl, Box, Fab, Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import { useState, useEffect } from "react";
import { EmployeeListContainer } from "./EmployeeListContainer";
import { EmployeeCardContainer } from "./EmployeeCardContainer";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import { useSearchParams } from "next/navigation";
import { Employee } from "../models/Employee";
import AddIcon from "@mui/icons-material/Add";
import AddEmployeeForm from "@/components/AddEmployeeForm";
import CloseIcon from "@mui/icons-material/Close";
import { mutate } from "swr";

export function SearchEmployees() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({ name: "", department: "", position: "" });
  const [view, setView] = useState(searchParams.get("view") || "list");
  const [departmentOptions, setDepartmentOptions] = useState<string[]>([]);
  const [positionOptions, setPositionOptions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // 社員一覧を取得し、部署・役職のユニーク値リストを作成
    fetch("/api/employees")
      .then(res => res.json())
      .then((employees: Employee[]) => {
        const departments = Array.from(new Set(employees.map(e => e.department))).filter(Boolean);
        const positions = Array.from(new Set(employees.map(e => e.position))).filter(Boolean);
        setDepartmentOptions(departments);
        setPositionOptions(positions);
      });
  }, []);

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
      <Box display="flex" justifyContent="flex-end">
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => setOpen(true)}
          size="medium"
        >
          <AddIcon />
        </Fab>
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { backgroundColor: 'rgba(255,255,255,0.75)' } }}
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <IconButton
            aria-label="close"
            onClick={() => setOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <AddEmployeeForm onSuccess={() => {
            setOpen(false);
            mutate((key) => typeof key === "string" && key.startsWith("/api/employees"));
          }} />
        </DialogContent>
      </Dialog>
      <TextField
        placeholder="検索キーワードを入力してください"
        value={filters.name}
        onChange={(e) => setFilters(f => ({ ...f, name: e.target.value }))}
        label="名前"
      />
      <Box sx={{ display: 'flex', gap: 2 }}>
        <FormControl size="small" sx={{ minWidth: 120, maxWidth: 180 }}>
          <InputLabel id="department-label">部署</InputLabel>
          <Select
            labelId="department-label"
            value={filters.department}
            label="部署"
            onChange={(e) => setFilters(f => ({ ...f, department: e.target.value }))}
          >
            <MenuItem value="">すべて</MenuItem>
            {departmentOptions.map(option => (
              <MenuItem value={option} key={option}>{option}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120, maxWidth: 180 }}>
          <InputLabel id="position-label">役職</InputLabel>
          <Select
            labelId="position-label"
            value={filters.position}
            label="役職"
            onChange={(e) => setFilters(f => ({ ...f, position: e.target.value }))}
          >
            <MenuItem value="">すべて</MenuItem>
            {positionOptions.map(option => (
              <MenuItem value={option} key={option}>{option}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
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
          filters={filters}
        />
      ) : (
        <EmployeeCardContainer
          key="employeesCardContainer"
          filters={filters}
        />
      )}
    </Paper>
  );
}