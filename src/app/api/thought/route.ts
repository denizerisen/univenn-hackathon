import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ThoughtPath {
  type: "worst_case" | "most_likely" | "positive";
  title: string;
  description: string;
  feeling: string;
}

export interface ThoughtAnalysis {
  patterns: string[];
  summary: string;
}

export interface ThoughtResponse {
  analysis: ThoughtAnalysis;
  paths: ThoughtPath[];
}

// ─── Prompt ───────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a calm, supportive mental wellness assistant.
You help users reframe negative thoughts gently.
You never invalidate feelings.
You avoid harsh or clinical language.
You encourage balanced and realistic thinking.

You must respond ONLY with a valid JSON object — no markdown, no explanation, no code fences.
The JSON must follow this exact structure:

{
  "analysis": {
    "patterns": ["pattern1", "pattern2"],
    "summary": "A short, gentle explanation of what you noticed in the thought"
  },
  "paths": [
    {
      "type": "worst_case",
      "title": "Worst Case",
      "description": "A compassionate description of the worst case scenario",
      "feeling": "How this scenario might feel emotionally"
    },
    {
      "type": "most_likely",
      "title": "Most Likely",
      "description": "A grounded, realistic description of what will probably happen",
      "feeling": "How this scenario might feel emotionally"
    },
    {
      "type": "positive",
      "title": "A Kinder Perspective",
      "description": "A gentle, hopeful reframe of the situation",
      "feeling": "How this perspective might feel emotionally"
    }
  ]
}

Common thought patterns to detect (use plain language, not clinical labels):
- catastrophizing, black-and-white thinking, mind reading, fortune telling,
  personalizing, emotional reasoning, should statements, overgeneralizing, filtering`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseClaudeJson(raw: string): ThoughtResponse {
  // 1. Strip any markdown code fences (```json … ``` or ``` … ```)
  let cleaned = raw.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/im, "").replace(/\s*```\s*$/im, "").trim();

  // 2. If Claude wrapped the JSON in extra prose, pull out the first {...} block
  if (!cleaned.startsWith("{")) {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON object found in Claude response");
    cleaned = match[0];
  }

  console.log("[thought/route] cleaned response:", cleaned);

  const parsed = JSON.parse(cleaned) as ThoughtResponse;

  // 3. Basic shape validation
  if (
    !parsed.analysis ||
    !Array.isArray(parsed.analysis.patterns) ||
    typeof parsed.analysis.summary !== "string" ||
    !Array.isArray(parsed.paths) ||
    parsed.paths.length !== 3
  ) {
    throw new Error("Unexpected response shape from Claude");
  }

  return parsed;
}

// ─── Route handler ────────────────────────────────────────────────────────────

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  // 1. Parse & validate body
  let thought: string;
  try {
    const body = await req.json() as { thought?: unknown };
    if (typeof body.thought !== "string" || !body.thought.trim()) {
      return NextResponse.json(
        { error: "Request body must include a non-empty `thought` string." },
        { status: 400 }
      );
    }
    thought = body.thought.trim();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  // 2. Call Claude
  let raw: string;
  try {
    const message = await client.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Here is the thought I'd like to explore:\n\n"${thought}"`,
        },
      ],
    });

    const block = message.content[0];
    if (block.type !== "text") {
      throw new Error("Unexpected content block type from Claude");
    }
    raw = block.text;
    console.log("[thought/route] raw Claude response:", raw);
  } catch (err) {
    console.error("[thought/route] Anthropic error:", err);
    return NextResponse.json(
      { error: "Failed to reach the AI. Please try again." },
      { status: 502 }
    );
  }

  // 3. Parse JSON
  let result: ThoughtResponse;
  try {
    result = parseClaudeJson(raw);
  } catch (err) {
    console.error("[thought/route] JSON parse error:", err, "\nRaw response was:", raw);
    return NextResponse.json(
      { error: "The AI returned an unexpected format. Please try again." },
      { status: 500 }
    );
  }

  // 4. Return
  return NextResponse.json(result, { status: 200 });
}
