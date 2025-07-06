import PersonIcon from "@mui/icons-material/Person";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTranslation } from "react-i18next";

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

type TabPanelValue = "basicInfo" | "skills" | "others";

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
  const { t } = useTranslation();
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

  const tabPanelValue = {
    basicInfo: t("tab_basic_info"),
    skills: t("tab_skills"),
    others: t("tab_others"),
  };

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
              {t("back_to_search")}
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
            <Typography variant="h6">{t("tab_basic_info")}</Typography>
            <Typography>{t("age", { age: employee.age })}</Typography>
            <Typography>{t("department", { department: employee.department ?? t("unset") })}</Typography>
            <Typography>{t("position", { position: employee.position ?? t("unset") })}</Typography>
          </Box>
        </TabContent>

        <TabContent value={"skills"} selectedValue={selectedTabValue}>
          <Box p={2} display="flex" flexDirection="column" gap={2}>
            <Box>
              <Typography variant="h6">{t("skills_info")}</Typography>

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
                  {t("not_skills_info")}
                </Typography>
              )}
            </Box>

            <Box>
              <Typography variant="h6">{t("certifications_info")}</Typography>
              {employee.certifications && employee.certifications.length > 0 ? (
                employee.certifications.map((cert, index) => (
                  <Typography key={index}>・{cert}</Typography>
                ))
              ) : (
                <Typography color="text.secondary">
                  {t("not_certifications_info")}
                </Typography>
              )}
            </Box>
          </Box>
        </TabContent>
        <TabContent value={"others"} selectedValue={selectedTabValue}>
          <Box p={2} display="flex" flexDirection="column" gap={1}>
            <Typography variant="h6">{t("tab_others")}</Typography>
          </Box>
        </TabContent>
      </Box>
    </Paper>
  );
}
