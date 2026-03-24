import { Circuit, TruthTable, TruthTableRow } from "./types";
import { propagate } from "./propagator";

/**
 * Generate a complete truth table for a circuit.
 * Enumerates all 2^n input combinations.
 */
export function generateTruthTable(circuit: Circuit): TruthTable {
  const inputs = circuit.components.filter((c) => c.type === "INPUT");
  const outputs = circuit.components.filter((c) => c.type === "OUTPUT");

  const inputLabels = inputs.map((c) => c.label || c.id);
  const outputLabels = outputs.map((c) => c.label || c.id);

  const n = inputs.length;
  const rows: TruthTableRow[] = [];

  const totalCombinations = Math.min(1 << n, 256); // cap at 256 rows

  for (let mask = 0; mask < totalCombinations; mask++) {
    // Clone circuit with specific input values
    const testCircuit: Circuit = {
      ...circuit,
      components: circuit.components.map((comp) => {
        if (comp.type === "INPUT") {
          const idx = inputs.findIndex((inp) => inp.id === comp.id);
          const bitValue = (mask >> (n - 1 - idx)) & 1;
          return { ...comp, value: bitValue === 1 };
        }
        return comp;
      }),
    };

    const state = propagate(testCircuit);

    // Collect input values for this row
    const rowInputs: Record<string, boolean> = {};
    inputs.forEach((inp, idx) => {
      const bitValue = (mask >> (n - 1 - idx)) & 1;
      rowInputs[inp.label || inp.id] = bitValue === 1;
    });

    // Collect output values
    const rowOutputs: Record<string, boolean> = {};
    outputs.forEach((out) => {
      // Find wire feeding into this OUTPUT component
      const wire = circuit.wires.find(
        (w) => w.to.componentId === out.id && w.to.pinIndex === 0
      );
      if (wire) {
        const srcState = state[wire.from.componentId];
        rowOutputs[out.label || out.id] = srcState?.[wire.from.pinIndex] ?? false;
      } else {
        rowOutputs[out.label || out.id] = false;
      }
    });

    rows.push({ inputs: rowInputs, outputs: rowOutputs });
  }

  return { inputLabels, outputLabels, rows };
}
