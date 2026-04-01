"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import { useColorMode } from "@/context/ColorModeContext";

// ─── Data ─────────────────────────────────────────────────────────────────────

const PROMPTS = [
  "I can't stop overthinking this",
  "I think I embarrassed myself",
  "What if I fail?",
  "I feel like I let someone down",
  "I keep replaying what happened",
];

const BLOBS = [
  { size: 380, left: "-8%", top: "2%", delay: 0, p: 0.1, s: 0.07 },
  { size: 220, left: "72%", top: "10%", delay: 0.4, p: 0.07, s: 0.12 },
  { size: 300, left: "65%", top: "60%", delay: 0.8, p: 0.09, s: 0.06 },
  { size: 200, left: "-4%", top: "68%", delay: 1.1, p: 0.06, s: 0.1 },
];

// ─── Animation helper ─────────────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] as const },
});

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StartPage() {
  const [thought, setThought] = useState("");
  const theme = useTheme();
  const { mode, toggleMode } = useColorMode();
  const isLight = mode === "light";

  const handleExplore = () => {
    console.log("Thought to explore:", thought);
    // TODO: router.push("/explore")
  };

  return (
    <Box sx={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      {/* Ambient blobs */}
      {BLOBS.map((b, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.5, delay: b.delay, ease: "easeOut" }}
          style={{
            position: "absolute",
            width: b.size,
            height: b.size,
            left: b.left,
            top: b.top,
            borderRadius: "50%",
            background: `radial-gradient(circle,
              ${alpha(theme.palette.primary.main, b.p)},
              ${alpha(theme.palette.secondary.main, b.s)})`,
            filter: "blur(72px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      ))}

      {/* Mode toggle */}
      <Box sx={{ position: "fixed", top: 20, right: 24, zIndex: 10 }}>
        <Tooltip title={isLight ? "Switch to dark" : "Switch to light"}>
          <IconButton
            onClick={toggleMode}
            size="large"
            sx={{
              color: theme.palette.text.secondary,
              opacity: 0.6,
              "&:hover": { opacity: 1 },
            }}
          >
            <motion.div
              key={mode}
              initial={{ rotate: -30, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {isLight ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
            </motion.div>
          </IconButton>
        </Tooltip>
      </Box>

      {/* Main content */}
      <Container
        maxWidth="md"
        sx={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          py: 10,
          px: { xs: 3, sm: 4 },
        }}
      >
        {/* App name */}
        <motion.div {...fadeUp(0.15)}>
          <Typography
            variant="overline"
            sx={{
              display: "block",
              textAlign: "center",
              letterSpacing: "0.28em",
              color: theme.palette.warning.main,
              mb: 6,
              fontSize: "1.25rem",
              fontWeight: 900,
            }}
          >
            A ROAD NOT TAKEN
          </Typography>
        </motion.div>

        {/* Headline */}
        <motion.div {...fadeUp(0.3)}>
          <Typography variant="h3" sx={{ textAlign: "center", mb: 1.5 }}>
            What's been on your mind?
          </Typography>
        </motion.div>

        {/* Sub-headline */}
        <motion.div {...fadeUp(0.42)}>
          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              mb: 5,
              px: 2,
              color: theme.palette.text.primary,
              fontSize: "1.1rem",
            }}
          >
            You don't have to figure everything out right now.
            <br />
            Just start with whatever feels closest to the surface.
          </Typography>
        </motion.div>

        {/* TextField */}
        <motion.div {...fadeUp(0.55)}>
          <TextField
            fullWidth
            multiline
            rows={1}
            value={thought}
            onChange={(e) => setThought(e.target.value)}
            placeholder="I keep thinking I messed everything up…"
            variant="outlined"
            sx={{
              mb: 2.5,
              "& .MuiOutlinedInput-root": {
                backgroundColor: isLight
                  ? alpha(theme.palette.success.main, 0.12)
                  : theme.palette.background.paper,
                transition: "box-shadow 0.35s ease, border-color 0.35s ease",
                "& fieldset": {
                  borderColor: alpha(theme.palette.text.secondary, 0.35),
                  borderWidth: 1.5,
                },
                "&:hover fieldset": {
                  borderColor: alpha(theme.palette.text.secondary, 0.7),
                },
                "&.Mui-focused fieldset": {
                  borderColor: theme.palette.primary.main,
                  borderWidth: 2,
                  boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.08)}`,
                },
              },
              "& .MuiInputBase-input": {
                color: theme.palette.text.primary,
                "&::placeholder": {
                  color: theme.palette.text.secondary,
                  opacity: 0.55,
                  fontStyle: "italic",
                },
              },
            }}
          />
        </motion.div>

        {/* Prompt chips */}
        <motion.div {...fadeUp(0.68)}>
          <Typography
            variant="body2"
            sx={{
              display: "block",
              textAlign: "center",
              color: theme.palette.primary.main,
              mb: 2,
              fontWeight: 600,
            }}
          >
            or pick something that resonates
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              justifyContent: "center",
              mb: 5,
            }}
          >
            {PROMPTS.map((prompt) => {
              const isSelected = thought === prompt;
              return (
                <motion.div
                  key={prompt}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 350, damping: 20 }}
                >
                  <Chip
                    label={prompt}
                    onClick={() => setThought(isSelected ? "" : prompt)}
                    variant="outlined"
                    sx={{
                      cursor: "pointer",
                      borderRadius: "999px",
                      fontSize: "0.78rem",
                      px: 0.5,
                      transition: "all 0.25s ease",
                      borderColor: isSelected
                        ? theme.palette.primary.main
                        : alpha(theme.palette.text.secondary, 0.25),
                      color: isSelected
                        ? theme.palette.primary.contrastText
                        : theme.palette.text.secondary,
                      backgroundColor: isSelected
                        ? theme.palette.primary.main
                        : alpha(theme.palette.background.paper, 0.45),
                      "&&:hover": {
                        borderColor: theme.palette.primary.main,
                        backgroundColor: isSelected
                          ? theme.palette.primary.main
                          : alpha(theme.palette.primary.main, 0.08),
                        color: isSelected
                          ? theme.palette.primary.contrastText
                          : theme.palette.primary.main,
                      },
                    }}
                  />
                </motion.div>
              );
            })}
          </Box>
        </motion.div>

        {/* CTA */}
        <motion.div
          {...fadeUp(0.8)}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <motion.div
            whileHover={thought.trim() ? { scale: 1.02 } : {}}
            whileTap={thought.trim() ? { scale: 0.98 } : {}}
            transition={{ type: "spring", stiffness: 350, damping: 20 }}
          >
            <Button
              variant="contained"
              size="large"
              disabled={!thought.trim()}
              onClick={handleExplore}
              sx={{
                px: 5,
                py: 1.6,
                fontSize: "1rem",
                borderRadius: "999px",
                minWidth: 230,
                boxShadow: thought.trim()
                  ? `0 8px 28px ${alpha(theme.palette.primary.main, 0.3)}`
                  : "none",
                transition: "box-shadow 0.35s ease, opacity 0.35s ease",
              }}
            >
              Explore this thought
            </Button>
          </motion.div>
        </motion.div>

        {/* Reassurance footer */}
        <motion.div {...fadeUp(0.95)}>
          <Typography
            variant="caption"
            sx={{
              display: "block",
              textAlign: "center",
              mt: 4,
              color: theme.palette.warning.main,
              fontWeight: 500,
              letterSpacing: "0.06em",
            }}
          >
            Private · Judgment-free · Just for you
          </Typography>
        </motion.div>
      </Container>
    </Box>
  );
}
