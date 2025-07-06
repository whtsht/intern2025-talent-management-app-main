"use client";

import { Container } from "@mui/material";
import { VerticalSpacer } from "../components/VerticalSpacer";
import { GlobalHeader } from "../components/GlobalHeader";
import { GlobalFooter } from "../components/GlobalFooter";
import { usePathname } from "next/navigation";
import { getTitleByPathname } from "./utlils/GetTitleByPathname";
import { useTranslation } from "react-i18next";

export function GlobalContainer({ children }: { children?: React.ReactNode }) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const subtitle = getTitleByPathname(pathname,t);
  return (
    <Container
      sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <header>
        <GlobalHeader
          title={t('title')}
          subtitle={subtitle}
        />
      </header>

      <VerticalSpacer height={32} />

      <main>{children}</main>

      <footer>
        <GlobalFooter />
      </footer>
    </Container>
  );
}
