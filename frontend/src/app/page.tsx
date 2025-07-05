import { SearchEmployees } from "../components/SearchEmployees";
import { GlobalContainer } from "@/components/GlobalContainer";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "社員検索",
};

export default function Home() {
  return (
    <GlobalContainer>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchEmployees />
      </Suspense>
    </GlobalContainer>
  );
}
