import { GateType } from "./types";

export interface ComponentDef {
  type: GateType;
  category: "gate" | "plexer" | "arithmetic" | "memory" | "wiring" | "io";
  inputCount: number;
  outputCount: number;
  pinPositions: { inputs: [number, number][]; outputs: [number, number][] };
  /** Bounding box (default 80x60) */
  width: number;
  height: number;
  /** Display name */
  label: string;
  /** Whether this is a sequential (clocked) component */
  sequential?: boolean;
  /** Evaluate pure combinational logic */
  evaluate: (inputs: boolean[]) => boolean[];
  /** Evaluate sequential (clocked) logic with state */
  evaluateSequential?: (
    inputs: boolean[],
    prevState: boolean[],
    clockEdge: boolean
  ) => { outputs: boolean[]; nextState: boolean[] };
}

const registry = new Map<GateType, ComponentDef>();

export function registerComponent(def: ComponentDef) {
  registry.set(def.type, def);
}

export function getComponentDef(type: GateType): ComponentDef | undefined {
  return registry.get(type);
}

export function getAllComponents(): ComponentDef[] {
  return Array.from(registry.values());
}

export function getComponentsByCategory(
  category: ComponentDef["category"]
): ComponentDef[] {
  return getAllComponents().filter((c) => c.category === category);
}
