"use client";

import { useMemo } from "react";
import { useCircuitStore } from "@/lib/stores/circuit-store";
import { generateTruthTable } from "@/lib/sim-engine/truth-table";

export default function TruthTable() {
  const { circuit, signalState } = useCircuitStore();

  const truthTable = useMemo(() => {
    const inputs = circuit.components.filter((c) => c.type === "INPUT");
    const outputs = circuit.components.filter((c) => c.type === "OUTPUT");
    if (inputs.length === 0 || outputs.length === 0) return null;
    if (inputs.length > 8) return null; // too many
    return generateTruthTable(circuit);
  }, [circuit]);

  // Find current row (which combination is active)
  const currentMask = useMemo(() => {
    const inputs = circuit.components.filter((c) => c.type === "INPUT");
    if (!truthTable || inputs.length === 0) return -1;
    return inputs.reduce((acc, inp, i) => {
      return acc | ((inp.value ? 1 : 0) << (inputs.length - 1 - i));
    }, 0);
  }, [circuit, truthTable]);

  if (!truthTable) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-zinc-500">
        Add at least 1 INPUT and 1 OUTPUT to see the truth table.
      </div>
    );
  }

  return (
    <div className="overflow-auto h-full p-2">
      <table className="text-xs font-mono w-auto border-collapse">
        <thead>
          <tr>
            {truthTable.inputLabels.map((l) => (
              <th
                key={l}
                className="px-3 py-1 text-center border-b border-r border-zinc-800 text-green-400"
              >
                {l}
              </th>
            ))}
            <th className="px-2 border-zinc-800" />
            {truthTable.outputLabels.map((l) => (
              <th
                key={l}
                className="px-3 py-1 text-center border-b border-l border-zinc-800 text-red-400"
              >
                {l}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {truthTable.rows.map((row, i) => {
            const isActive = i === currentMask;
            return (
              <tr
                key={i}
                className={isActive ? "bg-green-950/50 outline outline-1 outline-green-500" : ""}
              >
                {truthTable.inputLabels.map((l) => (
                  <td
                    key={l}
                    className={`px-3 py-0.5 text-center border-r border-zinc-800 ${
                      row.inputs[l] ? "text-green-400" : "text-zinc-400"
                    }`}
                  >
                    {row.inputs[l] ? "1" : "0"}
                  </td>
                ))}
                <td className="px-1 text-zinc-600">|</td>
                {truthTable.outputLabels.map((l) => (
                  <td
                    key={l}
                    className={`px-3 py-0.5 text-center border-l border-zinc-800 ${
                      row.outputs[l] ? "text-green-400" : "text-zinc-400"
                    }`}
                  >
                    {row.outputs[l] ? "1" : "0"}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
