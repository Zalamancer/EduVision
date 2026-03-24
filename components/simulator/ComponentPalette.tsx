"use client";

import { GateType } from "@/lib/sim-engine/types";
import { useCircuitStore } from "@/lib/stores/circuit-store";

interface PaletteItem {
  type: GateType;
  label: string;
  desc: string;
  color?: string;
}

const PALETTE: { section: string; items: PaletteItem[] }[] = [
  {
    section: "Inputs & Outputs",
    items: [
      { type: "INPUT", label: "Input Switch", desc: "Toggle 0/1 input", color: "#83C167" },
      { type: "OUTPUT", label: "Output LED", desc: "Read circuit output", color: "#FC6255" },
    ],
  },
  {
    section: "Logic Gates",
    items: [
      { type: "AND", label: "AND Gate", desc: "Output 1 if all inputs 1" },
      { type: "OR", label: "OR Gate", desc: "Output 1 if any input 1" },
      { type: "NOT", label: "NOT Gate", desc: "Inverts the input" },
      { type: "NAND", label: "NAND Gate", desc: "NOT AND (universal gate)" },
      { type: "NOR", label: "NOR Gate", desc: "NOT OR" },
      { type: "XOR", label: "XOR Gate", desc: "Exclusive OR" },
      { type: "XNOR", label: "XNOR Gate", desc: "Exclusive NOR" },
    ],
  },
];

export default function ComponentPalette() {
  const { setPlacingType, setSelectedTool, placingType } = useCircuitStore();

  const handleSelect = (type: GateType) => {
    setPlacingType(type);
    setSelectedTool("place");
  };

  return (
    <div
      className="h-full overflow-y-auto flex flex-col"
      style={{ background: "#12122A", borderRight: "1px solid #1E1E3A" }}
    >
      <div className="px-3 py-3 border-b" style={{ borderColor: "#1E1E3A" }}>
        <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#8888AA" }}>
          Components
        </p>
        {placingType && (
          <p className="text-xs mt-1" style={{ color: "#58C4DD" }}>
            Click canvas to place {placingType}
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {PALETTE.map(({ section, items }) => (
          <div key={section} className="mb-4">
            <p
              className="text-xs px-1 py-1 uppercase tracking-widest font-semibold"
              style={{ color: "#4A4A5A" }}
            >
              {section}
            </p>
            {items.map(({ type, label, desc, color }) => {
              const active = placingType === type;
              return (
                <button
                  key={type}
                  className="w-full text-left px-2 py-2 rounded flex items-start gap-2 mb-1 transition-all"
                  style={{
                    background: active ? "#1E1E3A" : "transparent",
                    border: active ? "1px solid #58C4DD" : "1px solid transparent",
                    color: active ? "#58C4DD" : "#E8E8F0",
                  }}
                  onClick={() => handleSelect(type)}
                >
                  <span
                    className="mt-0.5 w-5 h-5 rounded flex items-center justify-center text-xs font-mono font-bold flex-shrink-0"
                    style={{
                      background: color ?? "#1E1E3A",
                      color: color ? "#0A0A1A" : "#58C4DD",
                    }}
                  >
                    {type[0]}
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-medium leading-tight truncate">{label}</div>
                    <div className="text-xs leading-tight truncate" style={{ color: "#8888AA" }}>
                      {desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="p-3 border-t text-xs" style={{ borderColor: "#1E1E3A", color: "#4A4A5A" }}>
        <p>Click gate → click canvas to place</p>
        <p className="mt-1">Click output pin → input pin to wire</p>
        <p className="mt-1">Delete key removes selected</p>
      </div>
    </div>
  );
}
