"use client";

import { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Paper,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { AnimatePresence, motion } from "motion/react";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

interface Props {
  thought: string;
  thoughts: string[];
}

export default function ThoughtCard({ thoughts }: Props) {
  const [index, setIndex] = useState(thoughts.length - 1);
  const [direction, setDirection] = useState<1 | -1>(1);

  // Always jump to the latest thought when a new one is added
  useEffect(() => {
    setDirection(1);
    setIndex(thoughts.length - 1);
  }, [thoughts.length]);

  const theme = useTheme();
  const accent =
    theme.palette.mode === "dark"
      ? theme.palette.secondary.main
      : theme.palette.success.main;

  const canPrev = index > 0;
  const canNext = index < thoughts.length - 1;

  const navigate = (dir: 1 | -1) => {
    setDirection(dir);
    setIndex((i) => i + dir);
  };

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 24 : -24 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -24 : 24 }),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] as const }}
    >
      <Paper
        elevation={0}
        sx={{
          px: 3,
          py: 2,
          borderRadius: 2,
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: "blur(10px)",
          border: `1px solid ${alpha(accent, 0.2)}`,
        }}
      >
        {/* Header row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography
            variant="overline"
            sx={{
              color: theme.palette.info.main,
              letterSpacing: "0.18em",
              fontSize: "0.65rem",
            }}
          >
            what you shared
          </Typography>

          {thoughts.length > 1 && (
            <Typography
              variant="caption"
              sx={{ color: theme.palette.text.secondary, opacity: 0.6 }}
            >
              {index + 1} / {thoughts.length}
            </Typography>
          )}
        </Box>

        {/* Animated thought text */}
        <Box
          sx={{
            borderLeft: `3px solid ${alpha(accent, 0.4)}`,
            pl: 1.5,
            minHeight: 52,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] as const }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontStyle: "italic",
                  color: theme.palette.text.primary,
                  opacity: 0.85,
                }}
              >
                "{thoughts[index]}"
              </Typography>
            </motion.div>
          </AnimatePresence>
        </Box>

        {/* Navigation arrows (only if multiple thoughts) */}
        {thoughts.length > 1 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 0.5,
              mt: 1,
            }}
          >
            <Tooltip title="Earlier thought">
              <span>
                <IconButton
                  size="small"
                  onClick={() => navigate(-1)}
                  disabled={!canPrev}
                  sx={{
                    color: canPrev ? accent : alpha(accent, 0.3),
                    p: 0.25,
                    "&:hover": { backgroundColor: alpha(accent, 0.08) },
                  }}
                >
                  <ChevronLeftRoundedIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>

            <Tooltip title="Later thought">
              <span>
                <IconButton
                  size="small"
                  onClick={() => navigate(1)}
                  disabled={!canNext}
                  sx={{
                    color: canNext ? accent : alpha(accent, 0.3),
                    p: 0.25,
                    "&:hover": { backgroundColor: alpha(accent, 0.08) },
                  }}
                >
                  <ChevronRightRoundedIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        )}
      </Paper>
    </motion.div>
  );
}
