"use client";

import React, { useState, useEffect } from "react";
import { Paper, Box, TextField, Button, Typography, Alert } from "@mui/material";

interface FormState {
  name: string;
  age: string;
  department: string;
  position: string;
}

interface FormError {
  name?: string;
  age?: string;
  department?: string;
  position?: string;
  [key: string]: string | undefined;
}

const initialState: FormState = {
  name: "",
  age: "",
  department: "",
  position: "",
};

const AddEmployeeForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const [form, setForm] = useState<FormState>(initialState);
  const [formError, setFormError] = useState<FormError>({});
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // 成功メッセージを3秒後に自動で消す
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const validate = (values: FormState = form): FormError => {
    const errors: FormError = {};
    if (!values.name) errors.name = "名前を入力してください。";
    // age, department, positionは任意なのでバリデーションしない
    return errors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormError((prev) => ({ ...prev, [name]: undefined }));
    setError("");
    setSuccess(false);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const errors = validate({ ...form, [name]: e.target.value });
    setFormError((prev) => ({ ...prev, [name]: errors[name] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("submitted");

    e.preventDefault();
    const errors = validate();
    setFormError(errors);
    if (Object.keys(errors).length > 0) return;
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          age: Number(form.age),
          department: form.department,
          position: form.position,
        }),
      });
      console.log("fetch");
      if (res.ok) {
        setSuccess(true);
        setForm(initialState);
        setFormError({});
        if (onSuccess) onSuccess();
      } else {
        const data = await res.json();
        setError(data.message || "追加に失敗しました。");
      }
    } catch {
      setError("通信エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  // バリデーションOKかどうかを判定
  const isValid = form.name.trim() !== "";

  return (
    <Paper elevation={3} sx={{ maxWidth: 400, mx: "auto", p: 4 }}>
      <Typography variant="h5" mb={2} fontWeight="bold" sx={{ display: 'none' }}>従業員追加</Typography>
      <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
        <TextField
          label="名前"
          name="name"
          value={form.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!formError.name}
          helperText={formError.name}
          fullWidth
          required
        />
        <TextField
          label="年齢"
          name="age"
          value={form.age}
          onChange={handleChange}
          onBlur={handleBlur}
          type="number"
          inputProps={{ min: 1, step: 1 }}
          fullWidth
        />
        <TextField
          label="部署"
          name="department"
          value={form.department}
          onChange={handleChange}
          onBlur={handleBlur}
          fullWidth
        />
        <TextField
          label="役職"
          name="position"
          value={form.position}
          onChange={handleChange}
          onBlur={handleBlur}
          fullWidth
        />
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">追加に成功しました！</Alert>}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading || !isValid}
          sx={{ mt: 1 }}
        >
          {loading ? "追加中..." : "追加"}
        </Button>
      </Box>
    </Paper>
  );
};

export default AddEmployeeForm; 