import { registerComponent } from "../component-registry";

// ── FULL_ADDER ──
// Inputs: A, B, Cin. Outputs: Sum, Cout.
// Sum = A XOR B XOR Cin. Cout = (A AND B) OR (Cin AND (A XOR B)).
registerComponent({
  type: "FULL_ADDER",
  category: "arithmetic",
  inputCount: 3,
  outputCount: 2,
  width: 80,
  height: 60,
  label: "Full Adder",
  pinPositions: {
    inputs: [[0, 10], [0, 30], [0, 50]],
    outputs: [[80, 20], [80, 40]],
  },
  evaluate: (i) => {
    const a = i[0], b = i[1], cin = i[2];
    const sum = a !== b !== cin;                   // A XOR B XOR Cin
    const cout = (a && b) || (cin && (a !== b));   // (A AND B) OR (Cin AND (A XOR B))
    return [sum, cout];
  },
});

// ── SUBTRACTOR ──
// Full subtractor: Inputs: A, B, Bin (borrow-in).
// Outputs: Diff, Bout (borrow-out).
// Diff = A XOR B XOR Bin. Bout = (!A AND B) OR ((!A XOR B) AND Bin).
registerComponent({
  type: "SUBTRACTOR",
  category: "arithmetic",
  inputCount: 3,
  outputCount: 2,
  width: 80,
  height: 60,
  label: "Subtractor",
  pinPositions: {
    inputs: [[0, 10], [0, 30], [0, 50]],
    outputs: [[80, 20], [80, 40]],
  },
  evaluate: (i) => {
    const a = i[0], b = i[1], bin = i[2];
    const diff = a !== b !== bin;                     // A XOR B XOR Bin
    const bout = (!a && b) || ((a === b) && bin);     // (!A AND B) OR (!(A XOR B) AND Bin)
    return [diff, bout];
  },
});

// ── MULTIPLIER ──
// Single-bit multiplier: Inputs: A, B. Output: Product.
// For single-bit: A * B = A AND B.
registerComponent({
  type: "MULTIPLIER",
  category: "arithmetic",
  inputCount: 2,
  outputCount: 1,
  width: 80,
  height: 60,
  label: "Multiplier",
  pinPositions: {
    inputs: [[0, 15], [0, 45]],
    outputs: [[80, 30]],
  },
  evaluate: (i) => [i[0] && i[1]], // single-bit multiplication = AND
});

// ── DIVIDER ──
// Single-bit divider: Inputs: A (dividend), B (divisor).
// Outputs: Quotient, Remainder.
// For single-bit: Q = A AND B (A/B = 1 only if both are 1), R = A AND !B (remainder if A=1 but B=0).
// Division by zero (B=0): Q=0, R=A.
registerComponent({
  type: "DIVIDER",
  category: "arithmetic",
  inputCount: 2,
  outputCount: 2,
  width: 80,
  height: 60,
  label: "Divider",
  pinPositions: {
    inputs: [[0, 15], [0, 45]],
    outputs: [[80, 20], [80, 40]],
  },
  evaluate: (i) => {
    const a = i[0], b = i[1];
    if (!b) return [false, a]; // div by 0: Q=0, R=A
    return [a, false];         // 1/1=1 R0, 0/1=0 R0
  },
});

// ── NEGATOR ──
// Two's complement negation for single bit: Output = NOT input.
// (For multi-bit: invert all bits and add 1. For single bit, NOT is the complement.)
registerComponent({
  type: "NEGATOR",
  category: "arithmetic",
  inputCount: 1,
  outputCount: 1,
  width: 80,
  height: 60,
  label: "Negator",
  pinPositions: {
    inputs: [[0, 30]],
    outputs: [[80, 30]],
  },
  evaluate: (i) => [!i[0]],
});

// ── COMPARATOR ──
// Inputs: A, B. Outputs: GT (A>B), EQ (A==B), LT (A<B).
// Single-bit comparison: GT = A AND !B, EQ = A XNOR B, LT = !A AND B.
registerComponent({
  type: "COMPARATOR",
  category: "arithmetic",
  inputCount: 2,
  outputCount: 3,
  width: 80,
  height: 80,
  label: "Comparator",
  pinPositions: {
    inputs: [[0, 20], [0, 60]],
    outputs: [[80, 15], [80, 40], [80, 65]],
  },
  evaluate: (i) => {
    const a = i[0], b = i[1];
    const gt = a && !b;    // A > B
    const eq = a === b;    // A == B
    const lt = !a && b;    // A < B
    return [gt, eq, lt];
  },
});

// ── SHIFTER ──
// Inputs: Data, Direction. Output: Shifted.
// Single-bit shift: if Direction=0 (left), output=0 (bit shifted out); if Direction=1 (right), output=0.
// For single-bit, any shift produces 0 (the bit is shifted out of the single position).
registerComponent({
  type: "SHIFTER",
  category: "arithmetic",
  inputCount: 2,
  outputCount: 1,
  width: 80,
  height: 60,
  label: "Shifter",
  pinPositions: {
    inputs: [[0, 15], [0, 45]],
    outputs: [[80, 30]],
  },
  evaluate: () => [false], // single-bit shift always produces 0
});

// ── BIT_ADDER ──
// Half adder: Inputs: A, B. Outputs: Sum, Carry.
// Sum = A XOR B. Carry = A AND B.
registerComponent({
  type: "BIT_ADDER",
  category: "arithmetic",
  inputCount: 2,
  outputCount: 2,
  width: 80,
  height: 60,
  label: "Half Adder",
  pinPositions: {
    inputs: [[0, 15], [0, 45]],
    outputs: [[80, 20], [80, 40]],
  },
  evaluate: (i) => {
    const sum = i[0] !== i[1]; // A XOR B
    const carry = i[0] && i[1]; // A AND B
    return [sum, carry];
  },
});
