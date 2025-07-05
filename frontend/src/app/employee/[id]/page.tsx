import { EmployeeDetailsContainer } from "@/components/EmployeeDetailsContainer";
import { GlobalContainer } from "@/components/GlobalContainer";
import { Suspense } from 'react';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "社員詳細",
};

export default function EmployeePage() {
  return (
    <GlobalContainer>
      { /* Mark EmployeeDetailsContainer as CSR */ }
      <Suspense>
        <EmployeeDetailsContainer />
      </Suspense>
    </GlobalContainer>
  );
}
