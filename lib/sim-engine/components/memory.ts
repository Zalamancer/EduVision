import { registerComponent } from "../component-registry";

// ── D_FLIP_FLOP ──
// Inputs: D, CLK. Outputs: Q, Q'.
// On rising clock edge: Q = D.
// Combinational evaluate returns current state (no edge detection).
registerComponent({
  type: "D_FLIP_FLOP",
  category: "memory",
  inputCount: 2,
  outputCount: 2,
  width: 80,
  height: 60,
  label: "D-FF",
  sequential: true,
  pinPositions: {
    inputs: [[0, 15], [0, 45]],   // D, CLK
    outputs: [[80, 15], [80, 45]], // Q, Q'
  },
  evaluate: (i) => [i[0], !i[0]], // passthrough for combinational fallback
  evaluateSequential: (inputs, prevState, clockEdge) => {
    // prevState[0] = Q
    const d = inputs[0];
    const q = prevState.length > 0 ? prevState[0] : false;
    if (clockEdge) {
      // Rising edge: capture D
      return { outputs: [d, !d], nextState: [d] };
    }
    // No edge: hold previous state
    return { outputs: [q, !q], nextState: [q] };
  },
});

// ── T_FLIP_FLOP ──
// Inputs: T, CLK. Outputs: Q, Q'.
// On rising clock edge: if T=1, Q toggles; if T=0, Q holds.
registerComponent({
  type: "T_FLIP_FLOP",
  category: "memory",
  inputCount: 2,
  outputCount: 2,
  width: 80,
  height: 60,
  label: "T-FF",
  sequential: true,
  pinPositions: {
    inputs: [[0, 15], [0, 45]],   // T, CLK
    outputs: [[80, 15], [80, 45]], // Q, Q'
  },
  evaluate: (i) => [i[0], !i[0]],
  evaluateSequential: (inputs, prevState, clockEdge) => {
    const t = inputs[0];
    const q = prevState.length > 0 ? prevState[0] : false;
    if (clockEdge) {
      const nextQ = t ? !q : q; // toggle if T=1, hold if T=0
      return { outputs: [nextQ, !nextQ], nextState: [nextQ] };
    }
    return { outputs: [q, !q], nextState: [q] };
  },
});

// ── JK_FLIP_FLOP ──
// Inputs: J, K, CLK. Outputs: Q, Q'.
// On rising edge: J=0,K=0 -> hold; J=1,K=0 -> set (Q=1); J=0,K=1 -> reset (Q=0); J=1,K=1 -> toggle.
registerComponent({
  type: "JK_FLIP_FLOP",
  category: "memory",
  inputCount: 3,
  outputCount: 2,
  width: 80,
  height: 70,
  label: "JK-FF",
  sequential: true,
  pinPositions: {
    inputs: [[0, 10], [0, 35], [0, 60]], // J, K, CLK
    outputs: [[80, 20], [80, 50]],        // Q, Q'
  },
  evaluate: () => [false, true],
  evaluateSequential: (inputs, prevState, clockEdge) => {
    const j = inputs[0], k = inputs[1];
    const q = prevState.length > 0 ? prevState[0] : false;
    if (clockEdge) {
      let nextQ: boolean;
      if (!j && !k) nextQ = q;       // hold
      else if (j && !k) nextQ = true; // set
      else if (!j && k) nextQ = false; // reset
      else nextQ = !q;                // toggle (J=1, K=1)
      return { outputs: [nextQ, !nextQ], nextState: [nextQ] };
    }
    return { outputs: [q, !q], nextState: [q] };
  },
});

// ── SR_FLIP_FLOP ──
// Inputs: S, R, CLK. Outputs: Q, Q'.
// On rising edge: S=0,R=0 -> hold; S=1,R=0 -> set; S=0,R=1 -> reset; S=1,R=1 -> invalid (Q=1,Q'=1).
registerComponent({
  type: "SR_FLIP_FLOP",
  category: "memory",
  inputCount: 3,
  outputCount: 2,
  width: 80,
  height: 70,
  label: "SR-FF",
  sequential: true,
  pinPositions: {
    inputs: [[0, 10], [0, 35], [0, 60]], // S, R, CLK
    outputs: [[80, 20], [80, 50]],        // Q, Q'
  },
  evaluate: () => [false, true],
  evaluateSequential: (inputs, prevState, clockEdge) => {
    const s = inputs[0], r = inputs[1];
    const q = prevState.length > 0 ? prevState[0] : false;
    if (clockEdge) {
      let nextQ: boolean;
      if (!s && !r) nextQ = q;          // hold
      else if (s && !r) nextQ = true;    // set
      else if (!s && r) nextQ = false;   // reset
      else nextQ = true;                 // S=1,R=1: invalid state, convention Q=1
      const nextQBar = (s && r) ? true : !nextQ; // both HIGH in invalid state
      return { outputs: [nextQ, nextQBar], nextState: [nextQ] };
    }
    return { outputs: [q, !q], nextState: [q] };
  },
});

// ── REGISTER ──
// 1-bit register: Inputs: D, CLK, Enable. Outputs: Q.
// On rising edge with Enable=1: Q = D.
registerComponent({
  type: "REGISTER",
  category: "memory",
  inputCount: 3,
  outputCount: 1,
  width: 80,
  height: 70,
  label: "Register",
  sequential: true,
  pinPositions: {
    inputs: [[0, 10], [0, 35], [0, 60]], // D, CLK, Enable
    outputs: [[80, 35]],
  },
  evaluate: () => [false],
  evaluateSequential: (inputs, prevState, clockEdge) => {
    const d = inputs[0], enable = inputs[2];
    const q = prevState.length > 0 ? prevState[0] : false;
    if (clockEdge && enable) {
      return { outputs: [d], nextState: [d] };
    }
    return { outputs: [q], nextState: [q] };
  },
});

// ── COUNTER ──
// 1-bit counter: Input: CLK. Output: Q (toggles on each rising edge).
// State: current count bit.
registerComponent({
  type: "COUNTER",
  category: "memory",
  inputCount: 1,
  outputCount: 1,
  width: 80,
  height: 60,
  label: "Counter",
  sequential: true,
  pinPositions: {
    inputs: [[0, 30]],   // CLK
    outputs: [[80, 30]], // Q
  },
  evaluate: () => [false],
  evaluateSequential: (_inputs, prevState, clockEdge) => {
    const q = prevState.length > 0 ? prevState[0] : false;
    if (clockEdge) {
      const nextQ = !q; // toggle on each clock edge
      return { outputs: [nextQ], nextState: [nextQ] };
    }
    return { outputs: [q], nextState: [q] };
  },
});

// ── SHIFT_REGISTER ──
// 4-bit serial-in parallel-out shift register.
// Inputs: Serial-In, CLK. Outputs: Q3 (MSB), Q2, Q1, Q0 (LSB).
// On rising edge: shift all bits left, new bit enters at Q0.
registerComponent({
  type: "SHIFT_REGISTER",
  category: "memory",
  inputCount: 2,
  outputCount: 4,
  width: 100,
  height: 80,
  label: "Shift Reg",
  sequential: true,
  pinPositions: {
    inputs: [[0, 20], [0, 60]],                      // Serial-In, CLK
    outputs: [[100, 10], [100, 30], [100, 50], [100, 70]], // Q3, Q2, Q1, Q0
  },
  evaluate: () => [false, false, false, false],
  evaluateSequential: (inputs, prevState, clockEdge) => {
    // prevState = [Q3, Q2, Q1, Q0]
    const q3 = prevState.length > 0 ? prevState[0] : false;
    const q2 = prevState.length > 1 ? prevState[1] : false;
    const q1 = prevState.length > 2 ? prevState[2] : false;
    const q0 = prevState.length > 3 ? prevState[3] : false;
    if (clockEdge) {
      // Shift left: Q3 = old Q2, Q2 = old Q1, Q1 = old Q0, Q0 = Serial-In
      const newQ3 = q2;
      const newQ2 = q1;
      const newQ1 = q0;
      const newQ0 = inputs[0]; // Serial-In
      return {
        outputs: [newQ3, newQ2, newQ1, newQ0],
        nextState: [newQ3, newQ2, newQ1, newQ0],
      };
    }
    return { outputs: [q3, q2, q1, q0], nextState: [q3, q2, q1, q0] };
  },
});
