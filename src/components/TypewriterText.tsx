"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import type { TypographyProps } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { motion } from "motion/react";
import { useAccent } from "@/hooks/useAccent";

interface ScatterData {
  dx: number;
  dy: number;
  rotate: number;
}

interface WordToken {
  text: string;
  scatter: ScatterData;
}

interface Props extends Omit<TypographyProps, "children"> {
  text: string;
  /** ms per character — default 30 */
  speed?: number;
  /** ms delay before starting — default 0 */
  delay?: number;
  /** skip typing animation — reveal text instantly */
  instant?: boolean;
  /** skip the dust-scatter exit animation — just crossfade to new text */
  noScatter?: boolean;
  /** called once when the full text has finished typing */
  onDone?: () => void;
  sx?: SxProps<Theme>;
}

type Phase = "exit" | "type";

export default function TypewriterText({
  text,
  speed = 30,
  delay = 0,
  instant = false,
  noScatter = false,
  onDone,
  sx,
  ...typographyProps
}: Props) {
  const accent = useAccent();
  const [phase, setPhase]             = useState<Phase>("type");
  const [displayed, setDisplayed]     = useState("");
  const [done, setDone]               = useState(false);
  const [exitWords, setExitWords]     = useState<WordToken[]>([]);
  const [reservedHeight, setReservedHeight] = useState<number | null>(null);

  const timerRef     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const displayedRef = useRef("");
  const containerRef = useRef<HTMLSpanElement>(null);

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const startTyping = (target: string, startDelay: number, skipAnim = false) => {
    setDisplayed("");
    displayedRef.current = "";
    setDone(false);

    if (!target.trim()) return;

    // Instant reveal — no typewriter loop
    if (skipAnim) {
      setDisplayed(target);
      displayedRef.current = target;
      setDone(true);
      setReservedHeight(null);
      onDone?.();
      return;
    }

    let i = 0;
    timerRef.current = setTimeout(() => {
      const tick = () => {
        i++;
        const next = target.slice(0, i);
        setDisplayed(next);
        displayedRef.current = next;
        if (i >= target.length) {
          setDone(true);
          setReservedHeight(null);
          onDone?.();
        } else {
          timerRef.current = setTimeout(tick, speed);
        }
      };
      tick();
    }, startDelay);
  };

  useEffect(() => {
    clearTimer();

    const current = displayedRef.current;
    if (current.length > 0 && !noScatter) {
      // Snapshot current height before clearing content
      const h = containerRef.current?.offsetHeight ?? null;
      if (h) setReservedHeight(h);

      const tokens: WordToken[] = current.split(/(\s+)/).map((token) => ({
        text: token,
        scatter: {
          dx:     (Math.random() - 0.5) * 100,
          dy:     -(Math.random() * 55 + 12),
          rotate: (Math.random() - 0.5) * 40,
        },
      }));

      // Compute wait time so all words finish their animation before typing starts
      const wordCount = tokens.filter((t) => t.text.trim()).length;
      const scatterDuration = 600; // ms per word animation
      const perWordStagger  = 80;  // ms between each word
      const waitTime = wordCount * perWordStagger + scatterDuration + 100;

      setExitWords(tokens);
      setPhase("exit");
      setDisplayed("");
      displayedRef.current = "";

      timerRef.current = setTimeout(() => {
        setExitWords([]);
        setPhase("type");
        startTyping(text, delay, instant);
      }, waitTime);
    } else {
      setPhase("type");
      startTyping(text, delay, instant);
    }

    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <Typography
      ref={containerRef}
      component="span"
      sx={{
        display: "block",
        // Hold the pre-scatter height so the layout never jumps
        minHeight: reservedHeight != null ? `${reservedHeight}px` : undefined,
        transition: "min-height 0.4s ease",
        ...sx,
      }}
      {...typographyProps}
    >
      {/* Dust-scatter exit — word by word */}
      {phase === "exit" &&
        exitWords.map(({ text: token, scatter }, i) => {
          const isSpace = /^\s+$/.test(token);
          const wordIdx = exitWords.slice(0, i).filter((t) => !/^\s+$/.test(t.text)).length;
          return (
            <motion.span
              key={i}
              initial={{ opacity: 1, x: 0, y: 0, rotate: 0, filter: "blur(0px)" }}
              animate={{
                opacity: 0,
                x:       scatter.dx,
                y:       scatter.dy,
                rotate:  scatter.rotate,
                filter:  "blur(5px)",
              }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
                delay: isSpace ? 0 : wordIdx * 0.08,
              }}
              style={{ display: "inline-block" }}
            >
              {isSpace ? "\u00A0" : token}
            </motion.span>
          );
        })}

      {/* Typewriter reveal */}
      {phase === "type" && (
        <>
          {displayed}
          {!done && displayed.length > 0 && (
            <Box
              component="span"
              sx={{
                display: "inline-block",
                width: "1.5px",
                height: "1em",
                backgroundColor: accent,
                verticalAlign: "text-bottom",
                ml: "1px",
                animation: "blink 0.9s step-end infinite",
                "@keyframes blink": {
                  "0%, 100%": { opacity: 1 },
                  "50%":      { opacity: 0 },
                },
              }}
            />
          )}
        </>
      )}
    </Typography>
  );
}
