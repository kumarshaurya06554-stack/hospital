const { generateReply } = require("../services/geminiService");

const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_LENGTH = 10;

async function chat(req, res) {
  const { message, history = [] } = req.body || {};

  if (typeof message !== "string" || !message.trim() || message.trim().length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({
      success: false,
      message: `Message must contain 1-${MAX_MESSAGE_LENGTH} characters.`
    });
  }

  if (!Array.isArray(history) || history.length > MAX_HISTORY_LENGTH) {
    return res.status(400).json({
      success: false,
      message: `Conversation history must contain at most ${MAX_HISTORY_LENGTH} messages.`
    });
  }

  const normalizedHistory = [];
  for (const item of history) {
    if (
      !item ||
      !["user", "model"].includes(item.role) ||
      typeof item.text !== "string" ||
      !item.text.trim() ||
      item.text.length > MAX_MESSAGE_LENGTH
    ) {
      return res.status(400).json({
        success: false,
        message: "Conversation history contains an invalid message."
      });
    }

    normalizedHistory.push({ role: item.role, text: item.text.trim() });
  }

  try {
    const reply = await generateReply(message.trim(), normalizedHistory);
    return res.json({ success: true, reply });
  } catch (error) {
    console.error("AI chat request failed:", error.message);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "The AI assistant could not answer right now."
    });
  }
}

module.exports = { chat };
