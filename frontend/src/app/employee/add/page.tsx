"use client";
import AddEmployeeForm from "@/components/AddEmployeeForm";
import { useRouter } from "next/navigation";

export default function AddEmployeePage() {
  const router = useRouter();
  return (
    <div style={{ padding: 24 }}>
      <AddEmployeeForm onSuccess={() => router.push("/employee")} />
    </div>
  );
} 