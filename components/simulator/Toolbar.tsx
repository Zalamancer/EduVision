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

export default function Toolbar() {
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

  const btnBase =
    "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded text-xs font-medium transition-all";

  return (
    <div
      className="flex items-center gap-1 px-3 py-2 border-b"
      style={{ background: "#12122A", borderColor: "#1E1E3A" }}
    >
      {TOOLS.map(({ tool, label, icon }) => {
        const active = selectedTool === tool;
        return (
          <button
            key={tool}
            title={label}
            className={btnBase}
            style={{
              background: active ? "#1E1E3A" : "transparent",
              color: active ? "#58C4DD" : "#8888AA",
              border: active ? "1px solid #58C4DD" : "1px solid transparent",
            }}
            onClick={() => handleTool(tool)}
          >
            {icon}
            <span className="hidden sm:block" style={{ fontSize: "10px" }}>
              {tool.charAt(0).toUpperCase() + tool.slice(1)}
            </span>
          </button>
        );
      })}

      <div className="w-px h-8 mx-2" style={{ background: "#1E1E3A" }} />

      {/* Undo / Redo */}
      <button
        title="Undo (Ctrl+Z)"
        className={btnBase}
        style={{ color: undoStack.length > 0 ? "#8888AA" : "#3A3A5A" }}
        onClick={undo}
        disabled={undoStack.length === 0}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M4 4L1 7l3 3V8h6a3 3 0 010 6H6v-2h4a1 1 0 000-2H4V8L1 7l3-3z" />
        </svg>
        <span className="hidden sm:block" style={{ fontSize: "10px" }}>Undo</span>
      </button>
      <button
        title="Redo (Ctrl+Shift+Z)"
        className={btnBase}
        style={{ color: redoStack.length > 0 ? "#8888AA" : "#3A3A5A" }}
        onClick={redo}
        disabled={redoStack.length === 0}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M12 4l3 3-3 3V8H6a3 3 0 000 6h4v-2H6a1 1 0 010-2h6V8l3-1-3-3z" />
        </svg>
        <span className="hidden sm:block" style={{ fontSize: "10px" }}>Redo</span>
      </button>
    </div>
  );
}
