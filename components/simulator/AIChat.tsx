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
  "Build a 1-bit comparator",
  "Build a 2-bit comparator",
];

type AiMode = "tutor" | "build";

export default function AIChat() {
  const [mode, setMode] = useState<AiMode>("tutor");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your AI tutor. I can build circuits for you, explain what a circuit does, or help debug issues. Try: **\"Build me a half adder\"** or **\"Explain this circuit\"**.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingBuild, setPendingBuild] = useState<string | null>(null);
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
      // ── Phase 2: User answered clarifying questions → generate circuit ──
      if (pendingBuild) {
        const enriched = `${pendingBuild}\n\nUser's requirements: ${text}`;
        setPendingBuild(null);

        const res = await fetch("/api/ai/generate-circuit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description: enriched }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (data.circuit) {
          setCircuit(data.circuit);
          setMessages((m) => [
            ...m,
            {
              role: "assistant",
              content: `Circuit generated! I've placed it on the canvas. ${data.explanation ?? ""}`,
            },
          ]);
        }
        setLoading(false);
        return;
      }

      // ── Detect intent ──
      const isGenerateIntent =
        /build|create|make|generate|design|construct|draw|implement|wire/i.test(text);
      const isExplainIntent = /explain|what does|describe|how does/i.test(text);

      // ── Phase 1: Build intent → ask 3 clarifying questions first ──
      if (isGenerateIntent && !isExplainIntent) {
        setPendingBuild(text);

        const res = await fetch("/api/ai/tutor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            circuit,
            question: `The user wants to build: "${text}". Before building, ask exactly 3 short clarifying questions to understand their exact requirements. Focus on: (1) what specific outputs/functionality they need, (2) which implementation approach or gate types they prefer, (3) any constraints like gate count or specific design style. Number them 1-3. Be concise and direct.`,
            mode: "build",
          }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        setMessages((m) => [
          ...m,
          { role: "assistant", content: data.reply ?? "What would you like me to clarify?" },
        ]);
        setLoading(false);
        return;
      }

      // ── Normal flow: explain or tutor ──
      let endpoint = "/api/ai/tutor";
      if (isExplainIntent) endpoint = "/api/ai/explain-circuit";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ circuit, question: text, mode }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.reply ?? data.explanation ?? "Done!" },
      ]);
    } catch (err) {
      setPendingBuild(null);
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Make sure `GEMINI_API_KEY` is set in .env.local and restart the dev server.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header with mode toggle */}
      <div className="px-3 py-2 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between">
        <span className="text-xs font-bold tracking-widest uppercase text-zinc-400">
          AI {mode === "tutor" ? "Tutor" : "Build"}
        </span>
        <div className="flex rounded-md bg-zinc-800 p-0.5">
          {(["tutor", "build"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-all ${
                mode === m
                  ? "bg-zinc-600 text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {m === "tutor" ? "Tutor" : "Build"}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] px-3 py-2 rounded-lg text-sm leading-relaxed text-zinc-50 ${
                msg.role === "user"
                  ? "bg-zinc-800"
                  : "bg-zinc-900 border border-zinc-800"
              }`}
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
            <div className="px-3 py-2 rounded-lg text-sm bg-zinc-900 text-zinc-400 border border-zinc-800">
              <span className="animate-pulse">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      <div className="px-3 py-2 flex flex-wrap gap-1 border-t border-zinc-800">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            className="text-xs px-2 py-1 rounded-md bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700 transition-all"
            onClick={() => sendMessage(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2 p-3 border-t border-zinc-800 bg-zinc-900">
        <input
          className="flex-1 bg-transparent outline-none text-sm px-2 py-1 rounded-lg border border-zinc-800 text-zinc-50 placeholder:text-zinc-500 focus:ring-2 focus:ring-primary/50"
          placeholder="Ask anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          disabled={loading}
        />
        <button
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
            loading
              ? "bg-zinc-800 text-zinc-500"
              : "bg-primary text-primary-foreground hover:bg-green-400"
          }`}
          onClick={() => sendMessage(input)}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}
