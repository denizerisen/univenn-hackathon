import { createContext, useContext } from "react";

export type ThemeMode = "light" | "dark" | "tr-light" | "tr-dark";

interface ColorModeContextValue {
  mode: ThemeMode;
  toggleMode:   () => void; // light ↔ dark within same family
  toggleTrMode: () => void; // default ↔ TR theme
  isTrMode:     boolean;
  isDark:        boolean;
}

export const ColorModeContext = createContext<ColorModeContextValue>({
  mode:         "dark",
  toggleMode:   () => {},
  toggleTrMode: () => {},
  isTrMode:     false,
  isDark:        true,
});

export function useColorMode() {
  return useContext(ColorModeContext);
}
