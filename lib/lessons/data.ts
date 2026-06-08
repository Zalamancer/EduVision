import type { Lesson } from "./types";

// ── Lesson 1: How a Half Adder Works ────────────────────────────────────────
const halfAdder: Lesson = {
  id: "lesson-half-adder",
  slug: "half-adder",
  title: "How a Half Adder Works",
  description:
    "Watch a half adder circuit build itself layer by layer. See how XOR and AND gates work together to add two bits.",
  category: "arithmetic",
  fullCircuit: {
    id: "lesson-half-adder-circuit",
    name: "Half Adder",
    components: [
      { id: "ha-a", type: "INPUT", x: 40, y: 80, rotation: 0, label: "A", value: false },
      { id: "ha-b", type: "INPUT", x: 40, y: 200, rotation: 0, label: "B", value: false },
      { id: "ha-xor", type: "XOR", x: 220, y: 80, rotation: 0, label: "XOR" },
      { id: "ha-and", type: "AND", x: 220, y: 200, rotation: 0, label: "AND" },
      { id: "ha-sum", type: "OUTPUT", x: 420, y: 80, rotation: 0, label: "Sum" },
      { id: "ha-carry", type: "OUTPUT", x: 420, y: 200, rotation: 0, label: "Carry" },
    ],
    wires: [
      { id: "ha-w1", from: { componentId: "ha-a", pinIndex: 0 }, to: { componentId: "ha-xor", pinIndex: 0 } },
      { id: "ha-w2", from: { componentId: "ha-b", pinIndex: 0 }, to: { componentId: "ha-xor", pinIndex: 1 } },
      { id: "ha-w3", from: { componentId: "ha-a", pinIndex: 0 }, to: { componentId: "ha-and", pinIndex: 0 } },
      { id: "ha-w4", from: { componentId: "ha-b", pinIndex: 0 }, to: { componentId: "ha-and", pinIndex: 1 } },
      { id: "ha-w5", from: { componentId: "ha-xor", pinIndex: 0 }, to: { componentId: "ha-sum", pinIndex: 0 } },
      { id: "ha-w6", from: { componentId: "ha-and", pinIndex: 0 }, to: { componentId: "ha-carry", pinIndex: 0 } },
    ],
  },
  stages: [
    {
      id: "ha-stage-1",
      revealComponentIds: ["ha-a", "ha-b"],
      revealWireIds: [],
      explanation: "A half adder takes two single-bit inputs.",
    },
    {
      id: "ha-stage-2",
      revealComponentIds: ["ha-xor"],
      revealWireIds: ["ha-w1", "ha-w2"],
      explanation: "XOR produces the Sum bit \u2014 1 when inputs differ.",
    },
    {
      id: "ha-stage-3",
      revealComponentIds: ["ha-and"],
      revealWireIds: ["ha-w3", "ha-w4"],
      explanation: "AND produces the Carry bit \u2014 1 when both inputs are 1.",
    },
    {
      id: "ha-stage-4",
      revealComponentIds: ["ha-sum", "ha-carry"],
      revealWireIds: ["ha-w5", "ha-w6"],
      explanation: "Together they compute 1-bit addition: Sum and Carry.",
    },
  ],
};

// ── Lesson 2: How a Full Adder Works ────────────────────────────────────────
const fullAdder: Lesson = {
  id: "lesson-full-adder",
  slug: "full-adder",
  title: "How a Full Adder Works",
  description:
    "Explore how a full adder extends the half adder by accepting a carry-in, enabling multi-bit addition chains.",
  category: "arithmetic",
  fullCircuit: {
    id: "lesson-full-adder-circuit",
    name: "Full Adder",
    components: [
      { id: "fa-a", type: "INPUT", x: 40, y: 60, rotation: 0, label: "A", value: false },
      { id: "fa-b", type: "INPUT", x: 40, y: 160, rotation: 0, label: "B", value: false },
      { id: "fa-cin", type: "INPUT", x: 40, y: 280, rotation: 0, label: "Cin", value: false },
      { id: "fa-xor1", type: "XOR", x: 200, y: 80, rotation: 0, label: "XOR1" },
      { id: "fa-xor2", type: "XOR", x: 360, y: 80, rotation: 0, label: "XOR2" },
      { id: "fa-and1", type: "AND", x: 200, y: 220, rotation: 0, label: "AND1" },
      { id: "fa-and2", type: "AND", x: 360, y: 220, rotation: 0, label: "AND2" },
      { id: "fa-or", type: "OR", x: 500, y: 220, rotation: 0, label: "OR" },
      { id: "fa-sum", type: "OUTPUT", x: 560, y: 80, rotation: 0, label: "Sum" },
      { id: "fa-cout", type: "OUTPUT", x: 620, y: 220, rotation: 0, label: "Cout" },
    ],
    wires: [
      // A,B -> XOR1
      { id: "fa-w1", from: { componentId: "fa-a", pinIndex: 0 }, to: { componentId: "fa-xor1", pinIndex: 0 } },
      { id: "fa-w2", from: { componentId: "fa-b", pinIndex: 0 }, to: { componentId: "fa-xor1", pinIndex: 1 } },
      // XOR1,Cin -> XOR2
      { id: "fa-w3", from: { componentId: "fa-xor1", pinIndex: 0 }, to: { componentId: "fa-xor2", pinIndex: 0 } },
      { id: "fa-w4", from: { componentId: "fa-cin", pinIndex: 0 }, to: { componentId: "fa-xor2", pinIndex: 1 } },
      // A,B -> AND1
      { id: "fa-w5", from: { componentId: "fa-a", pinIndex: 0 }, to: { componentId: "fa-and1", pinIndex: 0 } },
      { id: "fa-w6", from: { componentId: "fa-b", pinIndex: 0 }, to: { componentId: "fa-and1", pinIndex: 1 } },
      // XOR1,Cin -> AND2
      { id: "fa-w7", from: { componentId: "fa-xor1", pinIndex: 0 }, to: { componentId: "fa-and2", pinIndex: 0 } },
      { id: "fa-w8", from: { componentId: "fa-cin", pinIndex: 0 }, to: { componentId: "fa-and2", pinIndex: 1 } },
      // AND1,AND2 -> OR
      { id: "fa-w9", from: { componentId: "fa-and1", pinIndex: 0 }, to: { componentId: "fa-or", pinIndex: 0 } },
      { id: "fa-w10", from: { componentId: "fa-and2", pinIndex: 0 }, to: { componentId: "fa-or", pinIndex: 1 } },
      // XOR2 -> Sum, OR -> Cout
      { id: "fa-w11", from: { componentId: "fa-xor2", pinIndex: 0 }, to: { componentId: "fa-sum", pinIndex: 0 } },
      { id: "fa-w12", from: { componentId: "fa-or", pinIndex: 0 }, to: { componentId: "fa-cout", pinIndex: 0 } },
    ],
  },
  stages: [
    {
      id: "fa-stage-1",
      revealComponentIds: ["fa-a", "fa-b", "fa-cin"],
      revealWireIds: [],
      explanation: "A full adder has 3 inputs: A, B, and Carry-in.",
    },
    {
      id: "fa-stage-2",
      revealComponentIds: ["fa-xor1"],
      revealWireIds: ["fa-w1", "fa-w2"],
      explanation: "First XOR computes A \u2295 B.",
    },
    {
      id: "fa-stage-3",
      revealComponentIds: ["fa-xor2"],
      revealWireIds: ["fa-w3", "fa-w4"],
      explanation: "Second XOR adds the carry: Sum = A \u2295 B \u2295 Cin.",
    },
    {
      id: "fa-stage-4",
      revealComponentIds: ["fa-and1", "fa-and2"],
      revealWireIds: ["fa-w5", "fa-w6", "fa-w7", "fa-w8"],
      explanation: "Two AND gates detect carry conditions.",
    },
    {
      id: "fa-stage-5",
      revealComponentIds: ["fa-or"],
      revealWireIds: ["fa-w9", "fa-w10"],
      explanation: "OR combines carries: Cout = (A\u00B7B) + (Cin\u00B7(A\u2295B)).",
    },
    {
      id: "fa-stage-6",
      revealComponentIds: ["fa-sum", "fa-cout"],
      revealWireIds: ["fa-w11", "fa-w12"],
      explanation: "The complete full adder \u2014 chainable for multi-bit addition.",
    },
  ],
};

// ── Lesson 3: Inside a 2:1 Multiplexer ──────────────────────────────────────
const mux2to1: Lesson = {
  id: "lesson-mux-2to1",
  slug: "mux-2to1",
  title: "Inside a 2:1 Multiplexer",
  description:
    "Discover how a multiplexer selects between two data inputs using basic logic gates.",
  category: "selection",
  fullCircuit: {
    id: "lesson-mux-2to1-circuit",
    name: "2:1 Multiplexer",
    components: [
      { id: "mux-d0", type: "INPUT", x: 40, y: 60, rotation: 0, label: "D0", value: false },
      { id: "mux-d1", type: "INPUT", x: 40, y: 180, rotation: 0, label: "D1", value: false },
      { id: "mux-s", type: "INPUT", x: 40, y: 300, rotation: 0, label: "S", value: false },
      { id: "mux-not", type: "NOT", x: 180, y: 300, rotation: 0, label: "NOT" },
      { id: "mux-and1", type: "AND", x: 300, y: 60, rotation: 0, label: "AND1" },
      { id: "mux-and2", type: "AND", x: 300, y: 180, rotation: 0, label: "AND2" },
      { id: "mux-or", type: "OR", x: 440, y: 120, rotation: 0, label: "OR" },
      { id: "mux-y", type: "OUTPUT", x: 580, y: 120, rotation: 0, label: "Y" },
    ],
    wires: [
      // S -> NOT
      { id: "mux-w1", from: { componentId: "mux-s", pinIndex: 0 }, to: { componentId: "mux-not", pinIndex: 0 } },
      // D0 -> AND1 top, NOT -> AND1 bottom
      { id: "mux-w2", from: { componentId: "mux-d0", pinIndex: 0 }, to: { componentId: "mux-and1", pinIndex: 0 } },
      { id: "mux-w3", from: { componentId: "mux-not", pinIndex: 0 }, to: { componentId: "mux-and1", pinIndex: 1 } },
      // D1 -> AND2 top, S -> AND2 bottom
      { id: "mux-w4", from: { componentId: "mux-d1", pinIndex: 0 }, to: { componentId: "mux-and2", pinIndex: 0 } },
      { id: "mux-w5", from: { componentId: "mux-s", pinIndex: 0 }, to: { componentId: "mux-and2", pinIndex: 1 } },
      // AND1 -> OR top, AND2 -> OR bottom
      { id: "mux-w6", from: { componentId: "mux-and1", pinIndex: 0 }, to: { componentId: "mux-or", pinIndex: 0 } },
      { id: "mux-w7", from: { componentId: "mux-and2", pinIndex: 0 }, to: { componentId: "mux-or", pinIndex: 1 } },
      // OR -> Y
      { id: "mux-w8", from: { componentId: "mux-or", pinIndex: 0 }, to: { componentId: "mux-y", pinIndex: 0 } },
    ],
  },
  stages: [
    {
      id: "mux-stage-1",
      revealComponentIds: ["mux-d0", "mux-d1", "mux-s"],
      revealWireIds: [],
      explanation: "A MUX selects one of two data inputs based on a select signal.",
    },
    {
      id: "mux-stage-2",
      revealComponentIds: ["mux-not"],
      revealWireIds: ["mux-w1"],
      explanation: "NOT inverts S to create the complement.",
    },
    {
      id: "mux-stage-3",
      revealComponentIds: ["mux-and1"],
      revealWireIds: ["mux-w2", "mux-w3"],
      explanation: "When S=0, NOT(S)=1 enables D0 through AND1.",
    },
    {
      id: "mux-stage-4",
      revealComponentIds: ["mux-and2"],
      revealWireIds: ["mux-w4", "mux-w5"],
      explanation: "When S=1, S enables D1 through AND2.",
    },
    {
      id: "mux-stage-5",
      revealComponentIds: ["mux-or", "mux-y"],
      revealWireIds: ["mux-w6", "mux-w7", "mux-w8"],
      explanation: "OR combines both paths \u2014 exactly one is active at a time.",
    },
  ],
};

export const LESSONS: Lesson[] = [halfAdder, fullAdder, mux2to1];

export function getLesson(slug: string): Lesson | undefined {
  return LESSONS.find((l) => l.slug === slug);
}
