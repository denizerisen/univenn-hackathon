"use client";

import { motion } from "motion/react";
import { Box, Button, Container, Stack, Typography } from "@mui/material";

export default function Home() {
  return (
    <Container maxWidth="md">
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
        <Typography variant="h2" fontWeight={700} color="primary">
          Univenn Hackathon
        </Typography>
        <Typography variant="h6" color="text.secondary" maxWidth={480}>
          Built with Next.js, Material-UI, and Framer Motion — ready to build
          something great.
        </Typography>
        <Stack direction="row" spacing={2}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Button variant="contained" size="large">
              Get Started
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Button variant="outlined" size="large">
              Learn More
            </Button>
          </motion.div>
        </Stack>
      </Box>
    </Container>
  );
}
