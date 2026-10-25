import { useEffect, useRef, useState } from "react";
import { Bot, MessageCircle, Send, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { askMedicineAssistant } from "../services/aiService";

const starterMessage = {
  role: "assistant",
  text: "Hi! I can explain general medicine information in simple language. What would you like to know?"
};

const suggestions = [
  "What should I ask a pharmacist before taking a new medicine?",
  "What does medicine strength mean?"
];

export default function MedicineAssistant() {
  const [messages, setMessages] = useState([starterMessage]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messageListRef = useRef(null);

  useEffect(() => {
    messageListRef.current?.scrollTo({
      top: messageListRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [messages, loading]);

  async function sendMessage(event) {
    event.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const history = messages
      .slice(1)
      .slice(-10)
      .map(({ role, text: messageText }) => ({
        role: role === "assistant" ? "model" : "user",
        text: messageText
      }));

    setMessages((current) => [...current, { role: "user", text }]);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const reply = await askMedicineAssistant(text, history);
      setMessages((current) => [...current, { role: "assistant", text: reply }]);
    } catch (requestError) {
      console.error("Medicine assistant request failed:", requestError);
      setError(requestError.message || "The assistant could not reply. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="assistant-section" aria-labelledby="assistant-title">
      <div className="assistant-intro">
        <div className="assistant-kicker"><Sparkles size={14} /> GEMINI-POWERED ASSISTANT</div>
        <h2 id="assistant-title">Questions about medicines?</h2>
        <p>Get a plain-language starting point for your conversation with a pharmacist.</p>
        <div className="assistant-safety"><ShieldCheck size={16} /> General information only. Not a diagnosis or prescription.</div>
      </div>

      <div className="chat-card">
        <div className="chat-header">
          <span className="chat-avatar"><Bot size={19} /></span>
          <span className="chat-title"><strong>MedKhoj assistant</strong><small><span /> Ready to help</small></span>
          <MessageCircle className="chat-header-icon" size={18} />
        </div>

        <div className="chat-messages" ref={messageListRef} aria-live="polite">
          {messages.map((message, index) => (
            <div className={`chat-message ${message.role}`} key={`${message.role}-${index}`}>
              {message.role === "assistant" && <span className="message-avatar"><Bot size={14} /></span>}
              <p>{message.text}</p>
              {message.role === "user" && <span className="message-avatar user-avatar"><UserRound size={14} /></span>}
            </div>
          ))}
          {loading && (
            <div className="chat-message assistant">
              <span className="message-avatar"><Bot size={14} /></span>
              <p className="typing-indicator" aria-label="Assistant is replying"><i /><i /><i /></p>
            </div>
          )}
        </div>

        {messages.length === 1 && (
          <div className="chat-suggestions">
            {suggestions.map((suggestion) => (
              <button type="button" key={suggestion} onClick={() => setInput(suggestion)}>{suggestion}</button>
            ))}
          </div>
        )}

        {error && <p className="chat-error" role="alert">{error}</p>}

        <form className="chat-form" onSubmit={sendMessage}>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            maxLength={2000}
            placeholder="Ask a general medicine question…"
            aria-label="Ask the medicine assistant"
            disabled={loading}
          />
          <button type="submit" aria-label="Send message" disabled={!input.trim() || loading}>
            <Send size={17} />
          </button>
        </form>
        <p className="chat-disclaimer">Please don’t share personal, medical-record, or emergency details here.</p>
      </div>
    </section>
  );
}
