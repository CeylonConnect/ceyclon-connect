const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

function clampText(value, maxLen) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLen);
}

function clampChatReply(value, maxLen) {
  // Preserve newlines for nicer chat formatting.
  return String(value || "")
    .trim()
    .slice(0, maxLen);
}

function buildPrompt(payload) {
  const kind = clampText(payload?.kind || "", 20).toLowerCase();
  const title = clampText(payload?.title, 120);
  const location = clampText(payload?.location, 80);
  const existing = clampText(
    payload?.existingDescription || payload?.description,
    800
  );

  // Tour fields
  const category = clampText(payload?.category, 40);
  const durationHours = payload?.durationHours;
  const groupSize = payload?.groupSize;

  // Event fields
  const eventCategory = clampText(payload?.eventType || payload?.type, 40);
  const startDate = clampText(payload?.startDate, 20);
  const endDate = clampText(payload?.endDate, 20);
  const time = clampText(payload?.time, 40);

  const themeHint = (() => {
    const combined = `${title} ${eventCategory} ${existing}`.trim();
    if (!combined) return "";
    if (/\b(christmas|xmas)\b/i.test(combined))
      return "Christmas / holiday celebration";
    if (/\bnew\s*year\b/i.test(combined)) return "New Year celebration";
    return "";
  })();

  const baseRules =
    "Write a natural, friendly description for a Sri Lanka travel app. " +
    "Output ONLY the description text (no title, no bullets, no markdown). " +
    "Avoid emojis. Avoid making up exact prices, guarantees, or specific inclusions unless provided. " +
    "Do not stop mid-sentence. End the final sentence with a period. " +
    "Do not write sentence fragments (avoid trailing clauses like 'where ...').";

  if (kind === "event") {
    return (
      `${baseRules}\n` +
      "Make it 90–130 words as 4–6 complete sentences (NOT less than 90 words). " +
      "First sentence MUST include the event name (do not start with a generic travel intro). " +
      "Do NOT write generic copy like 'Welcome to Sri Lanka' and do NOT mention our app/this app. " +
      "Describe what people will see/experience, the vibe, and who it suits. " +
      "Include practical context using ONLY the provided details (location, category, dates, time). " +
      "If any detail is missing, stay general instead of inventing specifics.\n" +
      `Event name: ${title || "(not provided)"}.\n` +
      `Location/District: ${location || "(not provided)"}.\n` +
      `Category: ${eventCategory || "(not provided)"}.\n` +
      `Dates: ${startDate || "?"} to ${endDate || "?"}.\n` +
      `Time: ${time || "(not provided)"}.\n` +
      (themeHint ? `Theme hint: ${themeHint}.\n` : "") +
      (existing
        ? `Existing description (improve if provided): ${existing}.\n`
        : "") +
      "Write in a confident, helpful tone."
    );
  }

  // Default to tour
  const durationLine =
    typeof durationHours === "number" && Number.isFinite(durationHours)
      ? `Duration: ${durationHours} hours.`
      : "";
  const groupLine =
    typeof groupSize === "number" && Number.isFinite(groupSize)
      ? `Group size: up to ${groupSize}.`
      : "";

  return (
    `${baseRules}\n` +
    "Make it a SMALL but complete tour description (exactly 2–3 full sentences, 45–80 words). " +
    "Explain the vibe, key highlights, and who it suits.\n" +
    `Tour title: ${title || "(not provided)"}.\n` +
    `Location/District: ${location || "(not provided)"}.\n` +
    `Category: ${category || "(not provided)"}.\n` +
    `${durationLine}\n` +
    `${groupLine}\n` +
    (existing
      ? `Existing description (improve if provided): ${existing}.\n`
      : "") +
    "Keep it concise and readable."
  );
}

function getKind(payload) {
  // IMPORTANT: payload.type is used as category for events; do not treat it as kind.
  const k = clampText(payload?.kind || "", 20).toLowerCase();
  return k || "tour";
}

function getGenerationConfig(kind) {
  // Tours: short, Events: longer & more complete
  if (kind === "event") {
    return {
      temperature: 0.6,
      maxOutputTokens: 720,
    };
  }
  return {
    temperature: 0.55,
    maxOutputTokens: 360,
  };
}

function countWords(text) {
  return String(text || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function trimToMaxWordsAtSentenceBoundary(text, maxWords) {
  const s = String(text || "").trim();
  if (!s) return "";
  const words = s.split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return s;

  const limited = words.slice(0, maxWords).join(" ");
  // Prefer cutting back to the last sentence terminator within the limited text.
  const last = Math.max(
    limited.lastIndexOf("."),
    limited.lastIndexOf("!"),
    limited.lastIndexOf("?")
  );
  if (last >= 0) return limited.slice(0, last + 1).trim();
  return ensureFinalPunctuation(limited);
}

async function callGemini({ url, prompt, generationConfig }) {
  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
    generationConfig,
  };

  const geminiRes = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await geminiRes.json().catch(() => ({}));
  return { ok: geminiRes.ok, status: geminiRes.status, json };
}

function ensureCompleteSentences(text) {
  const s = String(text || "").trim();
  if (!s) return "";
  // If it already ends with a sentence terminator, keep it.
  if (/[.!?]\s*$/.test(s)) return s;
  // Otherwise, try to trim to the last terminator to avoid a half sentence.
  const last = Math.max(
    s.lastIndexOf("."),
    s.lastIndexOf("!"),
    s.lastIndexOf("?")
  );
  if (last >= 0) {
    const trimmed = s.slice(0, last + 1).trim();
    return trimmed || s + ".";
  }
  // No terminator at all, just end it cleanly.
  return s + ".";
}

function ensureFinalPunctuation(text) {
  const s = String(text || "").trim();
  if (!s) return "";
  return /[.!?]\s*$/.test(s) ? s : s + ".";
}

function extractGeminiText(json) {
  const parts = json?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts) || parts.length === 0) return "";
  const text = parts
    .map((p) => (typeof p?.text === "string" ? p.text : ""))
    .join("\n")
    .trim();
  return text;
}

function normalizeUserMessage(text) {
  const s = String(text || "").trim();
  if (!s) return "";

  // If the whole message is just a greeting, keep it as-is.
  if (/^(hi|hello|hey)(\s+there)?[!.?]*$/i.test(s)) return s;

  // If user appends a greeting to a real question (e.g. "suggest tours hi"),
  // remove the trailing greeting token so it doesn't hijack the reply.
  const stripped = s
    .replace(/(?:[\s,]+)(hi|hello|hey)(\s+there)?[!.?]*\s*$/i, "")
    .trim();

  return stripped || s;
}

function normalizeChatMessages(input) {
  const raw = Array.isArray(input?.messages)
    ? input.messages
    : input?.message
    ? [{ role: "user", content: input.message }]
    : [];

  const cleaned = raw
    .filter(Boolean)
    .map((m) => ({
      role: String(m?.role || "user").toLowerCase(),
      content: clampText(
        String(m?.role || "user").toLowerCase() === "user"
          ? normalizeUserMessage(m?.content)
          : m?.content,
        800
      ),
    }))
    .filter((m) => (m.role === "user" || m.role === "assistant") && m.content);

  // Keep last 8 messages for token control
  return cleaned.slice(-8);
}

function buildChatPrompt(messages) {
  const instruction =
    "Reply like a helpful friend in simple English. " +
    "Keep it short and easy: 2–6 sentences (or up to 2 short paragraphs). " +
    "If the user's request is unclear, ask 1 quick follow-up question. " +
    "If the user includes a greeting along with a real question/request, answer the request (do not reply with only a greeting). " +
    "Only give a greeting-only response when the user's latest message is just a greeting (like 'hi'/'hello'/'hey'). " +
    "Do NOT use markdown formatting (no **, no *, no backticks). " +
    "Do not invent exact prices, guarantees, or specific facts not provided. Avoid emojis.";

  const transcript = messages
    .map(
      (m) => `${m.role === "assistant" ? "Assistant" : "User"}: ${m.content}`
    )
    .join("\n");

  return `${instruction}\n\n${transcript}\nAssistant:`;
}

function sanitizeAssistantReply(text) {
  // Remove common markdown markers users don't want to see.
  let s = String(text || "");
  s = s.replace(/\*\*/g, "");
  s = s.replace(/`+/g, "");
  return s.trim();
}

export const generateDescription = async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res
        .status(500)
        .json({ error: "GEMINI_API_KEY not configured on server" });
    }

    const input = req.body || {};
    const kind = getKind(input);
    const prompt = buildPrompt(input);
    if (!prompt.trim()) {
      return res.status(400).json({ error: "Missing input for generation" });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      GEMINI_MODEL
    )}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const generationConfig = getGenerationConfig(kind);
    let attempt = await callGemini({ url, prompt, generationConfig });

    if (!attempt.ok) {
      const msg =
        attempt.json?.error?.message ||
        attempt.json?.message ||
        attempt.json?.error ||
        "Gemini request failed";
      return res.status(502).json({ error: msg });
    }

    let text = extractGeminiText(attempt.json);
    if (!text) {
      return res.status(502).json({ error: "Gemini returned no description" });
    }

    // If event output is too short, retry once with a stronger instruction.
    if (kind === "event" && countWords(text) < 90) {
      const retryPrompt =
        prompt +
        "\nIMPORTANT: Your previous answer was too short or incomplete. Rewrite it to be 90–130 words (NOT less than 90) as 4–6 complete sentences, and do not use fragments like 'where ...'.";
      const retry = await callGemini({
        url,
        prompt: retryPrompt,
        generationConfig: { ...generationConfig, temperature: 0.55 },
      });
      if (retry.ok) {
        const retryText = extractGeminiText(retry.json);
        if (retryText) text = retryText;
      }
    }

    // Final clamp to keep UI tidy
    // For events, avoid trimming (can accidentally shorten output); just ensure punctuation.
    const safeText =
      kind === "event"
        ? ensureFinalPunctuation(text)
        : ensureCompleteSentences(text);
    const normalized =
      kind === "event"
        ? trimToMaxWordsAtSentenceBoundary(safeText, 140)
        : safeText;
    const description = clampText(normalized, kind === "event" ? 1200 : 1000);
    return res.json({ description });
  } catch (err) {
    return res.status(500).json({ error: err?.message || "Server error" });
  }
};

export const chatAssistant = async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res
        .status(500)
        .json({ error: "GEMINI_API_KEY not configured on server" });
    }

    const messages = normalizeChatMessages(req.body || {});
    if (!messages.length) {
      return res.status(400).json({ error: "Missing chat messages" });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      GEMINI_MODEL
    )}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const prompt = buildChatPrompt(messages);
    const generationConfig = {
      temperature: 0.6,
      maxOutputTokens: 300,
    };

    const attempt = await callGemini({ url, prompt, generationConfig });
    if (!attempt.ok) {
      const msg =
        attempt.json?.error?.message ||
        attempt.json?.message ||
        attempt.json?.error ||
        "Gemini request failed";
      return res.status(502).json({ error: msg });
    }

    const text = extractGeminiText(attempt.json);
    if (!text) {
      return res.status(502).json({ error: "Gemini returned no reply" });
    }

    const cleaned = sanitizeAssistantReply(text);
    const reply = clampChatReply(ensureCompleteSentences(cleaned), 1200);
    return res.json({ reply });
  } catch (err) {
    return res.status(500).json({ error: err?.message || "Server error" });
  }
};
