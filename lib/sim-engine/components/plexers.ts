import { registerComponent } from "../component-registry";

// ── MUX_2TO1 ──
// Inputs: D0, D1, S (select). Output: Y = S ? D1 : D0
registerComponent({
  type: "MUX_2TO1",
  category: "plexer",
  inputCount: 3,
  outputCount: 1,
  width: 80,
  height: 60,
  label: "2:1 MUX",
  pinPositions: { inputs: [[0, 12], [0, 48], [40, 60]], outputs: [[80, 30]] },
  evaluate: (i) => [i[2] ? i[1] : i[0]], // S selects D1 or D0
});

// ── MUX_4TO1 ──
// Inputs: D0, D1, D2, D3, S1, S0. Output: Y = D[S1*2+S0]
registerComponent({
  type: "MUX_4TO1",
  category: "plexer",
  inputCount: 6,
  outputCount: 1,
  width: 100,
  height: 100,
  label: "4:1 MUX",
  pinPositions: {
    inputs: [
      [0, 12],  // D0
      [0, 32],  // D1
      [0, 52],  // D2
      [0, 72],  // D3
      [35, 100], // S1
      [65, 100], // S0
    ],
    outputs: [[100, 50]],
  },
  evaluate: (i) => {
    // i[0..3] = D0..D3, i[4] = S1, i[5] = S0
    const sel = (i[4] ? 2 : 0) + (i[5] ? 1 : 0);
    return [i[sel] ?? false];
  },
});

// ── MUX_8TO1 ──
// Inputs: D0..D7, S2, S1, S0. Output: Y = D[S2*4+S1*2+S0]
registerComponent({
  type: "MUX_8TO1",
  category: "plexer",
  inputCount: 11,
  outputCount: 1,
  width: 100,
  height: 180,
  label: "8:1 MUX",
  pinPositions: {
    inputs: [
      [0, 12],  // D0
      [0, 32],  // D1
      [0, 52],  // D2
      [0, 72],  // D3
      [0, 92],  // D4
      [0, 112], // D5
      [0, 132], // D6
      [0, 152], // D7
      [25, 180], // S2
      [50, 180], // S1
      [75, 180], // S0
    ],
    outputs: [[100, 90]],
  },
  evaluate: (i) => {
    // i[0..7] = D0..D7, i[8] = S2, i[9] = S1, i[10] = S0
    const sel = (i[8] ? 4 : 0) + (i[9] ? 2 : 0) + (i[10] ? 1 : 0);
    return [i[sel] ?? false];
  },
});

// ── DEMUX_1TO4 ──
// Inputs: D (data), S1, S0. Outputs: Y0..Y3. Y[S1*2+S0] = D, rest = 0
registerComponent({
  type: "DEMUX_1TO4",
  category: "plexer",
  inputCount: 3,
  outputCount: 4,
  width: 100,
  height: 100,
  label: "1:4 DEMUX",
  pinPositions: {
    inputs: [
      [0, 50],   // D
      [35, 100], // S1
      [65, 100], // S0
    ],
    outputs: [
      [100, 12], // Y0
      [100, 37], // Y1
      [100, 62], // Y2
      [100, 87], // Y3
    ],
  },
  evaluate: (i) => {
    // i[0] = D, i[1] = S1, i[2] = S0
    const sel = (i[1] ? 2 : 0) + (i[2] ? 1 : 0);
    const out: boolean[] = [false, false, false, false];
    out[sel] = i[0];
    return out;
  },
});

// ── DECODER_2TO4 ──
// Inputs: A1, A0. Outputs: D0..D3. Exactly one output HIGH based on binary input.
registerComponent({
  type: "DECODER_2TO4",
  category: "plexer",
  inputCount: 2,
  outputCount: 4,
  width: 100,
  height: 80,
  label: "2:4 DEC",
  pinPositions: {
    inputs: [[0, 20], [0, 60]],
    outputs: [[100, 10], [100, 30], [100, 50], [100, 70]],
  },
  evaluate: (i) => {
    const a1 = i[0], a0 = i[1];
    return [!a1 && !a0, !a1 && a0, a1 && !a0, a1 && a0];
  },
});

// ── PRIORITY_ENCODER ──
// Inputs: D3, D2, D1, D0 (D3 = highest priority).
// Outputs: A1, A0 (encoded), Valid (any input active).
// Encodes the index of the highest-priority active input.
registerComponent({
  type: "PRIORITY_ENCODER",
  category: "plexer",
  inputCount: 4,
  outputCount: 3,
  width: 100,
  height: 100,
  label: "Priority Enc",
  pinPositions: {
    inputs: [
      [0, 12], // D3 (highest priority)
      [0, 37], // D2
      [0, 62], // D1
      [0, 87], // D0 (lowest priority)
    ],
    outputs: [
      [100, 25], // A1
      [100, 50], // A0
      [100, 75], // Valid
    ],
  },
  evaluate: (i) => {
    // i[0]=D3, i[1]=D2, i[2]=D1, i[3]=D0
    // Encode highest-priority active input
    if (i[0]) return [true, true, true];    // D3 -> A1=1, A0=1, V=1 (index 3)
    if (i[1]) return [true, false, true];   // D2 -> A1=1, A0=0, V=1 (index 2)
    if (i[2]) return [false, true, true];   // D1 -> A1=0, A0=1, V=1 (index 1)
    if (i[3]) return [false, false, true];  // D0 -> A1=0, A0=0, V=1 (index 0)
    return [false, false, false];           // none -> V=0
  },
});

// ── BIT_SELECTOR ──
// Simplified single-bit selector: Inputs: D0, D1, Sel. Output: D[Sel].
// (Conceptually selects one bit from a multi-bit value; simplified to 2-input for 1-bit operation.)
registerComponent({
  type: "BIT_SELECTOR",
  category: "plexer",
  inputCount: 3,
  outputCount: 1,
  width: 80,
  height: 60,
  label: "Bit Sel",
  pinPositions: {
    inputs: [[0, 15], [0, 45], [40, 60]],
    outputs: [[80, 30]],
  },
  evaluate: (i) => {
    // i[0]=D0, i[1]=D1, i[2]=Sel
    return [i[2] ? i[1] : i[0]];
  },
});
