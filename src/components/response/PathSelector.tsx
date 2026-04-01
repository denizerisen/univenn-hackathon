"use client";

import { Box, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "motion/react";
import CloudOutlinedIcon from "@mui/icons-material/CloudOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import type { ThoughtPath } from "@/app/api/thought/route";

interface Props {
  paths: ThoughtPath[];
  selected: ThoughtPath["type"];
  onSelect: (type: ThoughtPath["type"]) => void;
}

const PATH_META: Record<
  ThoughtPath["type"],
  { icon: React.ReactNode; order: number }
> = {
  worst_case:  { icon: <CloudOutlinedIcon fontSize="small" />, order: 0 },
  most_likely: { icon: <WbSunnyOutlinedIcon fontSize="small" />, order: 1 },
  positive:    { icon: <SpaOutlinedIcon fontSize="small" />, order: 2 },
};

// Sort so selector always appears: worst → most likely → positive
const TYPE_ORDER: ThoughtPath["type"][] = ["worst_case", "most_likely", "positive"];

export default function PathSelector({ paths, selected, onSelect }: Props) {
  const theme = useTheme();
  const accent = theme.palette.mode === "dark"
    ? theme.palette.secondary.main   // mauve-magic #c77dff
    : theme.palette.success.main;    // minty sage  #4C956C

  const sorted = TYPE_ORDER
    .map((t) => paths.find((p) => p.type === t))
    .filter(Boolean) as ThoughtPath[];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: 1,
        mb: 2.5,
      }}
    >
      {sorted.map((path) => {
        const isSelected = path.type === selected;
        const meta = PATH_META[path.type];

        return (
          <motion.div
            key={path.type}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 350, damping: 22 }}
            style={{ flex: 1 }}
          >
            <Box
              onClick={() => onSelect(path.type)}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.75,
                px: 2,
                py: 1.25,
                borderRadius: "999px",
                cursor: "pointer",
                userSelect: "none",
                transition: "all 0.25s ease",
                border: `1.5px solid ${
                  isSelected
                    ? accent
                    : alpha(theme.palette.text.secondary, 0.22)
                }`,
                backgroundColor: isSelected
                  ? alpha(accent, 0.12)
                  : alpha(theme.palette.background.paper, 0.4),
                color: isSelected
                  ? accent
                  : theme.palette.text.secondary,
                "&:hover": {
                  borderColor: accent,
                  backgroundColor: isSelected
                    ? alpha(accent, 0.15)
                    : alpha(accent, 0.06),
                  color: accent,
                },
              }}
            >
              {meta.icon}
              <Typography
                variant="caption"
                sx={{
                  fontWeight: isSelected ? 700 : 500,
                  whiteSpace: { xs: "normal", sm: "nowrap" },
                  textAlign: "center",
                }}
              >
                {path.title}
              </Typography>
            </Box>
          </motion.div>
        );
      })}
    </Box>
  );
}
