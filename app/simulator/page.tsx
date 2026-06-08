"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { EditorLayout } from "@/components/editor";
import ComponentPalette from "@/components/simulator/ComponentPalette";
import Toolbar from "@/components/simulator/Toolbar";
import TruthTable from "@/components/simulator/TruthTable";
import AIChat from "@/components/simulator/AIChat";
import { useTeachingStore } from "@/lib/stores/teaching-store";
import { useCircuitStore } from "@/lib/stores/circuit-store";

const Canvas = dynamic(() => import("@/components/simulator/Canvas"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center text-zinc-500">
      Loading canvas...
    </div>
  ),
});

export default function SimulatorPage() {
  const [showTruthTable, setShowTruthTable] = useState(false);
  const [showAI, setShowAI] = useState(true);
  const [showLabels, setShowLabels] = useState(false);

  // Prevent browser pinch-zoom and scroll on simulator page
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "viewport";
    meta.content = "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no";
    document.head.appendChild(meta);

    const prevent = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) e.preventDefault();
    };
    document.addEventListener("wheel", prevent, { passive: false });
    return () => {
      document.head.removeChild(meta);
      document.removeEventListener("wheel", prevent);
    };
  }, []);

  const teachingMode = useTeachingStore((s) => s.mode);
  const enterStepMode = useTeachingStore((s) => s.enterStepMode);
  const exitTeachingMode = useTeachingStore((s) => s.exitTeachingMode);
  const circuit = useCircuitStore((s) => s.circuit);

  const handleToggleTrace = () => {
    if (teachingMode !== "off") {
      exitTeachingMode();
    } else {
      enterStepMode(circuit);
    }
  };

  return (
    <EditorLayout
      leftPanel={<ComponentPalette />}
      centerMain={
        <div className="relative w-full h-full">
          <Canvas showLabels={showLabels} />
          <Toolbar
            showLabels={showLabels}
            onToggleLabels={() => setShowLabels((v) => !v)}
            traceActive={teachingMode !== "off"}
            onToggleTrace={handleToggleTrace}
          />
        </div>
      }
      splitRight={
        <div className="flex flex-col h-full">
          <div className="flex items-center px-3 py-1.5 border-b border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Truth Table
            </span>
          </div>
          <div className="flex-1 min-h-0 overflow-auto">
            <TruthTable />
          </div>
        </div>
      }
      rightPanel={<AIChat />}
      showSplit={showTruthTable}
      showRight={showAI}
      onToggleSplit={() => setShowTruthTable(!showTruthTable)}
      onToggleRight={() => setShowAI(!showAI)}
    />
  );
}
