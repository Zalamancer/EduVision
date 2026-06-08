"use client";

/**
 * SVG gate shapes — all 80x60 bounding box, ANSI/IEEE style.
 * Each returns an SVG group fragment (no <g> wrapper needed, parent provides transform).
 */

const FILL = "var(--gate-body)";
const STROKE = "var(--signal-high)";
const SW = 1.5;

export function ANDShape({ isHigh }: { isHigh?: boolean }) {
  return (
    <>
      {/* Input stubs */}
      <line x1="0" y1="15" x2="12" y2="15" stroke="var(--gate-low)" strokeWidth={SW} />
      <line x1="0" y1="45" x2="12" y2="45" stroke="var(--gate-low)" strokeWidth={SW} />
      {/* Output stub */}
      <line x1="68" y1="30" x2="80" y2="30" stroke={isHigh ? "var(--signal-high)" : "var(--gate-low)"} strokeWidth={SW} />
      {/* Body: flat back D shape */}
      <path
        d="M12,10 L44,10 Q68,10 68,30 Q68,50 44,50 L12,50 Z"
        fill={FILL}
        stroke={STROKE}
        strokeWidth={SW}
      />
      <text x="30" y="34" fill="var(--gate-label)" fontSize="10" fontFamily="monospace" textAnchor="middle">AND</text>
    </>
  );
}

export function ORShape({ isHigh }: { isHigh?: boolean }) {
  return (
    <>
      <line x1="0" y1="15" x2="14" y2="15" stroke="var(--gate-low)" strokeWidth={SW} />
      <line x1="0" y1="45" x2="14" y2="45" stroke="var(--gate-low)" strokeWidth={SW} />
      <line x1="72" y1="30" x2="80" y2="30" stroke={isHigh ? "var(--signal-high)" : "var(--gate-low)"} strokeWidth={SW} />
      {/* Body: curved shield shape */}
      <path
        d="M8,10 Q22,10 44,10 Q72,10 72,30 Q72,50 44,50 Q22,50 8,50 Q24,30 8,10 Z"
        fill={FILL}
        stroke={STROKE}
        strokeWidth={SW}
      />
      <text x="36" y="34" fill="var(--gate-label)" fontSize="10" fontFamily="monospace" textAnchor="middle">OR</text>
    </>
  );
}

export function NOTShape({ isHigh }: { isHigh?: boolean }) {
  return (
    <>
      <line x1="0" y1="30" x2="10" y2="30" stroke="var(--gate-low)" strokeWidth={SW} />
      <line x1="72" y1="30" x2="80" y2="30" stroke={isHigh ? "var(--signal-high)" : "var(--gate-low)"} strokeWidth={SW} />
      {/* Triangle */}
      <path
        d="M10,10 L64,30 L10,50 Z"
        fill={FILL}
        stroke={STROKE}
        strokeWidth={SW}
      />
      {/* Bubble */}
      <circle cx="68" cy="30" r="4" fill={FILL} stroke={STROKE} strokeWidth={SW} />
      <text x="28" y="34" fill="var(--gate-label)" fontSize="10" fontFamily="monospace" textAnchor="middle">NOT</text>
    </>
  );
}

export function NANDShape({ isHigh }: { isHigh?: boolean }) {
  return (
    <>
      <line x1="0" y1="15" x2="12" y2="15" stroke="var(--gate-low)" strokeWidth={SW} />
      <line x1="0" y1="45" x2="12" y2="45" stroke="var(--gate-low)" strokeWidth={SW} />
      <line x1="72" y1="30" x2="80" y2="30" stroke={isHigh ? "var(--signal-high)" : "var(--gate-low)"} strokeWidth={SW} />
      <path
        d="M12,10 L44,10 Q64,10 64,30 Q64,50 44,50 L12,50 Z"
        fill={FILL}
        stroke={STROKE}
        strokeWidth={SW}
      />
      {/* Bubble */}
      <circle cx="68" cy="30" r="4" fill={FILL} stroke={STROKE} strokeWidth={SW} />
      <text x="30" y="34" fill="var(--gate-label)" fontSize="10" fontFamily="monospace" textAnchor="middle">NAND</text>
    </>
  );
}

export function NORShape({ isHigh }: { isHigh?: boolean }) {
  return (
    <>
      <line x1="0" y1="15" x2="14" y2="15" stroke="var(--gate-low)" strokeWidth={SW} />
      <line x1="0" y1="45" x2="14" y2="45" stroke="var(--gate-low)" strokeWidth={SW} />
      <line x1="72" y1="30" x2="80" y2="30" stroke={isHigh ? "var(--signal-high)" : "var(--gate-low)"} strokeWidth={SW} />
      <path
        d="M8,10 Q22,10 44,10 Q68,10 68,30 Q68,50 44,50 Q22,50 8,50 Q24,30 8,10 Z"
        fill={FILL}
        stroke={STROKE}
        strokeWidth={SW}
      />
      {/* Bubble */}
      <circle cx="72" cy="30" r="4" fill={FILL} stroke={STROKE} strokeWidth={SW} />
      <text x="34" y="34" fill="var(--gate-label)" fontSize="10" fontFamily="monospace" textAnchor="middle">NOR</text>
    </>
  );
}

export function XORShape({ isHigh }: { isHigh?: boolean }) {
  return (
    <>
      <line x1="0" y1="15" x2="14" y2="15" stroke="var(--gate-low)" strokeWidth={SW} />
      <line x1="0" y1="45" x2="14" y2="45" stroke="var(--gate-low)" strokeWidth={SW} />
      <line x1="72" y1="30" x2="80" y2="30" stroke={isHigh ? "var(--signal-high)" : "var(--gate-low)"} strokeWidth={SW} />
      {/* Main shield */}
      <path
        d="M10,10 Q24,10 46,10 Q72,10 72,30 Q72,50 46,50 Q24,50 10,50 Q26,30 10,10 Z"
        fill={FILL}
        stroke={STROKE}
        strokeWidth={SW}
      />
      {/* Extra curved input line */}
      <path
        d="M4,10 Q20,30 4,50"
        fill="none"
        stroke={STROKE}
        strokeWidth={SW}
      />
      <text x="38" y="34" fill="var(--gate-label)" fontSize="10" fontFamily="monospace" textAnchor="middle">XOR</text>
    </>
  );
}

export function XNORShape({ isHigh }: { isHigh?: boolean }) {
  return (
    <>
      <line x1="0" y1="15" x2="14" y2="15" stroke="var(--gate-low)" strokeWidth={SW} />
      <line x1="0" y1="45" x2="14" y2="45" stroke="var(--gate-low)" strokeWidth={SW} />
      <line x1="72" y1="30" x2="80" y2="30" stroke={isHigh ? "var(--signal-high)" : "var(--gate-low)"} strokeWidth={SW} />
      <path
        d="M10,10 Q24,10 46,10 Q68,10 68,30 Q68,50 46,50 Q24,50 10,50 Q26,30 10,10 Z"
        fill={FILL}
        stroke={STROKE}
        strokeWidth={SW}
      />
      <path d="M4,10 Q20,30 4,50" fill="none" stroke={STROKE} strokeWidth={SW} />
      {/* Bubble */}
      <circle cx="72" cy="30" r="4" fill={FILL} stroke={STROKE} strokeWidth={SW} />
      <text x="34" y="34" fill="var(--gate-label)" fontSize="9" fontFamily="monospace" textAnchor="middle">XNOR</text>
    </>
  );
}

export function InputSwitchShape({ value }: { value?: boolean }) {
  const color = value ? "var(--signal-high)" : "var(--gate-low)";
  return (
    <>
      {/* Body */}
      <rect x="0" y="10" width="60" height="40" rx="6" fill="var(--gate-body)" stroke={color} strokeWidth="1.5" />
      {/* Switch indicator */}
      <rect
        x={value ? "32" : "8"}
        y="18"
        width="24"
        height="24"
        rx="4"
        fill={color}
        style={{ transition: "x 0.15s" }}
      />
      {/* Value text */}
      <text x="30" y="34" textAnchor="middle" fill="var(--switch-text)" fontSize="11" fontFamily="monospace" fontWeight="bold">
        {value ? "1" : "0"}
      </text>
      {/* Output stub */}
      <line x1="60" y1="30" x2="80" y2="30" stroke={color} strokeWidth="1.5" />
    </>
  );
}

export function OutputLEDShape({ value }: { value?: boolean }) {
  const color = value ? "var(--signal-high)" : "var(--gate-low)";
  const glowFilter = value ? "var(--signal-high-glow)" : "none";
  return (
    <>
      {/* Input stub */}
      <line x1="0" y1="30" x2="20" y2="30" stroke={color} strokeWidth="1.5" />
      {/* LED body */}
      <circle
        cx="44"
        cy="30"
        r="20"
        fill={value ? "var(--led-active-bg)" : "var(--gate-body)"}
        stroke={color}
        strokeWidth="1.5"
        style={{ filter: glowFilter }}
      />
      {/* Value text */}
      <text x="44" y="35" textAnchor="middle" fill={color} fontSize="14" fontFamily="monospace" fontWeight="bold">
        {value ? "1" : "0"}
      </text>
    </>
  );
}
