"use client";

import { Container } from "@mui/material";
import { VerticalSpacer } from "../components/VerticalSpacer";
import { GlobalHeader } from "../components/GlobalHeader";
import { GlobalFooter } from "../components/GlobalFooter";
import { usePathname } from "next/navigation";
import { getTitleByPathname } from "./utlils/GetTitleByPathname";

export function GlobalContainer({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();
  const subtitle = getTitleByPathname(pathname);
  return (
    <Container
      sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <header>
        <GlobalHeader
          title={"タレントマネジメントシステム"}
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
