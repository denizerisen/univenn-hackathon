"use client";

import { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { AnimatePresence, motion } from "motion/react";

const PHASES = [
  { label: "breathe in",  duration: 4000 },
  { label: "hold",        duration: 4000 },
  { label: "breathe out", duration: 4000 },
  { label: "hold",        duration: 4000 },
] as const;

// Box scale per phase: inhale → hold-big → exhale → hold-small
const BOX_SCALE   = [0.72, 1.12, 1.12, 0.72, 0.72];
const PHASE_TIMES = [0,    0.25, 0.5,  0.75, 1    ];

export default function BreathingLoader() {
  const theme = useTheme();
  const accent =
    theme.palette.mode === "dark"
      ? theme.palette.secondary.main
      : theme.palette.success.main;

  const [phaseIdx, setPhaseIdx] = useState(0);

  // Cycle through breathing phases
  useEffect(() => {
    const tick = () =>
      setPhaseIdx((i) => (i + 1) % PHASES.length);

    const id = setTimeout(tick, PHASES[phaseIdx].duration);
    return () => clearTimeout(id);
  }, [phaseIdx]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(6px)",
        backgroundColor: alpha(theme.palette.background.default, 0.55),
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3.5,
          userSelect: "none",
        }}
      >
        {/* Breathing box */}
        <Box sx={{ position: "relative", width: 96, height: 96 }}>
          {/* Outer glow ring */}
          <motion.div
            animate={{
              scale: BOX_SCALE,
              opacity: [0.18, 0.42, 0.42, 0.18, 0.18],
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              times: PHASE_TIMES,
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              inset: -16,
              borderRadius: 20,
              background: alpha(accent, 0.22),
              filter: "blur(12px)",
            }}
          />

          {/* Main box */}
          <motion.div
            animate={{
              scale: BOX_SCALE,
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              times: PHASE_TIMES,
              ease: "easeInOut",
            }}
            style={{
              width: 96,
              height: 96,
              borderRadius: 16,
              border: `2px solid ${alpha(accent, 0.55)}`,
              background: alpha(accent, 0.08),
              position: "relative",
            }}
          >
            {/* Corner dots */}
            {[
              { top: -4, left: -4 },
              { top: -4, right: -4 },
              { bottom: -4, left: -4 },
              { bottom: -4, right: -4 },
            ].map((pos, i) => (
              <Box
                key={i}
                sx={{
                  position: "absolute",
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  backgroundColor: accent,
                  opacity: 0.7,
                  ...pos,
                }}
              />
            ))}
          </motion.div>
        </Box>

        {/* Phase label */}
        <Box sx={{ height: 24, position: "relative", width: 200, textAlign: "center" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={phaseIdx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", whiteSpace: "nowrap" }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: accent,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  fontSize: "0.68rem",
                  fontWeight: 600,
                }}
              >
                {PHASES[phaseIdx].label}
              </Typography>
            </motion.div>
          </AnimatePresence>
        </Box>

        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.secondary,
            fontStyle: "italic",
            opacity: 0.6,
            mt: -1,
          }}
        >
          reflecting on your thought…
        </Typography>
      </Box>
    </motion.div>
  );
}
