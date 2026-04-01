"use client";

import { useEffect, useState } from "react";
import { Box, Container } from "@mui/material";
import ThoughtCard from "./ThoughtCard";
import ReflectionHeader from "./ReflectionHeader";
import DialoguePanel from "./DialoguePanel";
import type { ThoughtResponse } from "@/app/api/thought/route";

interface Props {
  thought: string;
  thoughts: string[];
  data: ThoughtResponse;
  isLoading?: boolean;
  onReset: () => void;
  onNewThought: (thought: string) => void;
}

export default function ResponseScene({
  thought,
  thoughts,
  data,
  isLoading,
  onReset,
  onNewThought,
}: Props) {
  const [summaryDone, setSummaryDone] = useState(false);

  // Reset gate whenever a new response is loading
  useEffect(() => {
    if (isLoading) setSummaryDone(false);
  }, [isLoading]);

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
          <ReflectionHeader
            analysis={data.analysis}
            isLoading={isLoading}
            onSummaryDone={() => setSummaryDone(true)}
          />
          <ThoughtCard thought={thought} thoughts={thoughts} />
        </Box>

        {/* Right column — 2/3: path selector + content */}
        <Box sx={{ flex: "1 1 0%", display: "flex", flexDirection: "column" }}>
          <DialoguePanel
            data={data}
            isLoading={isLoading}
            summaryDone={summaryDone}
            onReset={onReset}
            onNewThought={onNewThought}
          />
        </Box>
      </Box>
    </Container>
  );
}
