// frontend/src/components/LanguageSwitcher.tsx
"use client";
import { useTranslation } from "react-i18next";
import { Button, Box } from "@mui/material";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Box>
      <Button color="inherit" onClick={() => changeLanguage("ja")}>
        日本語
      </Button>
      <Button color="inherit" onClick={() => changeLanguage("en")}>
        English
      </Button>
    </Box>
  );
}