import PersonIcon from "@mui/icons-material/Person";
import { Avatar, Box, Card, CardContent, Typography } from "@mui/material";
import { Employee } from "../models/Employee";
import Link from "next/link";

export type EmployeeCardItemProps = {
    employee: Employee;
};

export function EmployeeCardItem(prop: EmployeeCardItemProps) {
    const employee = prop.employee;
    return (
        <Link
            href={`/employee/${employee.id}?view=card`}
            style={{ textDecoration: "none" }}
        >
            <Card
                sx={{
                    transition: "background-color 0.2s",
                    "&:hover": {
                        backgroundColor: "#f0f0f0",
                    },
                }}
            >
                <CardContent>
                    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                        <Avatar sx={{ width: 128, height: 128 }}>
                            <PersonIcon sx={{ fontSize: 128 }} />
                        </Avatar>
                        <Box display="flex" flexDirection="column">
                            <Typography>{employee.name}</Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Link>
    );
}