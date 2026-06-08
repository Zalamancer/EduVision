import { GateType } from "./types";
import { getComponentDef } from "./component-registry";

// Ensure all components are registered before this module is used
import "./components";

/** Original input counts for legacy gate types */
const _INPUT_COUNTS: Partial<Record<GateType, number>> = {
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
  MUX_2TO1: 3,       // D0, D1, S (select)
  FULL_ADDER: 3,     // A, B, Cin
  DECODER_2TO4: 2,   // A1, A0
};

/** Number of input pins for each gate type — falls back to component registry */
export const INPUT_COUNTS: Record<GateType, number> = new Proxy(
  _INPUT_COUNTS as Record<GateType, number>,
  {
    get(target, prop: string) {
      const key = prop as GateType;
      if (key in target) return target[key];
      const def = getComponentDef(key);
      return def?.inputCount ?? 0;
    },
  }
);

/** Original output counts for legacy gate types */
const _OUTPUT_COUNTS: Partial<Record<GateType, number>> = {
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
  MUX_2TO1: 1,       // Y
  FULL_ADDER: 2,     // Sum, Cout
  DECODER_2TO4: 4,   // D0, D1, D2, D3
};

/** Number of output pins for each gate type — falls back to component registry */
export const OUTPUT_COUNTS: Record<GateType, number> = new Proxy(
  _OUTPUT_COUNTS as Record<GateType, number>,
  {
    get(target, prop: string) {
      const key = prop as GateType;
      if (key in target) return target[key];
      const def = getComponentDef(key);
      return def?.outputCount ?? 0;
    },
  }
);

/**
 * Pure gate logic: given an array of boolean inputs, returns boolean output values.
 * Returns array to match OUTPUT_COUNTS for each gate type.
 * Falls back to the component registry for types not in the switch.
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
    case "MUX_2TO1":
      return [inputs[2] ? inputs[1] : inputs[0]]; // S selects D1 or D0
    case "FULL_ADDER": {
      const a = inputs[0], b = inputs[1], cin = inputs[2];
      const sum = a !== b !== cin;
      const cout = (a && b) || (cin && (a !== b));
      return [sum, cout];
    }
    case "DECODER_2TO4": {
      const a1 = inputs[0], a0 = inputs[1];
      return [!a1 && !a0, !a1 && a0, a1 && !a0, a1 && a0];
    }
    default: {
      // Fall back to component registry
      const def = getComponentDef(type);
      if (def) return def.evaluate(inputs);
      return [false];
    }
  }
}

/** Original pin positions for legacy gate types */
const _PIN_POSITIONS: Partial<Record<GateType, { inputs: [number, number][]; outputs: [number, number][] }>> = {
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
  MUX_2TO1:     { inputs: [[0, 12], [0, 48], [40, 60]], outputs: [[80, 30]] },
  FULL_ADDER:   { inputs: [[0, 10], [0, 30], [0, 50]], outputs: [[80, 20], [80, 40]] },
  DECODER_2TO4: { inputs: [[0, 20], [0, 60]], outputs: [[100, 10], [100, 30], [100, 50], [100, 70]] },
};

const DEFAULT_PIN_POSITIONS = { inputs: [] as [number, number][], outputs: [] as [number, number][] };

/** Pin positions relative to a component's bounding box — falls back to component registry */
export const PIN_POSITIONS: Record<GateType, { inputs: [number, number][]; outputs: [number, number][] }> = new Proxy(
  _PIN_POSITIONS as Record<GateType, { inputs: [number, number][]; outputs: [number, number][] }>,
  {
    get(target, prop: string) {
      const key = prop as GateType;
      if (key in target) return target[key];
      const def = getComponentDef(key);
      return def?.pinPositions ?? DEFAULT_PIN_POSITIONS;
    },
  }
);

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
