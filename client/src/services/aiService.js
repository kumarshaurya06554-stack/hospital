export async function askMedicineAssistant(message, history) {
  const response = await fetch("/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history })
  });

  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw new Error("The AI service returned an invalid response.", { cause: error });
  }

  if (!response.ok || !data.success) {
    throw new Error(data.message || `AI request failed (${response.status}).`);
  }

  if (typeof data.reply !== "string" || !data.reply.trim()) {
    throw new Error("The AI service returned an empty answer.");
  }

  return data.reply;
}
