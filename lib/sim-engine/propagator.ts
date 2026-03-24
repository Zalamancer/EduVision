import { Circuit, SignalState } from "./types";
import { evaluateGate, INPUT_COUNTS } from "./gates";

const MAX_ITERATIONS = 100; // cycle guard

/**
 * Propagate all signals through the circuit.
 * Returns a SignalState mapping componentId -> output boolean[].
 *
 * Algorithm:
 * 1. Seed INPUT components with their switch values.
 * 2. Iteratively evaluate any gate whose all inputs are resolved.
 * 3. Stop when stable or max iterations hit (for cycles).
 */
export function propagate(circuit: Circuit): SignalState {
  const state: SignalState = {};

  // Seed INPUT components
  for (const comp of circuit.components) {
    if (comp.type === "INPUT") {
      state[comp.id] = [comp.value ?? false];
    } else {
      state[comp.id] = [];
    }
  }

  // Build a lookup: componentId -> component
  const compMap = new Map(circuit.components.map((c) => [c.id, c]));

  // Build: for each component input pin, which wire feeds it?
  // wireMap[compId][pinIndex] = { fromId, fromPinIndex }
  const wireMap: Record<string, Record<number, { fromId: string; fromPin: number }>> = {};
  for (const comp of circuit.components) {
    wireMap[comp.id] = {};
  }
  for (const wire of circuit.wires) {
    wireMap[wire.to.componentId][wire.to.pinIndex] = {
      fromId: wire.from.componentId,
      fromPin: wire.from.pinIndex,
    };
  }

  let changed = true;
  let iterations = 0;

  while (changed && iterations < MAX_ITERATIONS) {
    changed = false;
    iterations++;

    for (const comp of circuit.components) {
      if (comp.type === "INPUT") continue; // already seeded
      if (comp.type === "OUTPUT") continue; // no outputs to compute

      const inputCount = INPUT_COUNTS[comp.type];
      const inputs: boolean[] = [];
      let allResolved = true;

      for (let i = 0; i < inputCount; i++) {
        const feed = wireMap[comp.id][i];
        if (feed) {
          const srcState = state[feed.fromId];
          if (srcState && srcState.length > feed.fromPin) {
            inputs.push(srcState[feed.fromPin]);
          } else {
            inputs.push(false); // unconnected = LOW
          }
        } else {
          inputs.push(false); // unconnected = LOW
        }
      }

      if (!allResolved) continue;

      const newOutputs = evaluateGate(comp.type, inputs);
      const prev = state[comp.id];
      const didChange =
        !prev ||
        prev.length !== newOutputs.length ||
        newOutputs.some((v, i) => v !== prev[i]);

      if (didChange) {
        state[comp.id] = newOutputs;
        changed = true;
      }
    }
  }

  return state;
}

/**
 * Get the signal value on a specific wire (from the source pin).
 */
export function getWireSignal(
  wireId: string,
  circuit: Circuit,
  state: SignalState
): boolean {
  const wire = circuit.wires.find((w) => w.id === wireId);
  if (!wire) return false;
  const srcState = state[wire.from.componentId];
  return srcState?.[wire.from.pinIndex] ?? false;
}
