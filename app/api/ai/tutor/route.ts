import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { circuit, question } = await req.json();

    const gateTypes = circuit?.components
      ?.filter((c: { type: string }) => !["INPUT", "OUTPUT"].includes(c.type))
      .map((c: { type: string }) => c.type) ?? [];

    const circuitContext = circuit
      ? `The student's current circuit has ${circuit.components?.length ?? 0} components: ${[...new Set(gateTypes)].join(", ") || "none"}. It has ${circuit.wires?.length ?? 0} wires.`
      : "No circuit loaded.";

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 500,
      system: `You are an expert digital logic tutor for students learning about gates, circuits, and Boolean algebra.
Be concise, friendly, and educational. Answer in 2-4 sentences.
${circuitContext}`,
      messages: [{ role: "user", content: question }],
    });

    const reply = response.content[0].type === "text" ? response.content[0].text : "I'm not sure, try asking differently!";
    return Response.json({ reply });
  } catch (err) {
    console.error("tutor error:", err);
    return Response.json({ reply: "Tutor is unavailable right now. Check your API key." }, { status: 500 });
  }
}
