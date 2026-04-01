import { useTheme } from "@mui/material/styles";
import { useColorMode } from "@/context/ColorModeContext";

/**
 * Returns the accent colour for the current theme mode:
 *  - TR modes    → primary (racing-red)
 *  - dark        → secondary (mauve-magic)
 *  - light       → success (minty sage)
 */
export function useAccent(): string {
  const theme = useTheme();
  const { isTrMode, isDark } = useColorMode();

  if (isTrMode)  return theme.palette.primary.main;   // racing-red
  if (isDark)    return theme.palette.secondary.main; // mauve-magic
  return theme.palette.success.main;                  // minty sage
}
