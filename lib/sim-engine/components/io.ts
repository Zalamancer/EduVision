import { registerComponent } from "../component-registry";

// ── BUTTON ──
// Momentary push button. 0 inputs, 1 output.
// Like INPUT but resets to LOW when released. Controlled via component.value.
registerComponent({
  type: "BUTTON",
  category: "io",
  inputCount: 0,
  outputCount: 1,
  width: 60,
  height: 60,
  label: "Button",
  pinPositions: {
    inputs: [],
    outputs: [[60, 30]],
  },
  evaluate: () => [false], // default LOW; component.value controls press state
});

// ── SEVEN_SEGMENT ──
// 7-segment display. 7 inputs (a-g segments), 0 outputs.
// Display-only: segments a through g control the seven segments.
// Standard segment mapping:
//   a = top, b = upper-right, c = lower-right, d = bottom,
//   e = lower-left, f = upper-left, g = middle.
registerComponent({
  type: "SEVEN_SEGMENT",
  category: "io",
  inputCount: 7,
  outputCount: 0,
  width: 60,
  height: 80,
  label: "7-Seg",
  pinPositions: {
    inputs: [
      [0, 8],  // a (top)
      [0, 18], // b (upper-right)
      [0, 28], // c (lower-right)
      [0, 38], // d (bottom)
      [0, 48], // e (lower-left)
      [0, 58], // f (upper-left)
      [0, 68], // g (middle)
    ],
    outputs: [],
  },
  evaluate: () => [], // display-only
});

// ── HEX_DISPLAY ──
// Hexadecimal display. 4 inputs (binary), 0 outputs.
// Displays the hex digit corresponding to the 4-bit binary input.
registerComponent({
  type: "HEX_DISPLAY",
  category: "io",
  inputCount: 4,
  outputCount: 0,
  width: 60,
  height: 60,
  label: "Hex Disp",
  pinPositions: {
    inputs: [
      [0, 8],  // bit 3 (MSB)
      [0, 22], // bit 2
      [0, 38], // bit 1
      [0, 52], // bit 0 (LSB)
    ],
    outputs: [],
  },
  evaluate: () => [], // display-only
});

// ── LED_MATRIX ──
// 4-input LED matrix (2x2 grid). Display-only.
// Inputs control individual LEDs in the matrix.
registerComponent({
  type: "LED_MATRIX",
  category: "io",
  inputCount: 4,
  outputCount: 0,
  width: 60,
  height: 60,
  label: "LED Matrix",
  pinPositions: {
    inputs: [
      [0, 8],  // LED 0 (top-left)
      [0, 22], // LED 1 (top-right)
      [0, 38], // LED 2 (bottom-left)
      [0, 52], // LED 3 (bottom-right)
    ],
    outputs: [],
  },
  evaluate: () => [], // display-only
});
