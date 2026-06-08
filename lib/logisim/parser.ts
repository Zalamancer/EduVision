import { Circuit, Component, Wire, GateType } from "@/lib/sim-engine/types";
import { nanoid } from "nanoid";

// ---------------------------------------------------------------------------
// Logisim component name -> EduVision GateType mapping
// ---------------------------------------------------------------------------

const GATE_MAP: Record<string, GateType> = {
  "AND Gate": "AND",
  "OR Gate": "OR",
  "NOT Gate": "NOT",
  "NAND Gate": "NAND",
  "NOR Gate": "NOR",
  "XOR Gate": "XOR",
  "XNOR Gate": "XNOR",
  Buffer: "BUFFER",
  Tunnel: "TUNNEL",
  Clock: "CLOCK",
  Constant: "CONSTANT",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseLoc(loc: string): [number, number] {
  const m = loc.match(/\((-?\d+),\s*(-?\d+)\)/);
  if (!m) return [0, 0];
  return [parseInt(m[1], 10), parseInt(m[2], 10)];
}

function getAttr(comp: Element, name: string): string | null {
  const attrs = comp.getElementsByTagName("a");
  for (let i = 0; i < attrs.length; i++) {
    if (attrs[i].getAttribute("name") === name) {
      return attrs[i].getAttribute("val");
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Pin position calculation for Logisim gates
// ---------------------------------------------------------------------------

interface PinInfo {
  componentId: string;
  role: "input" | "output";
  pinIndex: number;
  x: number;
  y: number;
}

/**
 * Compute pin positions for a Logisim component.
 * `loc` in Logisim is the OUTPUT pin position.
 */
function computeLogisimPins(
  componentId: string,
  logisimName: string,
  loc: [number, number],
  attrs: { size?: number; inputs?: number; output?: boolean; facing?: string }
): PinInfo[] {
  const pins: PinInfo[] = [];
  const [lx, ly] = loc;
  const size = attrs.size ?? 30;
  const inputs = attrs.inputs ?? 2;

  if (logisimName === "Pin") {
    if (attrs.output) {
      pins.push({ componentId, role: "input", pinIndex: 0, x: lx, y: ly });
    } else {
      pins.push({ componentId, role: "output", pinIndex: 0, x: lx, y: ly });
    }
    return pins;
  }

  // For gates: loc is the output pin position
  pins.push({ componentId, role: "output", pinIndex: 0, x: lx, y: ly });

  if (logisimName === "NOT Gate" || logisimName === "Buffer") {
    const notSize = attrs.size ?? 20;
    pins.push({ componentId, role: "input", pinIndex: 0, x: lx - notSize, y: ly });
    return pins;
  }

  // Multi-input gates (AND, OR, NAND, NOR, XOR, XNOR)
  // Logisim spaces inputs 20px apart for size=30 gates
  const spacing = 20;
  const totalSpan = (inputs - 1) * spacing;
  const startY = ly - totalSpan / 2;
  for (let i = 0; i < inputs; i++) {
    pins.push({
      componentId,
      role: "input",
      pinIndex: i,
      x: lx - size,
      y: startY + i * spacing,
    });
  }

  return pins;
}

/**
 * Compute EduVision top-left (x,y) from Logisim's loc (output pin position).
 * Logisim loc = output pin world position.
 * EduVision (x,y) = top-left of bounding box.
 * We need to subtract the output pin's offset from the bounding box.
 */
function logisimLocToTopLeft(
  logisimName: string,
  loc: [number, number],
  attrs: { size?: number; inputs?: number; output?: boolean }
): [number, number] {
  const [lx, ly] = loc;
  const size = attrs.size ?? 30;
  const inputs = attrs.inputs ?? 2;

  if (logisimName === "Pin") {
    if (attrs.output) {
      // OUTPUT: loc is input pin. EduVision INPUT pin is at [0, 30] relative to top-left.
      return [lx, ly - 30];
    } else {
      // INPUT: loc is output pin. EduVision OUTPUT pin is at [80, 30] relative to top-left.
      return [lx - 80, ly - 30];
    }
  }

  if (logisimName === "NOT Gate" || logisimName === "Buffer") {
    // Output pin at [80, 30] relative to top-left
    return [lx - 80, ly - 30];
  }

  // Multi-input gates: output at [80, 30] relative to top-left
  return [lx - 80, ly - 30];
}

// ---------------------------------------------------------------------------
// Main parser
// ---------------------------------------------------------------------------

export function parseLogisimCirc(xmlString: string): Circuit {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, "application/xml");

  const parseError = doc.querySelector("parsererror");
  if (parseError) {
    throw new Error("Invalid .circ XML: " + parseError.textContent);
  }

  const mainNameEl = doc.querySelector("main");
  const mainName = mainNameEl?.getAttribute("name") ?? "main";
  let circuitEl: Element | null = null;
  const circuits = doc.getElementsByTagName("circuit");
  for (let i = 0; i < circuits.length; i++) {
    if (circuits[i].getAttribute("name") === mainName) {
      circuitEl = circuits[i];
      break;
    }
  }
  if (!circuitEl && circuits.length > 0) {
    circuitEl = circuits[0];
  }
  if (!circuitEl) {
    throw new Error("No <circuit> element found in .circ file");
  }

  // -----------------------------------------------------------------------
  // 1. Parse components
  // -----------------------------------------------------------------------
  const components: Component[] = [];
  const allPins: PinInfo[] = [];
  const comps = circuitEl.getElementsByTagName("comp");

  // Track min coordinates to normalize positions
  let minX = Infinity;
  let minY = Infinity;

  for (let i = 0; i < comps.length; i++) {
    const comp = comps[i];
    const name = comp.getAttribute("name");
    const locStr = comp.getAttribute("loc");
    if (!name || !locStr) continue;

    const loc = parseLoc(locStr);
    const label = getAttr(comp, "label") ?? "";
    const isOutput = getAttr(comp, "output") === "true";
    const facing = getAttr(comp, "facing") ?? "east";
    const sizeStr = getAttr(comp, "size");
    const inputsStr = getAttr(comp, "inputs");
    const size = sizeStr ? parseInt(sizeStr, 10) : undefined;
    const inputCount = inputsStr ? parseInt(inputsStr, 10) : undefined;

    let gateType: GateType;
    if (name === "Pin") {
      gateType = isOutput ? "OUTPUT" : "INPUT";
    } else if (GATE_MAP[name]) {
      gateType = GATE_MAP[name];
    } else {
      continue; // Unknown component
    }

    const id = nanoid();

    // Convert Logisim loc (output pin) to EduVision top-left
    const [topLeftX, topLeftY] = logisimLocToTopLeft(name, loc, {
      size,
      inputs: inputCount,
      output: isOutput,
    });

    if (topLeftX < minX) minX = topLeftX;
    if (topLeftY < minY) minY = topLeftY;

    components.push({
      id,
      type: gateType,
      x: topLeftX,
      y: topLeftY,
      rotation: facingToRotation(facing),
      label: label || gateType,
      value: false,
    });

    // Compute pin positions for wire matching (use original Logisim coordinates)
    const pins = computeLogisimPins(id, name, loc, {
      size,
      inputs: inputCount,
      output: isOutput,
      facing,
    });
    allPins.push(...pins);
  }

  // Normalize positions: shift everything so top-left starts at (60, 60)
  // and scale up for readability (Logisim uses tight spacing)
  const offsetX = 60 - (isFinite(minX) ? minX : 0);
  const offsetY = 60 - (isFinite(minY) ? minY : 0);
  // EduVision gates are 80px wide, Logisim gates are ~30px wide.
  // Need 3x scale so components don't overlap.
  const SCALE = 3;

  for (const comp of components) {
    comp.x = Math.round((comp.x + offsetX) * SCALE);
    comp.y = Math.round((comp.y + offsetY) * SCALE);
  }

  // -----------------------------------------------------------------------
  // 2. Parse wires and match to component pins
  // -----------------------------------------------------------------------
  const wires: Wire[] = [];
  const wireEls = circuitEl.getElementsByTagName("wire");

  // Build a set of all wire segments as coordinate pairs for chain resolution
  const wireSegments: Array<{ from: [number, number]; to: [number, number] }> = [];
  for (let i = 0; i < wireEls.length; i++) {
    const wireEl = wireEls[i];
    const fromStr = wireEl.getAttribute("from");
    const toStr = wireEl.getAttribute("to");
    if (!fromStr || !toStr) continue;
    wireSegments.push({ from: parseLoc(fromStr), to: parseLoc(toStr) });
  }

  // Direct pin-to-pin matching: for each wire segment, try to match endpoints to pins
  for (const seg of wireSegments) {
    const matchFrom = findClosestPin(allPins, seg.from, 5);
    const matchTo = findClosestPin(allPins, seg.to, 5);

    if (!matchFrom || !matchTo) continue;

    let sourcePin: PinInfo | null = null;
    let destPin: PinInfo | null = null;

    if (matchFrom.role === "output" && matchTo.role === "input") {
      sourcePin = matchFrom;
      destPin = matchTo;
    } else if (matchFrom.role === "input" && matchTo.role === "output") {
      sourcePin = matchTo;
      destPin = matchFrom;
    } else {
      continue; // Can't determine direction
    }

    if (sourcePin.componentId === destPin.componentId) continue;

    const duplicate = wires.some(
      (w) =>
        w.from.componentId === sourcePin!.componentId &&
        w.from.pinIndex === sourcePin!.pinIndex &&
        w.to.componentId === destPin!.componentId &&
        w.to.pinIndex === destPin!.pinIndex
    );
    if (duplicate) continue;

    wires.push({
      id: nanoid(),
      from: { componentId: sourcePin.componentId, pinIndex: sourcePin.pinIndex },
      to: { componentId: destPin.componentId, pinIndex: destPin.pinIndex },
    });
  }

  // Chain resolution: find multi-segment wire paths
  // (output pin → junction → ... → junction → input pin)
  // Build adjacency from wire endpoints that share coordinates
  const junctionMap = new Map<string, Array<{ segIdx: number; end: "from" | "to" }>>();
  wireSegments.forEach((seg, idx) => {
    const fk = `${seg.from[0]},${seg.from[1]}`;
    const tk = `${seg.to[0]},${seg.to[1]}`;
    if (!junctionMap.has(fk)) junctionMap.set(fk, []);
    if (!junctionMap.has(tk)) junctionMap.set(tk, []);
    junctionMap.get(fk)!.push({ segIdx: idx, end: "from" });
    junctionMap.get(tk)!.push({ segIdx: idx, end: "to" });
  });

  // For each output pin, BFS through wire segments to find reachable input pins
  const outputPins = allPins.filter((p) => p.role === "output");
  const inputPins = allPins.filter((p) => p.role === "input");

  for (const outPin of outputPins) {
    const key = `${outPin.x},${outPin.y}`;
    const visited = new Set<string>();
    const queue = [key];
    visited.add(key);

    while (queue.length > 0) {
      const current = queue.shift()!;
      const connections = junctionMap.get(current) ?? [];

      for (const conn of connections) {
        const seg = wireSegments[conn.segIdx];
        const otherEnd = conn.end === "from" ? seg.to : seg.from;
        const otherKey = `${otherEnd[0]},${otherEnd[1]}`;

        if (visited.has(otherKey)) continue;
        visited.add(otherKey);

        // Check if this endpoint matches an input pin
        const matchedInput = findClosestPin(inputPins, otherEnd, 5);
        if (matchedInput && matchedInput.componentId !== outPin.componentId) {
          const dup = wires.some(
            (w) =>
              w.from.componentId === outPin.componentId &&
              w.from.pinIndex === outPin.pinIndex &&
              w.to.componentId === matchedInput.componentId &&
              w.to.pinIndex === matchedInput.pinIndex
          );
          if (!dup) {
            wires.push({
              id: nanoid(),
              from: { componentId: outPin.componentId, pinIndex: outPin.pinIndex },
              to: { componentId: matchedInput.componentId, pinIndex: matchedInput.pinIndex },
            });
          }
        }

        queue.push(otherKey);
      }
    }
  }

  return {
    id: nanoid(),
    name: mainName,
    components,
    wires,
  };
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function findClosestPin(
  pins: PinInfo[],
  coord: [number, number],
  threshold: number
): PinInfo | null {
  let best: PinInfo | null = null;
  let bestDist = Infinity;
  for (const pin of pins) {
    const dx = pin.x - coord[0];
    const dy = pin.y - coord[1];
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < bestDist && dist <= threshold) {
      bestDist = dist;
      best = pin;
    }
  }
  return best;
}

function facingToRotation(facing: string): number {
  switch (facing) {
    case "east": return 0;
    case "south": return 90;
    case "west": return 180;
    case "north": return 270;
    default: return 0;
  }
}
