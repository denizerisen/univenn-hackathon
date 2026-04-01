"use client";

import { Box, Chip, Paper, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "motion/react";
import type { ThoughtAnalysis } from "@/app/api/thought/route";
import TypewriterText from "@/components/TypewriterText";

interface Props {
  analysis: ThoughtAnalysis;
  isLoading?: boolean;
  onSummaryDone?: () => void;
}

export default function ReflectionHeader({ analysis, isLoading, onSummaryDone }: Props) {
  const theme = useTheme();
  const accent =
    theme.palette.mode === "dark"
      ? theme.palette.secondary.main
      : theme.palette.success.main;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.55,
        delay: 0.15,
        ease: [0.22, 1, 0.36, 1] as const,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          px: 3,
          py: 2.5,
          borderRadius: 2,
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: "blur(10px)",
          border: `1px solid ${alpha(accent, 0.18)}`,
          borderLeft: `4px solid ${alpha(accent, 0.55)}`,
        }}
      >
        <Typography
          variant="overline"
          sx={{
            display: "block",
            color: accent,
            letterSpacing: "0.2em",
            fontSize: "0.65rem",
            fontWeight: 600,
            mb: 1.5,
          }}
        >
          a gentle reflection
        </Typography>

        <TypewriterText
          text={isLoading ? "" : analysis.summary}
          variant="body1"
          delay={300}
          onDone={onSummaryDone}
          sx={{ color: theme.palette.text.primary, fontSize: "0.95rem" }}
        />

        {analysis.patterns.length > 0 && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0.75,
              mt: 2,
              opacity: isLoading ? 0 : 1,
              transition: "opacity 0.3s ease",
            }}
          >
            {analysis.patterns.map((pattern) => (
              <Chip
                key={pattern}
                label={pattern}
                size="small"
                sx={{
                  borderRadius: "999px",
                  fontSize: "0.72rem",
                  fontWeight: 500,
                  backgroundColor: alpha(accent, 0.1),
                  color: accent,
                  border: `1px solid ${alpha(accent, 0.25)}`,
                }}
              />
            ))}
          </Box>
        )}
      </Paper>
    </motion.div>
  );
}
