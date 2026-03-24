import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { circuit, question } = await req.json();

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

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 600,
      system:
        "You are a digital logic tutor. Explain circuits clearly and concisely to students. Use plain language. Keep responses under 150 words.",
      messages: [
        {
          role: "user",
          content: `Here is a circuit:\n${circuitSummary}\n\nUser question: ${question ?? "What does this circuit do?"}`,
        },
      ],
    });

    const reply = response.content[0].type === "text" ? response.content[0].text : "No explanation available.";

    return Response.json({ reply });
  } catch (err) {
    console.error("explain-circuit error:", err);
    return Response.json({ reply: "Sorry, I couldn't analyze the circuit right now." }, { status: 500 });
  }
}
