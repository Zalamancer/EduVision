"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useCircuitStore } from "@/lib/stores/circuit-store";
import { useTeachingStore } from "@/lib/stores/teaching-store";
import { useExerciseStore } from "@/lib/stores/exercise-store";
import { useLessonStore } from "@/lib/stores/lesson-store";
import { getPinPosition, INPUT_COUNTS } from "@/lib/sim-engine/gates";
import { GateType } from "@/lib/sim-engine/types";
import GateComponent from "./GateComponent";
import WireRenderer from "./WireRenderer";
import BusRenderer from "./BusRenderer";
import StepControls from "./StepControls";
import ExerciseOverlay from "./ExerciseOverlay";
import LessonOverlay from "./LessonOverlay";
import { nanoid } from "nanoid";

const GRID = 20;
const snap = (v: number) => Math.round(v / GRID) * GRID;

interface MousePos {
  x: number;
  y: number;
}

interface CanvasProps {
  showLabels?: boolean;
}

export default function Canvas({ showLabels }: CanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const {
    circuit,
    signalState,
    selectedIds,
    selectedTool,
    placingType,
    wireInProgress,
    addComponent,
    removeComponent,
    removeWire,
    moveComponent,
    addWire,
    toggleInput,
    setSelectedIds,
    setSelectedTool,
    setPlacingType,
    setWireInProgress,
    undo,
    redo,
    busGroups,
    addBusGroup,
    removeBusGroup,
  } = useCircuitStore();

  const teachingMode = useTeachingStore((s) => s.mode);
  const visibleSignalState = useTeachingStore((s) => s.visibleSignalState);
  const highlightedComponentIds = useTeachingStore((s) => s.highlightedComponentIds);
  const highlightedWireIds = useTeachingStore((s) => s.highlightedWireIds);

  const activeExercise = useExerciseStore((s) => s.activeExercise);
  const exerciseStepIndex = useExerciseStore((s) => s.currentStepIndex);

  const activeLesson = useLessonStore((s) => s.activeLesson);
  const lessonStageIndex = useLessonStore((s) => s.currentStageIndex);
  const revealedComponentIds = useLessonStore((s) => s.revealedComponentIds);
  const revealedWireIds = useLessonStore((s) => s.revealedWireIds);
  const lessonActive = activeLesson != null;

  // Determine which component IDs are newly revealed at the current stage
  const currentStageNewCompIds = lessonActive
    ? activeLesson.stages[lessonStageIndex]?.revealComponentIds ?? []
    : [];
  const currentStageNewWireIds = lessonActive
    ? activeLesson.stages[lessonStageIndex]?.revealWireIds ?? []
    : [];

  const currentExerciseStep = activeExercise?.steps[exerciseStepIndex];
  const ghost = currentExerciseStep?.ghost;
  const exerciseHighlights = currentExerciseStep?.highlightLabels ?? [];

  const traceActive = teachingMode !== "off";
  const renderSignalState = traceActive ? visibleSignalState : signalState;

  const [pan, setPan] = useState({ x: 60, y: 60 });
  const [scale, setScale] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [dragComponentId, setDragComponentId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const wasDragging = useRef(false);
  const inputPinDrag = useRef<{ componentId: string; pinIndex: number } | null>(null);
  const [mouseWorld, setMouseWorld] = useState<MousePos>({ x: 0, y: 0 });
  const [quickAdd, setQuickAdd] = useState<{
    screenX: number;
    screenY: number;
    worldX: number;
    worldY: number;
    fromComponentId: string;
    fromPinIndex: number;
    pinDirection: "input" | "output";
  } | null>(null);

  const svgToWorld = useCallback(
    (svgX: number, svgY: number): MousePos => ({
      x: (svgX - pan.x) / scale,
      y: (svgY - pan.y) / scale,
    }),
    [pan, scale]
  );

  const getEventPos = (e: React.MouseEvent | MouseEvent): { x: number; y: number } => {
    const rect = svgRef.current!.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "Delete" || e.key === "Backspace") {
        selectedIds.forEach((id) => {
          const isWire = circuit.wires.some((w) => w.id === id);
          if (isWire) removeWire(id);
          else removeComponent(id);
        });
        setSelectedIds([]);
      }
      if (e.key === "z" && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        e.preventDefault();
        redo();
      } else if (e.key === "z" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        undo();
      }
      if (e.key === "Escape") {
        setWireInProgress(null);
        setPlacingType(null);
        setSelectedTool("select");
        setSelectedIds([]);
      }
      // "B" to group selected INPUT components as a bus
      if (e.key === "b" || e.key === "B") {
        if (e.metaKey || e.ctrlKey) return; // don't hijack browser shortcuts
        const selectedInputs = circuit.components.filter(
          (c) => selectedIds.includes(c.id) && c.type === "INPUT"
        );
        if (selectedInputs.length >= 2) {
          // Sort by y-position (top = MSB)
          const sorted = [...selectedInputs].sort((a, b) => a.y - b.y);
          const existingLabels = busGroups.map((bg) => bg.label);
          // Auto-name: first available letter not already used
          let busLabel = "A";
          for (let code = 65; code <= 90; code++) {
            const letter = String.fromCharCode(code);
            if (!existingLabels.includes(letter)) {
              busLabel = letter;
              break;
            }
          }
          addBusGroup({
            id: nanoid(),
            label: busLabel,
            bitWidth: sorted.length,
            componentIds: sorted.map((c) => c.id),
          });
          setSelectedIds([]);
        }
      }
      // "U" to ungroup (remove bus) if selected components belong to a bus
      if (e.key === "u" || e.key === "U") {
        if (e.metaKey || e.ctrlKey) return;
        const busToRemove = busGroups.find((bg) =>
          bg.componentIds.some((cid) => selectedIds.includes(cid))
        );
        if (busToRemove) {
          removeBusGroup(busToRemove.id);
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedIds, circuit.components, circuit.wires, removeComponent, removeWire, setSelectedIds, undo, redo, setWireInProgress, setPlacingType, setSelectedTool, busGroups, addBusGroup, removeBusGroup]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const { x, y } = getEventPos(e);
    const delta = -e.deltaY * 0.001;
    const newScale = Math.max(0.1, Math.min(10, scale + delta * scale));
    const scaleChange = newScale / scale;
    setPan((p) => ({
      x: x - (x - p.x) * scaleChange,
      y: y - (y - p.y) * scaleChange,
    }));
    setScale(newScale);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (quickAdd) {
      setQuickAdd(null);
      return;
    }
    if (e.target === svgRef.current || (e.target as SVGElement).dataset.bg) {
      if (e.button === 1 || (e.button === 0 && selectedTool === "select")) {
        const { x, y } = getEventPos(e);
        setIsPanning(true);
        setPanStart({ x: x - pan.x, y: y - pan.y });
      }
      setSelectedIds([]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const { x, y } = getEventPos(e);
    const world = svgToWorld(x, y);
    setMouseWorld(world);

    if (isPanning) {
      setPan({ x: x - panStart.x, y: y - panStart.y });
    }

    if (dragComponentId) {
      wasDragging.current = true;
      moveComponent(dragComponentId, snap(world.x - dragOffset.x), snap(world.y - dragOffset.y));
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    setIsPanning(false);
    setDragComponentId(null);

    const showQuickAdd = wireInProgress || inputPinDrag.current;
    if (showQuickAdd) {
      const rect = svgRef.current!.getBoundingClientRect();
      const svgX = e.clientX - rect.left;
      const svgY = e.clientY - rect.top;
      const world = svgToWorld(svgX, svgY);

      if (wireInProgress) {
        // Dragged from output pin
        setQuickAdd({
          screenX: svgX,
          screenY: svgY,
          worldX: world.x,
          worldY: world.y,
          fromComponentId: wireInProgress.fromComponentId,
          fromPinIndex: wireInProgress.fromPinIndex,
          pinDirection: "output",
        });
        setWireInProgress(null);
        setSelectedTool("select");
      } else if (inputPinDrag.current) {
        // Dragged from input pin
        setQuickAdd({
          screenX: svgX,
          screenY: svgY,
          worldX: world.x,
          worldY: world.y,
          fromComponentId: inputPinDrag.current.componentId,
          fromPinIndex: inputPinDrag.current.pinIndex,
          pinDirection: "input",
        });
        inputPinDrag.current = null;
      }
    }
  };

  const handleSvgClick = (e: React.MouseEvent) => {
    if (traceActive) return;
    if (e.target !== svgRef.current && !(e.target as SVGElement).dataset.bg) return;

    if (placingType) {
      const world = svgToWorld(getEventPos(e).x, getEventPos(e).y);
      const label =
        placingType === "INPUT"
          ? `A${circuit.components.filter((c) => c.type === "INPUT").length}`
          : placingType === "OUTPUT"
          ? `Y${circuit.components.filter((c) => c.type === "OUTPUT").length}`
          : `${placingType}${circuit.components.length}`;
      addComponent({
        type: placingType as GateType,
        x: snap(world.x),
        y: snap(world.y),
        rotation: 0,
        label,
        value: false,
      });
      // Keep placing if same type (user can click again)
    }
  };

  const handleComponentSelect = (id: string, e: React.MouseEvent) => {
    if (traceActive) return;
    // Suppress click after drag (prevents accidental INPUT toggle)
    if (wasDragging.current) {
      wasDragging.current = false;
      return;
    }
    e.stopPropagation();
    if (selectedTool === "delete") {
      const isWire = circuit.wires.some((w) => w.id === id);
      if (isWire) removeWire(id);
      else removeComponent(id);
      return;
    }
    setSelectedIds([id]);
    setWireInProgress(null);
  };

  const handleInputPinDragStart = (compId: string, pinIndex: number) => {
    if (traceActive) return;
    inputPinDrag.current = { componentId: compId, pinIndex };
  };

  const handleOutputPinClick = (compId: string, pinIndex: number) => {
    if (traceActive) return;
    if (selectedTool === "delete") return;
    setWireInProgress({ fromComponentId: compId, fromPinIndex: pinIndex });
    setSelectedTool("wire");
  };

  const handleInputPinClick = (compId: string, pinIndex: number) => {
    if (traceActive) return;
    if (!wireInProgress) return;
    // Prevent self-connection
    if (wireInProgress.fromComponentId === compId) {
      setWireInProgress(null);
      return;
    }
    // Remove existing wire on this input pin
    const existing = circuit.wires.find(
      (w) => w.to.componentId === compId && w.to.pinIndex === pinIndex
    );
    if (existing) removeWire(existing.id);

    addWire({
      from: { componentId: wireInProgress.fromComponentId, pinIndex: wireInProgress.fromPinIndex },
      to: { componentId: compId, pinIndex },
    });
    setWireInProgress(null);
    setSelectedTool("select");
  };

  const handleWireClick = (wireId: string) => {
    if (traceActive) return;
    if (selectedTool === "delete") {
      removeWire(wireId);
    } else {
      setSelectedIds([wireId]);
    }
  };

  const handleComponentDragStart = (compId: string, e: React.MouseEvent) => {
    if (traceActive) return;
    if (selectedTool !== "select") return;
    e.stopPropagation();
    const comp = circuit.components.find((c) => c.id === compId);
    if (!comp) return;
    const world = svgToWorld(getEventPos(e).x, getEventPos(e).y);
    setDragComponentId(compId);
    setDragOffset({ x: world.x - comp.x, y: world.y - comp.y });
    setSelectedIds([compId]);
  };

  // Compute in-progress wire visual
  const inProgressWireVisual = (() => {
    if (!wireInProgress) return null;
    const fromComp = circuit.components.find((c) => c.id === wireInProgress.fromComponentId);
    if (!fromComp) return null;
    const [fx, fy] = getPinPosition(fromComp, "output", wireInProgress.fromPinIndex);
    return { fromX: fx, fromY: fy, toX: mouseWorld.x, toY: mouseWorld.y };
  })();

  // Compute OUTPUT component signal (from incoming wire)
  const getOutputSignal = (compId: string, compType: string): boolean[] => {
    if (compType !== "OUTPUT") return renderSignalState[compId] ?? [];
    const wire = circuit.wires.find((w) => w.to.componentId === compId);
    if (!wire) return [false];
    return [renderSignalState[wire.from.componentId]?.[wire.from.pinIndex] ?? false];
  };

  // Compute input signal values for a component (needed by display-only shapes)
  const getInputSignals = (compId: string, inputPinCount: number): boolean[] => {
    const signals: boolean[] = [];
    for (let i = 0; i < inputPinCount; i++) {
      const wire = circuit.wires.find(
        (w) => w.to.componentId === compId && w.to.pinIndex === i
      );
      if (wire) {
        signals.push(
          renderSignalState[wire.from.componentId]?.[wire.from.pinIndex] ?? false
        );
      } else {
        signals.push(false);
      }
    }
    return signals;
  };

  const handleQuickAdd = useCallback((gateType: GateType) => {
    if (!quickAdd) return;
    const label =
      gateType === "INPUT"
        ? `A${circuit.components.filter((c) => c.type === "INPUT").length}`
        : gateType === "OUTPUT"
        ? `Y${circuit.components.filter((c) => c.type === "OUTPUT").length}`
        : `${gateType}${circuit.components.length}`;
    const newId = addComponent({
      type: gateType,
      x: snap(quickAdd.worldX),
      y: snap(quickAdd.worldY),
      rotation: 0,
      label,
      value: false,
    });
    // Auto-wire: direction depends on which pin type started the drag
    if (newId) {
      if (quickAdd.pinDirection === "output") {
        // Dragged from output → new component's first input
        addWire({
          from: { componentId: quickAdd.fromComponentId, pinIndex: quickAdd.fromPinIndex },
          to: { componentId: newId, pinIndex: 0 },
        });
      } else {
        // Dragged from input → new component's first output wires to the original input
        addWire({
          from: { componentId: newId, pinIndex: 0 },
          to: { componentId: quickAdd.fromComponentId, pinIndex: quickAdd.fromPinIndex },
        });
      }
    }
    setQuickAdd(null);
  }, [quickAdd, circuit.components, addComponent, addWire]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const gateType = e.dataTransfer.getData("gate-type") as GateType;
    if (!gateType) return;
    const rect = svgRef.current!.getBoundingClientRect();
    const svgX = e.clientX - rect.left;
    const svgY = e.clientY - rect.top;
    const world = svgToWorld(svgX, svgY);
    const label =
      gateType === "INPUT"
        ? `A${circuit.components.filter((c) => c.type === "INPUT").length}`
        : gateType === "OUTPUT"
        ? `Y${circuit.components.filter((c) => c.type === "OUTPUT").length}`
        : `${gateType}${circuit.components.length}`;
    addComponent({
      type: gateType,
      x: snap(world.x),
      y: snap(world.y),
      rotation: 0,
      label,
      value: false,
    });
  }, [svgToWorld, circuit.components, addComponent]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const cursor =
    placingType
      ? "crosshair"
      : selectedTool === "delete"
      ? "not-allowed"
      : wireInProgress
      ? "crosshair"
      : "default";

  return (
    <div className="relative w-full h-full" onDrop={handleDrop} onDragOver={handleDragOver}>
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ cursor, background: "var(--canvas-bg)", userSelect: "none" }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleSvgClick}
      >
        {/* Grid dots */}
        <defs>
          <pattern id="grid" width={GRID * scale} height={GRID * scale} patternUnits="userSpaceOnUse"
            x={pan.x % (GRID * scale)} y={pan.y % (GRID * scale)}>
            <circle cx={GRID * scale / 2} cy={GRID * scale / 2} r="0.8" fill="var(--canvas-grid-dot)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" data-bg="true" />

        {/* World-space transform group */}
        <g transform={`translate(${pan.x},${pan.y}) scale(${scale})`}>
          {/* Wires */}
          <WireRenderer
            wires={lessonActive ? circuit.wires.filter((w) => revealedWireIds.has(w.id)) : circuit.wires}
            circuit={circuit}
            signalState={renderSignalState}
            selectedIds={selectedIds}
            onWireClick={handleWireClick}
            showLabels={showLabels}
            inProgressWire={inProgressWireVisual}
            highlightedWireIds={traceActive ? highlightedWireIds : undefined}
            fadingWireIds={lessonActive ? currentStageNewWireIds : undefined}
          />

          {/* Components */}
          {circuit.components
            .filter((comp) => !lessonActive || revealedComponentIds.has(comp.id))
            .map((comp) => {
            const outputSignals = getOutputSignal(comp.id, comp.type);
            const inSigs = getInputSignals(comp.id, INPUT_COUNTS[comp.type]);
            // For output LED, pass incoming signal as value
            const displayComp =
              comp.type === "OUTPUT"
                ? { ...comp, value: outputSignals[0] ?? false }
                : comp;

            const isFadingIn = lessonActive && currentStageNewCompIds.includes(comp.id);

            return (
              <g
                key={comp.id}
                onMouseDown={(e) => handleComponentDragStart(comp.id, e)}
                style={isFadingIn ? { animation: "lesson-fade-in 0.6s ease-out both" } : undefined}
              >
                <GateComponent
                  component={displayComp}
                  selected={selectedIds.includes(comp.id)}
                  signalOutputs={outputSignals}
                  inputSignals={inSigs}
                  onSelect={handleComponentSelect}
                  onInputPinClick={handleInputPinClick}
                  onOutputPinClick={handleOutputPinClick}
                  onPinDragStart={handleComponentDragStart}
                  onInputPinDragStart={handleInputPinDragStart}
                  onInputPinMouseUp={handleInputPinClick}
                  onToggleInput={traceActive ? undefined : toggleInput}
                  highlighted={traceActive && highlightedComponentIds.includes(comp.id)}
                  dimmed={traceActive && !highlightedComponentIds.includes(comp.id)}
                />
              </g>
            );
          })}

          {/* Bus groupings */}
          <BusRenderer
            busGroups={busGroups}
            circuit={circuit}
            signalState={renderSignalState}
          />

          {/* Exercise ghost component hint */}
          {ghost && (
            <g transform={`translate(${ghost.x},${ghost.y})`} style={{ animation: "trace-pulse 2s ease-in-out infinite" }}>
              <rect
                x="0" y="0" width="80" height="60"
                rx="6" fill="none"
                stroke="#22c55e" strokeWidth="1.5"
                strokeDasharray="4 2" opacity="0.2"
              />
              {ghost.label && (
                <text x="40" y="35" textAnchor="middle" fill="#22c55e" fontSize="10" fontFamily="monospace" opacity="0.3">
                  {ghost.label}
                </text>
              )}
            </g>
          )}

          {/* Exercise highlight rings around labeled components */}
          {exerciseHighlights.length > 0 && circuit.components
            .filter(c => exerciseHighlights.includes(c.label))
            .map(c => (
              <g key={`highlight-${c.id}`} transform={`translate(${c.x},${c.y})`}>
                <rect
                  x="-6" y="-6" width="92" height="72"
                  rx="8" fill="none"
                  stroke="#3b82f6" strokeWidth="2"
                  opacity="0.5"
                  style={{ animation: "trace-pulse 1.5s ease-in-out infinite" }}
                />
              </g>
            ))
          }
        </g>

        {/* Empty state hint */}
        {circuit.components.length === 0 && (
          <text x="50%" y="50%" textAnchor="middle" fill="var(--canvas-hint)" fontSize="18" fontFamily="monospace">
            Select a gate from the sidebar to begin
          </text>
        )}
      </svg>
      <StepControls />
      <ExerciseOverlay />
      <LessonOverlay />

      {/* Zoom controls */}
      <div className="absolute bottom-3 right-3 flex flex-col gap-1 z-10">
        <button
          onClick={() => setScale((s) => Math.min(10, s * 1.3))}
          className="w-8 h-8 rounded-lg bg-zinc-800/80 backdrop-blur border border-white/[0.06] text-zinc-300 hover:text-white hover:bg-zinc-700/80 transition-colors flex items-center justify-center text-sm font-bold"
          title="Zoom in"
        >
          +
        </button>
        <button
          onClick={() => {
            setScale(1);
            setPan({ x: 60, y: 60 });
          }}
          className="w-8 h-8 rounded-lg bg-zinc-800/80 backdrop-blur border border-white/[0.06] text-zinc-400 hover:text-white hover:bg-zinc-700/80 transition-colors flex items-center justify-center text-[10px] font-medium"
          title="Reset zoom"
        >
          {Math.round(scale * 100)}%
        </button>
        <button
          onClick={() => setScale((s) => Math.max(0.1, s / 1.3))}
          className="w-8 h-8 rounded-lg bg-zinc-800/80 backdrop-blur border border-white/[0.06] text-zinc-300 hover:text-white hover:bg-zinc-700/80 transition-colors flex items-center justify-center text-sm font-bold"
          title="Zoom out"
        >
          -
        </button>
      </div>
      {quickAdd && (
        <QuickAddMenu
          x={quickAdd.screenX}
          y={quickAdd.screenY}
          onSelect={handleQuickAdd}
          onClose={() => setQuickAdd(null)}
        />
      )}

      {/* Bus grouping hint */}
      {(() => {
        const selectedInputCount = circuit.components.filter(
          (c) => selectedIds.includes(c.id) && c.type === "INPUT"
        ).length;
        if (selectedInputCount < 2) return null;
        return (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1.5 bg-zinc-800/90 backdrop-blur-xl border border-emerald-500/30 rounded-lg shadow-lg flex items-center gap-2">
            <span className="text-[11px] text-zinc-300 font-medium">
              {selectedInputCount} inputs selected
            </span>
            <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/50 text-emerald-400 border border-emerald-500/30 font-mono font-bold">
              B
            </kbd>
            <span className="text-[11px] text-zinc-400">to group as bus</span>
          </div>
        );
      })()}
    </div>
  );
}

/* ── Quick Add Menu (node picker) ── */
const QUICK_ADD_ITEMS: { type: GateType; label: string; group: string }[] = [
  { type: "AND", label: "AND", group: "Logic" },
  { type: "OR", label: "OR", group: "Logic" },
  { type: "NOT", label: "NOT", group: "Logic" },
  { type: "NAND", label: "NAND", group: "Logic" },
  { type: "NOR", label: "NOR", group: "Logic" },
  { type: "XOR", label: "XOR", group: "Logic" },
  { type: "XNOR", label: "XNOR", group: "Logic" },
  { type: "INPUT", label: "Input", group: "I/O" },
  { type: "OUTPUT", label: "Output", group: "I/O" },
  { type: "MUX_2TO1", label: "2:1 MUX", group: "Component" },
  { type: "FULL_ADDER", label: "Full Adder", group: "Component" },
  { type: "DECODER_2TO4", label: "Decoder", group: "Component" },
];

function QuickAddMenu({
  x,
  y,
  onSelect,
  onClose,
}: {
  x: number;
  y: number;
  onSelect: (type: GateType) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const clickHandler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("keydown", handler);
    document.addEventListener("mousedown", clickHandler);
    return () => {
      document.removeEventListener("keydown", handler);
      document.removeEventListener("mousedown", clickHandler);
    };
  }, [onClose]);

  const filtered = QUICK_ADD_ITEMS.filter(
    (item) =>
      !search ||
      item.label.toLowerCase().includes(search.toLowerCase()) ||
      item.type.toLowerCase().includes(search.toLowerCase())
  );

  const groups = [...new Set(filtered.map((i) => i.group))];

  return (
    <div
      ref={menuRef}
      className="absolute z-50 w-52 bg-zinc-800/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden"
      style={{ left: x, top: y }}
    >
      <div className="p-2 border-b border-white/5">
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search gates..."
          className="w-full bg-zinc-900 text-zinc-200 text-[12px] px-2.5 py-1.5 rounded-lg border border-zinc-700 placeholder-zinc-500 focus:outline-none focus:border-primary"
          onKeyDown={(e) => {
            if (e.key === "Enter" && filtered.length > 0) {
              onSelect(filtered[0].type);
            }
          }}
        />
      </div>
      <div className="max-h-[240px] overflow-y-auto py-1">
        {groups.map((group) => (
          <div key={group}>
            <p className="text-[9px] px-3 pt-1.5 pb-0.5 uppercase tracking-widest font-semibold text-zinc-500">
              {group}
            </p>
            {filtered
              .filter((i) => i.group === group)
              .map((item) => (
                <button
                  key={item.type}
                  onClick={() => onSelect(item.type)}
                  className="w-full px-3 py-1.5 text-left text-[12px] text-zinc-300 hover:bg-zinc-700/60 hover:text-white transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                  {item.label}
                </button>
              ))}
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="px-3 py-3 text-[11px] text-zinc-500 text-center">No matches</p>
        )}
      </div>
    </div>
  );
}
