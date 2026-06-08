import { NextRequest } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`;

export async function POST(req: NextRequest) {
  try {
    const { circuit, question, mode = "tutor" } = await req.json();

    const gateCount = circuit?.components?.length ?? 0;
    const wireCount = circuit?.wires?.length ?? 0;
    const inputs = circuit?.components?.filter((c: { type: string }) => c.type === "INPUT").map((c: { label: string }) => c.label) ?? [];
    const outputs = circuit?.components?.filter((c: { type: string }) => c.type === "OUTPUT").map((c: { label: string }) => c.label) ?? [];
    const gateTypes = [...new Set(circuit?.components?.filter((c: { type: string }) => !["INPUT","OUTPUT"].includes(c.type)).map((c: { type: string }) => c.type))];

    const circuitSummary = `
Circuit: ${circuit?.name ?? "Unnamed"}
Gates: ${gateCount} components (${gateTypes.join(", ")})
Wires: ${wireCount}
Inputs: ${inputs.join(", ") || "none"}
Outputs: ${outputs.join(", ") || "none"}
    `.trim();

    const systemPrompt = mode === "build"
      ? `You are a digital logic assistant. Explain what the circuit does directly — its truth table, function, and how signals flow from inputs to outputs. Be clear and concise. No questions back. Keep responses under 150 words.`
      : `You are a Socratic digital logic tutor. Instead of explaining what the circuit does directly, guide the student through discovery:
1. Ask them to identify the gate types they see
2. Ask what each gate outputs for the current inputs
3. Walk them through tracing the signal path step by step with questions
4. Confirm their understanding before moving to the next gate

Use plain language. Keep responses under 150 words.`;

    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ parts: [{ text: `Here is a circuit:\n${circuitSummary}\n\nUser question: ${question ?? "What does this circuit do?"}` }] }],
        generationConfig: { maxOutputTokens: 600, temperature: 0.7 },
      }),
    });

    if (!res.ok) throw new Error(`Gemini API ${res.status}`);

    const data = await res.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "No explanation available.";
    return Response.json({ reply });
  } catch (err) {
    console.error("explain-circuit error:", err);
    return Response.json({ reply: "Sorry, I couldn't analyze the circuit right now." }, { status: 500 });
  }
}
