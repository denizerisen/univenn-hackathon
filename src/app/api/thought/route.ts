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

function buildSystemPrompt(role?: string, language?: string): string {
  const isTr = language === "tr";

  const roleContext =
    role === "sporcu"
      ? isTr
        ? `\n\nKullanıcı kendini SPORCU olarak tanımladı. Yanıtını sporcuların yaşadığı baskılara göre şekillendir: performans kaygısı, sakatlık korkusu, takım beklentileri, rekabet stresi, sportif kimlik. Spor diline uygun çerçeveler kullan (zihinsel dayanıklılık, toparlanma, odaklanma).`
        : `\n\nThe user has identified themselves as an ATHLETE (sporcu). Tailor your response to the unique pressures athletes face: performance anxiety, fear of injury, team expectations, competition stress, body image, and the identity tied to athletic success. Use sports-relevant framing when appropriate (e.g., mental resilience, recovery, staying grounded).`
      : role === "izleyici"
      ? isTr
        ? `\n\nKullanıcı Türk Milli Futbol Takımı'nın bir TARAFTARI olarak kendini tanımladı. Yanıtını taraftar deneyimine göre şekillendir: maç sonucu kaygısı, kolektif hayal kırıklığı, takımla aşırı özdeşleşme, tribündeki duygusal iniş çıkışlar. Taraftar perspektifine uygun çerçeveler kullan.`
        : `\n\nThe user has identified themselves as a FAN/SPECTATOR (izleyici) of a sports team — likely the Turkish national football team. Tailor your response to the emotional experience of passionate supporters: anxiety about match outcomes, collective disappointment, over-identification with team results, and the social highs and lows of fandom.`
      : isTr
      ? `\n\nKullanıcı Türkiye'nin 2026 FIFA Dünya Kupası serüveniyle ilgili düşüncelerini paylaşıyor. Yanıtını bu bağlama uygun şekilde çerçevele.`
      : "";

  const languageInstruction = isTr
    ? `\n\nÖNEMLİ: Tüm yanıtını (summary, description, feeling, patterns dahil) TÜRKÇE yaz. "title" alanları için şu karşılıkları kullan: positive → "Daha Nazik Bir Bakış", most_likely → "Büyük İhtimalle", worst_case → "En Kötü Senaryo".`
    : "";

  const base = isTr
    ? `Sen sakin ve destekleyici bir zihinsel sağlık asistanısın.
Kullanıcıların olumsuz düşüncelerini nazikçe yeniden çerçevelemelerine yardım ediyorsun.
Hiçbir zaman duyguları geçersiz saymıyorsun.
Sert veya klinik bir dil kullanmıyorsun.
Dengeli ve gerçekçi düşünmeyi teşvik ediyorsun.${roleContext}${languageInstruction}`
    : `You are a calm, supportive mental wellness assistant.
You help users reframe negative thoughts gently.
You never invalidate feelings.
You avoid harsh or clinical language.
You encourage balanced and realistic thinking.${roleContext}${languageInstruction}`;

  const jsonShape = isTr
    ? `
Yalnızca geçerli bir JSON nesnesiyle yanıt ver — markdown, açıklama veya kod bloğu kullanma.
JSON tam olarak şu yapıda olmalıdır:

{
  "analysis": {
    "patterns": ["düşünce kalıbı 1", "düşünce kalıbı 2"],
    "summary": "Düşüncede fark ettiğin şeyin kısa, nazik bir açıklaması"
  },
  "paths": [
    {
      "type": "positive",
      "title": "Daha Nazik Bir Bakış",
      "description": "Durumun nazik ve umut verici bir yeniden çerçevelemesi",
      "feeling": "Bu bakış açısı duygusal olarak nasıl hissettirebilir"
    },
    {
      "type": "most_likely",
      "title": "Büyük İhtimalle",
      "description": "Muhtemelen ne olacağının gerçekçi bir açıklaması",
      "feeling": "Bu senaryo duygusal olarak nasıl hissettirebilir"
    },
    {
      "type": "worst_case",
      "title": "En Kötü Senaryo",
      "description": "En kötü durumun şefkatli bir açıklaması",
      "feeling": "Bu senaryo duygusal olarak nasıl hissettirebilir"
    }
  ]
}

Tespit edilecek düşünce kalıpları (klinik değil, sade Türkçe etiketler kullan):
- felaket senaryosu, ya hep ya hiç düşüncesi, zihin okuma, kehanet, kişiselleştirme,
  duygusal akıl yürütme, "yapmalıyım" kalıpları, aşırı genelleme, filtreleme`
    : `

You must respond ONLY with a valid JSON object — no markdown, no explanation, no code fences.
The JSON must follow this exact structure:

{
  "analysis": {
    "patterns": ["pattern1", "pattern2"],
    "summary": "A short, gentle explanation of what you noticed in the thought"
  },
  "paths": [
    {
      "type": "positive",
      "title": "A Kinder Perspective",
      "description": "A gentle, hopeful reframe of the situation",
      "feeling": "How this perspective might feel emotionally"
    },
    {
      "type": "most_likely",
      "title": "Most Likely",
      "description": "A grounded, realistic description of what will probably happen",
      "feeling": "How this scenario might feel emotionally"
    },
    {
      "type": "worst_case",
      "title": "Worst Case",
      "description": "A compassionate description of the worst case scenario",
      "feeling": "How this scenario might feel emotionally"
    }
  ]
}

Common thought patterns to detect (use plain language, not clinical labels):
- catastrophizing, black-and-white thinking, mind reading, fortune telling,
  personalizing, emotional reasoning, should statements, overgeneralizing, filtering`;

  return base + jsonShape;
}

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
  let role: string | undefined;
  let language: string | undefined;
  try {
    const body = await req.json() as { thought?: unknown; role?: unknown; language?: unknown };
    if (typeof body.thought !== "string" || !body.thought.trim()) {
      return NextResponse.json(
        { error: "Request body must include a non-empty `thought` string." },
        { status: 400 }
      );
    }
    thought = body.thought.trim();
    if (body.role === "sporcu" || body.role === "izleyici") {
      role = body.role;
    }
    if (body.language === "tr") {
      language = "tr";
    }
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
      system: buildSystemPrompt(role, language),
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
