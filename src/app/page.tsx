"use client";

import { motion } from "motion/react";
import {
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import Link from "next/link";
import { useColorMode } from "@/context/ColorModeContext";
import { useTheme } from "@mui/material/styles";

export default function Home() {
  const { mode, toggleMode, toggleTrMode, isTrMode, isDark } = useColorMode();
  const theme = useTheme();
  const isLight = !isDark;

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          position: "fixed",
          top: 20,
          right: 24,
          display: "flex",
          gap: 0.5,
        }}
      >
        <Tooltip
          title={isTrMode ? "TR temasını kapat" : "Türkiye Milli Takımı teması"}
        >
          <IconButton
            onClick={toggleTrMode}
            size="small"
            sx={{
              fontSize: "1.2rem",
              width: 38,
              height: 38,
              border: isTrMode ? "2px solid #ef233c" : "2px solid transparent",
              backgroundColor: isTrMode
                ? "rgba(239,35,60,0.12)"
                : "transparent",
              boxShadow: isTrMode ? "0 0 0 3px rgba(239,35,60,0.18)" : "none",
              opacity: isTrMode ? 1 : 0.35,
              transition: "all 0.25s ease",
              "&:hover": {
                opacity: 1,
                backgroundColor: "rgba(239,35,60,0.1)",
                border: "2px solid #ef233c",
              },
            }}
          >
            <motion.div
              animate={{ scale: isTrMode ? 1.1 : 0.9 }}
              transition={{ duration: 0.25 }}
              style={{ lineHeight: 1, display: "flex" }}
            >
              🇹🇷
            </motion.div>
          </IconButton>
        </Tooltip>

        <Tooltip title={isLight ? "Switch to dark" : "Switch to light"}>
          <IconButton
            onClick={toggleMode}
            size="small"
            sx={{
              width: 38,
              height: 38,
              border: "2px solid transparent",
              backgroundColor: "transparent",
              color: theme.palette.text.secondary,
              opacity: 0.6,
              transition: "all 0.25s ease",
              "&:hover": {
                opacity: 1,
                backgroundColor: "rgba(128,128,128,0.1)",
                border: `2px solid ${theme.palette.text.secondary}`,
              },
            }}
          >
            <motion.div
              key={mode}
              initial={{ rotate: -30, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{ display: "flex" }}
            >
              {isLight ? (
                <DarkModeRoundedIcon fontSize="small" />
              ) : (
                <LightModeRoundedIcon fontSize="small" />
              )}
            </motion.div>
          </IconButton>
        </Tooltip>
      </Box>

      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: 4,
        }}
      >
        <Typography variant="h2">A ROAD NOT TAKEN</Typography>

        <Typography variant="body1" color="text.secondary" maxWidth={480}>
          Built with Next.js, Material-UI, and Framer Motion <br /> A visually
          stunning app that reflects and expands a user’s thoughts.
        </Typography>

        <Stack direction="row" spacing={2}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Button
              component={Link}
              href="/start"
              color="primary"
              variant="contained"
              size="large"
            >
              Get Started
            </Button>
          </motion.div>
          {/* <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Button variant="outlined" size="large" color="secondary">
              Learn More
            </Button>
          </motion.div> */}
        </Stack>
      </Box>
    </Container>
  );
}
