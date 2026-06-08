import { registerComponent } from "../component-registry";

// ── AND ──
registerComponent({
  type: "AND",
  category: "gate",
  inputCount: 2,
  outputCount: 1,
  width: 80,
  height: 60,
  label: "AND",
  pinPositions: { inputs: [[0, 15], [0, 45]], outputs: [[80, 30]] },
  evaluate: (i) => [i[0] && i[1]],
});

// ── OR ──
registerComponent({
  type: "OR",
  category: "gate",
  inputCount: 2,
  outputCount: 1,
  width: 80,
  height: 60,
  label: "OR",
  pinPositions: { inputs: [[5, 15], [5, 45]], outputs: [[80, 30]] },
  evaluate: (i) => [i[0] || i[1]],
});

// ── NOT ──
registerComponent({
  type: "NOT",
  category: "gate",
  inputCount: 1,
  outputCount: 1,
  width: 80,
  height: 60,
  label: "NOT",
  pinPositions: { inputs: [[0, 30]], outputs: [[80, 30]] },
  evaluate: (i) => [!i[0]],
});

// ── NAND ──
registerComponent({
  type: "NAND",
  category: "gate",
  inputCount: 2,
  outputCount: 1,
  width: 80,
  height: 60,
  label: "NAND",
  pinPositions: { inputs: [[0, 15], [0, 45]], outputs: [[80, 30]] },
  evaluate: (i) => [!(i[0] && i[1])],
});

// ── NOR ──
registerComponent({
  type: "NOR",
  category: "gate",
  inputCount: 2,
  outputCount: 1,
  width: 80,
  height: 60,
  label: "NOR",
  pinPositions: { inputs: [[5, 15], [5, 45]], outputs: [[80, 30]] },
  evaluate: (i) => [!(i[0] || i[1])],
});

// ── XOR ──
registerComponent({
  type: "XOR",
  category: "gate",
  inputCount: 2,
  outputCount: 1,
  width: 80,
  height: 60,
  label: "XOR",
  pinPositions: { inputs: [[5, 15], [5, 45]], outputs: [[80, 30]] },
  evaluate: (i) => [i[0] !== i[1]],
});

// ── XNOR ──
registerComponent({
  type: "XNOR",
  category: "gate",
  inputCount: 2,
  outputCount: 1,
  width: 80,
  height: 60,
  label: "XNOR",
  pinPositions: { inputs: [[5, 15], [5, 45]], outputs: [[80, 30]] },
  evaluate: (i) => [i[0] === i[1]],
});

// ── BUFFER ──
registerComponent({
  type: "BUFFER",
  category: "gate",
  inputCount: 1,
  outputCount: 1,
  width: 80,
  height: 60,
  label: "Buffer",
  pinPositions: { inputs: [[0, 30]], outputs: [[80, 30]] },
  evaluate: (i) => [i[0]],
});

// ── INPUT ──
registerComponent({
  type: "INPUT",
  category: "gate",
  inputCount: 0,
  outputCount: 1,
  width: 80,
  height: 60,
  label: "Input",
  pinPositions: { inputs: [], outputs: [[80, 30]] },
  evaluate: () => [false], // handled externally via component.value
});

// ── OUTPUT ──
registerComponent({
  type: "OUTPUT",
  category: "gate",
  inputCount: 1,
  outputCount: 0,
  width: 80,
  height: 60,
  label: "Output",
  pinPositions: { inputs: [[0, 30]], outputs: [] },
  evaluate: () => [],
});

// ── CONTROLLED_BUFFER ──
// Tri-state buffer: output = data when enable is HIGH, disconnected (LOW) otherwise
registerComponent({
  type: "CONTROLLED_BUFFER",
  category: "gate",
  inputCount: 2,
  outputCount: 1,
  width: 80,
  height: 60,
  label: "Ctrl Buffer",
  pinPositions: { inputs: [[0, 30], [40, 60]], outputs: [[80, 30]] },
  evaluate: (i) => [i[1] ? i[0] : false], // [data, enable] -> enable ? data : disconnected
});

// ── CONTROLLED_INVERTER ──
// Tri-state inverter: output = NOT data when enable is HIGH, disconnected (LOW) otherwise
registerComponent({
  type: "CONTROLLED_INVERTER",
  category: "gate",
  inputCount: 2,
  outputCount: 1,
  width: 80,
  height: 60,
  label: "Ctrl Inverter",
  pinPositions: { inputs: [[0, 30], [40, 60]], outputs: [[80, 30]] },
  evaluate: (i) => [i[1] ? !i[0] : false], // [data, enable] -> enable ? !data : disconnected
});
