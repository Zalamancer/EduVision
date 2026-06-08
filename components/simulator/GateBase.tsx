"use client";

import { GateType, PIN_POSITIONS } from "@/lib/sim-engine";

/** Non-standard bounding boxes — entries only needed for sizes != default 80x60 */
const BOUNDING_BOX: Partial<Record<GateType, { w: number; h: number }>> = {
  // Plexers
  MUX_4TO1:          { w: 100, h: 100 },
  MUX_8TO1:          { w: 100, h: 180 },
  DEMUX_1TO4:        { w: 100, h: 100 },
  DECODER_2TO4:      { w: 100, h: 80 },
  PRIORITY_ENCODER:  { w: 100, h: 100 },
  // Arithmetic
  COMPARATOR:        { w: 80, h: 80 },
  // Memory
  JK_FLIP_FLOP:      { w: 80, h: 70 },
  SR_FLIP_FLOP:      { w: 80, h: 70 },
  REGISTER:          { w: 80, h: 70 },
  SHIFT_REGISTER:    { w: 100, h: 80 },
  // Wiring
  CLOCK:             { w: 60, h: 60 },
  CONSTANT:          { w: 60, h: 40 },
  POWER:             { w: 40, h: 40 },
  GROUND:            { w: 40, h: 40 },
  PROBE:             { w: 40, h: 40 },
  TUNNEL:            { w: 60, h: 30 },
  SPLITTER:          { w: 40, h: 40 },
  // I/O
  BUTTON:            { w: 60, h: 60 },
  SEVEN_SEGMENT:     { w: 60, h: 80 },
  HEX_DISPLAY:       { w: 60, h: 60 },
  LED_MATRIX:        { w: 60, h: 60 },
};

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
  onPinDragStart: (compId: string, e: React.MouseEvent) => void;
  onInputPinDragStart?: (compId: string, pinIndex: number) => void;
  onInputPinMouseUp?: (compId: string, pinIndex: number) => void;
  children: React.ReactNode;
  highlighted?: boolean;
  dimmed?: boolean;
}

const PIN_RADIUS = 5;
const HIGH = "var(--signal-high)";
const LOW = "var(--gate-low)";
const BORDER = "var(--gate-border)";
const PRIMARY = "var(--signal-high)";

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
  onPinDragStart,
  onInputPinDragStart,
  onInputPinMouseUp,
  children,
  highlighted,
  dimmed,
}: GateBaseProps) {
  const pins = PIN_POSITIONS[type];
  const box = BOUNDING_BOX[type] ?? { w: 80, h: 60 };

  return (
    <g
      transform={`translate(${x},${y})`}
      className="gate-svg cursor-pointer"
      onClick={(e) => onSelect(id, e)}
      opacity={dimmed ? 0.35 : 1}
    >
      {/* Trace highlight glow ring */}
      {highlighted && (
        <rect
          x="-6"
          y="-6"
          width={box.w + 12}
          height={box.h + 12}
          rx="8"
          fill="none"
          stroke="var(--signal-high)"
          strokeWidth="2"
          opacity="0.6"
          style={{ animation: "trace-pulse 1.5s ease-in-out infinite" }}
        />
      )}

      {/* Gate body — selected gates get white/black stroke instead of green */}
      <g style={selected ? { '--signal-high': 'var(--gate-selected-stroke)' } as React.CSSProperties : undefined}>
        {children}
      </g>

      {/* Input pins — mouseDown starts drag tracking, click completes wire */}
      {pins.inputs.map(([px, py], i) => (
        <circle
          key={`in-${i}`}
          cx={px}
          cy={py}
          r={PIN_RADIUS}
          fill={BORDER}
          stroke={LOW}
          strokeWidth="1.5"
          className="cursor-pointer"
          onMouseDown={(e) => {
            e.stopPropagation();
            onInputPinDragStart?.(id, i);
          }}
          onClick={(e) => {
            e.stopPropagation();
            onInputPinClick(id, i);
          }}
          onMouseUp={(e) => {
            e.stopPropagation();
            onInputPinMouseUp?.(id, i);
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
            className="cursor-pointer"
            onMouseDown={(e) => {
              e.stopPropagation();
              onOutputPinClick(id, i);
            }}
          />
        );
      })}

      {/* Label */}
      <text
        x={box.w / 2}
        y={box.h + 12}
        textAnchor="middle"
        fill="var(--gate-label)"
        fontSize="9"
        fontFamily="monospace"
      >
        {label}
      </text>
    </g>
  );
}
