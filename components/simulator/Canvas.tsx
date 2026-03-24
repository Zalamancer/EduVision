"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useCircuitStore } from "@/lib/stores/circuit-store";
import { getPinPosition } from "@/lib/sim-engine/gates";
import { GateType } from "@/lib/sim-engine/types";
import GateComponent from "./GateComponent";
import WireRenderer from "./WireRenderer";
import { nanoid } from "nanoid";

const GRID = 20;
const snap = (v: number) => Math.round(v / GRID) * GRID;

interface MousePos {
  x: number;
  y: number;
}

export default function Canvas() {
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
  } = useCircuitStore();

  const [pan, setPan] = useState({ x: 60, y: 60 });
  const [scale, setScale] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [dragComponentId, setDragComponentId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [mouseWorld, setMouseWorld] = useState<MousePos>({ x: 0, y: 0 });

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
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedIds, circuit.wires, removeComponent, removeWire, setSelectedIds, undo, redo, setWireInProgress, setPlacingType, setSelectedTool]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const { x, y } = getEventPos(e);
    const delta = -e.deltaY * 0.001;
    const newScale = Math.max(0.2, Math.min(3, scale + delta * scale));
    const scaleChange = newScale / scale;
    setPan((p) => ({
      x: x - (x - p.x) * scaleChange,
      y: y - (y - p.y) * scaleChange,
    }));
    setScale(newScale);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
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
      moveComponent(dragComponentId, snap(world.x - dragOffset.x), snap(world.y - dragOffset.y));
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDragComponentId(null);
  };

  const handleSvgClick = (e: React.MouseEvent) => {
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

  const handleOutputPinClick = (compId: string, pinIndex: number) => {
    if (selectedTool === "delete") return;
    setWireInProgress({ fromComponentId: compId, fromPinIndex: pinIndex });
    setSelectedTool("wire");
  };

  const handleInputPinClick = (compId: string, pinIndex: number) => {
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
    if (selectedTool === "delete") {
      removeWire(wireId);
    } else {
      setSelectedIds([wireId]);
    }
  };

  const handleComponentDragStart = (compId: string, e: React.MouseEvent) => {
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
    if (compType !== "OUTPUT") return signalState[compId] ?? [];
    const wire = circuit.wires.find((w) => w.to.componentId === compId);
    if (!wire) return [false];
    return [signalState[wire.from.componentId]?.[wire.from.pinIndex] ?? false];
  };

  const cursor =
    placingType
      ? "crosshair"
      : selectedTool === "delete"
      ? "not-allowed"
      : wireInProgress
      ? "crosshair"
      : "default";

  return (
    <svg
      ref={svgRef}
      className="w-full h-full"
      style={{ cursor, background: "#0A0A1A", userSelect: "none" }}
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
          <circle cx={GRID * scale / 2} cy={GRID * scale / 2} r="0.8" fill="#1E1E3A" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" data-bg="true" />

      {/* World-space transform group */}
      <g transform={`translate(${pan.x},${pan.y}) scale(${scale})`}>
        {/* Wires */}
        <WireRenderer
          wires={circuit.wires}
          circuit={circuit}
          signalState={signalState}
          selectedIds={selectedIds}
          onWireClick={handleWireClick}
          inProgressWire={inProgressWireVisual}
        />

        {/* Components */}
        {circuit.components.map((comp) => {
          const outputSignals = getOutputSignal(comp.id, comp.type);
          // For output LED, pass incoming signal as value
          const displayComp =
            comp.type === "OUTPUT"
              ? { ...comp, value: outputSignals[0] ?? false }
              : comp;

          return (
            <g
              key={comp.id}
              onMouseDown={(e) => handleComponentDragStart(comp.id, e)}
            >
              <GateComponent
                component={displayComp}
                selected={selectedIds.includes(comp.id)}
                signalOutputs={outputSignals}
                onSelect={handleComponentSelect}
                onInputPinClick={handleInputPinClick}
                onOutputPinClick={handleOutputPinClick}
                onToggleInput={toggleInput}
              />
            </g>
          );
        })}
      </g>

      {/* Empty state hint */}
      {circuit.components.length === 0 && (
        <text x="50%" y="50%" textAnchor="middle" fill="#1E1E3A" fontSize="18" fontFamily="monospace">
          Select a gate from the sidebar to begin
        </text>
      )}
    </svg>
  );
}
