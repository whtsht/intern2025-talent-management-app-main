import PersonIcon from "@mui/icons-material/Person";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Avatar,
  Box,
  Button,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { Employee } from "../models/Employee";
import { useCallback, useState } from "react";
import Link from "next/link";

const tabPanelValue = {
  basicInfo: "基本情報",
  skills: "スキル",
  others: "その他",
} as const;

type TabPanelValue = keyof typeof tabPanelValue;

interface TabContentProps {
  value: TabPanelValue;
  selectedValue: TabPanelValue;
  children: React.ReactNode;
}

function TabContent({ value, selectedValue, children }: TabContentProps) {
  return (
    <Box
      role="tabpanel"
      hidden={value !== selectedValue}
      id={`tabpanel-${value}`}
    >
      {children}
    </Box>
  );
}

export type EmployeeDetailsProps = {
  employee: Employee;
  view: string | null;
};

export function EmployeeDetails(prop: EmployeeDetailsProps) {
  const [selectedTabValue, setSelectedTabValue] =
    useState<TabPanelValue>("basicInfo");
  const employee = prop.employee;
  const backUrl = prop.view ? `/?view=${prop.view}` : "/";

  const handleTabValueChange = useCallback(
    (event: React.SyntheticEvent, newValue: TabPanelValue) => {
      setSelectedTabValue(newValue);
    },
    []
  );

  return (
    <Paper sx={{ p: 2 }}>
      <Box
        display={"flex"}
        flexDirection="column"
        alignItems="flex-start"
        gap={1}
      >
        <Box mb={2}>
          <Link href={backUrl} style={{ textDecoration: "none" }}>
            <Button variant="outlined" startIcon={<ArrowBackIcon />}>
              検索画面に戻る
            </Button>
          </Link>
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          p={2}
          gap={2}
        >
          <Avatar sx={{ width: 128, height: 128 }}>
            <PersonIcon sx={{ fontSize: 128 }} />
          </Avatar>
          <Typography variant="h5">{employee.name}</Typography>
        </Box>
        <Box sx={{ borderBottom: 1, borderColor: "divider", width: "100%" }}>
          <Tabs value={selectedTabValue} onChange={handleTabValueChange}>
            <Tab label={tabPanelValue.basicInfo} value={"basicInfo"} />
            <Tab label={tabPanelValue.skills} value={"skills"} />
            <Tab label={tabPanelValue.others} value={"others"} />
          </Tabs>
        </Box>

        <TabContent value={"basicInfo"} selectedValue={selectedTabValue}>
          <Box p={2} display="flex" flexDirection="column" gap={1}>
            <Typography variant="h6">基本情報</Typography>
            <Typography>年齢：{employee.age}歳</Typography>
          </Box>
        </TabContent>

        <TabContent value={"skills"} selectedValue={selectedTabValue}>
          <Box p={2} display="flex" flexDirection="column" gap={2}>
            <Box>
              <Typography variant="h6">スキル</Typography>

              {employee.skills && employee.skills.length > 0 ? (
                employee.skills.map((skill, index) => (
                  <Box key={index} display="flex" gap={1}>
                    <Typography>・{skill.name}</Typography>
                    <Typography color="text.secondary">
                      ({skill.level})
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography color="text.secondary">
                  スキル情報は登録されていません。
                </Typography>
              )}
            </Box>

            <Box>
              <Typography variant="h6">資格</Typography>
              {employee.certifications && employee.certifications.length > 0 ? (
                employee.certifications.map((cert, index) => (
                  <Typography key={index}>・{cert}</Typography>
                ))
              ) : (
                <Typography color="text.secondary">
                  資格情報は登録されていません。
                </Typography>
              )}
            </Box>
          </Box>
        </TabContent>
        <TabContent value={"others"} selectedValue={selectedTabValue}>
          <Box p={2} display="flex" flexDirection="column" gap={1}>
            <Typography variant="h6">その他</Typography>
          </Box>
        </TabContent>
      </Box>
    </Paper>
  );
}
