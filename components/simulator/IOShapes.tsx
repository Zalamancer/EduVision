"use client";

/**
 * I/O component SVG shapes — buttons, displays, matrices.
 *
 * BUTTON:        60x60  — momentary push button
 * SEVEN_SEGMENT: 60x80  — 7-segment display
 * HEX_DISPLAY:   60x60  — hex digit display
 * LED_MATRIX:    60x60  — 2x2 LED grid
 */

const FILL = "var(--gate-body)";
const STROKE = "var(--signal-high)";
const SW = 1.2;
const STUB = "var(--gate-low)";
const PIN_LABEL = "var(--gate-label)";

/* ── Button ── 60x60 ──────────────────────────────────────── */
// Pins from io.ts: outputs [[60,30]]

export function ButtonShape({ isHigh, value }: { isHigh?: boolean; value?: boolean }) {
  const pressed = value ?? false;
  const outColor = isHigh ? STROKE : STUB;
  const btnColor = pressed ? STROKE : STUB;
  return (
    <>
      {/* Output stub */}
      <line x1="52" y1="30" x2="60" y2="30" stroke={outColor} strokeWidth={SW} />
      {/* Outer body */}
      <rect x="4" y="4" width="48" height="52" rx={4} fill={FILL} stroke={STROKE} strokeWidth={SW} />
      {/* Button housing (inner square) */}
      <rect x="14" y="14" width="28" height="28" rx={3} fill="none" stroke={STUB} strokeWidth={1} />
      {/* Button circle (push indicator) */}
      <circle
        cx="28"
        cy="28"
        r={pressed ? 10 : 8}
        fill={pressed ? STROKE : FILL}
        stroke={btnColor}
        strokeWidth={1.5}
      />
      {/* Label */}
      <text x="28" y="50" textAnchor="middle" dominantBaseline="central" fill={STROKE} fontSize="8" fontFamily="monospace" fontWeight="bold">
        BTN
      </text>
    </>
  );
}

/* ── Seven-Segment Display ── 60x80 ───────────────────────── */
// Pins from io.ts: inputs [[0,8],[0,18],[0,28],[0,38],[0,48],[0,58],[0,68]]
// Segment mapping: a=top, b=upper-right, c=lower-right, d=bottom, e=lower-left, f=upper-left, g=middle

export function SevenSegmentShape({
  isHigh,
  inputs,
}: {
  isHigh?: boolean;
  inputs?: boolean[];
}) {
  const seg = inputs ?? [false, false, false, false, false, false, false];
  const on = (i: number) => (seg[i] ? STROKE : "#27272a");

  // Segment geometry within the display area (body inset)
  // Display area: roughly x 20..50, y 12..68
  const segW = 16; // horizontal segment length
  const segH = 16; // vertical segment length
  const cx = 35;   // center x of digit
  const topY = 16;
  const midY = 38;
  const botY = 60;
  const lx = cx - segW / 2 - 1; // left x for verticals
  const rx = cx + segW / 2 + 1; // right x for verticals

  return (
    <>
      {/* Input stubs */}
      {[8, 18, 28, 38, 48, 58, 68].map((y, i) => (
        <line key={i} x1="0" y1={y} x2="8" y2={y} stroke={STUB} strokeWidth={SW} />
      ))}
      {/* Body */}
      <rect x="8" y="2" width="48" height="76" rx={4} fill={FILL} stroke={STROKE} strokeWidth={SW} />
      {/* Segment a — top horizontal */}
      <line x1={cx - segW / 2} y1={topY} x2={cx + segW / 2} y2={topY} stroke={on(0)} strokeWidth={2.5} strokeLinecap="round" />
      {/* Segment b — upper right vertical */}
      <line x1={rx} y1={topY + 2} x2={rx} y2={midY - 2} stroke={on(1)} strokeWidth={2.5} strokeLinecap="round" />
      {/* Segment c — lower right vertical */}
      <line x1={rx} y1={midY + 2} x2={rx} y2={botY - 2} stroke={on(2)} strokeWidth={2.5} strokeLinecap="round" />
      {/* Segment d — bottom horizontal */}
      <line x1={cx - segW / 2} y1={botY} x2={cx + segW / 2} y2={botY} stroke={on(3)} strokeWidth={2.5} strokeLinecap="round" />
      {/* Segment e — lower left vertical */}
      <line x1={lx} y1={midY + 2} x2={lx} y2={botY - 2} stroke={on(4)} strokeWidth={2.5} strokeLinecap="round" />
      {/* Segment f — upper left vertical */}
      <line x1={lx} y1={topY + 2} x2={lx} y2={midY - 2} stroke={on(5)} strokeWidth={2.5} strokeLinecap="round" />
      {/* Segment g — middle horizontal */}
      <line x1={cx - segW / 2} y1={midY} x2={cx + segW / 2} y2={midY} stroke={on(6)} strokeWidth={2.5} strokeLinecap="round" />
      {/* Pin labels */}
      <text x="12" y="11" fill={PIN_LABEL} fontSize="6" fontFamily="monospace">a</text>
      <text x="12" y="21" fill={PIN_LABEL} fontSize="6" fontFamily="monospace">b</text>
      <text x="12" y="31" fill={PIN_LABEL} fontSize="6" fontFamily="monospace">c</text>
      <text x="12" y="41" fill={PIN_LABEL} fontSize="6" fontFamily="monospace">d</text>
      <text x="12" y="51" fill={PIN_LABEL} fontSize="6" fontFamily="monospace">e</text>
      <text x="12" y="61" fill={PIN_LABEL} fontSize="6" fontFamily="monospace">f</text>
      <text x="12" y="71" fill={PIN_LABEL} fontSize="6" fontFamily="monospace">g</text>
    </>
  );
}

/* ── Hex Display ── 60x60 ─────────────────────────────────── */
// Pins from io.ts: inputs [[0,8],[0,22],[0,38],[0,52]]

const HEX_CHARS = "0123456789ABCDEF";

export function HexDisplayShape({
  isHigh,
  inputs,
}: {
  isHigh?: boolean;
  inputs?: boolean[];
}) {
  const bits = inputs ?? [false, false, false, false];
  const val = (bits[0] ? 8 : 0) + (bits[1] ? 4 : 0) + (bits[2] ? 2 : 0) + (bits[3] ? 1 : 0);
  const hexChar = HEX_CHARS[val];
  const active = bits.some(Boolean);

  return (
    <>
      {/* Input stubs */}
      {[8, 22, 38, 52].map((y, i) => (
        <line key={i} x1="0" y1={y} x2="8" y2={y} stroke={STUB} strokeWidth={SW} />
      ))}
      {/* Body */}
      <rect x="8" y="2" width="48" height="56" rx={4} fill={FILL} stroke={STROKE} strokeWidth={SW} />
      {/* Display area */}
      <rect x="22" y="10" width="24" height="32" rx={2} fill="#09090b" stroke="#27272a" strokeWidth={0.8} />
      {/* Hex digit */}
      <text
        x="34"
        y="26"
        textAnchor="middle"
        dominantBaseline="central"
        fill={active ? STROKE : "#27272a"}
        fontSize="20"
        fontFamily="monospace"
        fontWeight="bold"
      >
        {hexChar}
      </text>
      {/* Label */}
      <text x="32" y="52" textAnchor="middle" dominantBaseline="central" fill={STROKE} fontSize="8" fontFamily="monospace" fontWeight="bold">
        HEX
      </text>
      {/* Pin labels */}
      <text x="12" y="11" fill={PIN_LABEL} fontSize="6" fontFamily="monospace">D3</text>
      <text x="12" y="25" fill={PIN_LABEL} fontSize="6" fontFamily="monospace">D2</text>
      <text x="12" y="41" fill={PIN_LABEL} fontSize="6" fontFamily="monospace">D1</text>
      <text x="12" y="55" fill={PIN_LABEL} fontSize="6" fontFamily="monospace">D0</text>
    </>
  );
}

/* ── LED Matrix ── 60x60 ──────────────────────────────────── */
// Pins from io.ts: inputs [[0,8],[0,22],[0,38],[0,52]]
// 2x2 grid: LED0=top-left, LED1=top-right, LED2=bottom-left, LED3=bottom-right

export function LEDMatrixShape({
  isHigh,
  inputs,
}: {
  isHigh?: boolean;
  inputs?: boolean[];
}) {
  const leds = inputs ?? [false, false, false, false];

  const dotColor = (on: boolean) => (on ? STROKE : "#27272a");
  // Grid positions: 2x2 centered in the body
  const grid: [number, number][] = [
    [24, 18], // LED 0 — top-left
    [42, 18], // LED 1 — top-right
    [24, 36], // LED 2 — bottom-left
    [42, 36], // LED 3 — bottom-right
  ];

  return (
    <>
      {/* Input stubs */}
      {[8, 22, 38, 52].map((y, i) => (
        <line key={i} x1="0" y1={y} x2="8" y2={y} stroke={STUB} strokeWidth={SW} />
      ))}
      {/* Body */}
      <rect x="8" y="2" width="48" height="56" rx={4} fill={FILL} stroke={STROKE} strokeWidth={SW} />
      {/* LED dots */}
      {grid.map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r="6"
          fill={leds[i] ? STROKE : "#09090b"}
          stroke={dotColor(leds[i])}
          strokeWidth={1}
          opacity={leds[i] ? 1 : 0.4}
        />
      ))}
      {/* Label */}
      <text x="32" y="52" textAnchor="middle" dominantBaseline="central" fill={STROKE} fontSize="7" fontFamily="monospace" fontWeight="bold">
        MATRIX
      </text>
      {/* Pin labels */}
      <text x="12" y="11" fill={PIN_LABEL} fontSize="6" fontFamily="monospace">L0</text>
      <text x="12" y="25" fill={PIN_LABEL} fontSize="6" fontFamily="monospace">L1</text>
      <text x="12" y="41" fill={PIN_LABEL} fontSize="6" fontFamily="monospace">L2</text>
      <text x="12" y="55" fill={PIN_LABEL} fontSize="6" fontFamily="monospace">L3</text>
    </>
  );
}
