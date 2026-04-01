"use client";

import * as React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import { NextAppDirEmotionCacheProvider } from "./EmotionCache";
import { getTheme } from "@/theme/theme";
import { ColorModeContext } from "@/context/ColorModeContext";

const gradients = {
  light: "linear-gradient(135deg, #FEFEE3 0%, #F5EDD0 100%)",
  dark: "linear-gradient(135deg, #240046 0%, #10002b 100%)",
};

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = React.useState<"light" | "dark">("dark");

  const toggleMode = React.useCallback(() => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const theme = React.useMemo(() => getTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={{ mode, toggleMode }}>
      <NextAppDirEmotionCacheProvider options={{ key: "mui" }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box
            sx={{
              minHeight: "100vh",
              background: gradients[mode],
              transition: "background 0.4s ease",
            }}
          >
            {children}
          </Box>
        </ThemeProvider>
      </NextAppDirEmotionCacheProvider>
    </ColorModeContext.Provider>
  );
}
