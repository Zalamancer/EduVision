"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import ComponentPalette from "@/components/simulator/ComponentPalette";
import Toolbar from "@/components/simulator/Toolbar";
import TruthTable from "@/components/simulator/TruthTable";
import AIChat from "@/components/simulator/AIChat";
import { useCircuitStore } from "@/lib/stores/circuit-store";

// Canvas must be client-side only (uses SVG refs and mouse events)
const Canvas = dynamic(() => import("@/components/simulator/Canvas"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center" style={{ color: "#4A4A5A" }}>
      Loading canvas…
    </div>
  ),
});

export default function SimulatorPage() {
  const [showTruthTable, setShowTruthTable] = useState(true);
  const [showAI, setShowAI] = useState(true);
  const [circuitName, setCircuitName] = useState("Untitled Circuit");
  const { circuit } = useCircuitStore();

  useEffect(() => {
    setCircuitName(circuit.name);
  }, [circuit.name]);

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 56px)", background: "#0A0A1A" }}>
      {/* Top bar */}
      <div
        className="flex items-center gap-3 px-4 py-2 border-b"
        style={{ background: "#12122A", borderColor: "#1E1E3A" }}
      >
        <input
          className="bg-transparent outline-none text-sm font-medium flex-1 max-w-xs"
          style={{ color: "#E8E8F0" }}
          value={circuitName}
          onChange={(e) => setCircuitName(e.target.value)}
          title="Circuit name"
        />

        <div className="flex items-center gap-2 ml-auto">
          <button
            className="text-xs px-2 py-1 rounded transition-all"
            style={{
              background: showTruthTable ? "#1E1E3A" : "transparent",
              color: showTruthTable ? "#58C4DD" : "#8888AA",
            }}
            onClick={() => setShowTruthTable(!showTruthTable)}
          >
            Truth Table
          </button>
          <button
            className="text-xs px-2 py-1 rounded transition-all"
            style={{
              background: showAI ? "#1E1E3A" : "transparent",
              color: showAI ? "#58C4DD" : "#8888AA",
            }}
            onClick={() => setShowAI(!showAI)}
          >
            AI Tutor
          </button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Left: component palette */}
        <div className="w-48 flex-shrink-0 hidden md:block">
          <ComponentPalette />
        </div>

        {/* Center: canvas + toolbar + truth table */}
        <div className="flex flex-col flex-1 min-w-0">
          <Toolbar />

          <div className="flex flex-col flex-1 min-h-0">
            {/* Canvas */}
            <div className="flex-1 min-h-0 relative">
              <Canvas />
            </div>

            {/* Truth table panel */}
            {showTruthTable && (
              <div
                className="border-t flex-shrink-0"
                style={{
                  borderColor: "#1E1E3A",
                  height: "160px",
                  background: "#12122A",
                  overflowY: "auto",
                }}
              >
                <div
                  className="flex items-center px-3 py-1 border-b"
                  style={{ borderColor: "#1E1E3A" }}
                >
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#8888AA" }}>
                    Truth Table
                  </span>
                </div>
                <TruthTable />
              </div>
            )}
          </div>
        </div>

        {/* Right: AI chat */}
        {showAI && (
          <div
            className="w-72 flex-shrink-0 border-l"
            style={{ borderColor: "#1E1E3A" }}
          >
            <AIChat />
          </div>
        )}
      </div>
    </div>
  );
}
