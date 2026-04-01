import { createContext, useContext } from "react";

interface ColorModeContextValue {
  mode: "light" | "dark";
  toggleMode: () => void;
}

export const ColorModeContext = createContext<ColorModeContextValue>({
  mode: "light",
  toggleMode: () => {},
});

export function useColorMode() {
  return useContext(ColorModeContext);
}
