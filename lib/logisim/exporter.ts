import { Circuit, Component, GateType } from "@/lib/sim-engine/types";
import { PIN_POSITIONS } from "@/lib/sim-engine/gates";

// ---------------------------------------------------------------------------
// EduVision GateType -> Logisim component mapping
// ---------------------------------------------------------------------------

interface LogisimCompInfo {
  lib: string;
  name: string;
  attrs?: Record<string, string>;
}

const TYPE_TO_LOGISIM: Partial<Record<GateType, LogisimCompInfo>> = {
  INPUT: { lib: "0", name: "Pin", attrs: { tristate: "false" } },
  OUTPUT: { lib: "0", name: "Pin", attrs: { facing: "west", output: "true" } },
  AND: { lib: "1", name: "AND Gate", attrs: { size: "30", inputs: "2" } },
  OR: { lib: "1", name: "OR Gate", attrs: { size: "30", inputs: "2" } },
  NOT: { lib: "1", name: "NOT Gate", attrs: { size: "20" } },
  NAND: { lib: "1", name: "NAND Gate", attrs: { size: "30", inputs: "2" } },
  NOR: { lib: "1", name: "NOR Gate", attrs: { size: "30", inputs: "2" } },
  XOR: { lib: "1", name: "XOR Gate", attrs: { size: "30", inputs: "2" } },
  XNOR: { lib: "1", name: "XNOR Gate", attrs: { size: "30", inputs: "2" } },
  BUFFER: { lib: "1", name: "Buffer", attrs: { size: "20" } },
  TUNNEL: { lib: "0", name: "Tunnel" },
  CLOCK: { lib: "0", name: "Clock" },
  CONSTANT: { lib: "0", name: "Constant" },
};

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Snap to Logisim's 10-unit grid */
function snap10(v: number): number {
  return Math.round(v / 10) * 10;
}

/**
 * Compute Logisim `loc` (output pin position) from EduVision component.
 *
 * Logisim loc = where the output pin sits in world space.
 * For gates: that's the right side of the gate.
 * For OUTPUT (Pin facing west): that's where the input pin sits.
 *
 * We use Logisim-native coordinates: gate size 30 means 30px from input to output.
 * So we position the output pin at (x + 30) for gates, not (x + 80).
 */
function computeLogisimLoc(comp: Component): string {
  // Use EduVision component position, but express in Logisim coordinates
  // Logisim Pin (input): output is at the pin location itself
  // Logisim Gate: output at loc, inputs at loc - size
  // We map EduVision top-left to Logisim output pin position

  const x = snap10(comp.x);
  const y = snap10(comp.y + 30); // Center vertically (EduVision gates are 60px tall, pin is at y+30)

  if (comp.type === "INPUT") {
    // Logisim input Pin: loc is the output (right side)
    return `(${x + 20},${y})`; // Small pin, output ~20px right of left edge
  }
  if (comp.type === "OUTPUT") {
    // Logisim output Pin (facing west): loc is the input (left side)
    return `(${x},${y})`;
  }
  if (comp.type === "NOT" || comp.type === "BUFFER") {
    return `(${x + 20},${y})`; // NOT gate size=20
  }
  // Standard 2-input gates: size=30
  return `(${x + 30},${y})`;
}

/**
 * Get pin world position in Logisim coordinates for wire generation.
 */
function getPinLogisimPos(
  comp: Component,
  role: "input" | "output",
  pinIndex: number
): string {
  const x = snap10(comp.x);
  const y = snap10(comp.y + 30); // Center

  if (comp.type === "INPUT") {
    // Input pin has one output at its loc
    return `(${x + 20},${y})`;
  }
  if (comp.type === "OUTPUT") {
    // Output pin has one input at its loc
    return `(${x},${y})`;
  }

  if (role === "output") {
    if (comp.type === "NOT" || comp.type === "BUFFER") {
      return `(${x + 20},${y})`;
    }
    return `(${x + 30},${y})`;
  }

  // Input pins for multi-input gates
  // Logisim spaces inputs 20px apart
  const inputCount = 2; // Default 2-input gates
  const spacing = 20;
  const totalSpan = (inputCount - 1) * spacing;
  const startY = y - totalSpan / 2;
  const pinY = startY + pinIndex * spacing;

  if (comp.type === "NOT" || comp.type === "BUFFER") {
    return `(${x},${pinY})`;
  }
  return `(${x},${pinY})`;
}

// ---------------------------------------------------------------------------
// Main exporter — minimal format matching working Logisim files
// ---------------------------------------------------------------------------

export function exportToLogisimCirc(circuit: Circuit): string {
  const lines: string[] = [];
  lines.push('<?xml version="1.0" encoding="UTF-8" standalone="no"?>');
  lines.push('<project source="2.7.1" version="1.0">');
  lines.push('  <lib desc="#Wiring" name="0"/>');
  lines.push('  <lib desc="#Gates" name="1"/>');
  lines.push('  <lib desc="#Base" name="2"/>');
  lines.push('  <main name="main"/>');
  lines.push('  <circuit name="main">');

  const compMap = new Map<string, Component>();
  for (const comp of circuit.components) {
    compMap.set(comp.id, comp);
  }

  // Components
  for (const comp of circuit.components) {
    const info = TYPE_TO_LOGISIM[comp.type];
    if (!info) continue;

    const loc = computeLogisimLoc(comp);

    lines.push(`    <comp lib="${info.lib}" loc="${loc}" name="${escapeXml(info.name)}">`);

    if (info.attrs) {
      for (const [key, val] of Object.entries(info.attrs)) {
        lines.push(`      <a name="${escapeXml(key)}" val="${escapeXml(val)}"/>`);
      }
    }

    if (comp.label) {
      lines.push(`      <a name="label" val="${escapeXml(comp.label)}"/>`);
    }

    lines.push("    </comp>");
  }

  // Wires — Logisim ONLY supports horizontal or vertical segments.
  // Break each wire into Manhattan-routed segments: horizontal then vertical.
  for (const wire of circuit.wires) {
    const fromComp = compMap.get(wire.from.componentId);
    const toComp = compMap.get(wire.to.componentId);
    if (!fromComp || !toComp) continue;

    const fromPos = getPinLogisimPos(fromComp, "output", wire.from.pinIndex);
    const toPos = getPinLogisimPos(toComp, "input", wire.to.pinIndex);

    // Parse positions
    const fx = parseInt(fromPos.match(/\((\d+)/)?.[1] ?? "0");
    const fy = parseInt(fromPos.match(/,(\d+)/)?.[1] ?? "0");
    const tx = parseInt(toPos.match(/\((\d+)/)?.[1] ?? "0");
    const ty = parseInt(toPos.match(/,(\d+)/)?.[1] ?? "0");

    if (fx === tx || fy === ty) {
      // Already horizontal or vertical — single segment
      lines.push(`    <wire from="(${fx},${fy})" to="(${tx},${ty})"/>`);
    } else {
      // Manhattan route: horizontal to midpoint X, then vertical to dest Y, then horizontal to dest
      const midX = snap10(Math.round((fx + tx) / 2));
      lines.push(`    <wire from="(${fx},${fy})" to="(${midX},${fy})"/>`);
      lines.push(`    <wire from="(${midX},${fy})" to="(${midX},${ty})"/>`);
      lines.push(`    <wire from="(${midX},${ty})" to="(${tx},${ty})"/>`);
    }
  }

  lines.push("  </circuit>");
  lines.push("</project>");

  return lines.join("\n") + "\n";
}
