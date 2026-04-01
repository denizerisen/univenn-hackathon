"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { AnimatePresence, motion } from "motion/react";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

function ThinkingDots({ accent }: { accent: string }) {
  return (
    <Box sx={{ display: "flex", gap: "5px", alignItems: "center", py: 0.5 }}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.2, 1, 0.2], y: [0, -4, 0] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
          style={{
            display: "inline-block",
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: accent,
            opacity: 0.3,
          }}
        />
      ))}
    </Box>
  );
}
import PathSelector from "./PathSelector";
import TypewriterText from "@/components/TypewriterText";
import type { ThoughtResponse, ThoughtPath } from "@/app/api/thought/route";

interface Props {
  data: ThoughtResponse;
  isLoading?: boolean;
  summaryDone?: boolean;
  onReset: () => void;
  onNewThought: (thought: string) => void;
}

const PATH_PROMPTS: Record<ThoughtPath["type"], string> = {
  worst_case: "Sit with this honestly",
  most_likely: "Rest in what's likely",
  positive: "Carry this kinder view",
};

const PATH_PLACEHOLDERS: Record<ThoughtPath["type"], string> = {
  worst_case: "What feels most uncertain or scary right now…",
  most_likely: "What do you actually think will happen…",
  positive: "What might a gentler version of this look like…",
};

export default function DialoguePanel({
  data,
  isLoading,
  summaryDone,
  onReset,
  onNewThought,
}: Props) {
  const [selected, setSelected]   = useState<ThoughtPath["type"]>("most_likely");
  const [composing, setComposing] = useState(false);
  const [draft, setDraft]         = useState("");
  const [seenPaths, setSeenPaths] = useState<Set<ThoughtPath["type"]>>(new Set());

  // Reset seen paths whenever new API response data arrives
  useEffect(() => { setSeenPaths(new Set()); }, [data]);

  const theme = useTheme();
  const accent =
    theme.palette.mode === "dark"
      ? theme.palette.secondary.main
      : theme.palette.success.main;

  const activePath =
    data.paths.find((p) => p.type === selected) ?? data.paths[0];

  const handleOpenCompose = () => {
    setDraft("");
    setComposing(true);
  };

  const handleCancelCompose = () => {
    setComposing(false);
    setDraft("");
  };

  const handleSubmitNewThought = () => {
    if (!draft.trim()) return;
    onNewThought(draft.trim());
    setComposing(false);
    setDraft("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 44 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.65,
        delay: 0.25,
        ease: [0.22, 1, 0.36, 1] as const,
      }}
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Paper
        elevation={0}
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          borderRadius: 2,
          overflow: "hidden",
          backgroundColor: alpha(theme.palette.background.paper, 0.93),
          backdropFilter: "blur(16px)",
          border: `1px solid ${alpha(accent, 0.18)}`,
          boxShadow: `0 24px 64px ${alpha(theme.palette.text.primary, 0.1)}`,
          borderLeft: `4px solid ${alpha(accent, 0.55)}`,
        }}
      >
        <Box
          sx={{
            px: 3.5,
            pt: 3,
            pb: 3,
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <PathSelector
            paths={data.paths}
            selected={selected}
            onSelect={setSelected}
          />

          {/* Path content — fades out when composing */}
          <AnimatePresence mode="wait">
            {!composing && (
              <motion.div
                key={`path-${selected}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 1,
                    backgroundColor: alpha(accent, 0.05),
                    border: `1px solid ${alpha(accent, 0.12)}`,
                    mb: 3,
                  }}
                >
                  {!isLoading && !summaryDone ? (
                    <ThinkingDots accent={accent} />
                  ) : (
                    <TypewriterText
                      text={isLoading || !summaryDone ? "" : activePath.description}
                      instant={seenPaths.has(selected)}
                      variant="body1"
                      onDone={() =>
                        setSeenPaths((prev) => new Set([...prev, selected]))
                      }
                      sx={{ color: theme.palette.text.primary, mb: 2 }}
                    />
                  )}
                </Box>
              </motion.div>
            )}

            {/* Inline compose area */}
            {composing && (
              <motion.div
                key="compose"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{
                  duration: 0.3,
                  ease: [0.22, 1, 0.36, 1] as const,
                }}
              >
                <Box
                  sx={{
                    mb: 3,
                    p: 2,
                    borderRadius: 1,
                    border: `1px solid ${alpha(accent, 0.22)}`,
                    backgroundColor: alpha(accent, 0.04),
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 1.5,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: accent,
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        fontSize: "0.65rem",
                      }}
                    >
                      a new thought
                    </Typography>
                    <Tooltip title="Cancel">
                      <IconButton
                        size="small"
                        onClick={handleCancelCompose}
                        sx={{
                          color: theme.palette.text.secondary,
                          p: 0.25,
                          "&:hover": { color: theme.palette.text.primary },
                        }}
                      >
                        <CloseRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <TextField
                    multiline
                    rows={3}
                    fullWidth
                    autoFocus
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder={PATH_PLACEHOLDERS[selected]}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                        handleSubmitNewThought();
                      }
                    }}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1.5,
                        fontSize: "0.93rem",
                        backgroundColor: "transparent",
                        "& fieldset": { borderColor: "transparent" },
                        "&:hover fieldset": {
                          borderColor: alpha(accent, 0.25),
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "transparent",
                          boxShadow: "none",
                        },
                      },
                    }}
                  />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      mt: 1.5,
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Button
                        variant="contained"
                        size="small"
                        disabled={!draft.trim() || isLoading}
                        onClick={handleSubmitNewThought}
                        endIcon={
                          isLoading ? (
                            <CircularProgress size={14} color="inherit" />
                          ) : (
                            <SendRoundedIcon fontSize="small" />
                          )
                        }
                        sx={{
                          borderRadius: "999px",
                          px: 2.5,
                          py: 0.75,
                          fontSize: "0.82rem",
                          backgroundColor: accent,
                          color: theme.palette.background.paper,
                          boxShadow: "none",
                          "&:hover": {
                            backgroundColor: accent,
                            opacity: 0.88,
                            boxShadow: "none",
                          },
                          "&.Mui-disabled": { opacity: 0.45 },
                        }}
                      >
                        {isLoading ? "Reflecting…" : "Explore this"}
                      </Button>
                    </motion.div>
                  </Box>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "stretch", sm: "center" },
              justifyContent: "space-between",
              gap: 1.5,
              mt: "auto",
              pt: 1,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                fontStyle: "italic",
                opacity: 0.7,
              }}
            >
              "Take a breath. You don't have to rush."
            </Typography>

            {!composing && (
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleOpenCompose}
                  startIcon={<AutoAwesomeRoundedIcon fontSize="small" />}
                  sx={{
                    borderRadius: "999px",
                    px: 2.5,
                    py: 0.75,
                    fontSize: "0.82rem",
                    whiteSpace: "nowrap",
                    borderColor: alpha(accent, 0.35),
                    color: accent,
                    "&:hover": {
                      borderColor: theme.palette.text.primary,
                      color: theme.palette.text.primary,
                      backgroundColor: alpha(accent, 0.06),
                    },
                  }}
                >
                  {PATH_PROMPTS[selected]}
                </Button>
              </motion.div>
            )}
          </Box>
        </Box>
      </Paper>
    </motion.div>
  );
}
