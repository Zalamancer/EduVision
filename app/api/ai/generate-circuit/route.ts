import { NextRequest } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `You are a digital logic circuit designer for an educational platform. When given a description, return a valid JSON circuit.

The circuit JSON format is:
{
  "id": "string",
  "name": "string",
  "approach": "brief description of which implementation strategy you chose",
  "components": [
    {
      "id": "string",
      "type": "AND" | "OR" | "NOT" | "NAND" | "NOR" | "XOR" | "XNOR" | "INPUT" | "OUTPUT",
      "x": number,
      "y": number,
      "rotation": 0,
      "label": "string",
      "value": false
    }
  ],
  "wires": [
    {
      "id": "string",
      "from": { "componentId": "string", "pinIndex": 0 },
      "to": { "componentId": "string", "pinIndex": 0 }
    }
  ]
}

Pin rules:
- INPUT components have 1 output pin (pinIndex 0). No input pins.
- OUTPUT components have 1 input pin (pinIndex 0). No output pins.
- AND, OR, NAND, NOR, XOR, XNOR have 2 input pins (0 and 1) and 1 output pin (pinIndex 0).
- NOT has 1 input pin (pinIndex 0) and 1 output pin (pinIndex 0).
- Wire "from" always refers to an OUTPUT pin of a component.
- Wire "to" always refers to an INPUT pin of a component.

Layout rules:
- Space components at least 120px apart horizontally, 80px apart vertically.
- Start x around 40, y around 60.
- Use short IDs like "c1", "c2", "w1", "w2".
- Always include at least 1 INPUT and 1 OUTPUT.

IMPORTANT — Implementation variety:
Most circuits can be built in multiple valid ways. Each time you are asked, pick a DIFFERENT strategy at random from the applicable options below:
- Gate-level from truth table: derive SOP or POS expressions, optionally K-map minimized
- XOR/XNOR-based: use XOR for difference detection, XNOR for equality
- NAND-only or NOR-only: universal gate implementations
- Modular/cascaded: chain smaller sub-circuits (e.g. chain 1-bit comparators for N-bit)
- Mux-based: use AND/OR/NOT to implement multiplexer-style selection logic

State which approach you chose in the "approach" field.

Return ONLY valid JSON, no markdown, no explanation, no code fences.`;

export async function POST(req: NextRequest) {
  try {
    const { description } = await req.json();
    if (!description) {
      return Response.json({ error: "Missing description" }, { status: 400 });
    }

    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ parts: [{ text: `Design this circuit: ${description}` }] }],
        generationConfig: { maxOutputTokens: 4000, temperature: 0.8 },
      }),
    });

    if (!res.ok) throw new Error(`Gemini API ${res.status}`);

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    // Strip trailing commas before ] or } — common LLM JSON error
    const sanitized = jsonMatch[0].replace(/,\s*([}\]])/g, "$1");
    const circuit = JSON.parse(sanitized);

    if (!circuit.components || !circuit.wires) {
      throw new Error("Invalid circuit structure");
    }

    const approach = circuit.approach || "";
    delete circuit.approach;

    return Response.json({
      circuit,
      explanation: `Generated "${circuit.name || "circuit"}" with ${circuit.components.length} components.${approach ? ` **Approach:** ${approach}` : ""}`,
    });
  } catch (err) {
    console.error("generate-circuit error:", err);
    return Response.json(
      { error: "Failed to generate circuit", details: String(err) },
      { status: 500 }
    );
  }
}
