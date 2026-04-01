"use client";

import { Container } from "@mui/material";
import ThoughtCard from "./ThoughtCard";
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
      maxWidth="sm"
      sx={{
        position: "relative",
        zIndex: 1,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        py: 8,
        px: { xs: 2.5, sm: 3.5 },
      }}
    >
      <ThoughtCard thought={thought} />
      <DialoguePanel data={data} onReset={onReset} />
    </Container>
  );
}
