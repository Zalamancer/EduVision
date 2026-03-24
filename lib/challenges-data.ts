import { Circuit } from "./sim-engine/types";

export interface Challenge {
  id: string;
  slug: string;
  title: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  instructions: string; // markdown
  starterCircuit?: Circuit;
  solutionCircuit: Circuit;
}

export const CHALLENGES: Challenge[] = [
  {
    id: "ch1",
    slug: "and-from-nand",
    title: "Build an AND gate from NAND gates",
    difficulty: "beginner",
    instructions: `## Challenge: AND from NAND

**Goal:** Build a circuit that behaves exactly like an AND gate — but using **only NAND gates**.

### Background
The NAND gate is called a **universal gate** because any logic function can be implemented using only NAND gates.

To convert NAND → AND:
1. A NAND gate outputs **NOT(A·B)**
2. To get AND, you need to invert the NAND output
3. A NAND gate with both inputs tied together acts as a **NOT** gate

### Your task
1. Add **two Input switches** (A and B)
2. Use **NAND gates only** (no AND gates!) to produce output **Y = A·B**
3. Add an **Output LED**
4. Verify using the truth table — it should match an AND gate

### Expected truth table
| A | B | Y |
|---|---|---|
| 0 | 0 | 0 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 1 |

**Hint:** You'll need exactly 2 NAND gates.`,
    solutionCircuit: {
      id: "sol-ch1",
      name: "AND from NAND (solution)",
      components: [
        { id: "a", type: "INPUT", x: 40, y: 80, rotation: 0, label: "A", value: false },
        { id: "b", type: "INPUT", x: 40, y: 160, rotation: 0, label: "B", value: false },
        { id: "nand1", type: "NAND", x: 200, y: 100, rotation: 0, label: "NAND1" },
        { id: "nand2", type: "NAND", x: 360, y: 100, rotation: 0, label: "NAND2" },
        { id: "out", type: "OUTPUT", x: 500, y: 100, rotation: 0, label: "Y" },
      ],
      wires: [
        { id: "w1", from: { componentId: "a", pinIndex: 0 }, to: { componentId: "nand1", pinIndex: 0 } },
        { id: "w2", from: { componentId: "b", pinIndex: 0 }, to: { componentId: "nand1", pinIndex: 1 } },
        { id: "w3", from: { componentId: "nand1", pinIndex: 0 }, to: { componentId: "nand2", pinIndex: 0 } },
        { id: "w4", from: { componentId: "nand1", pinIndex: 0 }, to: { componentId: "nand2", pinIndex: 1 } },
        { id: "w5", from: { componentId: "nand2", pinIndex: 0 }, to: { componentId: "out", pinIndex: 0 } },
      ],
    },
  },
  {
    id: "ch2",
    slug: "half-adder",
    title: "Build a half adder",
    difficulty: "beginner",
    instructions: `## Challenge: Half Adder

**Goal:** Build a circuit that adds two 1-bit numbers and produces a **Sum** and **Carry** output.

### Background
A **half adder** is one of the most fundamental arithmetic circuits. It adds two bits:

- **Sum** = A XOR B (the least significant bit of A+B)
- **Carry** = A AND B (the carry into the next bit position)

### Your task
1. Add **two Input switches** (A and B)
2. Add **two Output LEDs** labeled Sum and Carry
3. Use the correct gates to implement both outputs

### Expected truth table
| A | B | Sum | Carry |
|---|---|-----|-------|
| 0 | 0 |  0  |   0   |
| 0 | 1 |  1  |   0   |
| 1 | 0 |  1  |   0   |
| 1 | 1 |  0  |   1   |

**Hint:** You need an XOR gate for Sum and an AND gate for Carry. Both share the same inputs.`,
    solutionCircuit: {
      id: "sol-ch2",
      name: "Half Adder (solution)",
      components: [
        { id: "a", type: "INPUT", x: 40, y: 80, rotation: 0, label: "A", value: false },
        { id: "b", type: "INPUT", x: 40, y: 160, rotation: 0, label: "B", value: false },
        { id: "xor1", type: "XOR", x: 200, y: 80, rotation: 0, label: "XOR1" },
        { id: "and1", type: "AND", x: 200, y: 180, rotation: 0, label: "AND1" },
        { id: "sum", type: "OUTPUT", x: 360, y: 80, rotation: 0, label: "Sum" },
        { id: "carry", type: "OUTPUT", x: 360, y: 180, rotation: 0, label: "Carry" },
      ],
      wires: [
        { id: "w1", from: { componentId: "a", pinIndex: 0 }, to: { componentId: "xor1", pinIndex: 0 } },
        { id: "w2", from: { componentId: "b", pinIndex: 0 }, to: { componentId: "xor1", pinIndex: 1 } },
        { id: "w3", from: { componentId: "a", pinIndex: 0 }, to: { componentId: "and1", pinIndex: 0 } },
        { id: "w4", from: { componentId: "b", pinIndex: 0 }, to: { componentId: "and1", pinIndex: 1 } },
        { id: "w5", from: { componentId: "xor1", pinIndex: 0 }, to: { componentId: "sum", pinIndex: 0 } },
        { id: "w6", from: { componentId: "and1", pinIndex: 0 }, to: { componentId: "carry", pinIndex: 0 } },
      ],
    },
  },
  {
    id: "ch3",
    slug: "xor-from-gates",
    title: "Output 1 only when exactly one input is 1",
    difficulty: "beginner",
    instructions: `## Challenge: Exclusive OR

**Goal:** Build a circuit with **two inputs (A, B)** that outputs 1 if and only if **exactly one** input is HIGH.

### Background
This is the definition of the **XOR (Exclusive OR)** gate! But your challenge is to build it from AND, OR, and NOT gates — without using an XOR gate directly.

XOR can be expressed as:
> Y = (A OR B) AND NOT(A AND B)

Which means: "A or B is HIGH, but not both."

### Your task
1. Add inputs A and B
2. Build Y = (A + B) · ¬(A · B) using basic gates
3. Add an Output LED

### Expected truth table
| A | B | Y |
|---|---|---|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

**Hint:** You need OR, AND, NOT, and AND gates.`,
    solutionCircuit: {
      id: "sol-ch3",
      name: "XOR from gates (solution)",
      components: [
        { id: "a", type: "INPUT", x: 40, y: 80, rotation: 0, label: "A", value: false },
        { id: "b", type: "INPUT", x: 40, y: 180, rotation: 0, label: "B", value: false },
        { id: "or1", type: "OR", x: 200, y: 80, rotation: 0, label: "OR1" },
        { id: "and1", type: "AND", x: 200, y: 200, rotation: 0, label: "AND1" },
        { id: "not1", type: "NOT", x: 360, y: 200, rotation: 0, label: "NOT1" },
        { id: "and2", type: "AND", x: 480, y: 120, rotation: 0, label: "AND2" },
        { id: "out", type: "OUTPUT", x: 620, y: 120, rotation: 0, label: "Y" },
      ],
      wires: [
        { id: "w1", from: { componentId: "a", pinIndex: 0 }, to: { componentId: "or1", pinIndex: 0 } },
        { id: "w2", from: { componentId: "b", pinIndex: 0 }, to: { componentId: "or1", pinIndex: 1 } },
        { id: "w3", from: { componentId: "a", pinIndex: 0 }, to: { componentId: "and1", pinIndex: 0 } },
        { id: "w4", from: { componentId: "b", pinIndex: 0 }, to: { componentId: "and1", pinIndex: 1 } },
        { id: "w5", from: { componentId: "and1", pinIndex: 0 }, to: { componentId: "not1", pinIndex: 0 } },
        { id: "w6", from: { componentId: "or1", pinIndex: 0 }, to: { componentId: "and2", pinIndex: 0 } },
        { id: "w7", from: { componentId: "not1", pinIndex: 0 }, to: { componentId: "and2", pinIndex: 1 } },
        { id: "w8", from: { componentId: "and2", pinIndex: 0 }, to: { componentId: "out", pinIndex: 0 } },
      ],
    },
  },
];

export function getChallenge(slug: string): Challenge | undefined {
  return CHALLENGES.find((c) => c.slug === slug);
}
