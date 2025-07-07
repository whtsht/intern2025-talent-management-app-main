import { Container } from "@mui/material";
import { VerticalSpacer } from "../components/VerticalSpacer";
import { GlobalHeader } from "../components/GlobalHeader";
import { GlobalFooter } from "../components/GlobalFooter";
import ProtectedRoute from "./ProtectedRoute";

export function GlobalContainer({ children }: { children?: React.ReactNode }) {
  return (
    <Container
      sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <header>
        <GlobalHeader title={"タレントマネジメントシステム"} />
      </header>

      <VerticalSpacer height={32} />

      <main>
        <ProtectedRoute>
          {children}
        </ProtectedRoute>
      </main>

      <footer>
        <GlobalFooter />
      </footer>
    </Container>
  );
}
