"use client";

import { useState, useRef, useEffect } from "react";
import { useCircuitStore } from "@/lib/stores/circuit-store";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Build me an AND gate from NAND gates",
  "Build a half adder circuit",
  "Explain this circuit",
  "Why isn't this working?",
  "Build a 2-to-1 mux",
];

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your AI tutor. I can build circuits for you, explain what a circuit does, or help debug issues. Try: **\"Build me a half adder\"** or **\"Explain this circuit\"**.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { circuit, signalState, setCircuit } = useCircuitStore();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const isGenerateIntent =
        /build|create|make|generate|design|construct/i.test(text);
      const isExplainIntent = /explain|what does|describe|how does/i.test(text);
      const isDiagnoseIntent = /why|debug|broken|wrong|not work|fix/i.test(text);

      let endpoint = "/api/ai/tutor";
      if (isGenerateIntent && !isExplainIntent) endpoint = "/api/ai/generate-circuit";
      else if (isExplainIntent) endpoint = "/api/ai/explain-circuit";

      const body =
        endpoint === "/api/ai/generate-circuit"
          ? { description: text }
          : { circuit, question: text };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (endpoint === "/api/ai/generate-circuit" && data.circuit) {
        setCircuit(data.circuit);
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: `Circuit generated! I've placed it on the canvas. ${data.explanation ?? ""}`,
          },
        ]);
      } else {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: data.reply ?? data.explanation ?? "Done!" },
        ]);
      }
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Make sure `ANTHROPIC_API_KEY` is set.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full" style={{ background: "#0A0A1A" }}>
      {/* Header */}
      <div
        className="px-3 py-2 border-b text-xs font-bold tracking-widest uppercase"
        style={{ borderColor: "#1E1E3A", color: "#8888AA", background: "#12122A" }}
      >
        AI Tutor
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className="max-w-[85%] px-3 py-2 rounded-lg text-sm leading-relaxed"
              style={{
                background: msg.role === "user" ? "#1E1E3A" : "#12122A",
                color: "#E8E8F0",
                border: msg.role === "assistant" ? "1px solid #1E1E3A" : "none",
              }}
              dangerouslySetInnerHTML={{
                __html: msg.content
                  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                  .replace(/\n/g, "<br/>"),
              }}
            />
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div
              className="px-3 py-2 rounded-lg text-sm"
              style={{ background: "#12122A", color: "#8888AA", border: "1px solid #1E1E3A" }}
            >
              <span className="animate-pulse">Thinking…</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      <div className="px-3 py-2 flex flex-wrap gap-1 border-t" style={{ borderColor: "#1E1E3A" }}>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            className="text-xs px-2 py-1 rounded transition-all"
            style={{ background: "#1E1E3A", color: "#8888AA" }}
            onClick={() => sendMessage(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div
        className="flex gap-2 p-3 border-t"
        style={{ borderColor: "#1E1E3A", background: "#12122A" }}
      >
        <input
          className="flex-1 bg-transparent outline-none text-sm px-2 py-1 rounded border"
          style={{ borderColor: "#1E1E3A", color: "#E8E8F0" }}
          placeholder="Ask anything…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          disabled={loading}
        />
        <button
          className="px-3 py-1 rounded text-sm font-medium transition-all"
          style={{
            background: loading ? "#1E1E3A" : "#58C4DD",
            color: loading ? "#4A4A5A" : "#0A0A1A",
          }}
          onClick={() => sendMessage(input)}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}
