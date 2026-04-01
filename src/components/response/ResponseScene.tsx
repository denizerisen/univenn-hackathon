"use client";

import { Box, Container } from "@mui/material";
import ThoughtCard from "./ThoughtCard";
import ReflectionHeader from "./ReflectionHeader";
import DialoguePanel from "./DialoguePanel";
import type { ThoughtResponse } from "@/app/api/thought/route";

interface Props {
  thought: string;
  data: ThoughtResponse;
  onReset: () => void;
}

export default function ResponseScene({ thought, data, onReset }: Props) {
  return (
    <Container
      maxWidth="lg"
      sx={{
        position: "relative",
        zIndex: 1,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        py: 8,
        px: { xs: 2.5, sm: 4 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "stretch",
          gap: 3,
          width: "100%",
        }}
      >
        {/* Left column — 1/3: thought card + reflection header */}
        <Box
          sx={{
            flex: "0 0 33.333%",
            maxWidth: { md: "33.333%" },
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <ReflectionHeader analysis={data.analysis} />
          <ThoughtCard thought={thought} />
        </Box>

        {/* Right column — 2/3: path selector + content */}
        <Box sx={{ flex: "1 1 0%", display: "flex", flexDirection: "column" }}>
          <DialoguePanel data={data} onReset={onReset} />
        </Box>
      </Box>
    </Container>
  );
}
