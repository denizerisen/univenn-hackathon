import { createTheme } from "@mui/material/styles";
import type { ThemeMode } from "@/context/ColorModeContext";

// ─── Light palette — 8-stop earthy scale ─────────────────────────────────────
//
//  #FEFEE3  creamy sand       → page background (lightest)
//  #F5EDD0  warm parchment    → paper / card surfaces          [+derived]
//  #FFC9B9  peach blossom     → primary accent (buttons)
//  #8BB3C8  misty morning     → cool contrast accent           [+added]
//  #D68C45  copper amber      → secondary accent / borders
//  #C97B5A  terracotta clay   → chips / warm tags              [+added]
//#ad2e24 dark terracotta
//  #4C956C  minty sage        → secondary text
//  #2C6E49  forest green      → primary text / headings (darkest)
//
const light = {
  primary: "#2C6E49",           // forest green — bold, eye-catching buttons
  primaryContrast: "#FEFEE3",   // creamy sand text on forest green buttons
  secondary: "#8BB3C8",         // misty morning blue
  bgDefault: "#FEFEE3",         // creamy sand
  bgPaper: "#F5EDD0CC",         // warm parchment, semi-transparent
  textPrimary: "#2C6E49",       // forest green — deep, high contrast
  textSecondary: "#4C956C",     // minty sage
  heading: "#1e4d33",           // one stop deeper than forest for headings
  bodyGradient: "linear-gradient(135deg, #FEFEE3 0%, #F5EDD0 100%)",
  paperBg: "#F5EDD0CC",
  elevatedBg: "#EDE4C4",        // deeper hover surface
  inputBg: "#FEFEE3BB",
  inputHoverBorder: "#D68C45",  // copper
  chipBg: "#FFE8DE",            // soft peach tint
  terracotta: "#C97B5A",        // warm earthy red accent
  mistyBlue: "#8BB3C8",         // cool counterpoint
  divider: "#D68C4555",
};

// ─── TR-light palette — Türkiye Milli Takımı ─────────────────────────────────
//
//  #fffbfb  snow            → pure near-white background
//  #e30613  racing-red      → dominant primary, headings, buttons
//  #ca0101  brick-ember     → deep red for hover / active / borders
//  #393939  graphite        → body text — strong contrast on white
//  #e0dcdc  alabaster-grey  → muted labels, secondary, chip fills
//
const trLight = {
  primary:         "#e30613",          // racing-red
  primaryContrast: "#fffbfb",          // snow on red
  secondary:       "#e0dcdc",          // alabaster-grey
  bgDefault:       "#fffbfb",          // snow
  bgPaper:         "#fffffff2",
  textPrimary:     "#393939",          // graphite
  textSecondary:   "#6b6b6b",          // mid-graphite
  heading:         "#e30613",          // racing-red headings — dominant
  bodyGradient:    "linear-gradient(160deg, #fffbfb 0%, #f5f0f0 100%)",
  paperBg:         "#fffffff2",
  elevatedBg:      "#f5f0f0",
  inputBg:         "#fff6f6",          // barely-there red tint
  inputHoverBorder:"#e30613",
  chipBg:          "#fce8e8",          // pale red chip
  divider:         "#e3061322",
};

// ─── TR-dark palette ──────────────────────────────────────────────────────────
//
//  Graphite base, racing-red accents dominant, snow for text
//
const trDark = {
  primary:         "#e30613",          // racing-red — still dominant
  secondary:       "#e0dcdc",          // alabaster-grey
  bgDefault:       "#393939",          // graphite
  bgPaper:         "#2c2c2ccc",        // slightly deeper cards
  textPrimary:     "#fffbfb",          // snow
  textSecondary:   "#e0dcdc",          // alabaster-grey
  heading:         "#e30613",          // racing-red headings in dark too
  bodyGradient:    "linear-gradient(160deg, #393939 0%, #242424 100%)",
  paperBg:         "#2c2c2ccc",
  elevatedBg:      "#4a4a4a",
  inputBg:         "#2c2c2caa",
  inputHoverBorder:"#e30613",
  chipBg:          "#ca0101",          // brick-ember chip
  divider:         "#e3061344",
};

// ─── Dark palette ─────────────────────────────────────────────────────────────
//
//  #10002b  dark-amethyst    → gradient end / deepest bg
//  #240046  dark-amethyst-2  → page default bg
//  #3c096c  indigo-ink       → paper / card surfaces
//  #5a189a  indigo-velvet    → elevated surfaces / dividers
//  #7b2cbf  royal-violet     → interactive borders
//  #9d4edd  lavender-purple  → primary accent (buttons, links)
//  #c77dff  mauve-magic      → secondary accent / secondary text
//  #e0aaff  mauve            → primary text / headings
//
const dark = {
  primary: "#9d4edd",           // lavender-purple
  secondary: "#c77dff",         // mauve-magic
  bgDefault: "#240046",         // dark-amethyst-2
  bgPaper: "#3c096ccc",         // indigo-ink, semi-transparent
  textPrimary: "#e0aaff",       // mauve — high contrast on deep bg
  textSecondary: "#c77dff",     // mauve-magic
  heading: "#e0aaff",           // mauve — headings
  bodyGradient: "linear-gradient(135deg, #240046 0%, #10002b 100%)",
  paperBg: "#3c096ccc",
  elevatedBg: "#5a189a",        // indigo-velvet — hover / active
  inputBg: "#3c096caa",
  inputHoverBorder: "#7b2cbf",  // royal-violet
  chipBg: "#3c096c",
  divider: "#5a189a",
};

export function getTheme(mode: ThemeMode) {
  const paletteMode = mode === "dark" || mode === "tr-dark" ? "dark" : "light";
  const c =
    mode === "light"    ? light    :
    mode === "dark"     ? dark     :
    mode === "tr-light" ? trLight  :
                          trDark;
  const isDark = paletteMode === "dark";
  const isTr   = mode === "tr-light" || mode === "tr-dark";

  return createTheme({
    palette: {
      mode: paletteMode,
      primary: {
        main: c.primary,
        contrastText: "primaryContrast" in c ? (c as typeof light).primaryContrast : undefined,
      },
      secondary: { main: c.secondary },
      warning: { main: isTr ? "#780000" : isDark ? "#c77dff" : "#D68C45" },
      info:    { main: isTr ? "#669bbc" : isDark ? "#9d4edd" : "#8BB3C8" },
      success: { main: isTr ? "#669bbc" : "#4C956C" },
      background: {
        default: c.bgDefault,
        paper: c.bgPaper,
      },
      text: {
        primary: c.textPrimary,
        secondary: c.textSecondary,
      },
      divider: c.divider,
    },

    shape: { borderRadius: 16 },

    typography: {
      fontFamily: `var(--font-quicksand), "Quicksand", sans-serif`,
      h1: { fontWeight: 700, lineHeight: 1.15, color: c.heading },
      h2: { fontWeight: 700, lineHeight: 1.2,  color: c.heading },
      h3: { fontWeight: 700, lineHeight: 1.25, color: c.heading },
      h4: { fontWeight: 700, lineHeight: 1.3,  color: c.heading },
      h5: { fontWeight: 700, lineHeight: 1.35, color: c.heading },
      h6: { fontWeight: 700, lineHeight: 1.4,  color: c.heading },
      body1:   { fontSize: "1.05rem",  lineHeight: 1.75 },
      body2:   { fontSize: "0.95rem",  lineHeight: 1.65 },
      caption: { fontSize: "0.85rem",  lineHeight: 1.5  },
      button:  { textTransform: "none", fontWeight: 600, lineHeight: 1.5 },
    },

    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backdropFilter: "blur(12px)",
            backgroundColor: c.paperBg,
            boxShadow: isDark
              ? "0 8px 30px rgba(0,0,0,0.35)"
              : isTr
              ? "0 8px 30px rgba(227,6,19,0.10)"
              : "0 8px 30px rgba(44,110,73,0.08)",
          },
        },
      },

      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "999px",
            padding: "10px 20px",
            fontWeight: 600,
            boxShadow: isDark
              ? "0 4px 14px rgba(0,0,0,0.4)"
              : isTr
              ? "0 4px 14px rgba(227,6,19,0.32)"
              : "0 4px 14px rgba(214,140,69,0.25)",
          },
        },
      },

      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 16,
              backgroundColor: c.inputBg,
              transition: "all 0.3s ease",
              "& fieldset": { borderColor: "transparent" },
              "&:hover fieldset": { borderColor: c.inputHoverBorder },
              "&.Mui-focused fieldset": {
                borderColor: c.primary,
                boxShadow: `0 0 0 2px ${c.primary}44`,
              },
            },
          },
        },
      },

      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: "999px",
            backgroundColor: c.chipBg,
            color: c.textPrimary,
          },
        },
      },
    },
  });
}
