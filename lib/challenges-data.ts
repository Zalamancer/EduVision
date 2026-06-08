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

  // ── Challenge 4: OR from NAND ──────────────────────────────────────
  {
    id: "ch4",
    slug: "or-from-nand",
    title: "Build an OR gate from NAND gates",
    difficulty: "beginner",
    instructions: `## Challenge: OR from NAND

**Goal:** Build a circuit that behaves exactly like an OR gate — but using **only NAND gates**.

### Background
Since NAND is a universal gate, you can build OR from it too. The trick uses **De Morgan's law**:

> A OR B = NOT(NOT(A) AND NOT(B)) = NAND(NOT(A), NOT(B))

A NOT gate can be made by tying both inputs of a NAND gate together.

### Your task
1. Add **two Input switches** (A and B)
2. Use **NAND gates only** to produce output **Y = A + B**
3. Add an **Output LED**

### Expected truth table
| A | B | Y |
|---|---|---|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 1 |

**Hint:** You'll need exactly 3 NAND gates — two acting as NOT (tied inputs), then one final NAND.`,
    solutionCircuit: {
      id: "sol-ch4",
      name: "OR from NAND (solution)",
      components: [
        { id: "a", type: "INPUT", x: 40, y: 80, rotation: 0, label: "A", value: false },
        { id: "b", type: "INPUT", x: 40, y: 200, rotation: 0, label: "B", value: false },
        { id: "nand1", type: "NAND", x: 200, y: 80, rotation: 0, label: "NOT-A" },
        { id: "nand2", type: "NAND", x: 200, y: 200, rotation: 0, label: "NOT-B" },
        { id: "nand3", type: "NAND", x: 360, y: 140, rotation: 0, label: "NAND3" },
        { id: "out", type: "OUTPUT", x: 520, y: 140, rotation: 0, label: "Y" },
      ],
      wires: [
        { id: "w1", from: { componentId: "a", pinIndex: 0 }, to: { componentId: "nand1", pinIndex: 0 } },
        { id: "w2", from: { componentId: "a", pinIndex: 0 }, to: { componentId: "nand1", pinIndex: 1 } },
        { id: "w3", from: { componentId: "b", pinIndex: 0 }, to: { componentId: "nand2", pinIndex: 0 } },
        { id: "w4", from: { componentId: "b", pinIndex: 0 }, to: { componentId: "nand2", pinIndex: 1 } },
        { id: "w5", from: { componentId: "nand1", pinIndex: 0 }, to: { componentId: "nand3", pinIndex: 0 } },
        { id: "w6", from: { componentId: "nand2", pinIndex: 0 }, to: { componentId: "nand3", pinIndex: 1 } },
        { id: "w7", from: { componentId: "nand3", pinIndex: 0 }, to: { componentId: "out", pinIndex: 0 } },
      ],
    },
  },

  // ── Challenge 5: XNOR gate ────────────────────────────────────────
  {
    id: "ch5",
    slug: "xnor-gate",
    title: "Build an XNOR gate",
    difficulty: "beginner",
    instructions: `## Challenge: XNOR Gate

**Goal:** Build a circuit that outputs 1 when **both inputs match** (both 0 or both 1).

### Background
The **XNOR** gate is the complement of XOR. It acts as an **equality detector**:

> Y = NOT(A XOR B)

XNOR outputs 1 when A equals B, and 0 when they differ.

### Your task
1. Add **two Input switches** (A and B)
2. Use an **XOR gate** followed by a **NOT gate**
3. Add an **Output LED**

### Expected truth table
| A | B | Y |
|---|---|---|
| 0 | 0 | 1 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 1 |

**Hint:** Just 2 gates — XOR then NOT.`,
    solutionCircuit: {
      id: "sol-ch5",
      name: "XNOR gate (solution)",
      components: [
        { id: "a", type: "INPUT", x: 40, y: 80, rotation: 0, label: "A", value: false },
        { id: "b", type: "INPUT", x: 40, y: 180, rotation: 0, label: "B", value: false },
        { id: "xor1", type: "XOR", x: 200, y: 120, rotation: 0, label: "XOR1" },
        { id: "not1", type: "NOT", x: 360, y: 120, rotation: 0, label: "NOT1" },
        { id: "out", type: "OUTPUT", x: 520, y: 120, rotation: 0, label: "Y" },
      ],
      wires: [
        { id: "w1", from: { componentId: "a", pinIndex: 0 }, to: { componentId: "xor1", pinIndex: 0 } },
        { id: "w2", from: { componentId: "b", pinIndex: 0 }, to: { componentId: "xor1", pinIndex: 1 } },
        { id: "w3", from: { componentId: "xor1", pinIndex: 0 }, to: { componentId: "not1", pinIndex: 0 } },
        { id: "w4", from: { componentId: "not1", pinIndex: 0 }, to: { componentId: "out", pinIndex: 0 } },
      ],
    },
  },

  // ── Challenge 6: NOR implementation ───────────────────────────────
  {
    id: "ch6",
    slug: "nor-implementation",
    title: "Build a NOR gate",
    difficulty: "beginner",
    instructions: `## Challenge: NOR Gate

**Goal:** Build a circuit that behaves like a **NOR gate** using an OR gate followed by a NOT gate.

### Background
The **NOR** gate outputs 1 only when **both inputs are 0**. Like NAND, NOR is also a universal gate.

> Y = NOT(A OR B)

### Your task
1. Add **two Input switches** (A and B)
2. Use an **OR gate** followed by a **NOT gate**
3. Add an **Output LED**

### Expected truth table
| A | B | Y |
|---|---|---|
| 0 | 0 | 1 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 0 |

**Hint:** Just 2 gates — OR then NOT.`,
    solutionCircuit: {
      id: "sol-ch6",
      name: "NOR implementation (solution)",
      components: [
        { id: "a", type: "INPUT", x: 40, y: 80, rotation: 0, label: "A", value: false },
        { id: "b", type: "INPUT", x: 40, y: 180, rotation: 0, label: "B", value: false },
        { id: "or1", type: "OR", x: 200, y: 120, rotation: 0, label: "OR1" },
        { id: "not1", type: "NOT", x: 360, y: 120, rotation: 0, label: "NOT1" },
        { id: "out", type: "OUTPUT", x: 520, y: 120, rotation: 0, label: "Y" },
      ],
      wires: [
        { id: "w1", from: { componentId: "a", pinIndex: 0 }, to: { componentId: "or1", pinIndex: 0 } },
        { id: "w2", from: { componentId: "b", pinIndex: 0 }, to: { componentId: "or1", pinIndex: 1 } },
        { id: "w3", from: { componentId: "or1", pinIndex: 0 }, to: { componentId: "not1", pinIndex: 0 } },
        { id: "w4", from: { componentId: "not1", pinIndex: 0 }, to: { componentId: "out", pinIndex: 0 } },
      ],
    },
  },

  // ── Challenge 7: Full Adder ───────────────────────────────────────
  {
    id: "ch7",
    slug: "full-adder",
    title: "Build a full adder",
    difficulty: "intermediate",
    instructions: `## Challenge: Full Adder

**Goal:** Build a **full adder** that adds three 1-bit inputs: A, B, and Carry-in (Cin), producing Sum and Carry-out (Cout).

### Background
A full adder extends the half adder by accepting a carry from a previous stage:

- **Sum** = A XOR B XOR Cin
- **Cout** = (A AND B) OR (Cin AND (A XOR B))

This is the building block for multi-bit addition.

### Your task
1. Add **three Input switches** (A, B, Cin)
2. Use XOR, AND, and OR gates to compute both outputs
3. Add **two Output LEDs** (Sum and Cout)

### Expected truth table
| A | B | Cin | Sum | Cout |
|---|---|-----|-----|------|
| 0 | 0 |  0  |  0  |  0   |
| 0 | 0 |  1  |  1  |  0   |
| 0 | 1 |  0  |  1  |  0   |
| 0 | 1 |  1  |  0  |  1   |
| 1 | 0 |  0  |  1  |  0   |
| 1 | 0 |  1  |  0  |  1   |
| 1 | 1 |  0  |  0  |  1   |
| 1 | 1 |  1  |  1  |  1   |

**Hint:** You need 2 XOR gates, 2 AND gates, and 1 OR gate.`,
    solutionCircuit: {
      id: "sol-ch7",
      name: "Full Adder (solution)",
      components: [
        { id: "a", type: "INPUT", x: 40, y: 60, rotation: 0, label: "A", value: false },
        { id: "b", type: "INPUT", x: 40, y: 160, rotation: 0, label: "B", value: false },
        { id: "cin", type: "INPUT", x: 40, y: 260, rotation: 0, label: "Cin", value: false },
        { id: "xor1", type: "XOR", x: 200, y: 100, rotation: 0, label: "XOR1" },
        { id: "and1", type: "AND", x: 200, y: 260, rotation: 0, label: "AND1" },
        { id: "xor2", type: "XOR", x: 360, y: 80, rotation: 0, label: "XOR2" },
        { id: "and2", type: "AND", x: 360, y: 200, rotation: 0, label: "AND2" },
        { id: "or1", type: "OR", x: 520, y: 230, rotation: 0, label: "OR1" },
        { id: "sum", type: "OUTPUT", x: 540, y: 80, rotation: 0, label: "Sum" },
        { id: "cout", type: "OUTPUT", x: 680, y: 230, rotation: 0, label: "Cout" },
      ],
      wires: [
        { id: "w1", from: { componentId: "a", pinIndex: 0 }, to: { componentId: "xor1", pinIndex: 0 } },
        { id: "w2", from: { componentId: "b", pinIndex: 0 }, to: { componentId: "xor1", pinIndex: 1 } },
        { id: "w3", from: { componentId: "a", pinIndex: 0 }, to: { componentId: "and1", pinIndex: 0 } },
        { id: "w4", from: { componentId: "b", pinIndex: 0 }, to: { componentId: "and1", pinIndex: 1 } },
        { id: "w5", from: { componentId: "xor1", pinIndex: 0 }, to: { componentId: "xor2", pinIndex: 0 } },
        { id: "w6", from: { componentId: "cin", pinIndex: 0 }, to: { componentId: "xor2", pinIndex: 1 } },
        { id: "w7", from: { componentId: "xor1", pinIndex: 0 }, to: { componentId: "and2", pinIndex: 0 } },
        { id: "w8", from: { componentId: "cin", pinIndex: 0 }, to: { componentId: "and2", pinIndex: 1 } },
        { id: "w9", from: { componentId: "and1", pinIndex: 0 }, to: { componentId: "or1", pinIndex: 0 } },
        { id: "w10", from: { componentId: "and2", pinIndex: 0 }, to: { componentId: "or1", pinIndex: 1 } },
        { id: "w11", from: { componentId: "xor2", pinIndex: 0 }, to: { componentId: "sum", pinIndex: 0 } },
        { id: "w12", from: { componentId: "or1", pinIndex: 0 }, to: { componentId: "cout", pinIndex: 0 } },
      ],
    },
  },

  // ── Challenge 8: 2-to-1 Multiplexer ──────────────────────────────
  {
    id: "ch8",
    slug: "2to1-mux",
    title: "Build a 2:1 multiplexer",
    difficulty: "intermediate",
    instructions: `## Challenge: 2:1 Multiplexer

**Goal:** Build a **2:1 multiplexer** that selects one of two data inputs based on a select signal.

### Background
A multiplexer (MUX) is a data selector. For a 2:1 MUX:

> Y = (NOT(S) AND D0) OR (S AND D1)

When S=0, Y follows D0. When S=1, Y follows D1.

### Your task
1. Add **three Input switches** (D0, D1, S)
2. Use NOT, AND, and OR gates to implement the MUX
3. Add an **Output LED** (Y)

### Expected truth table
| D0 | D1 | S | Y |
|----|----|---|---|
|  0 |  0 | 0 | 0 |
|  0 |  0 | 1 | 0 |
|  0 |  1 | 0 | 0 |
|  0 |  1 | 1 | 1 |
|  1 |  0 | 0 | 1 |
|  1 |  0 | 1 | 0 |
|  1 |  1 | 0 | 1 |
|  1 |  1 | 1 | 1 |

**Hint:** You need 1 NOT, 2 AND, and 1 OR gate.`,
    solutionCircuit: {
      id: "sol-ch8",
      name: "2:1 MUX (solution)",
      components: [
        { id: "d0", type: "INPUT", x: 40, y: 60, rotation: 0, label: "D0", value: false },
        { id: "d1", type: "INPUT", x: 40, y: 160, rotation: 0, label: "D1", value: false },
        { id: "s", type: "INPUT", x: 40, y: 260, rotation: 0, label: "S", value: false },
        { id: "not1", type: "NOT", x: 200, y: 260, rotation: 0, label: "NOT-S" },
        { id: "and1", type: "AND", x: 360, y: 80, rotation: 0, label: "AND1" },
        { id: "and2", type: "AND", x: 360, y: 200, rotation: 0, label: "AND2" },
        { id: "or1", type: "OR", x: 520, y: 140, rotation: 0, label: "OR1" },
        { id: "out", type: "OUTPUT", x: 680, y: 140, rotation: 0, label: "Y" },
      ],
      wires: [
        { id: "w1", from: { componentId: "s", pinIndex: 0 }, to: { componentId: "not1", pinIndex: 0 } },
        { id: "w2", from: { componentId: "d0", pinIndex: 0 }, to: { componentId: "and1", pinIndex: 0 } },
        { id: "w3", from: { componentId: "not1", pinIndex: 0 }, to: { componentId: "and1", pinIndex: 1 } },
        { id: "w4", from: { componentId: "d1", pinIndex: 0 }, to: { componentId: "and2", pinIndex: 0 } },
        { id: "w5", from: { componentId: "s", pinIndex: 0 }, to: { componentId: "and2", pinIndex: 1 } },
        { id: "w6", from: { componentId: "and1", pinIndex: 0 }, to: { componentId: "or1", pinIndex: 0 } },
        { id: "w7", from: { componentId: "and2", pinIndex: 0 }, to: { componentId: "or1", pinIndex: 1 } },
        { id: "w8", from: { componentId: "or1", pinIndex: 0 }, to: { componentId: "out", pinIndex: 0 } },
      ],
    },
  },

  // ── Challenge 9: Full Adder Chain ─────────────────────────────────
  {
    id: "ch9",
    slug: "full-adder-chain",
    title: "Chain two full adders for 2-bit addition",
    difficulty: "intermediate",
    instructions: `## Challenge: 2-Bit Adder (Full Adder Chain)

**Goal:** Chain **two FULL_ADDER blocks** to add two 2-bit numbers.

### Background
Multi-bit addition works by connecting the carry-out of one adder to the carry-in of the next. For 2-bit addition:

- **FA0** adds A0 + B0 + 0 (no initial carry) → produces S0 and C0
- **FA1** adds A1 + B1 + C0 (carry from FA0) → produces S1 and Cout

### Your task
1. Connect the **four inputs** (A1, A0, B1, B0) to the correct full adder pins
2. Wire the **carry chain** from FA0's Cout to FA1's Cin
3. Connect the **three outputs** (S1, S0, Cout)

**Example:** A=11 (3), B=01 (1) → S=100 (4), so S1=1, S0=0, Cout=1? No — Cout=1, S1=0, S0=0. Actually: 11+01 = 3+1 = 4 = 100, so Cout=1, S1=0, S0=0.

### Expected behavior
| A1 A0 | B1 B0 | Cout S1 S0 |
|-------|-------|------------|
|  0 0  |  0 0  |  0  0  0   |
|  0 1  |  0 1  |  0  1  0   |
|  1 0  |  0 1  |  0  1  1   |
|  1 1  |  1 1  |  1  1  0   |

**Hint:** FA0's Cin should have a constant low input. Use the FULL_ADDER compound block.`,
    starterCircuit: {
      id: "starter-ch9",
      name: "Full Adder Chain (starter)",
      components: [
        { id: "a1", type: "INPUT", x: 40, y: 60, rotation: 0, label: "A1", value: false },
        { id: "a0", type: "INPUT", x: 40, y: 140, rotation: 0, label: "A0", value: false },
        { id: "b1", type: "INPUT", x: 40, y: 220, rotation: 0, label: "B1", value: false },
        { id: "b0", type: "INPUT", x: 40, y: 300, rotation: 0, label: "B0", value: false },
        { id: "gnd", type: "INPUT", x: 40, y: 380, rotation: 0, label: "GND", value: false },
        { id: "s1", type: "OUTPUT", x: 600, y: 80, rotation: 0, label: "S1" },
        { id: "s0", type: "OUTPUT", x: 600, y: 200, rotation: 0, label: "S0" },
        { id: "cout", type: "OUTPUT", x: 600, y: 320, rotation: 0, label: "Cout" },
      ],
      wires: [],
    },
    solutionCircuit: {
      id: "sol-ch9",
      name: "Full Adder Chain (solution)",
      components: [
        { id: "a1", type: "INPUT", x: 40, y: 60, rotation: 0, label: "A1", value: false },
        { id: "a0", type: "INPUT", x: 40, y: 140, rotation: 0, label: "A0", value: false },
        { id: "b1", type: "INPUT", x: 40, y: 220, rotation: 0, label: "B1", value: false },
        { id: "b0", type: "INPUT", x: 40, y: 300, rotation: 0, label: "B0", value: false },
        { id: "gnd", type: "INPUT", x: 40, y: 380, rotation: 0, label: "GND", value: false },
        { id: "fa0", type: "FULL_ADDER", x: 240, y: 220, rotation: 0, label: "FA0" },
        { id: "fa1", type: "FULL_ADDER", x: 420, y: 100, rotation: 0, label: "FA1" },
        { id: "s1", type: "OUTPUT", x: 600, y: 80, rotation: 0, label: "S1" },
        { id: "s0", type: "OUTPUT", x: 600, y: 200, rotation: 0, label: "S0" },
        { id: "cout", type: "OUTPUT", x: 600, y: 320, rotation: 0, label: "Cout" },
      ],
      wires: [
        { id: "w1", from: { componentId: "a0", pinIndex: 0 }, to: { componentId: "fa0", pinIndex: 0 } },
        { id: "w2", from: { componentId: "b0", pinIndex: 0 }, to: { componentId: "fa0", pinIndex: 1 } },
        { id: "w3", from: { componentId: "gnd", pinIndex: 0 }, to: { componentId: "fa0", pinIndex: 2 } },
        { id: "w4", from: { componentId: "a1", pinIndex: 0 }, to: { componentId: "fa1", pinIndex: 0 } },
        { id: "w5", from: { componentId: "b1", pinIndex: 0 }, to: { componentId: "fa1", pinIndex: 1 } },
        { id: "w6", from: { componentId: "fa0", pinIndex: 1 }, to: { componentId: "fa1", pinIndex: 2 } },
        { id: "w7", from: { componentId: "fa0", pinIndex: 0 }, to: { componentId: "s0", pinIndex: 0 } },
        { id: "w8", from: { componentId: "fa1", pinIndex: 0 }, to: { componentId: "s1", pinIndex: 0 } },
        { id: "w9", from: { componentId: "fa1", pinIndex: 1 }, to: { componentId: "cout", pinIndex: 0 } },
      ],
    },
  },

  // ── Challenge 10: 2-Bit Priority Circuit ──────────────────────────
  {
    id: "ch10",
    slug: "priority-2bit",
    title: "Build a 2-bit priority circuit",
    difficulty: "intermediate",
    instructions: `## Challenge: 2-Bit Priority Circuit

**Goal:** Build a circuit that grants access to the **highest-priority** request.

### Background
Priority circuits are used in computer architecture for interrupt handling and bus arbitration. In this 2-bit version:

- R1 has **higher priority** than R0
- G1 = R1 (highest priority always granted if requested)
- G0 = R0 AND NOT(R1) (only granted if R1 is NOT requesting)

### Your task
1. Add **two Input switches** (R1, R0)
2. G1 is simply R1 (wire it directly)
3. G0 = R0 AND NOT(R1) — use a NOT and an AND gate
4. Add **two Output LEDs** (G1, G0)

### Expected truth table
| R1 | R0 | G1 | G0 |
|----|----|----|-----|
|  0 |  0 |  0 |  0  |
|  0 |  1 |  0 |  1  |
|  1 |  0 |  1 |  0  |
|  1 |  1 |  1 |  0  |

**Hint:** Only 2 gates needed — 1 NOT and 1 AND.`,
    solutionCircuit: {
      id: "sol-ch10",
      name: "2-bit Priority (solution)",
      components: [
        { id: "r1", type: "INPUT", x: 40, y: 80, rotation: 0, label: "R1", value: false },
        { id: "r0", type: "INPUT", x: 40, y: 200, rotation: 0, label: "R0", value: false },
        { id: "not1", type: "NOT", x: 200, y: 140, rotation: 0, label: "NOT-R1" },
        { id: "and1", type: "AND", x: 360, y: 200, rotation: 0, label: "AND1" },
        { id: "g1", type: "OUTPUT", x: 520, y: 80, rotation: 0, label: "G1" },
        { id: "g0", type: "OUTPUT", x: 520, y: 200, rotation: 0, label: "G0" },
      ],
      wires: [
        { id: "w1", from: { componentId: "r1", pinIndex: 0 }, to: { componentId: "g1", pinIndex: 0 } },
        { id: "w2", from: { componentId: "r1", pinIndex: 0 }, to: { componentId: "not1", pinIndex: 0 } },
        { id: "w3", from: { componentId: "r0", pinIndex: 0 }, to: { componentId: "and1", pinIndex: 0 } },
        { id: "w4", from: { componentId: "not1", pinIndex: 0 }, to: { componentId: "and1", pinIndex: 1 } },
        { id: "w5", from: { componentId: "and1", pinIndex: 0 }, to: { componentId: "g0", pinIndex: 0 } },
      ],
    },
  },

  // ── Challenge 11: 1-Bit Comparator ────────────────────────────────
  {
    id: "ch11",
    slug: "1bit-comparator",
    title: "Build a 1-bit comparator",
    difficulty: "intermediate",
    instructions: `## Challenge: 1-Bit Comparator

**Goal:** Compare two 1-bit numbers A and B, producing three outputs: **Greater Than**, **Equal**, and **Less Than**.

### Background
A comparator is essential in ALUs and sorting networks:

- **GT** (A > B) = A AND NOT(B)
- **EQ** (A = B) = A XNOR B
- **LT** (A < B) = NOT(A) AND B

### Your task
1. Add **two Input switches** (A and B)
2. Produce **three Output LEDs**: GT, EQ, LT
3. Use NOT, AND, and XNOR gates

### Expected truth table
| A | B | GT | EQ | LT |
|---|---|----|----|-----|
| 0 | 0 |  0 |  1 |  0  |
| 0 | 1 |  0 |  0 |  1  |
| 1 | 0 |  1 |  0 |  0  |
| 1 | 1 |  0 |  1 |  0  |

**Hint:** You need 2 NOT gates, 2 AND gates, and 1 XNOR gate.`,
    solutionCircuit: {
      id: "sol-ch11",
      name: "1-bit Comparator (solution)",
      components: [
        { id: "a", type: "INPUT", x: 40, y: 80, rotation: 0, label: "A", value: false },
        { id: "b", type: "INPUT", x: 40, y: 240, rotation: 0, label: "B", value: false },
        { id: "not1", type: "NOT", x: 200, y: 240, rotation: 0, label: "NOT-B" },
        { id: "not2", type: "NOT", x: 200, y: 320, rotation: 0, label: "NOT-A" },
        { id: "and1", type: "AND", x: 360, y: 60, rotation: 0, label: "AND-GT" },
        { id: "xnor1", type: "XNOR", x: 360, y: 160, rotation: 0, label: "XNOR-EQ" },
        { id: "and2", type: "AND", x: 360, y: 280, rotation: 0, label: "AND-LT" },
        { id: "gt", type: "OUTPUT", x: 540, y: 60, rotation: 0, label: "GT" },
        { id: "eq", type: "OUTPUT", x: 540, y: 160, rotation: 0, label: "EQ" },
        { id: "lt", type: "OUTPUT", x: 540, y: 280, rotation: 0, label: "LT" },
      ],
      wires: [
        { id: "w1", from: { componentId: "a", pinIndex: 0 }, to: { componentId: "and1", pinIndex: 0 } },
        { id: "w2", from: { componentId: "b", pinIndex: 0 }, to: { componentId: "not1", pinIndex: 0 } },
        { id: "w3", from: { componentId: "not1", pinIndex: 0 }, to: { componentId: "and1", pinIndex: 1 } },
        { id: "w4", from: { componentId: "a", pinIndex: 0 }, to: { componentId: "xnor1", pinIndex: 0 } },
        { id: "w5", from: { componentId: "b", pinIndex: 0 }, to: { componentId: "xnor1", pinIndex: 1 } },
        { id: "w6", from: { componentId: "a", pinIndex: 0 }, to: { componentId: "not2", pinIndex: 0 } },
        { id: "w7", from: { componentId: "not2", pinIndex: 0 }, to: { componentId: "and2", pinIndex: 0 } },
        { id: "w8", from: { componentId: "b", pinIndex: 0 }, to: { componentId: "and2", pinIndex: 1 } },
        { id: "w9", from: { componentId: "and1", pinIndex: 0 }, to: { componentId: "gt", pinIndex: 0 } },
        { id: "w10", from: { componentId: "xnor1", pinIndex: 0 }, to: { componentId: "eq", pinIndex: 0 } },
        { id: "w11", from: { componentId: "and2", pinIndex: 0 }, to: { componentId: "lt", pinIndex: 0 } },
      ],
    },
  },

  // ── Challenge 12: 2-to-4 Decoder ──────────────────────────────────
  {
    id: "ch12",
    slug: "decoder-build",
    title: "Build a 2-to-4 decoder",
    difficulty: "intermediate",
    instructions: `## Challenge: 2-to-4 Decoder

**Goal:** Build a **2-to-4 line decoder** that activates exactly one of four outputs based on a 2-bit input.

### Background
A decoder converts a binary code into a one-hot output. For a 2-to-4 decoder:

- D0 = NOT(A1) AND NOT(A0) — input 00
- D1 = NOT(A1) AND A0 — input 01
- D2 = A1 AND NOT(A0) — input 10
- D3 = A1 AND A0 — input 11

### Your task
1. Add **two Input switches** (A1, A0)
2. Use **2 NOT gates** and **4 AND gates** to decode all four minterms
3. Add **four Output LEDs** (D0, D1, D2, D3)

### Expected truth table
| A1 | A0 | D0 | D1 | D2 | D3 |
|----|----|----|----|----|-----|
|  0 |  0 |  1 |  0 |  0 |  0  |
|  0 |  1 |  0 |  1 |  0 |  0  |
|  1 |  0 |  0 |  0 |  1 |  0  |
|  1 |  1 |  0 |  0 |  0 |  1  |

**Hint:** You need 2 NOT gates (for complements) and 4 AND gates (one per output).`,
    solutionCircuit: {
      id: "sol-ch12",
      name: "2-to-4 Decoder (solution)",
      components: [
        { id: "a1", type: "INPUT", x: 40, y: 100, rotation: 0, label: "A1", value: false },
        { id: "a0", type: "INPUT", x: 40, y: 260, rotation: 0, label: "A0", value: false },
        { id: "not1", type: "NOT", x: 200, y: 100, rotation: 0, label: "NOT-A1" },
        { id: "not2", type: "NOT", x: 200, y: 260, rotation: 0, label: "NOT-A0" },
        { id: "and0", type: "AND", x: 380, y: 60, rotation: 0, label: "AND-D0" },
        { id: "and1", type: "AND", x: 380, y: 150, rotation: 0, label: "AND-D1" },
        { id: "and2", type: "AND", x: 380, y: 240, rotation: 0, label: "AND-D2" },
        { id: "and3", type: "AND", x: 380, y: 330, rotation: 0, label: "AND-D3" },
        { id: "d0", type: "OUTPUT", x: 560, y: 60, rotation: 0, label: "D0" },
        { id: "d1", type: "OUTPUT", x: 560, y: 150, rotation: 0, label: "D1" },
        { id: "d2", type: "OUTPUT", x: 560, y: 240, rotation: 0, label: "D2" },
        { id: "d3", type: "OUTPUT", x: 560, y: 330, rotation: 0, label: "D3" },
      ],
      wires: [
        // D0 = NOT(A1) AND NOT(A0)
        { id: "w1", from: { componentId: "a1", pinIndex: 0 }, to: { componentId: "not1", pinIndex: 0 } },
        { id: "w2", from: { componentId: "a0", pinIndex: 0 }, to: { componentId: "not2", pinIndex: 0 } },
        { id: "w3", from: { componentId: "not1", pinIndex: 0 }, to: { componentId: "and0", pinIndex: 0 } },
        { id: "w4", from: { componentId: "not2", pinIndex: 0 }, to: { componentId: "and0", pinIndex: 1 } },
        // D1 = NOT(A1) AND A0
        { id: "w5", from: { componentId: "not1", pinIndex: 0 }, to: { componentId: "and1", pinIndex: 0 } },
        { id: "w6", from: { componentId: "a0", pinIndex: 0 }, to: { componentId: "and1", pinIndex: 1 } },
        // D2 = A1 AND NOT(A0)
        { id: "w7", from: { componentId: "a1", pinIndex: 0 }, to: { componentId: "and2", pinIndex: 0 } },
        { id: "w8", from: { componentId: "not2", pinIndex: 0 }, to: { componentId: "and2", pinIndex: 1 } },
        // D3 = A1 AND A0
        { id: "w9", from: { componentId: "a1", pinIndex: 0 }, to: { componentId: "and3", pinIndex: 0 } },
        { id: "w10", from: { componentId: "a0", pinIndex: 0 }, to: { componentId: "and3", pinIndex: 1 } },
        // Outputs
        { id: "w11", from: { componentId: "and0", pinIndex: 0 }, to: { componentId: "d0", pinIndex: 0 } },
        { id: "w12", from: { componentId: "and1", pinIndex: 0 }, to: { componentId: "d1", pinIndex: 0 } },
        { id: "w13", from: { componentId: "and2", pinIndex: 0 }, to: { componentId: "d2", pinIndex: 0 } },
        { id: "w14", from: { componentId: "and3", pinIndex: 0 }, to: { componentId: "d3", pinIndex: 0 } },
      ],
    },
  },

  // ── Challenge 13: MUX Implements AND ──────────────────────────────
  {
    id: "ch13",
    slug: "mux-implements-and",
    title: "Implement AND using a MUX",
    difficulty: "intermediate",
    instructions: `## Challenge: AND from a MUX

**Goal:** Implement the AND function using a **single MUX_2TO1** block.

### Background
A multiplexer can implement **any 2-variable Boolean function** by carefully choosing its data inputs. For AND:

> Y = A AND B

If we use A as the select line:
- When A=0, Y should be 0 → set D0 = 0 (constant low)
- When A=1, Y should be B → set D1 = B

So: **D0 = GND (always 0), D1 = B, S = A → Y = A AND B**

### Your task
1. Add **two Input switches** (A, B) and a **GND** input (always 0)
2. Place a **MUX_2TO1** block
3. Wire: D0 = GND, D1 = B, S = A
4. Add an **Output LED** (Y)

### Expected truth table
| A | B | Y |
|---|---|---|
| 0 | 0 | 0 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 1 |

**Hint:** Only 1 MUX block needed. The insight is that MUX data inputs can be constants!`,
    solutionCircuit: {
      id: "sol-ch13",
      name: "MUX implements AND (solution)",
      components: [
        { id: "a", type: "INPUT", x: 40, y: 80, rotation: 0, label: "A", value: false },
        { id: "b", type: "INPUT", x: 40, y: 180, rotation: 0, label: "B", value: false },
        { id: "gnd", type: "INPUT", x: 40, y: 280, rotation: 0, label: "GND", value: false },
        { id: "mux1", type: "MUX_2TO1", x: 280, y: 160, rotation: 0, label: "MUX" },
        { id: "out", type: "OUTPUT", x: 500, y: 160, rotation: 0, label: "Y" },
      ],
      wires: [
        { id: "w1", from: { componentId: "gnd", pinIndex: 0 }, to: { componentId: "mux1", pinIndex: 0 } },
        { id: "w2", from: { componentId: "b", pinIndex: 0 }, to: { componentId: "mux1", pinIndex: 1 } },
        { id: "w3", from: { componentId: "a", pinIndex: 0 }, to: { componentId: "mux1", pinIndex: 2 } },
        { id: "w4", from: { componentId: "mux1", pinIndex: 0 }, to: { componentId: "out", pinIndex: 0 } },
      ],
    },
  },

  // ── Challenge 14: Half Subtractor ─────────────────────────────────
  {
    id: "ch14",
    slug: "half-subtractor",
    title: "Build a half subtractor",
    difficulty: "intermediate",
    instructions: `## Challenge: Half Subtractor

**Goal:** Build a circuit that computes the **difference** of two 1-bit numbers, producing **Diff** and **Borrow** outputs.

### Background
A half subtractor computes A - B:

- **Diff** = A XOR B (the difference bit)
- **Borrow** = NOT(A) AND B (borrow is needed when B > A)

### Your task
1. Add **two Input switches** (A and B)
2. Use XOR, NOT, and AND gates to compute both outputs
3. Add **two Output LEDs** (Diff and Borrow)

### Expected truth table
| A | B | Diff | Borrow |
|---|---|------|--------|
| 0 | 0 |  0   |   0    |
| 0 | 1 |  1   |   1    |
| 1 | 0 |  1   |   0    |
| 1 | 1 |  0   |   0    |

**Hint:** XOR handles Diff (same as addition). Borrow = NOT(A) AND B.`,
    solutionCircuit: {
      id: "sol-ch14",
      name: "Half Subtractor (solution)",
      components: [
        { id: "a", type: "INPUT", x: 40, y: 80, rotation: 0, label: "A", value: false },
        { id: "b", type: "INPUT", x: 40, y: 200, rotation: 0, label: "B", value: false },
        { id: "xor1", type: "XOR", x: 200, y: 80, rotation: 0, label: "XOR1" },
        { id: "not1", type: "NOT", x: 200, y: 200, rotation: 0, label: "NOT-A" },
        { id: "and1", type: "AND", x: 360, y: 220, rotation: 0, label: "AND1" },
        { id: "diff", type: "OUTPUT", x: 520, y: 80, rotation: 0, label: "Diff" },
        { id: "borrow", type: "OUTPUT", x: 520, y: 220, rotation: 0, label: "Borrow" },
      ],
      wires: [
        { id: "w1", from: { componentId: "a", pinIndex: 0 }, to: { componentId: "xor1", pinIndex: 0 } },
        { id: "w2", from: { componentId: "b", pinIndex: 0 }, to: { componentId: "xor1", pinIndex: 1 } },
        { id: "w3", from: { componentId: "a", pinIndex: 0 }, to: { componentId: "not1", pinIndex: 0 } },
        { id: "w4", from: { componentId: "not1", pinIndex: 0 }, to: { componentId: "and1", pinIndex: 0 } },
        { id: "w5", from: { componentId: "b", pinIndex: 0 }, to: { componentId: "and1", pinIndex: 1 } },
        { id: "w6", from: { componentId: "xor1", pinIndex: 0 }, to: { componentId: "diff", pinIndex: 0 } },
        { id: "w7", from: { componentId: "and1", pinIndex: 0 }, to: { componentId: "borrow", pinIndex: 0 } },
      ],
    },
  },

  // ── Challenge 15: Majority Gate ───────────────────────────────────
  {
    id: "ch15",
    slug: "majority-gate",
    title: "Build a 3-input majority gate",
    difficulty: "advanced",
    instructions: `## Challenge: Majority Gate

**Goal:** Build a circuit that outputs 1 when **two or more** of its three inputs are HIGH.

### Background
The majority gate is fundamental in fault-tolerant systems (e.g., triple modular redundancy). For three inputs A, B, C:

> Y = (A AND B) OR (B AND C) OR (A AND C)

This is also equivalent to the carry output of a full adder!

### Your task
1. Add **three Input switches** (A, B, C)
2. Use **3 AND gates** and **2 OR gates** to implement the majority function
3. Add an **Output LED** (Y)

### Expected truth table
| A | B | C | Y |
|---|---|---|---|
| 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 0 |
| 0 | 1 | 0 | 0 |
| 0 | 1 | 1 | 1 |
| 1 | 0 | 0 | 0 |
| 1 | 0 | 1 | 1 |
| 1 | 1 | 0 | 1 |
| 1 | 1 | 1 | 1 |

**Hint:** Compute each pair's AND, then OR the results together. You need 3 AND gates and 2 OR gates (cascaded).`,
    solutionCircuit: {
      id: "sol-ch15",
      name: "Majority Gate (solution)",
      components: [
        { id: "a", type: "INPUT", x: 40, y: 60, rotation: 0, label: "A", value: false },
        { id: "b", type: "INPUT", x: 40, y: 180, rotation: 0, label: "B", value: false },
        { id: "c", type: "INPUT", x: 40, y: 300, rotation: 0, label: "C", value: false },
        { id: "and1", type: "AND", x: 220, y: 80, rotation: 0, label: "A AND B" },
        { id: "and2", type: "AND", x: 220, y: 200, rotation: 0, label: "B AND C" },
        { id: "and3", type: "AND", x: 220, y: 320, rotation: 0, label: "A AND C" },
        { id: "or1", type: "OR", x: 400, y: 140, rotation: 0, label: "OR1" },
        { id: "or2", type: "OR", x: 560, y: 200, rotation: 0, label: "OR2" },
        { id: "out", type: "OUTPUT", x: 720, y: 200, rotation: 0, label: "Y" },
      ],
      wires: [
        { id: "w1", from: { componentId: "a", pinIndex: 0 }, to: { componentId: "and1", pinIndex: 0 } },
        { id: "w2", from: { componentId: "b", pinIndex: 0 }, to: { componentId: "and1", pinIndex: 1 } },
        { id: "w3", from: { componentId: "b", pinIndex: 0 }, to: { componentId: "and2", pinIndex: 0 } },
        { id: "w4", from: { componentId: "c", pinIndex: 0 }, to: { componentId: "and2", pinIndex: 1 } },
        { id: "w5", from: { componentId: "a", pinIndex: 0 }, to: { componentId: "and3", pinIndex: 0 } },
        { id: "w6", from: { componentId: "c", pinIndex: 0 }, to: { componentId: "and3", pinIndex: 1 } },
        { id: "w7", from: { componentId: "and1", pinIndex: 0 }, to: { componentId: "or1", pinIndex: 0 } },
        { id: "w8", from: { componentId: "and2", pinIndex: 0 }, to: { componentId: "or1", pinIndex: 1 } },
        { id: "w9", from: { componentId: "or1", pinIndex: 0 }, to: { componentId: "or2", pinIndex: 0 } },
        { id: "w10", from: { componentId: "and3", pinIndex: 0 }, to: { componentId: "or2", pinIndex: 1 } },
        { id: "w11", from: { componentId: "or2", pinIndex: 0 }, to: { componentId: "out", pinIndex: 0 } },
      ],
    },
  },
];

export function getChallenge(slug: string): Challenge | undefined {
  return CHALLENGES.find((c) => c.slug === slug);
}
