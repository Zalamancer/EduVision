import { GateType } from "./types";

/** Number of input pins for each gate type */
export const INPUT_COUNTS: Record<GateType, number> = {
  AND: 2,
  OR: 2,
  NOT: 1,
  NAND: 2,
  NOR: 2,
  XOR: 2,
  XNOR: 2,
  BUFFER: 1,
  INPUT: 0,
  OUTPUT: 1,
};

/** Number of output pins for each gate type */
export const OUTPUT_COUNTS: Record<GateType, number> = {
  AND: 1,
  OR: 1,
  NOT: 1,
  NAND: 1,
  NOR: 1,
  XOR: 1,
  XNOR: 1,
  BUFFER: 1,
  INPUT: 1,
  OUTPUT: 0,
};

/**
 * Pure gate logic: given an array of boolean inputs, returns boolean output values.
 * Returns array to match OUTPUT_COUNTS for each gate type.
 */
export function evaluateGate(type: GateType, inputs: boolean[]): boolean[] {
  switch (type) {
    case "AND":
      return [inputs[0] && inputs[1]];
    case "OR":
      return [inputs[0] || inputs[1]];
    case "NOT":
      return [!inputs[0]];
    case "NAND":
      return [!(inputs[0] && inputs[1])];
    case "NOR":
      return [!(inputs[0] || inputs[1])];
    case "XOR":
      return [inputs[0] !== inputs[1]];
    case "XNOR":
      return [inputs[0] === inputs[1]];
    case "BUFFER":
      return [inputs[0]];
    case "INPUT":
      // Handled externally via component.value
      return [false];
    case "OUTPUT":
      // No outputs
      return [];
    default:
      return [false];
  }
}

/** Pin positions relative to an 80x60 component bounding box (x,y offset from top-left) */
export const PIN_POSITIONS: Record<GateType, { inputs: [number, number][]; outputs: [number, number][] }> = {
  AND:    { inputs: [[0, 15], [0, 45]], outputs: [[80, 30]] },
  OR:     { inputs: [[5, 15], [5, 45]], outputs: [[80, 30]] },
  NOT:    { inputs: [[0, 30]], outputs: [[80, 30]] },
  NAND:   { inputs: [[0, 15], [0, 45]], outputs: [[80, 30]] },
  NOR:    { inputs: [[5, 15], [5, 45]], outputs: [[80, 30]] },
  XOR:    { inputs: [[5, 15], [5, 45]], outputs: [[80, 30]] },
  XNOR:   { inputs: [[5, 15], [5, 45]], outputs: [[80, 30]] },
  BUFFER: { inputs: [[0, 30]], outputs: [[80, 30]] },
  INPUT:  { inputs: [], outputs: [[80, 30]] },
  OUTPUT: { inputs: [[0, 30]], outputs: [] },
};

/** Get absolute pin position for a component */
export function getPinPosition(
  component: { x: number; y: number; type: GateType },
  role: "input" | "output",
  pinIndex: number
): [number, number] {
  const pins = role === "input"
    ? PIN_POSITIONS[component.type].inputs
    : PIN_POSITIONS[component.type].outputs;
  const pin = pins[pinIndex] ?? [0, 0];
  return [component.x + pin[0], component.y + pin[1]];
}
