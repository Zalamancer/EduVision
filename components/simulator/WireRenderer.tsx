"use client";

import { Wire, Circuit, SignalState } from "@/lib/sim-engine/types";
import { getPinPosition } from "@/lib/sim-engine/gates";

interface WireRendererProps {
  wires: Wire[];
  circuit: Circuit;
  signalState: SignalState;
  selectedIds: string[];
  onWireClick: (wireId: string) => void;
  /** In-progress wire: from pin to current mouse position */
  inProgressWire?: {
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
  } | null;
}

function bezierPath(x1: number, y1: number, x2: number, y2: number): string {
  const cx = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`;
}

export default function WireRenderer({
  wires,
  circuit,
  signalState,
  selectedIds,
  onWireClick,
  inProgressWire,
}: WireRendererProps) {
  const compMap = new Map(circuit.components.map((c) => [c.id, c]));

  return (
    <g>
      {wires.map((wire) => {
        const fromComp = compMap.get(wire.from.componentId);
        const toComp = compMap.get(wire.to.componentId);
        if (!fromComp || !toComp) return null;

        const [x1, y1] = getPinPosition(fromComp, "output", wire.from.pinIndex);
        const [x2, y2] = getPinPosition(toComp, "input", wire.to.pinIndex);

        const fromState = signalState[wire.from.componentId];
        const isHigh = fromState?.[wire.from.pinIndex] ?? false;
        const isSelected = selectedIds.includes(wire.id);

        const color = isHigh ? "#83C167" : "#4A4A5A";

        return (
          <g key={wire.id}>
            {/* Click target (wide invisible) */}
            <path
              d={bezierPath(x1, y1, x2, y2)}
              fill="none"
              stroke="transparent"
              strokeWidth="12"
              className="cursor-pointer"
              onClick={() => onWireClick(wire.id)}
            />
            {/* Visible wire */}
            <path
              d={bezierPath(x1, y1, x2, y2)}
              fill="none"
              stroke={isSelected ? "#58C4DD" : color}
              strokeWidth={isSelected ? 2.5 : 2}
              strokeDasharray={isSelected ? "6 3" : undefined}
            />
          </g>
        );
      })}

      {/* In-progress wire */}
      {inProgressWire && (
        <path
          d={bezierPath(
            inProgressWire.fromX,
            inProgressWire.fromY,
            inProgressWire.toX,
            inProgressWire.toY
          )}
          fill="none"
          stroke="#58C4DD"
          strokeWidth="2"
          strokeDasharray="5 3"
          opacity="0.7"
        />
      )}
    </g>
  );
}
