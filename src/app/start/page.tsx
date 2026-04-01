"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
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
import ResponseScene from "@/components/response/ResponseScene";
import BreathingLoader from "@/components/response/BreathingLoader";
import type { ThoughtResponse } from "@/app/api/thought/route";

// ─── Mock data (remove when API is wired up) ──────────────────────────────────

// ─── Data ─────────────────────────────────────────────────────────────────────

const PROMPTS_DEFAULT = [
  "What if I fail?",
  "I can't stop overthinking this",
  "I keep replaying what happened",
];

const PROMPTS_TR_SPORCU = [
  "Performansım yeterli mi?",
  "Takımı hayal kırıklığına uğratacağım",
  "Baskıyı kaldıramıyorum",
];

const PROMPTS_TR_IZLEYICI = [
  "Takımımız yine hayal kırıklığı yarattı",
  "Bu kadar üzülmemeli miyim?",
  "Umut beslemekten korkuyorum",
];

const PROMPTS_TR_GENERAL = [
  "Türkiye gruptan çıkabilir mi?",
  "Bu kadar heyecanlanmak normal mi?",
  "Hayal kırıklığına uğramaktan korkuyorum",
];

const BLOBS = [
  { size: 380, left: "-8%", top: "2%", delay: 0, p: 0.1, s: 0.07 },
  { size: 220, left: "72%", top: "10%", delay: 0.4, p: 0.07, s: 0.12 },
  { size: 300, left: "65%", top: "60%", delay: 0.8, p: 0.09, s: 0.06 },
  { size: 200, left: "-4%", top: "68%", delay: 1.1, p: 0.06, s: 0.1 },
];

// ─── Animation variants ───────────────────────────────────────────────────────

// Enter animation (reused on every child)
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] as const },
});

// Wind-blow exit — parent staggers, children declare their own exit shape
const inputContainerVariants = {
  exit: {
    transition: { staggerChildren: 0.065, staggerDirection: 1 },
  },
};

const windExitVariant = {
  exit: {
    x: -110,
    opacity: 0,
    transition: { duration: 0.38, ease: [0.4, 0, 1, 1] as const },
  },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

type Phase = "input" | "response";

// ─── Tension detection ────────────────────────────────────────────────────────

// High-intensity words that trigger breathing on their own
const HIGH_TENSION_WORDS = [
  "panic",
  "panicking",
  "breakdown",
  "suicid",
  "self-harm",
  "hopeless",
  "worthless",
  "can't breathe",
  "falling apart",
  "overwhelmed",
  "devastated",
  "can't cope",
  "can't go on",
  "hate myself",
  "hate my life",
  "want to disappear",
];

// Moderate words — need 2+ to trigger
const MODERATE_TENSION_WORDS = [
  "terrible",
  "horrible",
  "awful",
  "scared",
  "fear",
  "anxiety",
  "anxious",
  "depressed",
  "destroy",
  "ruined",
  "disaster",
  "failure",
  "fail",
  "alone",
  "stuck",
  "trapped",
  "broken",
  "shame",
  "ashamed",
  "humiliated",
  "embarrassed",
  "useless",
  "stupid",
  "burden",
  "crying",
  "cannot",
  "everything wrong",
  "nothing works",
  "no one cares",
  "nobody",
];

function isTense(text: string): boolean {
  const lower = text.toLowerCase();
  if (HIGH_TENSION_WORDS.some((w) => lower.includes(w))) return true;
  const moderateHits = MODERATE_TENSION_WORDS.filter((w) => lower.includes(w));
  return moderateHits.length >= 2;
}

const CALMING_MESSAGES = [
  "That sounds like a lot to carry right now. Let's take a breath together before we dive in.",
  "It's okay to feel overwhelmed. You don't have to rush — breathe with us for a moment.",
  "That feeling deserves a gentle pause. Let's breathe first, then look at it together.",
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StartPage() {
  const [thought, setThought] = useState("");
  const [thoughts, setThoughts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("input");
  const [responseData, setResponseData] = useState<ThoughtResponse | null>(
    null,
  );

  // TR mode role selection
  const [trRole, setTrRole] = useState<"sporcu" | "izleyici" | null>(null);

  // Guided breathing state
  const [breathingMessage, setBreathingMessage] = useState<string | null>(null);
  const [continueRequested, setContinueRequested] = useState(false);

  const theme = useTheme();
  const { mode, toggleMode, toggleTrMode, isTrMode, isDark } = useColorMode();
  const isLight = !isDark;

  // ── Localised content ────────────────────────────────────────────────────────
  const content = isTrMode
    ? trRole === "sporcu"
      ? {
          overline: "DÜNYA KUPASI - TÜRK MİLLİ TAKIMI",
          headline: "Sahada ne hissediyorsun?",
          subheadline: (
            <>
              Her maç bir ders, her his geçerli.
              <br />
              Sahada yaşadıklarını burada paylaşabilirsin.
            </>
          ),
          placeholder: "Bugün antrenman/maçta kendimi...",
          chipHint: "ya da bir tanesini seç",
          prompts: PROMPTS_TR_SPORCU,
          ctaIdle: "Zihnini Sahaya Çıkar",
          ctaLoading: "Analiz ediliyor…",
        }
      : trRole === "izleyici"
        ? {
            overline: "DÜNYA KUPASI - TÜRK MİLLİ TAKIMI",
            headline: "Maç seni nasıl etkiledi?",
            subheadline: (
              <>
                Takımın için hissettiğin her şey gerçek.
                <br />
                Bugün içinden geçenleri bir anlat.
              </>
            ),
            placeholder: "Maçı izlerken içimden...",
            chipHint: "ya da bir tanesini seç",
            prompts: PROMPTS_TR_IZLEYICI,
            ctaIdle: "Yüreğini Konuştur",
            ctaLoading: "Dinleniyor…",
          }
        : {
            overline: "DÜNYA KUPASI - TÜRK MİLLİ TAKIMI",
            headline: "2026 FIFA Dünya Kupası için heyecanlı mısın?",
            subheadline: (
              <>
                Milyonlar aynı anda nefesini tuttu.
                <br />
                Senin hissettiğin de bu hikâyenin bir parçası.
              </>
            ),
            placeholder: "Bu turnuva bende...",
            chipHint: "ya da bir tanesini seç",
            prompts: PROMPTS_TR_GENERAL,
            ctaIdle: "İçini Dök",
            ctaLoading: "Yükleniyor…",
          }
    : {
        overline: "A ROAD NOT TAKEN",
        headline: "What's been on your mind?",
        subheadline: (
          <>
            You don't have to figure everything out right now.
            <br />
            Just start with whatever feels closest to the surface.
          </>
        ),
        placeholder: "I keep thinking...",
        chipHint: "or pick something that resonates",
        prompts: PROMPTS_DEFAULT,
        ctaIdle: "Explore this thought",
        ctaLoading: "Exploring…",
      };

  // ── Handlers ────────────────────────────────────────────────────────────────

  // Use a ref so async callbacks always read the latest value without stale closure
  const breathingActiveRef = useRef(false);
  const textFieldRef = useRef<HTMLTextAreaElement>(null);

  const submitThought = async (submittedThought: string) => {
    if (!submittedThought.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/thought", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          thought: submittedThought,
          ...(trRole && { role: trRole }),
          ...(isTrMode && { language: "tr" }),
        }),
      });

      const data = (await res.json()) as ThoughtResponse & { error?: string };

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setBreathingMessage(null);
        breathingActiveRef.current = false;
        return;
      }

      setThoughts((prev) => [...prev, submittedThought]);
      setThought(submittedThought);
      setResponseData(data);

      // Only auto-transition if breathing overlay is NOT active —
      // the user must explicitly press skip/continue
      if (!breathingActiveRef.current) {
        setPhase("response");
      }
      // else: data is ready but we wait for handleBreathingContinue
    } catch {
      setError("Could not reach the server. Please check your connection.");
      setBreathingMessage(null);
      breathingActiveRef.current = false;
    } finally {
      setLoading(false);
    }
  };

  const handleExplore = () => {
    const msg = isTense(thought)
      ? CALMING_MESSAGES[Math.floor(Math.random() * CALMING_MESSAGES.length)]
      : null;
    breathingActiveRef.current = !!msg;
    setBreathingMessage(msg);
    setContinueRequested(false);
    submitThought(thought);
  };

  /** Called when user presses "skip to my reflection" on the breathing overlay */
  const handleBreathingContinue = () => {
    setContinueRequested(true);
    breathingActiveRef.current = false;
    setBreathingMessage(null);
    // If API already finished, transition now; otherwise submitThought will do it
    if (responseData) setPhase("response");
  };

  /** Called from inside the response scene — no phase change, stays in response */
  const handleNewThought = (newThought: string) => {
    breathingActiveRef.current = false;
    setBreathingMessage(null);
    submitThought(newThought);
  };

  const handleReset = () => {
    setPhase("input");
    setThought("");
    setResponseData(null);
    setError(null);
    setBreathingMessage(null);
    setContinueRequested(false);
    breathingActiveRef.current = false;
    // thoughts history is intentionally kept across resets
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <Box sx={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      {/* Ambient blobs — persistent across phases */}
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

      {/* Mode toggles — persistent */}
      <Box
        sx={{
          position: "fixed",
          top: 20,
          right: 24,
          zIndex: 10,
          display: "flex",
          gap: 0.5,
        }}
      >
        {/* TR theme toggle */}
        <Tooltip title={isTrMode ? "TR temasını kapat" : "TR Milli Takımı"}>
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

        {/* Dark / light toggle */}
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

      {/* ── Guided breathing overlay ──────────────────────────────────────── */}
      <AnimatePresence>
        {breathingMessage && (
          <BreathingLoader
            message={breathingMessage}
            apiReady={!loading}
            onContinue={handleBreathingContinue}
          />
        )}
      </AnimatePresence>

      {/* ── Phase content ─────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {/* ── Input phase ─────────────────────────────────────────────────── */}
        {phase === "input" && (
          <motion.div
            key="input-scene"
            variants={inputContainerVariants}
            exit="exit"
            style={{ position: "relative", zIndex: 1 }}
          >
            <Container
              maxWidth="md"
              sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                py: 10,
                px: { xs: 3, sm: 4 },
              }}
            >
              {/* App name */}
              <motion.div {...fadeUp(0.15)} variants={windExitVariant}>
                <Typography
                  variant="overline"
                  sx={{
                    display: "block",
                    textAlign: "center",
                    letterSpacing: "0.28em",
                    color: theme.palette.warning.main,
                    mb: 2,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                  }}
                >
                  {content.overline}
                </Typography>
              </motion.div>

              {/* Headline */}
              <motion.div {...fadeUp(0.3)} variants={windExitVariant}>
                <Typography variant="h3" sx={{ textAlign: "center", mb: 1.5 }}>
                  {content.headline}
                </Typography>
              </motion.div>

              {/* Sub-headline */}
              <motion.div {...fadeUp(0.42)} variants={windExitVariant}>
                <Typography
                  variant="body1"
                  sx={{
                    textAlign: "center",
                    mb: 3,
                    px: 2,
                    color: theme.palette.text.primary,
                    fontSize: "1.1rem",
                  }}
                >
                  {content.subheadline}
                </Typography>
              </motion.div>

              {/* TR role selector — only in TR mode */}
              {isTrMode && (
                <motion.div {...fadeUp(0.5)} variants={windExitVariant}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 1.5,
                      mb: 3,
                    }}
                  >
                    {(["sporcu", "izleyici"] as const).map((role) => {
                      const isActive = trRole === role;
                      return (
                        <motion.div
                          key={role}
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                        >
                          <Chip
                            label={
                              role === "sporcu"
                                ? "⚽ Sporcuyum"
                                : "🏟️ İzleyiciyim"
                            }
                            onClick={() => setTrRole(isActive ? null : role)}
                            variant="outlined"
                            sx={{
                              cursor: "pointer",
                              borderRadius: "999px",
                              fontSize: "0.85rem",
                              fontWeight: 600,
                              px: 1.5,
                              py: 2.5,
                              transition: "all 0.2s ease",
                              borderWidth: 2,
                              borderColor: isActive
                                ? theme.palette.primary.main
                                : alpha(theme.palette.primary.main, 0.3),
                              color: isActive
                                ? theme.palette.primary.contrastText
                                : theme.palette.primary.main,
                              backgroundColor: isActive
                                ? theme.palette.primary.main
                                : "transparent",
                              boxShadow: isActive
                                ? `0 4px 16px ${alpha(theme.palette.primary.main, 0.35)}`
                                : "none",
                              "&&:hover": {
                                borderColor: theme.palette.primary.main,
                                backgroundColor: isActive
                                  ? theme.palette.primary.main
                                  : alpha(theme.palette.primary.main, 0.07),
                              },
                            }}
                          />
                        </motion.div>
                      );
                    })}
                  </Box>
                </motion.div>
              )}

              {/* TextField */}
              <motion.div {...fadeUp(0.55)} variants={windExitVariant}>
                <TextField
                  fullWidth
                  multiline
                  rows={1}
                  inputRef={textFieldRef}
                  value={thought}
                  onChange={(e) => setThought(e.target.value)}
                  placeholder={content.placeholder}
                  variant="outlined"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (thought.trim() && !loading) handleExplore();
                    }
                  }}
                  sx={{
                    mb: 2.5,
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: isLight
                        ? alpha(theme.palette.success.main, 0.12)
                        : theme.palette.background.paper,
                      fontSize: "1.05rem",
                      transition:
                        "box-shadow 0.35s ease, border-color 0.35s ease",
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
              <motion.div {...fadeUp(0.68)} variants={windExitVariant}>
                <Typography
                  variant="body2"
                  sx={{
                    display: "block",
                    textAlign: "center",
                    color: theme.palette.info.main,
                    mb: 2,
                    fontWeight: 500,
                    letterSpacing: "0.02em",
                  }}
                >
                  {content.chipHint}
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
                  {content.prompts.map((prompt) => {
                    const isSelected = thought === prompt;
                    return (
                      <motion.div
                        key={prompt}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.96 }}
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 20,
                        }}
                      >
                        <Chip
                          label={prompt}
                          onClick={() => {
                            setThought(isSelected ? "" : prompt);
                            if (!isSelected) textFieldRef.current?.focus();
                          }}
                          variant="outlined"
                          sx={{
                            cursor: "pointer",
                            borderRadius: "999px",
                            fontSize: "0.88rem",
                            fontWeight: 500,
                            px: 1,
                            py: 2.5,
                            transition: "all 0.22s ease",
                            borderWidth: 1.5,
                            borderColor: isSelected
                              ? theme.palette.primary.main
                              : alpha(theme.palette.text.primary, 0.22),
                            color: isSelected
                              ? theme.palette.primary.contrastText
                              : theme.palette.text.primary,
                            backgroundColor: isSelected
                              ? theme.palette.primary.main
                              : alpha(theme.palette.background.paper, 0.6),
                            boxShadow: isSelected
                              ? `0 4px 14px ${alpha(theme.palette.primary.main, 0.3)}`
                              : `0 2px 8px ${alpha(theme.palette.text.primary, 0.06)}`,
                            "&&:hover": {
                              borderColor: theme.palette.primary.main,
                              backgroundColor: isSelected
                                ? theme.palette.primary.main
                                : alpha(theme.palette.primary.main, 0.1),
                              color: isSelected
                                ? theme.palette.primary.contrastText
                                : theme.palette.primary.main,
                              boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.2)}`,
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
                variants={windExitVariant}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <motion.div
                  whileHover={thought.trim() && !loading ? { scale: 1.02 } : {}}
                  whileTap={thought.trim() && !loading ? { scale: 0.98 } : {}}
                  transition={{ type: "spring", stiffness: 350, damping: 20 }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    disabled={!thought.trim() || loading}
                    onClick={handleExplore}
                    startIcon={
                      loading ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : null
                    }
                    sx={{
                      px: 5,
                      py: 1.6,
                      fontSize: "1rem",
                      borderRadius: "999px",
                      minWidth: 230,
                      letterSpacing: "0.02em",
                      boxShadow:
                        thought.trim() && !loading
                          ? `0 8px 28px ${alpha(theme.palette.primary.main, 0.3)}`
                          : "none",
                      transition: "box-shadow 0.35s ease, opacity 0.35s ease",
                    }}
                  >
                    {loading ? content.ctaLoading : content.ctaIdle}
                  </Button>
                </motion.div>

                {error && (
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 2,
                      textAlign: "center",
                      color: theme.palette.error.main,
                    }}
                  >
                    {error}
                  </Typography>
                )}
              </motion.div>

              {/* Reassurance */}
              <motion.div {...fadeUp(0.95)} variants={windExitVariant}>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    textAlign: "center",
                    mt: 4,
                    color: theme.palette.success.main,
                    fontWeight: 500,
                    letterSpacing: "0.06em",
                  }}
                >
                  Private · Judgment-free · Just for you
                </Typography>
              </motion.div>
            </Container>
          </motion.div>
        )}

        {/* ── Response phase ───────────────────────────────────────────────── */}
        {phase === "response" && responseData && (
          <motion.div
            key="response-scene"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ position: "relative", zIndex: 1 }}
          >
            <ResponseScene
              thought={thought}
              thoughts={thoughts}
              data={responseData}
              isLoading={loading}
              onReset={handleReset}
              onNewThought={handleNewThought}
              overline={content.overline}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
