"use client";

import { useCircuitStore, Tool } from "@/lib/stores/circuit-store";

interface ToolButton {
  tool: Tool;
  label: string;
  icon: React.ReactNode;
}

const TOOLS: ToolButton[] = [
  {
    tool: "select",
    label: "Select (V)",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M2 1l10 5-4.5 1.5L14 14l-1.5 1.5L7 9.5 5.5 14 2 1z" />
      </svg>
    ),
  },
  {
    tool: "wire",
    label: "Wire (W)",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 8 Q8 2 14 8" />
      </svg>
    ),
  },
  {
    tool: "delete",
    label: "Delete (Del)",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M5 3V2h6v1h3v2H2V3h3zM3 7h10l-1 7H4L3 7z" />
      </svg>
    ),
  },
];

interface ToolbarProps {
  showLabels?: boolean;
  onToggleLabels?: () => void;
  traceActive?: boolean;
  onToggleTrace?: () => void;
}

export default function Toolbar({ showLabels = false, onToggleLabels, traceActive = false, onToggleTrace }: ToolbarProps) {
  const {
    selectedTool,
    setSelectedTool,
    setPlacingType,
    setWireInProgress,
    undo,
    redo,
    undoStack,
    redoStack,
  } = useCircuitStore();

  const handleTool = (tool: Tool) => {
    setSelectedTool(tool);
    if (tool !== "place") setPlacingType(null);
    if (tool !== "wire") setWireInProgress(null);
  };

  const btn =
    "flex items-center justify-center w-8 h-8 rounded-lg transition-all border";

  return (
    <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 p-1.5 bg-zinc-900/90 backdrop-blur-xl border border-white/[0.06] rounded-xl shadow-lg">
      {TOOLS.map(({ tool, label, icon }) => {
        const active = selectedTool === tool;
        return (
          <button
            key={tool}
            title={label}
            className={`${btn} ${
              active
                ? "bg-zinc-700 text-primary border-primary"
                : "text-zinc-400 border-transparent hover:text-zinc-100 hover:bg-zinc-800/80"
            }`}
            onClick={() => handleTool(tool)}
          >
            {icon}
          </button>
        );
      })}

      <div className="h-px mx-1 bg-white/[0.06]" />

      <button
        title="Undo (Ctrl+Z)"
        className={`${btn} border-transparent ${undoStack.length > 0 ? "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80" : "text-zinc-700"}`}
        onClick={undo}
        disabled={undoStack.length === 0}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <path d="M4 4L1 7l3 3V8h6a3 3 0 010 6H6v-2h4a1 1 0 000-2H4V8L1 7l3-3z" />
        </svg>
      </button>
      <button
        title="Redo (Ctrl+Shift+Z)"
        className={`${btn} border-transparent ${redoStack.length > 0 ? "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80" : "text-zinc-700"}`}
        onClick={redo}
        disabled={redoStack.length === 0}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <path d="M12 4l3 3-3 3V8H6a3 3 0 000 6h4v-2H6a1 1 0 010-2h6V8l3-1-3-3z" />
        </svg>
      </button>

      <div className="h-px mx-1 bg-white/[0.06]" />

      <button
        title="Show Wire Values"
        className={`${btn} ${
          showLabels
            ? "text-primary border-primary bg-zinc-700"
            : "text-zinc-400 border-transparent hover:text-zinc-100 hover:bg-zinc-800/80"
        }`}
        onClick={onToggleLabels}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 3C4.36 3 1.26 5.28 0 8.5c1.26 3.22 4.36 5.5 8 5.5s6.74-2.28 8-5.5C14.74 5.28 11.64 3 8 3zm0 9.17a3.67 3.67 0 110-7.34 3.67 3.67 0 010 7.34zM8 5.5a3 3 0 100 6 3 3 0 000-6z"/>
        </svg>
      </button>

      <div className="h-px mx-1 bg-white/[0.06]" />

      <button
        title="Step-Through Mode"
        className={`${btn} ${
          traceActive
            ? "text-amber-400 border-amber-400 bg-zinc-700"
            : "text-zinc-400 border-transparent hover:text-zinc-100 hover:bg-zinc-800/80"
        }`}
        onClick={onToggleTrace}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <path d="M9 1L3 9h4l-1 6 6-8H8l1-6z" />
        </svg>
      </button>
    </div>
  );
}
