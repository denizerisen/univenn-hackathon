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
import { useColorMode } from "@/context/ColorModeContext";
import { useTheme } from "@mui/material/styles";

export default function Home() {
  const { mode, toggleMode } = useColorMode();
  const theme = useTheme();
  const isLight = mode === "light";

  return (
    <Container maxWidth="md">
      <Box sx={{ position: "fixed", top: 20, right: 24 }}>
        <Tooltip title={isLight ? "Switch to dark" : "Switch to light"}>
          <IconButton onClick={toggleMode} color="primary" size="large">
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
        <Typography variant="h2">Univenn Hackathon</Typography>

        <Typography variant="body1" color="text.secondary" maxWidth={480}>
          Built with Next.js, Material-UI, and Framer Motion — an organic earthy
          journey from forest to sand.
        </Typography>

        {/* Accent chips */}
        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          justifyContent="center"
        >
          {[
            { label: "Forest Green", color: isLight ? "#2C6E49" : undefined },
            { label: "Minty Sage", color: isLight ? "#4C956C" : undefined },
            { label: "Terracotta", color: isLight ? "#C97B5A" : undefined },
            { label: "Misty Blue", color: isLight ? "#8BB3C8" : undefined },
            { label: "Copper", color: isLight ? "#D68C45" : undefined },
          ].map(({ label, color }) => (
            <motion.div
              key={label}
              whileHover={{ scale: 1.08 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Chip
                label={label}
                sx={color ? { backgroundColor: color, color: "#FEFEE3" } : {}}
              />
            </motion.div>
          ))}
        </Stack>

        <Stack direction="row" spacing={2}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Button color="primary" variant="contained" size="large">
              Get Started
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Button variant="outlined" size="large" color="secondary">
              Learn More
            </Button>
          </motion.div>
        </Stack>
      </Box>
    </Container>
  );
}
