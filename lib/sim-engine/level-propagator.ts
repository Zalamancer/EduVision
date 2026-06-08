import {
  Circuit,
  SignalState,
  PropagationLevel,
  PropagationTrace,
} from "./types";
import { evaluateGate, INPUT_COUNTS } from "./gates";

/**
 * Propagate signals level-by-level through the circuit DAG.
 *
 * Returns a PropagationTrace with independent snapshots at each
 * topological depth, enabling step-through visualization.
 *
 * Algorithm:
 * 1. Seed INPUT components at depth 0 with their values.
 * 2. BFS from inputs through wires to assign depth to every component
 *    (depth = max depth of any input source + 1).
 * 3. Group components by depth.
 * 4. For each depth level, evaluate all gates at that level using the
 *    cumulative state from previous levels.
 * 5. Record which wire IDs became active at each level.
 * 6. Return PropagationTrace with all levels.
 */
export function propagateLevels(circuit: Circuit): PropagationTrace {
  const compMap = new Map(circuit.components.map((c) => [c.id, c]));

  // Build wire lookup: for each component input pin, which wire feeds it?
  const wireMap: Record<
    string,
    Record<number, { fromId: string; fromPin: number; wireId: string }>
  > = {};
  for (const comp of circuit.components) {
    wireMap[comp.id] = {};
  }
  for (const wire of circuit.wires) {
    wireMap[wire.to.componentId][wire.to.pinIndex] = {
      fromId: wire.from.componentId,
      fromPin: wire.from.pinIndex,
      wireId: wire.id,
    };
  }

  // Build adjacency: source componentId -> list of destination componentIds
  const adjacency: Record<string, Set<string>> = {};
  for (const comp of circuit.components) {
    adjacency[comp.id] = new Set();
  }
  for (const wire of circuit.wires) {
    adjacency[wire.from.componentId].add(wire.to.componentId);
  }

  // --- Assign depths via BFS ---
  // depth = max depth of any input source + 1
  const depth: Record<string, number> = {};

  // Seed inputs at depth 0
  const queue: string[] = [];
  for (const comp of circuit.components) {
    if (comp.type === "INPUT") {
      depth[comp.id] = 0;
      queue.push(comp.id);
    }
  }

  // BFS: propagate depths through the DAG
  while (queue.length > 0) {
    const srcId = queue.shift()!;
    const srcDepth = depth[srcId];

    for (const destId of adjacency[srcId]) {
      const candidateDepth = srcDepth + 1;
      if (depth[destId] === undefined || candidateDepth > depth[destId]) {
        depth[destId] = candidateDepth;
        queue.push(destId);
      }
    }
  }

  // Assign depth 0 to any component not reached (disconnected)
  for (const comp of circuit.components) {
    if (depth[comp.id] === undefined) {
      depth[comp.id] = 0;
    }
  }

  // --- Group components by depth ---
  const maxDepth = Math.max(0, ...Object.values(depth));
  const groups: string[][] = Array.from({ length: maxDepth + 1 }, () => []);
  for (const comp of circuit.components) {
    groups[depth[comp.id]].push(comp.id);
  }

  // --- Evaluate level by level ---
  const cumulativeState: SignalState = {};
  const levels: PropagationLevel[] = [];

  for (let d = 0; d <= maxDepth; d++) {
    const ids = groups[d];
    if (ids.length === 0) continue;

    const evaluatedIds: string[] = [];
    const activeWireIds: string[] = [];

    for (const compId of ids) {
      const comp = compMap.get(compId)!;

      if (comp.type === "INPUT") {
        // Seed with switch value
        cumulativeState[compId] = [comp.value ?? false];
        evaluatedIds.push(compId);

        // Mark outbound wires as active if the input is true
        if (comp.value) {
          for (const wire of circuit.wires) {
            if (wire.from.componentId === compId) {
              activeWireIds.push(wire.id);
            }
          }
        }
        continue;
      }

      if (comp.type === "OUTPUT") {
        // OUTPUT has no output pins to compute, but record it at its depth
        cumulativeState[compId] = [];
        evaluatedIds.push(compId);

        // Mark inbound wires as active if their source signal is true
        const inputCount = INPUT_COUNTS[comp.type];
        for (let i = 0; i < inputCount; i++) {
          const feed = wireMap[compId][i];
          if (feed) {
            const srcState = cumulativeState[feed.fromId];
            if (srcState && srcState.length > feed.fromPin && srcState[feed.fromPin]) {
              activeWireIds.push(feed.wireId);
            }
          }
        }
        continue;
      }

      // Regular gate: gather inputs
      const inputCount = INPUT_COUNTS[comp.type];
      const inputs: boolean[] = [];

      for (let i = 0; i < inputCount; i++) {
        const feed = wireMap[compId][i];
        if (feed) {
          const srcState = cumulativeState[feed.fromId];
          if (srcState && srcState.length > feed.fromPin) {
            inputs.push(srcState[feed.fromPin]);
          } else {
            inputs.push(false); // disconnected = LOW
          }
        } else {
          inputs.push(false); // disconnected = LOW
        }
      }

      const outputs = evaluateGate(comp.type, inputs);
      cumulativeState[compId] = outputs;
      evaluatedIds.push(compId);

      // Mark outbound wires as active if their output pin is true
      for (const wire of circuit.wires) {
        if (wire.from.componentId === compId) {
          const pinVal = outputs[wire.from.pinIndex];
          if (pinVal) {
            activeWireIds.push(wire.id);
          }
        }
      }
    }

    // Clone cumulative state so each level is an independent snapshot
    const snapshot: SignalState = {};
    for (const key of Object.keys(cumulativeState)) {
      snapshot[key] = [...cumulativeState[key]];
    }

    levels.push({
      depth: d,
      evaluatedIds,
      activeWireIds,
      signalState: snapshot,
    });
  }

  return {
    levels,
    totalSteps: levels.length,
  };
}
