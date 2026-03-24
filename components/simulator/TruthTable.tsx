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
      <div className="flex items-center justify-center h-full text-sm" style={{ color: "#4A4A5A" }}>
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
                className="px-3 py-1 text-center border-b border-r"
                style={{ borderColor: "#1E1E3A", color: "#83C167" }}
              >
                {l}
              </th>
            ))}
            <th className="px-2" style={{ borderColor: "#1E1E3A", background: "transparent" }} />
            {truthTable.outputLabels.map((l) => (
              <th
                key={l}
                className="px-3 py-1 text-center border-b border-l"
                style={{ borderColor: "#1E1E3A", color: "#FC6255" }}
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
                style={{
                  background: isActive ? "#1a2e1a" : "transparent",
                  outline: isActive ? "1px solid #83C167" : "none",
                }}
              >
                {truthTable.inputLabels.map((l) => (
                  <td
                    key={l}
                    className="px-3 py-0.5 text-center border-r"
                    style={{
                      borderColor: "#1E1E3A",
                      color: row.inputs[l] ? "#83C167" : "#8888AA",
                    }}
                  >
                    {row.inputs[l] ? "1" : "0"}
                  </td>
                ))}
                <td className="px-1" style={{ color: "#4A4A5A" }}>│</td>
                {truthTable.outputLabels.map((l) => (
                  <td
                    key={l}
                    className="px-3 py-0.5 text-center border-l"
                    style={{
                      borderColor: "#1E1E3A",
                      color: row.outputs[l] ? "#83C167" : "#8888AA",
                    }}
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
