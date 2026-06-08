import { registerComponent } from "../component-registry";

// ── CLOCK ──
// 0 inputs, 1 output. Toggles on each simulation tick.
// Treated as a special source; toggling is handled by the simulation loop.
registerComponent({
  type: "CLOCK",
  category: "wiring",
  inputCount: 0,
  outputCount: 1,
  width: 60,
  height: 60,
  label: "Clock",
  sequential: true,
  pinPositions: {
    inputs: [],
    outputs: [[60, 30]],
  },
  evaluate: () => [false], // initial state; toggled externally
  evaluateSequential: (_inputs, prevState, clockEdge) => {
    const q = prevState.length > 0 ? prevState[0] : false;
    if (clockEdge) {
      return { outputs: [!q], nextState: [!q] };
    }
    return { outputs: [q], nextState: [q] };
  },
});

// ── CONSTANT ──
// 0 inputs, 1 output. Always outputs a fixed value (HIGH by default).
// The value is configured via component.value property.
registerComponent({
  type: "CONSTANT",
  category: "wiring",
  inputCount: 0,
  outputCount: 1,
  width: 60,
  height: 40,
  label: "Const",
  pinPositions: {
    inputs: [],
    outputs: [[60, 20]],
  },
  evaluate: () => [true], // default HIGH; overridden by component.value
});

// ── POWER ──
// 0 inputs, 1 output. Always HIGH (Vcc).
registerComponent({
  type: "POWER",
  category: "wiring",
  inputCount: 0,
  outputCount: 1,
  width: 40,
  height: 40,
  label: "Vcc",
  pinPositions: {
    inputs: [],
    outputs: [[20, 40]],
  },
  evaluate: () => [true],
});

// ── GROUND ──
// 0 inputs, 1 output. Always LOW (GND).
registerComponent({
  type: "GROUND",
  category: "wiring",
  inputCount: 0,
  outputCount: 1,
  width: 40,
  height: 40,
  label: "GND",
  pinPositions: {
    inputs: [],
    outputs: [[20, 40]],
  },
  evaluate: () => [false],
});

// ── PROBE ──
// 1 input, 0 outputs. Display-only component that shows signal value.
registerComponent({
  type: "PROBE",
  category: "wiring",
  inputCount: 1,
  outputCount: 0,
  width: 40,
  height: 40,
  label: "Probe",
  pinPositions: {
    inputs: [[0, 20]],
    outputs: [],
  },
  evaluate: () => [], // display-only, no outputs
});

// ── TUNNEL ──
// Named tunnel for long-distance connections.
// 1 input, 1 output. Acts as identity (passes signal through).
// Tunnels with the same label are logically connected.
registerComponent({
  type: "TUNNEL",
  category: "wiring",
  inputCount: 1,
  outputCount: 1,
  width: 60,
  height: 30,
  label: "Tunnel",
  pinPositions: {
    inputs: [[0, 15]],
    outputs: [[60, 15]],
  },
  evaluate: (i) => [i[0]], // identity
});

// ── SPLITTER ──
// Bit splitter/combiner for multi-bit signals.
// Simplified for single-bit: 1 input, 2 outputs (both mirror the input).
registerComponent({
  type: "SPLITTER",
  category: "wiring",
  inputCount: 1,
  outputCount: 2,
  width: 40,
  height: 40,
  label: "Splitter",
  pinPositions: {
    inputs: [[0, 20]],
    outputs: [[40, 10], [40, 30]],
  },
  evaluate: (i) => [i[0], i[0]], // fan-out: both outputs mirror input
});
