"use client";

/**
 * Wiring component SVG shapes — sources, probes, tunnels, splitters.
 *
 * CLOCK:     60x60  — square-wave source
 * CONSTANT:  60x40  — fixed HIGH/LOW
 * POWER:     40x40  — Vcc source (output bottom)
 * GROUND:    40x40  — GND sink (output bottom)
 * PROBE:     40x40  — signal observer
 * TUNNEL:    60x30  — named tunnel arrow
 * SPLITTER:  40x40  — fan-out
 */

const FILL = "var(--gate-body)";
const STROKE = "var(--signal-high)";
const SW = 1.2;
const STUB = "var(--gate-low)";
const PIN_LABEL = "var(--gate-label)";

/* ── Clock ── 60x60 ───────────────────────────────────────── */
// Pins from wiring.ts: outputs [[60,30]]

export function ClockShape({ isHigh }: { isHigh?: boolean }) {
  const outColor = isHigh ? STROKE : STUB;
  return (
    <>
      {/* Output stub */}
      <line x1="52" y1="30" x2="60" y2="30" stroke={outColor} strokeWidth={SW} />
      {/* Body */}
      <rect x="4" y="4" width="48" height="52" rx={4} fill={FILL} stroke={STROKE} strokeWidth={SW} />
      {/* Square wave symbol */}
      <path
        d="M14,38 L14,22 L22,22 L22,38 L30,38 L30,22 L38,22 L38,38"
        fill="none"
        stroke={outColor}
        strokeWidth={1.5}
      />
      {/* Label */}
      <text x="28" y="50" textAnchor="middle" dominantBaseline="central" fill={STROKE} fontSize="9" fontFamily="monospace" fontWeight="bold">
        CLK
      </text>
    </>
  );
}

/* ── Constant ── 60x40 ────────────────────────────────────── */
// Pins from wiring.ts: outputs [[60,20]]

export function ConstantShape({ isHigh, value }: { isHigh?: boolean; value?: boolean }) {
  const v = value ?? true;
  const outColor = isHigh ? STROKE : STUB;
  return (
    <>
      {/* Output stub */}
      <line x1="52" y1="20" x2="60" y2="20" stroke={outColor} strokeWidth={SW} />
      {/* Body */}
      <rect x="4" y="4" width="48" height="32" rx={4} fill={FILL} stroke={STROKE} strokeWidth={SW} />
      {/* Value */}
      <text x="28" y="20" textAnchor="middle" dominantBaseline="central" fill={STROKE} fontSize="14" fontFamily="monospace" fontWeight="bold">
        {v ? "1" : "0"}
      </text>
    </>
  );
}

/* ── Power (Vcc) ── 40x40 ─────────────────────────────────── */
// Pins from wiring.ts: outputs [[20,40]]

export function PowerShape({ isHigh }: { isHigh?: boolean }) {
  const outColor = isHigh ? STROKE : STUB;
  return (
    <>
      {/* Output stub (bottom) */}
      <line x1="20" y1="32" x2="20" y2="40" stroke={outColor} strokeWidth={SW} />
      {/* Body */}
      <rect x="4" y="4" width="32" height="28" rx={4} fill={FILL} stroke={STROKE} strokeWidth={SW} />
      {/* Up-arrow symbol */}
      <path
        d="M20,10 L20,26"
        fill="none"
        stroke={STROKE}
        strokeWidth={1.5}
      />
      <path
        d="M15,16 L20,10 L25,16"
        fill="none"
        stroke={STROKE}
        strokeWidth={1.5}
      />
      {/* Label */}
      <text x="20" y="1" textAnchor="middle" dominantBaseline="auto" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">
        VCC
      </text>
    </>
  );
}

/* ── Ground ── 40x40 ──────────────────────────────────────── */
// Pins from wiring.ts: outputs [[20,40]]  (engine models GND as output=LOW)

export function GroundShape({ isHigh }: { isHigh?: boolean }) {
  const _outColor = isHigh ? STROKE : STUB;
  return (
    <>
      {/* Output stub (bottom) */}
      <line x1="20" y1="32" x2="20" y2="40" stroke={STUB} strokeWidth={SW} />
      {/* Body */}
      <rect x="4" y="4" width="32" height="28" rx={4} fill={FILL} stroke={STROKE} strokeWidth={SW} />
      {/* Ground symbol — three horizontal lines, decreasing width */}
      <line x1="20" y1="10" x2="20" y2="16" stroke={STUB} strokeWidth={1.5} />
      <line x1="11" y1="16" x2="29" y2="16" stroke={STUB} strokeWidth={1.5} />
      <line x1="14" y1="21" x2="26" y2="21" stroke={STUB} strokeWidth={1.5} />
      <line x1="17" y1="26" x2="23" y2="26" stroke={STUB} strokeWidth={1.5} />
      {/* Label */}
      <text x="20" y="1" textAnchor="middle" dominantBaseline="auto" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">
        GND
      </text>
    </>
  );
}

/* ── Probe ── 40x40 ───────────────────────────────────────── */
// Pins from wiring.ts: inputs [[0,20]]

export function ProbeShape({ isHigh }: { isHigh?: boolean }) {
  const inColor = isHigh ? STROKE : STUB;
  return (
    <>
      {/* Input stub */}
      <line x1="0" y1="20" x2="6" y2="20" stroke={inColor} strokeWidth={SW} />
      {/* Body */}
      <rect x="6" y="4" width="30" height="32" rx={4} fill={FILL} stroke={STROKE} strokeWidth={SW} />
      {/* Eye icon — ellipse + circle pupil */}
      <ellipse cx="21" cy="18" rx="9" ry="5" fill="none" stroke={inColor} strokeWidth={1} />
      <circle cx="21" cy="18" r="2.5" fill={inColor} />
      {/* Label */}
      <text x="21" y="32" textAnchor="middle" dominantBaseline="central" fill={STROKE} fontSize="7" fontFamily="monospace" fontWeight="bold">
        PROBE
      </text>
    </>
  );
}

/* ── Tunnel ── 60x30 ──────────────────────────────────────── */
// Pins from wiring.ts: inputs [[0,15]]  outputs [[60,15]]

export function TunnelShape({ isHigh, label }: { isHigh?: boolean; label?: string }) {
  const wireColor = isHigh ? STROKE : STUB;
  return (
    <>
      {/* Input stub */}
      <line x1="0" y1="15" x2="4" y2="15" stroke={wireColor} strokeWidth={SW} />
      {/* Output stub */}
      <line x1="56" y1="15" x2="60" y2="15" stroke={wireColor} strokeWidth={SW} />
      {/* Arrow body — pentagon shape */}
      <path
        d="M4,3 L46,3 L56,15 L46,27 L4,27 Z"
        fill={FILL}
        stroke={STROKE}
        strokeWidth={SW}
      />
      {/* Label text */}
      <text x="28" y="15" textAnchor="middle" dominantBaseline="central" fill={STROKE} fontSize="9" fontFamily="monospace" fontWeight="bold">
        {label ?? "TUN"}
      </text>
    </>
  );
}

/* ── Splitter ── 40x40 ────────────────────────────────────── */
// Pins from wiring.ts: inputs [[0,20]]  outputs [[40,10],[40,30]]

export function SplitterShape({ isHigh }: { isHigh?: boolean }) {
  const wireColor = isHigh ? STROKE : STUB;
  return (
    <>
      {/* Input stub */}
      <line x1="0" y1="20" x2="8" y2="20" stroke={wireColor} strokeWidth={SW} />
      {/* Output stubs */}
      <line x1="32" y1="10" x2="40" y2="10" stroke={wireColor} strokeWidth={SW} />
      <line x1="32" y1="30" x2="40" y2="30" stroke={wireColor} strokeWidth={SW} />
      {/* Body */}
      <rect x="8" y="2" width="24" height="36" rx={3} fill={FILL} stroke={STROKE} strokeWidth={SW} />
      {/* Fan-out lines inside body */}
      <line x1="14" y1="20" x2="20" y2="20" stroke={wireColor} strokeWidth={1} />
      <line x1="20" y1="20" x2="26" y2="10" stroke={wireColor} strokeWidth={1} />
      <line x1="20" y1="20" x2="26" y2="30" stroke={wireColor} strokeWidth={1} />
      {/* Dot at junction */}
      <circle cx="20" cy="20" r="1.5" fill={wireColor} />
    </>
  );
}
