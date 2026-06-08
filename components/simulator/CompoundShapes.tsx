"use client";

/**
 * Compound gate SVG shapes — labeled rectangular blocks (not ANSI curves).
 * MUX_2TO1:     80x60 box
 * FULL_ADDER:   80x60 box
 * DECODER_2TO4: 100x80 box
 */

const FILL = "var(--gate-body)";
const STROKE = "var(--signal-high)";
const SW = 1.2;
const STUB = "var(--gate-low)";
const PIN_LABEL = "var(--gate-label)";

export function MUX2TO1Shape({ isHigh }: { isHigh?: boolean }) {
  return (
    <>
      {/* Input stubs */}
      <line x1="0" y1="12" x2="8" y2="12" stroke={STUB} strokeWidth={SW} />
      <line x1="0" y1="48" x2="8" y2="48" stroke={STUB} strokeWidth={SW} />
      <line x1="40" y1="60" x2="40" y2="52" stroke={STUB} strokeWidth={SW} />
      {/* Output stub */}
      <line x1="72" y1="30" x2="80" y2="30" stroke={isHigh ? STROKE : STUB} strokeWidth={SW} />
      {/* Body */}
      <rect x="8" y="2" width="64" height="50" rx={4} fill={FILL} stroke={STROKE} strokeWidth={SW} />
      {/* Center label */}
      <text x="40" y="30" textAnchor="middle" dominantBaseline="central" fill={STROKE} fontSize="11" fontFamily="monospace" fontWeight="bold">
        MUX
      </text>
      {/* Pin labels */}
      <text x="12" y="15" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">D0</text>
      <text x="12" y="51" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">D1</text>
      <text x="44" y="50" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">S</text>
      <text x="67" y="33" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="end">Y</text>
    </>
  );
}

export function FullAdderShape({ isHigh }: { isHigh?: boolean }) {
  const outColor0 = isHigh ? STROKE : STUB;
  const outColor1 = isHigh ? STROKE : STUB;
  return (
    <>
      {/* Input stubs */}
      <line x1="0" y1="10" x2="8" y2="10" stroke={STUB} strokeWidth={SW} />
      <line x1="0" y1="30" x2="8" y2="30" stroke={STUB} strokeWidth={SW} />
      <line x1="0" y1="50" x2="8" y2="50" stroke={STUB} strokeWidth={SW} />
      {/* Output stubs */}
      <line x1="72" y1="20" x2="80" y2="20" stroke={outColor0} strokeWidth={SW} />
      <line x1="72" y1="40" x2="80" y2="40" stroke={outColor1} strokeWidth={SW} />
      {/* Body */}
      <rect x="8" y="2" width="64" height="56" rx={4} fill={FILL} stroke={STROKE} strokeWidth={SW} />
      {/* Center label */}
      <text x="40" y="30" textAnchor="middle" dominantBaseline="central" fill={STROKE} fontSize="11" fontFamily="monospace" fontWeight="bold">
        FA
      </text>
      {/* Pin labels */}
      <text x="12" y="13" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">A</text>
      <text x="12" y="33" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">B</text>
      <text x="12" y="53" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">Cin</text>
      <text x="68" y="23" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="end">S</text>
      <text x="68" y="43" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="end">Co</text>
    </>
  );
}

export function Decoder2to4Shape({ isHigh }: { isHigh?: boolean }) {
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
      {/* Center label */}
      <text x="50" y="40" textAnchor="middle" dominantBaseline="central" fill={STROKE} fontSize="11" fontFamily="monospace" fontWeight="bold">
        DEC
      </text>
      {/* Pin labels */}
      <text x="12" y="23" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">A1</text>
      <text x="12" y="63" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">A0</text>
      <text x="88" y="13" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="end">D0</text>
      <text x="88" y="33" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="end">D1</text>
      <text x="88" y="53" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="end">D2</text>
      <text x="88" y="73" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="end">D3</text>
    </>
  );
}

/* ── Plexer shapes ── */

export function MUX4TO1Shape({ isHigh }: { isHigh?: boolean }) {
  // 100x100 box. Inputs: D0-D3 left, S1,S0 bottom. Output: Y right.
  // Pin positions: D0[0,12] D1[0,32] D2[0,52] D3[0,72] S1[35,100] S0[65,100] Y[100,50]
  // Body: x=8 y=2 w=84 h=90 (rect edge left=8, right=92, top=2, bottom=92)
  const outColor = isHigh ? STROKE : STUB;
  return (
    <>
      {/* Input stubs (left) */}
      <line x1="0" y1="12" x2="8" y2="12" stroke={STUB} strokeWidth={SW} />
      <line x1="0" y1="32" x2="8" y2="32" stroke={STUB} strokeWidth={SW} />
      <line x1="0" y1="52" x2="8" y2="52" stroke={STUB} strokeWidth={SW} />
      <line x1="0" y1="72" x2="8" y2="72" stroke={STUB} strokeWidth={SW} />
      {/* Input stubs (bottom) */}
      <line x1="35" y1="100" x2="35" y2="92" stroke={STUB} strokeWidth={SW} />
      <line x1="65" y1="100" x2="65" y2="92" stroke={STUB} strokeWidth={SW} />
      {/* Output stub */}
      <line x1="92" y1="50" x2="100" y2="50" stroke={outColor} strokeWidth={SW} />
      {/* Body */}
      <rect x="8" y="2" width="84" height="90" rx={4} fill={FILL} stroke={STROKE} strokeWidth={SW} />
      {/* Center label */}
      <text x="50" y="46" textAnchor="middle" dominantBaseline="central" fill={STROKE} fontSize="11" fontFamily="monospace" fontWeight="bold">
        MUX 4:1
      </text>
      {/* Pin labels */}
      <text x="12" y="15" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">D0</text>
      <text x="12" y="35" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">D1</text>
      <text x="12" y="55" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">D2</text>
      <text x="12" y="75" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">D3</text>
      <text x="35" y="88" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="middle">S1</text>
      <text x="65" y="88" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="middle">S0</text>
      <text x="88" y="53" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="end">Y</text>
    </>
  );
}

export function MUX8TO1Shape({ isHigh }: { isHigh?: boolean }) {
  // 100x180 box. Inputs: D0-D7 left, S2,S1,S0 bottom. Output: Y right.
  // Pin positions: D0[0,12] D1[0,32] D2[0,52] D3[0,72] D4[0,92] D5[0,112] D6[0,132] D7[0,152]
  //   S2[25,180] S1[50,180] S0[75,180] Y[100,90]
  // Body: x=8 y=2 w=84 h=170 (rect edge left=8, right=92, top=2, bottom=172)
  const outColor = isHigh ? STROKE : STUB;
  return (
    <>
      {/* Input stubs (left) */}
      <line x1="0" y1="12" x2="8" y2="12" stroke={STUB} strokeWidth={SW} />
      <line x1="0" y1="32" x2="8" y2="32" stroke={STUB} strokeWidth={SW} />
      <line x1="0" y1="52" x2="8" y2="52" stroke={STUB} strokeWidth={SW} />
      <line x1="0" y1="72" x2="8" y2="72" stroke={STUB} strokeWidth={SW} />
      <line x1="0" y1="92" x2="8" y2="92" stroke={STUB} strokeWidth={SW} />
      <line x1="0" y1="112" x2="8" y2="112" stroke={STUB} strokeWidth={SW} />
      <line x1="0" y1="132" x2="8" y2="132" stroke={STUB} strokeWidth={SW} />
      <line x1="0" y1="152" x2="8" y2="152" stroke={STUB} strokeWidth={SW} />
      {/* Input stubs (bottom) */}
      <line x1="25" y1="180" x2="25" y2="172" stroke={STUB} strokeWidth={SW} />
      <line x1="50" y1="180" x2="50" y2="172" stroke={STUB} strokeWidth={SW} />
      <line x1="75" y1="180" x2="75" y2="172" stroke={STUB} strokeWidth={SW} />
      {/* Output stub */}
      <line x1="92" y1="90" x2="100" y2="90" stroke={outColor} strokeWidth={SW} />
      {/* Body */}
      <rect x="8" y="2" width="84" height="170" rx={4} fill={FILL} stroke={STROKE} strokeWidth={SW} />
      {/* Center label */}
      <text x="50" y="86" textAnchor="middle" dominantBaseline="central" fill={STROKE} fontSize="11" fontFamily="monospace" fontWeight="bold">
        MUX 8:1
      </text>
      {/* Pin labels */}
      <text x="12" y="15" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">D0</text>
      <text x="12" y="35" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">D1</text>
      <text x="12" y="55" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">D2</text>
      <text x="12" y="75" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">D3</text>
      <text x="12" y="95" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">D4</text>
      <text x="12" y="115" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">D5</text>
      <text x="12" y="135" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">D6</text>
      <text x="12" y="155" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">D7</text>
      <text x="25" y="168" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="middle">S2</text>
      <text x="50" y="168" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="middle">S1</text>
      <text x="75" y="168" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="middle">S0</text>
      <text x="88" y="93" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="end">Y</text>
    </>
  );
}

export function DEMUX1TO4Shape({ isHigh }: { isHigh?: boolean }) {
  // 100x100 box. Input: D left, S1,S0 bottom. Outputs: Y0-Y3 right.
  // Pin positions: D[0,50] S1[35,100] S0[65,100] Y0[100,12] Y1[100,37] Y2[100,62] Y3[100,87]
  // Body: x=8 y=2 w=84 h=90
  const outColor = isHigh ? STROKE : STUB;
  return (
    <>
      {/* Input stub (left) */}
      <line x1="0" y1="50" x2="8" y2="50" stroke={STUB} strokeWidth={SW} />
      {/* Input stubs (bottom) */}
      <line x1="35" y1="100" x2="35" y2="92" stroke={STUB} strokeWidth={SW} />
      <line x1="65" y1="100" x2="65" y2="92" stroke={STUB} strokeWidth={SW} />
      {/* Output stubs */}
      <line x1="92" y1="12" x2="100" y2="12" stroke={outColor} strokeWidth={SW} />
      <line x1="92" y1="37" x2="100" y2="37" stroke={outColor} strokeWidth={SW} />
      <line x1="92" y1="62" x2="100" y2="62" stroke={outColor} strokeWidth={SW} />
      <line x1="92" y1="87" x2="100" y2="87" stroke={outColor} strokeWidth={SW} />
      {/* Body */}
      <rect x="8" y="2" width="84" height="90" rx={4} fill={FILL} stroke={STROKE} strokeWidth={SW} />
      {/* Center label */}
      <text x="50" y="46" textAnchor="middle" dominantBaseline="central" fill={STROKE} fontSize="11" fontFamily="monospace" fontWeight="bold">
        DEMUX
      </text>
      {/* Pin labels */}
      <text x="12" y="53" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">D</text>
      <text x="35" y="88" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="middle">S1</text>
      <text x="65" y="88" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="middle">S0</text>
      <text x="88" y="15" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="end">Y0</text>
      <text x="88" y="40" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="end">Y1</text>
      <text x="88" y="65" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="end">Y2</text>
      <text x="88" y="90" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="end">Y3</text>
    </>
  );
}

export function PriorityEncoderShape({ isHigh }: { isHigh?: boolean }) {
  // 100x100 box. Inputs: D3,D2,D1,D0 left. Outputs: A1,A0,V right.
  // Pin positions: D3[0,12] D2[0,37] D1[0,62] D0[0,87] A1[100,25] A0[100,50] V[100,75]
  // Body: x=8 y=2 w=84 h=90
  const outColor = isHigh ? STROKE : STUB;
  return (
    <>
      {/* Input stubs */}
      <line x1="0" y1="12" x2="8" y2="12" stroke={STUB} strokeWidth={SW} />
      <line x1="0" y1="37" x2="8" y2="37" stroke={STUB} strokeWidth={SW} />
      <line x1="0" y1="62" x2="8" y2="62" stroke={STUB} strokeWidth={SW} />
      <line x1="0" y1="87" x2="8" y2="87" stroke={STUB} strokeWidth={SW} />
      {/* Output stubs */}
      <line x1="92" y1="25" x2="100" y2="25" stroke={outColor} strokeWidth={SW} />
      <line x1="92" y1="50" x2="100" y2="50" stroke={outColor} strokeWidth={SW} />
      <line x1="92" y1="75" x2="100" y2="75" stroke={outColor} strokeWidth={SW} />
      {/* Body */}
      <rect x="8" y="2" width="84" height="90" rx={4} fill={FILL} stroke={STROKE} strokeWidth={SW} />
      {/* Center label */}
      <text x="50" y="46" textAnchor="middle" dominantBaseline="central" fill={STROKE} fontSize="10" fontFamily="monospace" fontWeight="bold">
        PRI ENC
      </text>
      {/* Pin labels */}
      <text x="12" y="15" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">D3</text>
      <text x="12" y="40" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">D2</text>
      <text x="12" y="65" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">D1</text>
      <text x="12" y="90" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">D0</text>
      <text x="88" y="28" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="end">A1</text>
      <text x="88" y="53" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="end">A0</text>
      <text x="88" y="78" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="end">V</text>
    </>
  );
}

export function BitSelectorShape({ isHigh }: { isHigh?: boolean }) {
  // 80x60 box. Inputs: D0[0,15] D1[0,45] S[40,60]. Output: Y[80,30].
  // Body: x=8 y=2 w=64 h=50
  const outColor = isHigh ? STROKE : STUB;
  return (
    <>
      {/* Input stubs */}
      <line x1="0" y1="15" x2="8" y2="15" stroke={STUB} strokeWidth={SW} />
      <line x1="0" y1="45" x2="8" y2="45" stroke={STUB} strokeWidth={SW} />
      <line x1="40" y1="60" x2="40" y2="52" stroke={STUB} strokeWidth={SW} />
      {/* Output stub */}
      <line x1="72" y1="30" x2="80" y2="30" stroke={outColor} strokeWidth={SW} />
      {/* Body */}
      <rect x="8" y="2" width="64" height="50" rx={4} fill={FILL} stroke={STROKE} strokeWidth={SW} />
      {/* Center label */}
      <text x="40" y="26" textAnchor="middle" dominantBaseline="central" fill={STROKE} fontSize="10" fontFamily="monospace" fontWeight="bold">
        BIT SEL
      </text>
      {/* Pin labels */}
      <text x="12" y="18" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">D0</text>
      <text x="12" y="48" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">D1</text>
      <text x="44" y="50" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">S</text>
      <text x="68" y="33" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="end">Y</text>
    </>
  );
}

/* ── Arithmetic shapes ── */

export function SubtractorShape({ isHigh }: { isHigh?: boolean }) {
  // 80x60 box. Inputs: A[0,10] B[0,30] Bin[0,50]. Outputs: D[80,20] Bout[80,40].
  // Body: x=8 y=2 w=64 h=56
  const outColor = isHigh ? STROKE : STUB;
  return (
    <>
      {/* Input stubs */}
      <line x1="0" y1="10" x2="8" y2="10" stroke={STUB} strokeWidth={SW} />
      <line x1="0" y1="30" x2="8" y2="30" stroke={STUB} strokeWidth={SW} />
      <line x1="0" y1="50" x2="8" y2="50" stroke={STUB} strokeWidth={SW} />
      {/* Output stubs */}
      <line x1="72" y1="20" x2="80" y2="20" stroke={outColor} strokeWidth={SW} />
      <line x1="72" y1="40" x2="80" y2="40" stroke={outColor} strokeWidth={SW} />
      {/* Body */}
      <rect x="8" y="2" width="64" height="56" rx={4} fill={FILL} stroke={STROKE} strokeWidth={SW} />
      {/* Center label */}
      <text x="40" y="30" textAnchor="middle" dominantBaseline="central" fill={STROKE} fontSize="11" fontFamily="monospace" fontWeight="bold">
        SUB
      </text>
      {/* Pin labels */}
      <text x="12" y="13" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">A</text>
      <text x="12" y="33" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">B</text>
      <text x="12" y="53" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">Bin</text>
      <text x="68" y="23" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="end">D</text>
      <text x="68" y="43" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="end">Bo</text>
    </>
  );
}

export function MultiplierShape({ isHigh }: { isHigh?: boolean }) {
  // 80x60 box. Inputs: A[0,15] B[0,45]. Output: P[80,30].
  // Body: x=8 y=2 w=64 h=56
  const outColor = isHigh ? STROKE : STUB;
  return (
    <>
      {/* Input stubs */}
      <line x1="0" y1="15" x2="8" y2="15" stroke={STUB} strokeWidth={SW} />
      <line x1="0" y1="45" x2="8" y2="45" stroke={STUB} strokeWidth={SW} />
      {/* Output stub */}
      <line x1="72" y1="30" x2="80" y2="30" stroke={outColor} strokeWidth={SW} />
      {/* Body */}
      <rect x="8" y="2" width="64" height="56" rx={4} fill={FILL} stroke={STROKE} strokeWidth={SW} />
      {/* Center label */}
      <text x="40" y="30" textAnchor="middle" dominantBaseline="central" fill={STROKE} fontSize="11" fontFamily="monospace" fontWeight="bold">
        MUL
      </text>
      {/* Pin labels */}
      <text x="12" y="18" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">A</text>
      <text x="12" y="48" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">B</text>
      <text x="68" y="33" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="end">P</text>
    </>
  );
}

export function DividerShape({ isHigh }: { isHigh?: boolean }) {
  // 80x60 box. Inputs: A[0,15] B[0,45]. Outputs: Q[80,20] R[80,40].
  // Body: x=8 y=2 w=64 h=56
  const outColor = isHigh ? STROKE : STUB;
  return (
    <>
      {/* Input stubs */}
      <line x1="0" y1="15" x2="8" y2="15" stroke={STUB} strokeWidth={SW} />
      <line x1="0" y1="45" x2="8" y2="45" stroke={STUB} strokeWidth={SW} />
      {/* Output stubs */}
      <line x1="72" y1="20" x2="80" y2="20" stroke={outColor} strokeWidth={SW} />
      <line x1="72" y1="40" x2="80" y2="40" stroke={outColor} strokeWidth={SW} />
      {/* Body */}
      <rect x="8" y="2" width="64" height="56" rx={4} fill={FILL} stroke={STROKE} strokeWidth={SW} />
      {/* Center label */}
      <text x="40" y="30" textAnchor="middle" dominantBaseline="central" fill={STROKE} fontSize="11" fontFamily="monospace" fontWeight="bold">
        DIV
      </text>
      {/* Pin labels */}
      <text x="12" y="18" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">A</text>
      <text x="12" y="48" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">B</text>
      <text x="68" y="23" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="end">Q</text>
      <text x="68" y="43" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="end">R</text>
    </>
  );
}

export function NegatorShape({ isHigh }: { isHigh?: boolean }) {
  // 80x60 box. Input: A[0,30]. Output: -A[80,30].
  // Body: x=8 y=2 w=64 h=56
  const outColor = isHigh ? STROKE : STUB;
  return (
    <>
      {/* Input stub */}
      <line x1="0" y1="30" x2="8" y2="30" stroke={STUB} strokeWidth={SW} />
      {/* Output stub */}
      <line x1="72" y1="30" x2="80" y2="30" stroke={outColor} strokeWidth={SW} />
      {/* Body */}
      <rect x="8" y="2" width="64" height="56" rx={4} fill={FILL} stroke={STROKE} strokeWidth={SW} />
      {/* Center label */}
      <text x="40" y="30" textAnchor="middle" dominantBaseline="central" fill={STROKE} fontSize="11" fontFamily="monospace" fontWeight="bold">
        NEG
      </text>
      {/* Pin labels */}
      <text x="12" y="33" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">A</text>
      <text x="68" y="33" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="end">-A</text>
    </>
  );
}

export function ComparatorShape({ isHigh }: { isHigh?: boolean }) {
  // 80x80 box. Inputs: A[0,20] B[0,60]. Outputs: GT[80,15] EQ[80,40] LT[80,65].
  // Body: x=8 y=2 w=64 h=76
  const outColor = isHigh ? STROKE : STUB;
  return (
    <>
      {/* Input stubs */}
      <line x1="0" y1="20" x2="8" y2="20" stroke={STUB} strokeWidth={SW} />
      <line x1="0" y1="60" x2="8" y2="60" stroke={STUB} strokeWidth={SW} />
      {/* Output stubs */}
      <line x1="72" y1="15" x2="80" y2="15" stroke={outColor} strokeWidth={SW} />
      <line x1="72" y1="40" x2="80" y2="40" stroke={outColor} strokeWidth={SW} />
      <line x1="72" y1="65" x2="80" y2="65" stroke={outColor} strokeWidth={SW} />
      {/* Body */}
      <rect x="8" y="2" width="64" height="76" rx={4} fill={FILL} stroke={STROKE} strokeWidth={SW} />
      {/* Center label */}
      <text x="40" y="40" textAnchor="middle" dominantBaseline="central" fill={STROKE} fontSize="11" fontFamily="monospace" fontWeight="bold">
        CMP
      </text>
      {/* Pin labels */}
      <text x="12" y="23" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">A</text>
      <text x="12" y="63" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">B</text>
      <text x="68" y="18" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="end">GT</text>
      <text x="68" y="43" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="end">EQ</text>
      <text x="68" y="68" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="end">LT</text>
    </>
  );
}

export function ShifterShape({ isHigh }: { isHigh?: boolean }) {
  // 80x60 box. Inputs: D[0,15] Dir[0,45]. Output: Y[80,30].
  // Body: x=8 y=2 w=64 h=56
  const outColor = isHigh ? STROKE : STUB;
  return (
    <>
      {/* Input stubs */}
      <line x1="0" y1="15" x2="8" y2="15" stroke={STUB} strokeWidth={SW} />
      <line x1="0" y1="45" x2="8" y2="45" stroke={STUB} strokeWidth={SW} />
      {/* Output stub */}
      <line x1="72" y1="30" x2="80" y2="30" stroke={outColor} strokeWidth={SW} />
      {/* Body */}
      <rect x="8" y="2" width="64" height="56" rx={4} fill={FILL} stroke={STROKE} strokeWidth={SW} />
      {/* Center label */}
      <text x="40" y="30" textAnchor="middle" dominantBaseline="central" fill={STROKE} fontSize="10" fontFamily="monospace" fontWeight="bold">
        SHIFT
      </text>
      {/* Pin labels */}
      <text x="12" y="18" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">D</text>
      <text x="12" y="48" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">Dir</text>
      <text x="68" y="33" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="end">Y</text>
    </>
  );
}

export function BitAdderShape({ isHigh }: { isHigh?: boolean }) {
  // 80x60 box. Inputs: A[0,15] B[0,45]. Outputs: S[80,20] C[80,40].
  // Body: x=8 y=2 w=64 h=56
  const outColor = isHigh ? STROKE : STUB;
  return (
    <>
      {/* Input stubs */}
      <line x1="0" y1="15" x2="8" y2="15" stroke={STUB} strokeWidth={SW} />
      <line x1="0" y1="45" x2="8" y2="45" stroke={STUB} strokeWidth={SW} />
      {/* Output stubs */}
      <line x1="72" y1="20" x2="80" y2="20" stroke={outColor} strokeWidth={SW} />
      <line x1="72" y1="40" x2="80" y2="40" stroke={outColor} strokeWidth={SW} />
      {/* Body */}
      <rect x="8" y="2" width="64" height="56" rx={4} fill={FILL} stroke={STROKE} strokeWidth={SW} />
      {/* Center label */}
      <text x="40" y="30" textAnchor="middle" dominantBaseline="central" fill={STROKE} fontSize="11" fontFamily="monospace" fontWeight="bold">
        HA
      </text>
      {/* Pin labels */}
      <text x="12" y="18" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">A</text>
      <text x="12" y="48" fill={PIN_LABEL} fontSize="7" fontFamily="monospace">B</text>
      <text x="68" y="23" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="end">S</text>
      <text x="68" y="43" fill={PIN_LABEL} fontSize="7" fontFamily="monospace" textAnchor="end">C</text>
    </>
  );
}
