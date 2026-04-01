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
import { useAccent } from "@/hooks/useAccent";
import { useColorMode } from "@/context/ColorModeContext";

interface Props {
  thought: string;
  thoughts: string[];
}

// ─── Sentiment scorer (0 = very negative, 100 = very positive) ────────────────

const NEG_WORDS = [
  "fail", "failur", "panic", "hopeless", "worthless", "hate", "awful", "terrible",
  "horrible", "scared", "fear", "anxious", "anxiety", "depress", "destroy", "ruin",
  "disaster", "stuck", "trapped", "broken", "shame", "humiliat", "useless", "stupid",
  "burden", "alone", "nobody", "cry", "crying", "cannot", "can't", "won't", "never",
  "always wrong", "everything wrong", "nothing works", "no one", "lost", "overwhelm",
  "devastat", "miserable", "regret", "disappoint", "exhaust", "powerless",
  // TR
  "korku", "panik", "başaramıyorum", "mahvoldum", "berbat", "korkunç", "utanç",
  "hayal kırıklığı", "endişe", "yalnız", "çaresiz", "yorgun", "pişman",
];

const POS_WORDS = [
  "hope", "better", "good", "great", "happy", "love", "excit", "confident", "strong",
  "proud", "grateful", "thankful", "calm", "peace", "joy", "progress", "improve",
  "success", "learn", "grow", "capable", "relief", "trust", "accept", "okay",
  // TR
  "umut", "iyi", "güzel", "mutlu", "heyecan", "güven", "başardım", "seviyorum",
  "teşekkür", "huzur", "gelişim", "öğren", "kabul", "rahat",
];

function sentimentScore(text: string): number {
  const lower = text.toLowerCase();
  let score = 50;
  NEG_WORDS.forEach((w) => { if (lower.includes(w)) score -= 8; });
  POS_WORDS.forEach((w) => { if (lower.includes(w)) score += 8; });
  return Math.min(100, Math.max(0, score));
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
  const accent = useAccent();
  const { isTrMode } = useColorMode();
  const t = isTrMode
    ? { header: "paylaştıkların", prev: "Önceki düşünce", next: "Sonraki düşünce" }
    : { header: "what you shared", prev: "Earlier thought", next: "Later thought" };

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
            {t.header}
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

        {/* Sentiment bar */}
        <Box sx={{ mt: 2, mb: thoughts.length > 1 ? 0.5 : 0 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 0.5,
            }}
          >
            <Typography sx={{ fontSize: "0.8rem", lineHeight: 1 }}>😔</Typography>
            <Typography sx={{ fontSize: "0.8rem", lineHeight: 1 }}>😊</Typography>
          </Box>
          <Box
            sx={{
              position: "relative",
              height: 6,
              borderRadius: "999px",
              background: `linear-gradient(to right,
                #ef4444 0%,
                #f97316 25%,
                #eab308 50%,
                #84cc16 75%,
                #22c55e 100%)`,
              overflow: "hidden",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: alpha(theme.palette.background.paper, 0.85),
                  borderRadius: "999px",
                  transformOrigin: "right",
                }}
              >
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: `${100 - sentimentScore(thoughts[index])}%` }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    height: "100%",
                    borderRadius: "999px",
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </Box>
        </Box>

        {/* Navigation arrows (only if multiple thoughts) */}
        {thoughts.length > 1 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 0.5,
              mt: 0.5,
            }}
          >
            <Tooltip title={t.prev}>
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

            <Tooltip title={t.next}>
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
