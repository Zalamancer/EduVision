import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a digital logic circuit designer. When given a description, return a valid JSON circuit.

The circuit JSON format is:
{
  "id": "string",
  "name": "string",
  "components": [
    {
      "id": "string",
      "type": "AND" | "OR" | "NOT" | "NAND" | "NOR" | "XOR" | "XNOR" | "INPUT" | "OUTPUT",
      "x": number,  // grid position, multiples of 20
      "y": number,
      "rotation": 0,
      "label": "string",
      "value": false  // only for INPUT type
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

Rules:
- INPUT components have 1 output pin (pinIndex 0). No input pins.
- OUTPUT components have 1 input pin (pinIndex 0). No output pins.
- AND, OR, NAND, NOR, XOR, XNOR have 2 input pins (0 and 1) and 1 output pin (pinIndex 0).
- NOT has 1 input pin (pinIndex 0) and 1 output pin.
- Wire "from" always refers to an OUTPUT pin of a component.
- Wire "to" always refers to an INPUT pin of a component.
- Space components at least 120px apart horizontally, 80px apart vertically.
- Start x around 40, y around 60.
- Use short IDs like "c1", "c2", "w1", "w2".
- Always include at least 1 INPUT and 1 OUTPUT.

Return ONLY valid JSON, no markdown, no explanation.`;

export async function POST(req: NextRequest) {
  try {
    const { description } = await req.json();
    if (!description) {
      return Response.json({ error: "Missing description" }, { status: 400 });
    }

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Design this circuit: ${description}`,
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    const circuit = JSON.parse(jsonMatch[0]);

    // Validate minimal structure
    if (!circuit.components || !circuit.wires) {
      throw new Error("Invalid circuit structure");
    }

    return Response.json({
      circuit,
      explanation: `Generated "${circuit.name || "circuit"}" with ${circuit.components.length} components.`,
    });
  } catch (err) {
    console.error("generate-circuit error:", err);
    return Response.json(
      { error: "Failed to generate circuit", details: String(err) },
      { status: 500 }
    );
  }
}
