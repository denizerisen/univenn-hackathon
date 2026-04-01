"use client";

import { useEffect, useState } from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { AnimatePresence, motion } from "motion/react";

const PHASES = [
  { label: "breathe in",  duration: 4000 },
  { label: "hold",        duration: 4000 },
  { label: "breathe out", duration: 4000 },
  { label: "hold",        duration: 4000 },
] as const;

const BOX_SCALE   = [0.72, 1.12, 1.12, 0.72, 0.72];
const PHASE_TIMES = [0,    0.25, 0.5,  0.75, 1    ];

// Show skip option after one breathe-in (4 s) + one breathe-out (4 s) = 8 s
const SKIP_AFTER_MS = PHASES[0].duration + PHASES[2].duration; // 8 000

interface Props {
  /** When provided, shows calming message + guided breathing mode */
  message?: string;
  /** Called when user clicks the Continue button */
  onContinue?: () => void;
  /** Shows a spinner on the Continue button while the API is still loading */
  apiReady?: boolean;
}

export default function BreathingLoader({ message, onContinue, apiReady }: Props) {
  const theme = useTheme();
  const accent =
    theme.palette.mode === "dark"
      ? theme.palette.secondary.main
      : theme.palette.success.main;

  const [phaseIdx, setPhaseIdx]       = useState(0);
  const [cycleComplete, setCycleComplete] = useState(false);
  const [continueClicked, setContinueClicked] = useState(false);

  // Cycle through breathing phases
  useEffect(() => {
    const id = setTimeout(() => {
      setPhaseIdx((i) => (i + 1) % PHASES.length);
    }, PHASES[phaseIdx].duration);
    return () => clearTimeout(id);
  }, [phaseIdx]);

  // Reveal skip/continue option after breathe-in + breathe-out (8 s)
  useEffect(() => {
    const id = setTimeout(() => setCycleComplete(true), SKIP_AFTER_MS);
    return () => clearTimeout(id);
  }, []);

  const handleContinue = () => {
    setContinueClicked(true);
    onContinue?.();
  };

  const isGuided = !!message;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(8px)",
        backgroundColor: alpha(theme.palette.background.default, isGuided ? 0.82 : 0.55),
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: isGuided ? 3 : 3.5,
          px: 4,
          maxWidth: 420,
          textAlign: "center",
          userSelect: "none",
        }}
      >
        {/* Calming message (guided mode only) */}
        {isGuided && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          >
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.primary,
                fontStyle: "italic",
                opacity: 0.85,
                lineHeight: 1.7,
              }}
            >
              {message}
            </Typography>
          </motion.div>
        )}

        {/* Breathing box */}
        <Box sx={{ position: "relative", width: 96, height: 96 }}>
          {/* Glow */}
          <motion.div
            animate={{
              scale:   BOX_SCALE,
              opacity: [0.18, 0.42, 0.42, 0.18, 0.18],
            }}
            transition={{ duration: 16, repeat: Infinity, times: PHASE_TIMES, ease: "easeInOut" }}
            style={{
              position: "absolute",
              inset: -16,
              borderRadius: 20,
              background: alpha(accent, 0.22),
              filter: "blur(12px)",
            }}
          />

          {/* Box */}
          <motion.div
            animate={{ scale: BOX_SCALE }}
            transition={{ duration: 16, repeat: Infinity, times: PHASE_TIMES, ease: "easeInOut" }}
            style={{
              width: 96,
              height: 96,
              borderRadius: 16,
              border: `2px solid ${alpha(accent, 0.55)}`,
              background: alpha(accent, 0.08),
              position: "relative",
            }}
          >
            {[{ top: -4, left: -4 }, { top: -4, right: -4 }, { bottom: -4, left: -4 }, { bottom: -4, right: -4 }].map(
              (pos, i) => (
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
              )
            )}
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

        {/* Footer line */}
        <Typography
          variant="caption"
          sx={{ color: theme.palette.text.secondary, fontStyle: "italic", opacity: 0.6, mt: -1 }}
        >
          {isGuided ? "your reflection is on its way" : "reflecting on your thought…"}
        </Typography>

        {/* Continue button — appears after 1 cycle in guided mode */}
        {isGuided && (
          <AnimatePresence>
            {cycleComplete && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
              >
                <Button
                  variant="outlined"
                  onClick={handleContinue}
                  disabled={continueClicked && !apiReady}
                  sx={{
                    borderRadius: "999px",
                    px: 3.5,
                    py: 1,
                    fontSize: "0.85rem",
                    borderColor: alpha(accent, 0.45),
                    color: accent,
                    "&:hover": {
                      borderColor: accent,
                      backgroundColor: alpha(accent, 0.07),
                    },
                    "&.Mui-disabled": { opacity: 0.5 },
                  }}
                >
                  {continueClicked && !apiReady
                    ? "almost there…"
                    : "skip to my reflection"}
                </Button>

                <Typography
                  variant="caption"
                  sx={{ color: theme.palette.text.secondary, opacity: 0.5 }}
                >
                  or keep breathing — the box method continues on its own
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </Box>
    </motion.div>
  );
}
