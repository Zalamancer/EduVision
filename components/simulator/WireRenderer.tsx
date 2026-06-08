"use client";

import { Wire, Circuit, SignalState } from "@/lib/sim-engine/types";
import { getPinPosition } from "@/lib/sim-engine/gates";

interface WireRendererProps {
  wires: Wire[];
  circuit: Circuit;
  signalState: SignalState;
  selectedIds: string[];
  onWireClick: (wireId: string) => void;
  showLabels?: boolean;
  inProgressWire?: {
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
  } | null;
  highlightedWireIds?: string[];
  fadingWireIds?: string[];
}

/** Manhattan routing — straight horizontal/vertical segments with right-angle turns */
function manhattanPath(x1: number, y1: number, x2: number, y2: number): string {
  const midX = (x1 + x2) / 2;
  return `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`;
}

export default function WireRenderer({
  wires,
  circuit,
  signalState,
  selectedIds,
  onWireClick,
  showLabels,
  inProgressWire,
  highlightedWireIds,
  fadingWireIds,
}: WireRendererProps) {
  const traceActive = highlightedWireIds != null && highlightedWireIds.length > 0;
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
        const isHighlighted = traceActive && highlightedWireIds!.includes(wire.id);
        const isUnresolved = traceActive && !fromState;

        const color = isUnresolved ? "var(--gate-label)" : isHigh ? "var(--signal-high)" : "var(--gate-low)";
        const d = manhattanPath(x1, y1, x2, y2);

        // In trace mode: highlighted wires are full opacity + thicker, others are dimmed
        const wireOpacity = traceActive ? (isHighlighted ? 1 : 0.25) : 1;
        const wireWidth = isSelected ? 2.5 : isHighlighted ? 3 : 2;
        const wireDash = isSelected ? "6 3" : isUnresolved ? "4 4" : undefined;

        const isFading = fadingWireIds?.includes(wire.id);

        return (
          <g key={wire.id} opacity={wireOpacity} style={isFading ? { animation: "lesson-fade-in 0.6s ease-out both" } : undefined}>
            {/* Click target (wide invisible) */}
            <path
              d={d}
              fill="none"
              stroke="transparent"
              strokeWidth="12"
              className="cursor-pointer"
              onClick={() => onWireClick(wire.id)}
            />
            {/* Visible wire */}
            <path
              d={d}
              fill="none"
              stroke={isSelected ? "var(--signal-high)" : color}
              strokeWidth={wireWidth}
              strokeDasharray={wireDash}
              strokeLinejoin="round"
            />
            {showLabels && (() => {
              const labelX = (x1 + x2) / 2;
              const labelY = (y1 + y2) / 2;
              return (
                <g>
                  <rect x={labelX - 8} y={labelY - 7} width={16} height={14} rx={4}
                    fill={isHigh ? "var(--signal-high-bg)" : "var(--wire-label-bg)"} />
                  <text x={labelX} y={labelY + 3.5} textAnchor="middle"
                    fill={isHigh ? "var(--signal-high-text)" : "var(--gate-label)"}
                    fontSize="9" fontFamily="monospace" fontWeight="bold">
                    {isHigh ? "1" : "0"}
                  </text>
                </g>
              );
            })()}
          </g>
        );
      })}

      {/* In-progress wire */}
      {inProgressWire && (
        <>
          <path
            d={manhattanPath(
              inProgressWire.fromX,
              inProgressWire.fromY,
              inProgressWire.toX,
              inProgressWire.toY
            )}
            fill="none"
            stroke="var(--signal-high)"
            strokeWidth="2"
            strokeDasharray="5 3"
            strokeLinejoin="round"
            opacity="0.7"
          />
          {showLabels && (() => {
            const labelX = (inProgressWire.fromX + inProgressWire.toX) / 2;
            const labelY = (inProgressWire.fromY + inProgressWire.toY) / 2;
            return (
              <g opacity="0.7">
                <rect x={labelX - 8} y={labelY - 7} width={16} height={14} rx={4}
                  fill="var(--wire-label-bg)" />
                <text x={labelX} y={labelY + 3.5} textAnchor="middle"
                  fill="var(--gate-label)"
                  fontSize="9" fontFamily="monospace" fontWeight="bold">
                  ?
                </text>
              </g>
            );
          })()}
        </>
      )}
    </g>
  );
}
