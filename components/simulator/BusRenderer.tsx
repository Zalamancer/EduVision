"use client";

import { BusGroup, Circuit, SignalState } from "@/lib/sim-engine/types";

interface BusRendererProps {
  busGroups: BusGroup[];
  circuit: Circuit;
  signalState: SignalState;
}

/** Height of a standard gate body (used for bracket spacing). */
const COMP_HEIGHT = 60;
/** How far left from the component the bracket is drawn. */
const BRACKET_X_OFFSET = 24;
/** Horizontal width of the bracket end-caps. */
const CAP_WIDTH = 6;

export default function BusRenderer({ busGroups, circuit, signalState }: BusRendererProps) {
  return (
    <>
      {busGroups.map((bus) => {
        // Resolve component positions for this bus
        const positions = bus.componentIds
          .map((cid) => circuit.components.find((c) => c.id === cid))
          .filter(Boolean) as { id: string; x: number; y: number; type: string; value?: boolean }[];

        if (positions.length < 2) return null;

        // Compute the current binary value from signal state / component values
        const bits = bus.componentIds.map((cid) => {
          const comp = circuit.components.find((c) => c.id === cid);
          if (!comp) return false;
          if (comp.type === "INPUT") {
            // For inputs, use the component's value (switch state)
            return comp.value ?? false;
          }
          // For outputs or other types, use signal state
          const sig = signalState[cid];
          return sig ? sig[0] ?? false : false;
        });

        const binaryStr = bits.map((b) => (b ? "1" : "0")).join("");
        const decimalVal = parseInt(binaryStr, 2);

        // Bracket geometry: vertical line connecting top of first to bottom of last component
        const xs = positions.map((p) => p.x);
        const ys = positions.map((p) => p.y);
        const minX = Math.min(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);

        const bracketX = minX - BRACKET_X_OFFSET;
        const topY = minY + 10; // align with top of gate body
        const bottomY = maxY + 10 + COMP_HEIGHT - 20; // align with bottom of gate body

        return (
          <g key={bus.id}>
            {/* Vertical line */}
            <line
              x1={bracketX}
              y1={topY}
              x2={bracketX}
              y2={bottomY}
              stroke="#22c55e"
              strokeWidth={1.5}
              strokeLinecap="round"
            />
            {/* Top cap */}
            <line
              x1={bracketX}
              y1={topY}
              x2={bracketX + CAP_WIDTH}
              y2={topY}
              stroke="#22c55e"
              strokeWidth={1.5}
              strokeLinecap="round"
            />
            {/* Bottom cap */}
            <line
              x1={bracketX}
              y1={bottomY}
              x2={bracketX + CAP_WIDTH}
              y2={bottomY}
              stroke="#22c55e"
              strokeWidth={1.5}
              strokeLinecap="round"
            />

            {/* Label + binary value */}
            <text
              x={bracketX - 4}
              y={topY - 10}
              fill="#22c55e"
              fontSize="11"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="start"
            >
              {bus.label} = {binaryStr}
            </text>

            {/* Decimal equivalent */}
            <text
              x={bracketX - 4}
              y={topY - 10 + 13}
              fill="#22c55e"
              fontSize="9"
              fontFamily="monospace"
              opacity={0.7}
              textAnchor="start"
            >
              ({decimalVal})
            </text>
          </g>
        );
      })}
    </>
  );
}
