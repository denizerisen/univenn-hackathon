"use client";

import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { NextAppDirEmotionCacheProvider } from "./EmotionCache";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#6366f1",
    },
    secondary: {
      main: "#ec4899",
    },
  },
  typography: {
    fontFamily: "var(--font-geist-sans), sans-serif",
  },
});

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <NextAppDirEmotionCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
