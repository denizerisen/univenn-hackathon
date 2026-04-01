"use client";

import { useState } from "react";
import { Box, Button, Paper, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { AnimatePresence, motion } from "motion/react";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import PathSelector from "./PathSelector";
import type { ThoughtResponse, ThoughtPath } from "@/app/api/thought/route";

interface Props {
  data: ThoughtResponse;
  onReset: () => void;
}

export default function DialoguePanel({ data, onReset }: Props) {
  const [selected, setSelected] = useState<ThoughtPath["type"]>("most_likely");
  const theme = useTheme();
  const accent =
    theme.palette.mode === "dark"
      ? theme.palette.secondary.main // mauve-magic #c77dff
      : theme.palette.success.main; // minty sage  #4C956C

  const activePath =
    data.paths.find((p) => p.type === selected) ?? data.paths[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 44 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.65,
        delay: 0.25,
        ease: [0.22, 1, 0.36, 1] as const,
      }}
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Paper
        elevation={0}
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          borderRadius: 2,
          overflow: "hidden",
          backgroundColor: alpha(theme.palette.background.paper, 0.93),
          backdropFilter: "blur(16px)",
          border: `1px solid ${alpha(accent, 0.18)}`,
          boxShadow: `0 24px 64px ${alpha(theme.palette.text.primary, 0.1)}`,
          borderLeft: `4px solid ${alpha(accent, 0.55)}`,
        }}
      >
        {/* ── Path selector + content ────────────────────────────────── */}
        <Box
          sx={{
            px: 3.5,
            pt: 3,
            pb: 3,
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <PathSelector
            paths={data.paths}
            selected={selected}
            onSelect={setSelected}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 1,
                  backgroundColor: alpha(accent, 0.05),
                  border: `1px solid ${alpha(accent, 0.12)}`,
                  mb: 3,
                  flex: 1,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ color: theme.palette.text.primary, mb: 2 }}
                >
                  {activePath.description}
                </Typography>
              </Box>
            </motion.div>
          </AnimatePresence>

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={onReset}
                startIcon={<ReplayRoundedIcon fontSize="small" />}
                sx={{
                  borderRadius: 2,
                  px: 2.5,
                  py: 0.75,
                  fontSize: "0.82rem",
                  borderColor: alpha(accent, 0.35),
                  color: accent,
                  "&:hover": {
                    borderColor: theme.palette.text.primary,
                    color: theme.palette.text.primary,
                    backgroundColor: alpha(accent, 0.06),
                  },
                }}
              >
                Try again
              </Button>
            </motion.div>
          </Box>
        </Box>
      </Paper>
    </motion.div>
  );
}
