"use client";

import { GateType, PIN_POSITIONS } from "@/lib/sim-engine";

interface GateBaseProps {
  id: string;
  type: GateType;
  x: number;
  y: number;
  label: string;
  selected: boolean;
  signalOutputs: boolean[];
  onSelect: (id: string, e: React.MouseEvent) => void;
  onInputPinClick: (compId: string, pinIndex: number) => void;
  onOutputPinClick: (compId: string, pinIndex: number) => void;
  children: React.ReactNode; // the gate shape SVG
}

const PIN_RADIUS = 5;
const HIGH = "#83C167";
const LOW = "#4A4A5A";
const BORDER = "#1E1E3A";
const PRIMARY = "#58C4DD";

export default function GateBase({
  id,
  type,
  x,
  y,
  label,
  selected,
  signalOutputs,
  onSelect,
  onInputPinClick,
  onOutputPinClick,
  children,
}: GateBaseProps) {
  const pins = PIN_POSITIONS[type];

  return (
    <g
      transform={`translate(${x},${y})`}
      className="gate-svg cursor-pointer"
      onClick={(e) => onSelect(id, e)}
    >
      {/* Selection ring */}
      {selected && (
        <rect
          x="-4"
          y="-4"
          width="88"
          height="68"
          rx="6"
          fill="none"
          stroke={PRIMARY}
          strokeWidth="2"
          strokeDasharray="4 2"
        />
      )}

      {/* Gate body */}
      {children}

      {/* Input pins */}
      {pins.inputs.map(([px, py], i) => (
        <circle
          key={`in-${i}`}
          cx={px}
          cy={py}
          r={PIN_RADIUS}
          fill={BORDER}
          stroke={LOW}
          strokeWidth="1.5"
          className="cursor-crosshair"
          onClick={(e) => {
            e.stopPropagation();
            onInputPinClick(id, i);
          }}
        />
      ))}

      {/* Output pins */}
      {pins.outputs.map(([px, py], i) => {
        const isHigh = signalOutputs[i] ?? false;
        return (
          <circle
            key={`out-${i}`}
            cx={px}
            cy={py}
            r={PIN_RADIUS}
            fill={isHigh ? HIGH : BORDER}
            stroke={isHigh ? HIGH : LOW}
            strokeWidth="1.5"
            className="cursor-crosshair"
            onClick={(e) => {
              e.stopPropagation();
              onOutputPinClick(id, i);
            }}
          />
        );
      })}

      {/* Label */}
      <text
        x="40"
        y="72"
        textAnchor="middle"
        fill="#8888AA"
        fontSize="9"
        fontFamily="monospace"
      >
        {label}
      </text>
    </g>
  );
}
