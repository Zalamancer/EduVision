import { NextRequest } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`;

export async function POST(req: NextRequest) {
  try {
    const { circuit, question, mode = "tutor" } = await req.json();

    const gateTypes = circuit?.components
      ?.filter((c: { type: string }) => !["INPUT", "OUTPUT"].includes(c.type))
      .map((c: { type: string }) => c.type) ?? [];

    const circuitContext = circuit
      ? `The student's current circuit has ${circuit.components?.length ?? 0} components: ${[...new Set(gateTypes)].join(", ") || "none"}. It has ${circuit.wires?.length ?? 0} wires.`
      : "No circuit loaded.";

    const systemPrompt = mode === "build"
      ? `You are a direct digital logic assistant. Answer questions clearly and concisely. If the user asks you to do something to their circuit, describe exactly what to change. Give straightforward explanations — no questions back, no Socratic method. Be helpful and efficient. Keep responses to 2-4 sentences.\n${circuitContext}`
      : `You are a Socratic tutor for digital logic circuits. Your role is to guide students to discover answers themselves, NOT give answers directly.

Rules:
1. NEVER give the direct answer or solution
2. Ask the student what they think first
3. If they're wrong, ask them to check a specific part of the circuit ("What value do you see at the AND gate's output?")
4. Give hints that lead to discovery, not answers
5. After 3+ exchanges where the student is genuinely stuck, you may provide a more direct explanation
6. Always praise correct reasoning, even partial understanding
7. Use questions like: "What do you expect to happen when...?", "Can you trace the signal from...?", "What does this gate do with those inputs?"

Be concise and friendly. Keep responses to 2-4 sentences.
${circuitContext}`;

    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ parts: [{ text: question }] }],
        generationConfig: { maxOutputTokens: 500, temperature: 0.7 },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Gemini API error:", err);
      throw new Error(`Gemini API ${res.status}`);
    }

    const data = await res.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "I'm not sure, try asking differently!";
    return Response.json({ reply });
  } catch (err) {
    console.error("tutor error:", err);
    return Response.json({ reply: "Tutor is unavailable right now. Check your API key." }, { status: 500 });
  }
}
