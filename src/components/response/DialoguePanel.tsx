"use client";

import { useState } from "react";
import { Box, Button, Chip, Paper, Typography, useTheme } from "@mui/material";
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
  const theme = useTheme();
  const [selected, setSelected] = useState<ThoughtPath["type"]>("most_likely");

  const activePath = data.paths.find((p) => p.type === selected) ?? data.paths[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 44 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay: 0.25, ease: [0.22, 1, 0.36, 1] as const }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 560,
          mx: "auto",
          borderRadius: 4,
          overflow: "hidden",
          backgroundColor: alpha(theme.palette.background.paper, 0.92),
          backdropFilter: "blur(16px)",
          border: `1px solid ${alpha(theme.palette.success.main, 0.18)}`,
          boxShadow: `0 24px 64px ${alpha(theme.palette.text.primary, 0.1)}`,
          // Visual novel left accent stripe
          borderLeft: `4px solid ${alpha(theme.palette.success.main, 0.55)}`,
        }}
      >
        {/* ── Panel header ──────────────────────────────────────────── */}
        <Box
          sx={{
            px: 3.5,
            pt: 3,
            pb: 2,
            borderBottom: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
          }}
        >
          <Typography
            variant="overline"
            sx={{
              color: theme.palette.success.main,
              letterSpacing: "0.2em",
              fontSize: "0.65rem",
              fontWeight: 600,
            }}
          >
            a gentle reflection
          </Typography>

          {/* Summary */}
          <Typography
            variant="body1"
            sx={{
              mt: 1.5,
              color: theme.palette.text.primary,
              fontSize: "1rem",
            }}
          >
            {data.analysis.summary}
          </Typography>

          {/* Pattern chips */}
          {data.analysis.patterns.length > 0 && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mt: 2 }}>
              {data.analysis.patterns.map((pattern) => (
                <Chip
                  key={pattern}
                  label={pattern}
                  size="small"
                  sx={{
                    borderRadius: "999px",
                    fontSize: "0.72rem",
                    fontWeight: 500,
                    backgroundColor: alpha(theme.palette.success.main, 0.1),
                    color: theme.palette.success.main,
                    border: `1px solid ${alpha(theme.palette.success.main, 0.25)}`,
                  }}
                />
              ))}
            </Box>
          )}
        </Box>

        {/* ── Path selector + content ────────────────────────────────── */}
        <Box sx={{ px: 3.5, pt: 2.5, pb: 3 }}>
          <PathSelector
            paths={data.paths}
            selected={selected}
            onSelect={setSelected}
          />

          {/* Animated path content */}
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
                  borderRadius: 3,
                  backgroundColor: alpha(theme.palette.success.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.success.main, 0.12)}`,
                  mb: 3,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: theme.palette.text.primary,
                    mb: 2,
                  }}
                >
                  {activePath.description}
                </Typography>

                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,
                    px: 2,
                    py: 0.75,
                    borderRadius: "999px",
                    backgroundColor: alpha(theme.palette.warning.main, 0.12),
                    border: `1px solid ${alpha(theme.palette.warning.main, 0.25)}`,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.warning.main,
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                    }}
                  >
                    feeling:
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.text.primary,
                      fontStyle: "italic",
                    }}
                  >
                    {activePath.feeling}
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </AnimatePresence>

          {/* Footer */}
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={onReset}
                startIcon={<ReplayRoundedIcon fontSize="small" />}
                sx={{
                  borderRadius: "999px",
                  px: 2.5,
                  py: 0.75,
                  fontSize: "0.82rem",
                  borderColor: alpha(theme.palette.text.secondary, 0.35),
                  color: theme.palette.text.secondary,
                  "&:hover": {
                    borderColor: theme.palette.success.main,
                    color: theme.palette.success.main,
                    backgroundColor: alpha(theme.palette.success.main, 0.06),
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
