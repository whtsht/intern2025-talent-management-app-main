import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

export interface GlobalHeaderProps {
  title: string;
  subtitle: string;
}

export function GlobalHeader({ title, subtitle }: GlobalHeaderProps) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            background:
              "linear-gradient(45deg, rgb(0, 91, 172), rgb(94, 194, 198))",
          }}
        >
          <Link href="/">
            <Image
              src="/icon.png"
              alt="トップページ"
              width={50}
              height={40}
              style={{ marginLeft: 0 }}
            />
          </Link>
          <Link href="/">
            <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
              {title} {subtitle}
            </Typography>
          </Link>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
