"use client";

/**
 * Memory / sequential component SVG shapes.
 * Labeled rectangles with clock-triangle markers on CLK pins.
 *
 * D_FLIP_FLOP:    80x60   — D, CLK -> Q, Q'
 * T_FLIP_FLOP:    80x60   — T, CLK -> Q, Q'
 * JK_FLIP_FLOP:   80x70   — J, CLK, K -> Q, Q'
 * SR_FLIP_FLOP:   80x70   — S, CLK, R -> Q, Q'
 * REGISTER:       80x70   — D, CLK, EN -> Q
 * COUNTER:        80x60   — CLK -> Q
 * SHIFT_REGISTER: 100x80  — D, CLK -> Q3, Q2, Q1, Q0
 */

const FILL = "var(--gate-body)";
const STROKE = "var(--signal-high)";
const SW = 1.2;
const STUB = "var(--gate-low)";
const PIN_LABEL = "var(--gate-label)";

/* ── helpers ────────────────────────────────────────────────── */

/** Small right-pointing triangle at a CLK pin (points into the body). */
function ClockTriangle({ x, y }: { x: number; y: number }) {
  return (
    <path
      d={`M${x - 3},${y - 3} L${x},${y} L${x - 3},${y + 3}`}
      fill="none"
      stroke={STROKE}
      strokeWidth={SW}
    />
  );
}

/* ── D Flip-Flop ── 80x60 ─────────────────────────────────── */
// Pins from memory.ts: inputs [[0,15],[0,45]]  outputs [[80,15],[80,45]]

export function DFlipFlopShape({ isHigh }: { isHigh?: boolean }) {
  const outColor = isHigh ? STROKE : STUB;
  return (
    <>
      {/* Input stubs */}
      <line x1="0" y1="15" x2="8" y2="15" stroke={STUB} strokeWidth={SW} />
      <line x1="0" y1="45" x2="8" y2="45" stroke={STUB} strokeWidth={SW} />
      {/* Output stubs */}
      <line x1="72" y1="15" x2="80" y2="15" stroke={outColor} strokeWidth={SW} />
      <line x1="72" y1="45" x2="80" y2="45" stroke={outColor} strokeWidth={SW} />
      {/* Body */}
      <rect x="8" y="2" width="64" height="56" rx={4} fill={FILL} stroke={STROKE} strokeWidth={SW} />
      {/* Clock triangle on CLK pin */}
      <ClockTriangle x={11} y={45} />
      {/* Center label */}
      <text x="40" y="30" textAnchor="middle" dominantBaseline="central" fill={STROKE} fontSize="11" fontFamily="monospace" fontWeight="bold">
        D FF
      </text>
      {/* Pin labels */}
      <text x="14" y="18" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">D</text>
      <text x="14" y="48" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">CLK</text>
      <text x="68" y="18" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="end">Q</text>
      <text x="68" y="48" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="end">Q&apos;</text>
    </>
  );
}

/* ── T Flip-Flop ── 80x60 ─────────────────────────────────── */
// Pins from memory.ts: inputs [[0,15],[0,45]]  outputs [[80,15],[80,45]]

export function TFlipFlopShape({ isHigh }: { isHigh?: boolean }) {
  const outColor = isHigh ? STROKE : STUB;
  return (
    <>
      {/* Input stubs */}
      <line x1="0" y1="15" x2="8" y2="15" stroke={STUB} strokeWidth={SW} />
      <line x1="0" y1="45" x2="8" y2="45" stroke={STUB} strokeWidth={SW} />
      {/* Output stubs */}
      <line x1="72" y1="15" x2="80" y2="15" stroke={outColor} strokeWidth={SW} />
      <line x1="72" y1="45" x2="80" y2="45" stroke={outColor} strokeWidth={SW} />
      {/* Body */}
      <rect x="8" y="2" width="64" height="56" rx={4} fill={FILL} stroke={STROKE} strokeWidth={SW} />
      {/* Clock triangle on CLK pin */}
      <ClockTriangle x={11} y={45} />
      {/* Center label */}
      <text x="40" y="30" textAnchor="middle" dominantBaseline="central" fill={STROKE} fontSize="11" fontFamily="monospace" fontWeight="bold">
        T FF
      </text>
      {/* Pin labels */}
      <text x="14" y="18" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">T</text>
      <text x="14" y="48" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">CLK</text>
      <text x="68" y="18" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="end">Q</text>
      <text x="68" y="48" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="end">Q&apos;</text>
    </>
  );
}

/* ── JK Flip-Flop ── 80x70 ────────────────────────────────── */
// Pins from memory.ts: inputs [[0,10],[0,35],[0,60]]  outputs [[80,20],[80,50]]

export function JKFlipFlopShape({ isHigh }: { isHigh?: boolean }) {
  const outColor = isHigh ? STROKE : STUB;
  return (
    <>
      {/* Input stubs */}
      <line x1="0" y1="10" x2="8" y2="10" stroke={STUB} strokeWidth={SW} />
      <line x1="0" y1="35" x2="8" y2="35" stroke={STUB} strokeWidth={SW} />
      <line x1="0" y1="60" x2="8" y2="60" stroke={STUB} strokeWidth={SW} />
      {/* Output stubs */}
      <line x1="72" y1="20" x2="80" y2="20" stroke={outColor} strokeWidth={SW} />
      <line x1="72" y1="50" x2="80" y2="50" stroke={outColor} strokeWidth={SW} />
      {/* Body */}
      <rect x="8" y="2" width="64" height="66" rx={4} fill={FILL} stroke={STROKE} strokeWidth={SW} />
      {/* Clock triangle on CLK pin */}
      <ClockTriangle x={11} y={35} />
      {/* Center label */}
      <text x="40" y="35" textAnchor="middle" dominantBaseline="central" fill={STROKE} fontSize="11" fontFamily="monospace" fontWeight="bold">
        JK FF
      </text>
      {/* Pin labels */}
      <text x="14" y="13" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">J</text>
      <text x="14" y="38" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">CLK</text>
      <text x="14" y="63" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">K</text>
      <text x="68" y="23" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="end">Q</text>
      <text x="68" y="53" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="end">Q&apos;</text>
    </>
  );
}

/* ── SR Flip-Flop ── 80x70 ────────────────────────────────── */
// Pins from memory.ts: inputs [[0,10],[0,35],[0,60]]  outputs [[80,20],[80,50]]

export function SRFlipFlopShape({ isHigh }: { isHigh?: boolean }) {
  const outColor = isHigh ? STROKE : STUB;
  return (
    <>
      {/* Input stubs */}
      <line x1="0" y1="10" x2="8" y2="10" stroke={STUB} strokeWidth={SW} />
      <line x1="0" y1="35" x2="8" y2="35" stroke={STUB} strokeWidth={SW} />
      <line x1="0" y1="60" x2="8" y2="60" stroke={STUB} strokeWidth={SW} />
      {/* Output stubs */}
      <line x1="72" y1="20" x2="80" y2="20" stroke={outColor} strokeWidth={SW} />
      <line x1="72" y1="50" x2="80" y2="50" stroke={outColor} strokeWidth={SW} />
      {/* Body */}
      <rect x="8" y="2" width="64" height="66" rx={4} fill={FILL} stroke={STROKE} strokeWidth={SW} />
      {/* Clock triangle on CLK pin */}
      <ClockTriangle x={11} y={35} />
      {/* Center label */}
      <text x="40" y="35" textAnchor="middle" dominantBaseline="central" fill={STROKE} fontSize="11" fontFamily="monospace" fontWeight="bold">
        SR FF
      </text>
      {/* Pin labels */}
      <text x="14" y="13" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">S</text>
      <text x="14" y="38" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">CLK</text>
      <text x="14" y="63" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">R</text>
      <text x="68" y="23" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="end">Q</text>
      <text x="68" y="53" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="end">Q&apos;</text>
    </>
  );
}

/* ── Register ── 80x70 ────────────────────────────────────── */
// Pins from memory.ts: inputs [[0,10],[0,35],[0,60]]  outputs [[80,35]]

export function RegisterShape({ isHigh }: { isHigh?: boolean }) {
  const outColor = isHigh ? STROKE : STUB;
  return (
    <>
      {/* Input stubs */}
      <line x1="0" y1="10" x2="8" y2="10" stroke={STUB} strokeWidth={SW} />
      <line x1="0" y1="35" x2="8" y2="35" stroke={STUB} strokeWidth={SW} />
      <line x1="0" y1="60" x2="8" y2="60" stroke={STUB} strokeWidth={SW} />
      {/* Output stub */}
      <line x1="72" y1="35" x2="80" y2="35" stroke={outColor} strokeWidth={SW} />
      {/* Body */}
      <rect x="8" y="2" width="64" height="66" rx={4} fill={FILL} stroke={STROKE} strokeWidth={SW} />
      {/* Clock triangle on CLK pin */}
      <ClockTriangle x={11} y={35} />
      {/* Center label */}
      <text x="40" y="35" textAnchor="middle" dominantBaseline="central" fill={STROKE} fontSize="11" fontFamily="monospace" fontWeight="bold">
        REG
      </text>
      {/* Pin labels */}
      <text x="14" y="13" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">D</text>
      <text x="14" y="38" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">CLK</text>
      <text x="14" y="63" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">EN</text>
      <text x="68" y="38" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="end">Q</text>
    </>
  );
}

/* ── Counter ── 80x60 ─────────────────────────────────────── */
// Pins from memory.ts: inputs [[0,30]]  outputs [[80,30]]

export function CounterShape({ isHigh }: { isHigh?: boolean }) {
  const outColor = isHigh ? STROKE : STUB;
  return (
    <>
      {/* Input stub */}
      <line x1="0" y1="30" x2="8" y2="30" stroke={STUB} strokeWidth={SW} />
      {/* Output stub */}
      <line x1="72" y1="30" x2="80" y2="30" stroke={outColor} strokeWidth={SW} />
      {/* Body */}
      <rect x="8" y="2" width="64" height="56" rx={4} fill={FILL} stroke={STROKE} strokeWidth={SW} />
      {/* Clock triangle on CLK pin */}
      <ClockTriangle x={11} y={30} />
      {/* Center label */}
      <text x="40" y="30" textAnchor="middle" dominantBaseline="central" fill={STROKE} fontSize="11" fontFamily="monospace" fontWeight="bold">
        CTR
      </text>
      {/* Pin labels */}
      <text x="14" y="33" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">CLK</text>
      <text x="68" y="33" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="end">Q</text>
    </>
  );
}

/* ── Shift Register ── 100x80 ─────────────────────────────── */
// Pins from memory.ts: inputs [[0,20],[0,60]]  outputs [[100,10],[100,30],[100,50],[100,70]]

export function ShiftRegisterShape({ isHigh }: { isHigh?: boolean }) {
  const outColor = isHigh ? STROKE : STUB;
  return (
    <>
      {/* Input stubs */}
      <line x1="0" y1="20" x2="8" y2="20" stroke={STUB} strokeWidth={SW} />
      <line x1="0" y1="60" x2="8" y2="60" stroke={STUB} strokeWidth={SW} />
      {/* Output stubs */}
      <line x1="92" y1="10" x2="100" y2="10" stroke={outColor} strokeWidth={SW} />
      <line x1="92" y1="30" x2="100" y2="30" stroke={outColor} strokeWidth={SW} />
      <line x1="92" y1="50" x2="100" y2="50" stroke={outColor} strokeWidth={SW} />
      <line x1="92" y1="70" x2="100" y2="70" stroke={outColor} strokeWidth={SW} />
      {/* Body */}
      <rect x="8" y="2" width="84" height="76" rx={4} fill={FILL} stroke={STROKE} strokeWidth={SW} />
      {/* Clock triangle on CLK pin */}
      <ClockTriangle x={11} y={60} />
      {/* Center label */}
      <text x="50" y="40" textAnchor="middle" dominantBaseline="central" fill={STROKE} fontSize="10" fontFamily="monospace" fontWeight="bold">
        SHIFT
      </text>
      <text x="50" y="52" textAnchor="middle" dominantBaseline="central" fill={STROKE} fontSize="10" fontFamily="monospace" fontWeight="bold">
        REG
      </text>
      {/* Pin labels */}
      <text x="14" y="23" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">D</text>
      <text x="14" y="63" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">CLK</text>
      <text x="88" y="13" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="end">Q3</text>
      <text x="88" y="33" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="end">Q2</text>
      <text x="88" y="53" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="end">Q1</text>
      <text x="88" y="73" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="end">Q0</text>
    </>
  );
}
