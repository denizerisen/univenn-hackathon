"use client";

import * as React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import { NextAppDirEmotionCacheProvider } from "./EmotionCache";
import { getTheme } from "@/theme/theme";
import { ColorModeContext } from "@/context/ColorModeContext";
import type { ThemeMode } from "@/context/ColorModeContext";

const gradients: Record<ThemeMode, string> = {
  "light":    "linear-gradient(135deg, #FEFEE3 0%, #F5EDD0 100%)",
  "dark":     "linear-gradient(135deg, #240046 0%, #10002b 100%)",
  "tr-light": "linear-gradient(160deg, #fffbfb 0%, #f5f0f0 100%)",
  "tr-dark":  "linear-gradient(160deg, #393939 0%, #242424 100%)",
};

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = React.useState<ThemeMode>("dark");

  const toggleMode = React.useCallback(() => {
    setMode((prev) =>
      prev === "light"    ? "dark"     :
      prev === "dark"     ? "light"    :
      prev === "tr-light" ? "tr-dark"  :
                            "tr-light"
    );
  }, []);

  const toggleTrMode = React.useCallback(() => {
    setMode((prev) => {
      if (prev === "tr-light" || prev === "tr-dark") {
        // TR kapatılıyor — önceki light/dark'a geri dön
        return prev === "tr-light" ? "light" : "dark";
      }
      // TR açılıyor — her zaman tr-light ile başla
      return "tr-light";
    });
  }, []);

  const isTrMode = mode === "tr-light" || mode === "tr-dark";
  const isDark   = mode === "dark"     || mode === "tr-dark";

  const theme = React.useMemo(() => getTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={{ mode, toggleMode, toggleTrMode, isTrMode, isDark }}>
      <NextAppDirEmotionCacheProvider options={{ key: "mui" }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box
            sx={{
              minHeight: "100vh",
              background: gradients[mode],
              transition: "background 0.5s ease",
            }}
          >
            {children}
          </Box>
        </ThemeProvider>
      </NextAppDirEmotionCacheProvider>
    </ColorModeContext.Provider>
  );
}
