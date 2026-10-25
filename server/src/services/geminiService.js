const { apiKey, model } = require("../config/gemini");

const SYSTEM_INSTRUCTION = [
  "You are MedKhoj, a medicine information assistant.",
  "Give general, plain-language educational information only. Do not diagnose, prescribe, recommend starting or stopping a medicine, or invent patient-specific dosing.",
  "Encourage users to follow their clinician's prescription and ask a qualified doctor or pharmacist about personal treatment, interactions, pregnancy, allergies, or side effects.",
  "For possible overdose, severe allergic reaction, breathing trouble, chest pain, or another emergency, tell the user to contact local emergency services or poison control immediately.",
  "Be clear when uncertain. Do not claim that catalogue sample prices or availability are live or verified.",
  "Reply in the language used by the user when practical."
].join(" ");

class GeminiServiceError extends Error {
  constructor(message, statusCode = 502) {
    super(message);
    this.name = "GeminiServiceError";
    this.statusCode = statusCode;
  }
}

async function generateReply(message, history) {
  if (!apiKey) {
    throw new GeminiServiceError("AI is not configured. Add GEMINI_API_KEY to server/.env and restart the backend.", 503);
  }

  const contents = [
    ...history.map(({ role, text }) => ({
      role,
      parts: [{ text }]
    })),
    { role: "user", parts: [{ text: message }] }
  ];
  const generationConfig = {
    maxOutputTokens: 2048
  };

  if (/^gemini-3(?:\.\d+)?-/i.test(model)) {
    generationConfig.thinkingConfig = {
      thinkingLevel: /gemini-3\.5-flash-lite/i.test(model) ? "minimal" : "low"
    };
  } else {
    generationConfig.temperature = 0.3;
  }

  let response;
  try {
    response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
          contents,
          generationConfig
        }),
        signal: AbortSignal.timeout(30000)
      }
    );
  } catch (error) {
    if (error.name === "TimeoutError" || error.name === "AbortError") {
      throw new GeminiServiceError("The AI response timed out. Please try again.", 504);
    }
    throw new GeminiServiceError("Could not connect to the Gemini API. Please try again.", 502);
  }

  let result;
  try {
    result = await response.json();
  } catch (error) {
    throw new GeminiServiceError("Gemini returned an invalid response.", 502);
  }

  if (!response.ok) {
    const providerMessage = result.error?.message
      ?.replaceAll(apiKey, "[redacted]")
      .slice(0, 300);
    console.error(`Gemini API returned HTTP ${response.status}${providerMessage ? `: ${providerMessage}` : "."}`);
    if (response.status === 429) {
      throw new GeminiServiceError("The AI service is busy. Please wait a moment and try again.", 429);
    }
    if (response.status === 401 || response.status === 403) {
      throw new GeminiServiceError("Gemini rejected the configured API key. Check server/.env and restart the backend.", 502);
    }
    throw new GeminiServiceError("Gemini could not answer right now. Please try again.", 502);
  }

  const text = result.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim();

  if (!text) {
    if (result.candidates?.[0]?.finishReason === "MAX_TOKENS") {
      throw new GeminiServiceError("Gemini used its response budget before producing an answer. Please try again.", 502);
    }
    throw new GeminiServiceError("Gemini did not return a text answer. Please rephrase and try again.", 502);
  }

  return text;
}

module.exports = { generateReply, GeminiServiceError };
