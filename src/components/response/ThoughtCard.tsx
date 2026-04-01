"use client";

import { Box, Paper, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "motion/react";

interface Props {
  thought: string;
}

export default function ThoughtCard({ thought }: Props) {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] as const }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 480,
          mx: "auto",
          mb: 3,
          px: 3,
          py: 2,
          borderRadius: 3,
          backgroundColor: alpha(theme.palette.background.paper, 0.7),
          backdropFilter: "blur(10px)",
          border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
        }}
      >
        <Typography
          variant="overline"
          sx={{
            display: "block",
            color: theme.palette.info.main,
            letterSpacing: "0.18em",
            fontSize: "0.65rem",
            mb: 0.75,
          }}
        >
          what you shared
        </Typography>
        <Box
          sx={{
            borderLeft: `3px solid ${alpha(theme.palette.success.main, 0.4)}`,
            pl: 1.5,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontStyle: "italic",
              color: theme.palette.text.primary,
              opacity: 0.85,
            }}
          >
            "{thought}"
          </Typography>
        </Box>
      </Paper>
    </motion.div>
  );
}
