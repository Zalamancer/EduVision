import type { Exercise } from "./types";

export const EXERCISES: Exercise[] = [
  // ── Exercise 1: Your First AND Gate ──────────────────────────────
  {
    id: "ex1",
    slug: "first-and-gate",
    title: "Your First AND Gate",
    description:
      "Build a simple AND gate circuit with two inputs and one output. Learn how AND logic works by toggling inputs.",
    difficulty: "beginner",
    category: "basics",
    steps: [
      {
        id: "ex1-s1",
        instruction: "Place an Input switch. This will be input A.",
        action: { type: "place", gateType: "INPUT", label: "A" },
        ghost: { type: "INPUT", x: 40, y: 80, label: "A" },
      },
      {
        id: "ex1-s2",
        instruction: "Place another Input switch for input B.",
        action: { type: "place", gateType: "INPUT", label: "B" },
        ghost: { type: "INPUT", x: 40, y: 160, label: "B" },
      },
      {
        id: "ex1-s3",
        instruction: "Place an AND gate between the inputs and output.",
        action: { type: "place", gateType: "AND" },
        ghost: { type: "AND", x: 200, y: 100 },
      },
      {
        id: "ex1-s4",
        instruction: "Connect A's output to the AND gate's top input.",
        action: {
          type: "wire",
          fromLabel: "A",
          fromPin: 0,
          toLabel: "AND",
          toPin: 0,
        },
        highlightLabels: ["A"],
      },
      {
        id: "ex1-s5",
        instruction: "Connect B's output to the AND gate's bottom input.",
        action: {
          type: "wire",
          fromLabel: "B",
          fromPin: 0,
          toLabel: "AND",
          toPin: 1,
        },
        highlightLabels: ["B"],
      },
      {
        id: "ex1-s6",
        instruction: "Place an Output LED to see the result.",
        action: { type: "place", gateType: "OUTPUT", label: "Y" },
        ghost: { type: "OUTPUT", x: 360, y: 100, label: "Y" },
      },
      {
        id: "ex1-s7",
        instruction: "Connect the AND gate's output to the LED.",
        action: {
          type: "wire",
          fromLabel: "AND",
          fromPin: 0,
          toLabel: "Y",
          toPin: 0,
        },
        highlightLabels: ["Y"],
      },
      {
        id: "ex1-s8",
        instruction: "Toggle input A to 1 (click it).",
        action: { type: "toggle", label: "A", value: true },
      },
      {
        id: "ex1-s9",
        instruction:
          "Toggle B to 1 as well. Both inputs are now HIGH — what does the AND gate output?",
        hint: "AND outputs 1 only when ALL inputs are 1.",
        action: { type: "toggle", label: "B", value: true },
      },
    ],
  },

  // ── Exercise 2: Build a Half Adder ───────────────────────────────
  {
    id: "ex2",
    slug: "half-adder",
    title: "Build a Half Adder",
    description:
      "A half adder adds two single bits and produces a Sum and a Carry. Build one from an XOR and an AND gate.",
    difficulty: "beginner",
    category: "arithmetic",
    steps: [
      {
        id: "ex2-s1",
        instruction: "Place an Input switch for bit A.",
        action: { type: "place", gateType: "INPUT", label: "A" },
        ghost: { type: "INPUT", x: 40, y: 80, label: "A" },
      },
      {
        id: "ex2-s2",
        instruction: "Place an Input switch for bit B.",
        action: { type: "place", gateType: "INPUT", label: "B" },
        ghost: { type: "INPUT", x: 40, y: 200, label: "B" },
      },
      {
        id: "ex2-s3",
        instruction:
          "Place an XOR gate. It will compute the Sum bit (A XOR B).",
        action: { type: "place", gateType: "XOR" },
        ghost: { type: "XOR", x: 220, y: 80 },
      },
      {
        id: "ex2-s4",
        instruction: "Wire both inputs to the XOR gate.",
        action: {
          type: "wire",
          fromLabel: "A",
          fromPin: 0,
          toLabel: "XOR",
          toPin: 0,
        },
        highlightLabels: ["A", "XOR"],
      },
      {
        id: "ex2-s5",
        instruction: "Connect B to the XOR gate's bottom input.",
        action: {
          type: "wire",
          fromLabel: "B",
          fromPin: 0,
          toLabel: "XOR",
          toPin: 1,
        },
        highlightLabels: ["B", "XOR"],
      },
      {
        id: "ex2-s6",
        instruction:
          "Place an AND gate. It will compute the Carry bit (A AND B).",
        action: { type: "place", gateType: "AND" },
        ghost: { type: "AND", x: 220, y: 200 },
      },
      {
        id: "ex2-s7",
        instruction: "Wire A to the AND gate's top input.",
        action: {
          type: "wire",
          fromLabel: "A",
          fromPin: 0,
          toLabel: "AND",
          toPin: 0,
        },
        highlightLabels: ["A", "AND"],
      },
      {
        id: "ex2-s8",
        instruction: "Wire B to the AND gate's bottom input.",
        action: {
          type: "wire",
          fromLabel: "B",
          fromPin: 0,
          toLabel: "AND",
          toPin: 1,
        },
        highlightLabels: ["B", "AND"],
      },
      {
        id: "ex2-s9",
        instruction: "Place an Output LED and label it Sum.",
        action: { type: "place", gateType: "OUTPUT", label: "Sum" },
        ghost: { type: "OUTPUT", x: 420, y: 80, label: "Sum" },
      },
      {
        id: "ex2-s10",
        instruction: "Place another Output LED and label it Carry.",
        action: { type: "place", gateType: "OUTPUT", label: "Carry" },
        ghost: { type: "OUTPUT", x: 420, y: 200, label: "Carry" },
      },
      {
        id: "ex2-s11",
        instruction: "Wire the XOR gate's output to Sum.",
        action: {
          type: "wire",
          fromLabel: "XOR",
          fromPin: 0,
          toLabel: "Sum",
          toPin: 0,
        },
        highlightLabels: ["XOR", "Sum"],
      },
      {
        id: "ex2-s12",
        instruction: "Wire the AND gate's output to Carry.",
        action: {
          type: "wire",
          fromLabel: "AND",
          fromPin: 0,
          toLabel: "Carry",
          toPin: 0,
        },
        highlightLabels: ["AND", "Carry"],
      },
      {
        id: "ex2-s13",
        instruction:
          "Verify the truth table. Try all four input combinations and check that Sum and Carry are correct.",
        hint: "When A=1 and B=1 the sum is 0 (with a carry of 1) — just like 1+1=10 in binary.",
        action: { type: "verify" },
      },
    ],
  },

  // ── Exercise 3: OR from NAND Gates ───────────────────────────────
  {
    id: "ex3",
    slug: "or-from-nand",
    title: "OR from NAND Gates",
    description:
      "NAND is a universal gate — you can build any other gate from it. Prove it by constructing an OR gate using only NANDs.",
    difficulty: "intermediate",
    category: "universal gates",
    steps: [
      {
        id: "ex3-s1",
        instruction: "Place Input A.",
        action: { type: "place", gateType: "INPUT", label: "A" },
        ghost: { type: "INPUT", x: 40, y: 80, label: "A" },
      },
      {
        id: "ex3-s2",
        instruction: "Place Input B.",
        action: { type: "place", gateType: "INPUT", label: "B" },
        ghost: { type: "INPUT", x: 40, y: 200, label: "B" },
      },
      {
        id: "ex3-s3",
        instruction:
          "Place the first NAND gate (NAND1). We'll use it to invert A.",
        action: { type: "place", gateType: "NAND", label: "NAND1" },
        ghost: { type: "NAND", x: 200, y: 60, label: "NAND1" },
      },
      {
        id: "ex3-s4",
        instruction:
          "Wire A to BOTH inputs of NAND1. A NAND with the same signal on both inputs acts as a NOT.",
        hint: "NAND(A, A) = NOT A. This is the trick behind NAND universality.",
        action: {
          type: "wire",
          fromLabel: "A",
          fromPin: 0,
          toLabel: "NAND1",
          toPin: 0,
        },
        highlightLabels: ["A", "NAND1"],
      },
      {
        id: "ex3-s5",
        instruction: "Wire A to the bottom input of NAND1 as well.",
        action: {
          type: "wire",
          fromLabel: "A",
          fromPin: 0,
          toLabel: "NAND1",
          toPin: 1,
        },
        highlightLabels: ["A", "NAND1"],
      },
      {
        id: "ex3-s6",
        instruction:
          "Place a second NAND gate (NAND2). This one will invert B.",
        action: { type: "place", gateType: "NAND", label: "NAND2" },
        ghost: { type: "NAND", x: 200, y: 200, label: "NAND2" },
      },
      {
        id: "ex3-s7",
        instruction: "Wire B to both inputs of NAND2.",
        action: {
          type: "wire",
          fromLabel: "B",
          fromPin: 0,
          toLabel: "NAND2",
          toPin: 0,
        },
        highlightLabels: ["B", "NAND2"],
      },
      {
        id: "ex3-s8",
        instruction: "Wire B to the bottom input of NAND2 too.",
        action: {
          type: "wire",
          fromLabel: "B",
          fromPin: 0,
          toLabel: "NAND2",
          toPin: 1,
        },
        highlightLabels: ["B", "NAND2"],
      },
      {
        id: "ex3-s9",
        instruction:
          "Place a third NAND gate (NAND3). NAND(NOT A, NOT B) = A OR B.",
        hint: "By De Morgan's law: NOT(NOT A AND NOT B) = A OR B.",
        action: { type: "place", gateType: "NAND", label: "NAND3" },
        ghost: { type: "NAND", x: 360, y: 130, label: "NAND3" },
      },
      {
        id: "ex3-s10",
        instruction:
          "Wire NAND1 output to NAND3 top input, and NAND2 output to NAND3 bottom input.",
        action: {
          type: "wire",
          fromLabel: "NAND1",
          fromPin: 0,
          toLabel: "NAND3",
          toPin: 0,
        },
        highlightLabels: ["NAND1", "NAND3"],
      },
      {
        id: "ex3-s11",
        instruction: "Wire NAND2 output to NAND3's bottom input.",
        action: {
          type: "wire",
          fromLabel: "NAND2",
          fromPin: 0,
          toLabel: "NAND3",
          toPin: 1,
        },
        highlightLabels: ["NAND2", "NAND3"],
      },
      {
        id: "ex3-s12",
        instruction: "Place the output LED.",
        action: { type: "place", gateType: "OUTPUT", label: "Y" },
        ghost: { type: "OUTPUT", x: 520, y: 130, label: "Y" },
      },
      {
        id: "ex3-s13",
        instruction: "Wire NAND3's output to Y.",
        action: {
          type: "wire",
          fromLabel: "NAND3",
          fromPin: 0,
          toLabel: "Y",
          toPin: 0,
        },
        highlightLabels: ["NAND3", "Y"],
      },
      {
        id: "ex3-s14",
        instruction:
          "Verify the circuit matches an OR gate. Try all four input combos.",
        hint: "OR outputs 1 when at least one input is 1. Your NAND circuit should behave identically.",
        action: { type: "verify" },
      },
    ],
  },

  // ── Exercise 4: Build a 2:1 Multiplexer ─────────────────────────
  {
    id: "ex4",
    slug: "2to1-mux",
    title: "Build a 2:1 Multiplexer",
    description:
      "A multiplexer selects one of its data inputs based on a select signal. Build a 2:1 MUX from basic gates.",
    difficulty: "intermediate",
    category: "selection",
    steps: [
      {
        id: "ex4-s1",
        instruction: "Place data input D0.",
        action: { type: "place", gateType: "INPUT", label: "D0" },
        ghost: { type: "INPUT", x: 40, y: 60, label: "D0" },
      },
      {
        id: "ex4-s2",
        instruction: "Place data input D1.",
        action: { type: "place", gateType: "INPUT", label: "D1" },
        ghost: { type: "INPUT", x: 40, y: 180, label: "D1" },
      },
      {
        id: "ex4-s3",
        instruction: "Place the select input S.",
        action: { type: "place", gateType: "INPUT", label: "S" },
        ghost: { type: "INPUT", x: 40, y: 300, label: "S" },
      },
      {
        id: "ex4-s4",
        instruction:
          "Place a NOT gate. We need the inverted select signal for the D0 path.",
        action: { type: "place", gateType: "NOT", label: "NOT" },
        ghost: { type: "NOT", x: 180, y: 300 },
      },
      {
        id: "ex4-s5",
        instruction: "Wire S into the NOT gate.",
        action: {
          type: "wire",
          fromLabel: "S",
          fromPin: 0,
          toLabel: "NOT",
          toPin: 0,
        },
        highlightLabels: ["S", "NOT"],
      },
      {
        id: "ex4-s6",
        instruction:
          "Place AND1. This gate passes D0 when S is 0 (NOT S is 1).",
        action: { type: "place", gateType: "AND", label: "AND1" },
        ghost: { type: "AND", x: 300, y: 60, label: "AND1" },
      },
      {
        id: "ex4-s7",
        instruction: "Wire D0 to AND1's top input, and NOT output to AND1's bottom input.",
        action: {
          type: "wire",
          fromLabel: "D0",
          fromPin: 0,
          toLabel: "AND1",
          toPin: 0,
        },
        highlightLabels: ["D0", "AND1"],
      },
      {
        id: "ex4-s8",
        instruction: "Wire the NOT gate's output to AND1's bottom input.",
        action: {
          type: "wire",
          fromLabel: "NOT",
          fromPin: 0,
          toLabel: "AND1",
          toPin: 1,
        },
        highlightLabels: ["NOT", "AND1"],
      },
      {
        id: "ex4-s9",
        instruction: "Place AND2. This gate passes D1 when S is 1.",
        action: { type: "place", gateType: "AND", label: "AND2" },
        ghost: { type: "AND", x: 300, y: 180, label: "AND2" },
      },
      {
        id: "ex4-s10",
        instruction: "Wire D1 to AND2's top input.",
        action: {
          type: "wire",
          fromLabel: "D1",
          fromPin: 0,
          toLabel: "AND2",
          toPin: 0,
        },
        highlightLabels: ["D1", "AND2"],
      },
      {
        id: "ex4-s11",
        instruction: "Wire S directly to AND2's bottom input.",
        action: {
          type: "wire",
          fromLabel: "S",
          fromPin: 0,
          toLabel: "AND2",
          toPin: 1,
        },
        highlightLabels: ["S", "AND2"],
      },
      {
        id: "ex4-s12",
        instruction:
          "Place an OR gate to combine both AND outputs into the final result.",
        action: { type: "place", gateType: "OR", label: "OR" },
        ghost: { type: "OR", x: 440, y: 120, label: "OR" },
      },
      {
        id: "ex4-s13",
        instruction: "Wire AND1 output to OR's top input.",
        action: {
          type: "wire",
          fromLabel: "AND1",
          fromPin: 0,
          toLabel: "OR",
          toPin: 0,
        },
        highlightLabels: ["AND1", "OR"],
      },
      {
        id: "ex4-s14",
        instruction: "Wire AND2 output to OR's bottom input.",
        action: {
          type: "wire",
          fromLabel: "AND2",
          fromPin: 0,
          toLabel: "OR",
          toPin: 1,
        },
        highlightLabels: ["AND2", "OR"],
      },
      {
        id: "ex4-s15",
        instruction: "Place the output LED.",
        action: { type: "place", gateType: "OUTPUT", label: "Y" },
        ghost: { type: "OUTPUT", x: 580, y: 120, label: "Y" },
      },
      {
        id: "ex4-s16",
        instruction: "Wire the OR gate's output to Y.",
        action: {
          type: "wire",
          fromLabel: "OR",
          fromPin: 0,
          toLabel: "Y",
          toPin: 0,
        },
        highlightLabels: ["OR", "Y"],
      },
      {
        id: "ex4-s17",
        instruction:
          "Verify the mux. When S=0, Y should equal D0. When S=1, Y should equal D1.",
        hint: "A multiplexer is like a railroad switch — S decides which track (D0 or D1) reaches the output.",
        action: { type: "verify" },
      },
    ],
  },

  // ── Exercise 5: Build a Full Adder ───────────────────────────────
  {
    id: "ex5",
    slug: "full-adder",
    title: "Build a Full Adder",
    description:
      "A full adder handles a carry-in, making it chainable for multi-bit addition. Build one from two XOR, two AND, and one OR gate.",
    difficulty: "intermediate",
    category: "arithmetic",
    steps: [
      {
        id: "ex5-s1",
        instruction: "Place Input A.",
        action: { type: "place", gateType: "INPUT", label: "A" },
        ghost: { type: "INPUT", x: 40, y: 60, label: "A" },
      },
      {
        id: "ex5-s2",
        instruction: "Place Input B.",
        action: { type: "place", gateType: "INPUT", label: "B" },
        ghost: { type: "INPUT", x: 40, y: 160, label: "B" },
      },
      {
        id: "ex5-s3",
        instruction: "Place the carry-in input Cin.",
        action: { type: "place", gateType: "INPUT", label: "Cin" },
        ghost: { type: "INPUT", x: 40, y: 280, label: "Cin" },
      },
      {
        id: "ex5-s4",
        instruction:
          "Place XOR1. It computes the partial sum of A and B.",
        action: { type: "place", gateType: "XOR", label: "XOR1" },
        ghost: { type: "XOR", x: 200, y: 80, label: "XOR1" },
      },
      {
        id: "ex5-s5",
        instruction: "Wire A to XOR1 top input and B to XOR1 bottom input.",
        action: {
          type: "wire",
          fromLabel: "A",
          fromPin: 0,
          toLabel: "XOR1",
          toPin: 0,
        },
        highlightLabels: ["A", "XOR1"],
      },
      {
        id: "ex5-s6",
        instruction: "Wire B to XOR1's bottom input.",
        action: {
          type: "wire",
          fromLabel: "B",
          fromPin: 0,
          toLabel: "XOR1",
          toPin: 1,
        },
        highlightLabels: ["B", "XOR1"],
      },
      {
        id: "ex5-s7",
        instruction:
          "Place XOR2. XOR1's result XORed with Cin gives the final Sum.",
        action: { type: "place", gateType: "XOR", label: "XOR2" },
        ghost: { type: "XOR", x: 360, y: 80, label: "XOR2" },
      },
      {
        id: "ex5-s8",
        instruction: "Wire XOR1 output to XOR2 top input, and Cin to XOR2 bottom input.",
        action: {
          type: "wire",
          fromLabel: "XOR1",
          fromPin: 0,
          toLabel: "XOR2",
          toPin: 0,
        },
        highlightLabels: ["XOR1", "XOR2"],
      },
      {
        id: "ex5-s9",
        instruction: "Wire Cin to XOR2's bottom input.",
        action: {
          type: "wire",
          fromLabel: "Cin",
          fromPin: 0,
          toLabel: "XOR2",
          toPin: 1,
        },
        highlightLabels: ["Cin", "XOR2"],
      },
      {
        id: "ex5-s10",
        instruction:
          "Place AND1. It detects when both A and B are 1 (generates a carry).",
        action: { type: "place", gateType: "AND", label: "AND1" },
        ghost: { type: "AND", x: 200, y: 220, label: "AND1" },
      },
      {
        id: "ex5-s11",
        instruction: "Wire A to AND1 top input and B to AND1 bottom input.",
        action: {
          type: "wire",
          fromLabel: "A",
          fromPin: 0,
          toLabel: "AND1",
          toPin: 0,
        },
        highlightLabels: ["A", "AND1"],
      },
      {
        id: "ex5-s12",
        instruction: "Wire B to AND1's bottom input.",
        action: {
          type: "wire",
          fromLabel: "B",
          fromPin: 0,
          toLabel: "AND1",
          toPin: 1,
        },
        highlightLabels: ["B", "AND1"],
      },
      {
        id: "ex5-s13",
        instruction:
          "Place AND2. It detects when the partial sum and Cin are both 1 (propagates a carry).",
        action: { type: "place", gateType: "AND", label: "AND2" },
        ghost: { type: "AND", x: 360, y: 220, label: "AND2" },
      },
      {
        id: "ex5-s14",
        instruction: "Wire XOR1 output to AND2's top input.",
        action: {
          type: "wire",
          fromLabel: "XOR1",
          fromPin: 0,
          toLabel: "AND2",
          toPin: 0,
        },
        highlightLabels: ["XOR1", "AND2"],
      },
      {
        id: "ex5-s15",
        instruction: "Wire Cin to AND2's bottom input.",
        action: {
          type: "wire",
          fromLabel: "Cin",
          fromPin: 0,
          toLabel: "AND2",
          toPin: 1,
        },
        highlightLabels: ["Cin", "AND2"],
      },
      {
        id: "ex5-s16",
        instruction:
          "Place an OR gate. If either AND produces a carry, the overall carry-out is 1.",
        action: { type: "place", gateType: "OR", label: "OR" },
        ghost: { type: "OR", x: 500, y: 220, label: "OR" },
      },
      {
        id: "ex5-s17",
        instruction: "Wire AND1 output to OR top input.",
        action: {
          type: "wire",
          fromLabel: "AND1",
          fromPin: 0,
          toLabel: "OR",
          toPin: 0,
        },
        highlightLabels: ["AND1", "OR"],
      },
      {
        id: "ex5-s18",
        instruction: "Wire AND2 output to OR bottom input.",
        action: {
          type: "wire",
          fromLabel: "AND2",
          fromPin: 0,
          toLabel: "OR",
          toPin: 1,
        },
        highlightLabels: ["AND2", "OR"],
      },
      {
        id: "ex5-s19",
        instruction: "Place the Sum output LED.",
        action: { type: "place", gateType: "OUTPUT", label: "Sum" },
        ghost: { type: "OUTPUT", x: 560, y: 80, label: "Sum" },
      },
      {
        id: "ex5-s20",
        instruction: "Place the Cout output LED.",
        action: { type: "place", gateType: "OUTPUT", label: "Cout" },
        ghost: { type: "OUTPUT", x: 620, y: 220, label: "Cout" },
      },
      {
        id: "ex5-s21",
        instruction: "Wire XOR2 output to Sum.",
        action: {
          type: "wire",
          fromLabel: "XOR2",
          fromPin: 0,
          toLabel: "Sum",
          toPin: 0,
        },
        highlightLabels: ["XOR2", "Sum"],
      },
      {
        id: "ex5-s22",
        instruction: "Wire OR output to Cout.",
        action: {
          type: "wire",
          fromLabel: "OR",
          fromPin: 0,
          toLabel: "Cout",
          toPin: 0,
        },
        highlightLabels: ["OR", "Cout"],
      },
      {
        id: "ex5-s23",
        instruction:
          "Verify all 8 input combinations. The truth table should match binary addition of A + B + Cin.",
        hint: "For A=1, B=1, Cin=1: Sum=1, Cout=1 (1+1+1 = 11 in binary). Check all 8 rows to be sure.",
        action: { type: "verify" },
      },
    ],
  },

  // ── Exercise 6: Build a 2-to-4 Decoder ─────────────────────────────
  {
    id: "ex6",
    slug: "2to4-decoder",
    title: "Build a 2-to-4 Decoder",
    description:
      "A decoder activates exactly one of its outputs based on the binary value of its inputs. Build a 2-to-4 decoder from NOT and AND gates.",
    difficulty: "intermediate",
    category: "decoding",
    steps: [
      {
        id: "ex6-s1",
        instruction: "Place Input A1 (the high-order select bit).",
        action: { type: "place", gateType: "INPUT", label: "A1" },
        ghost: { type: "INPUT", x: 40, y: 80, label: "A1" },
      },
      {
        id: "ex6-s2",
        instruction: "Place Input A0 (the low-order select bit).",
        action: { type: "place", gateType: "INPUT", label: "A0" },
        ghost: { type: "INPUT", x: 40, y: 200, label: "A0" },
      },
      {
        id: "ex6-s3",
        instruction: "Place a NOT gate to invert A1.",
        action: { type: "place", gateType: "NOT", label: "NOT_A1" },
        ghost: { type: "NOT", x: 180, y: 80, label: "NOT_A1" },
      },
      {
        id: "ex6-s4",
        instruction: "Place a NOT gate to invert A0.",
        action: { type: "place", gateType: "NOT", label: "NOT_A0" },
        ghost: { type: "NOT", x: 180, y: 200, label: "NOT_A0" },
      },
      {
        id: "ex6-s5",
        instruction: "Wire A1 to NOT_A1.",
        action: {
          type: "wire",
          fromLabel: "A1",
          fromPin: 0,
          toLabel: "NOT_A1",
          toPin: 0,
        },
        highlightLabels: ["A1", "NOT_A1"],
      },
      {
        id: "ex6-s6",
        instruction: "Wire A0 to NOT_A0.",
        action: {
          type: "wire",
          fromLabel: "A0",
          fromPin: 0,
          toLabel: "NOT_A0",
          toPin: 0,
        },
        highlightLabels: ["A0", "NOT_A0"],
      },
      {
        id: "ex6-s7",
        instruction:
          "Place AND0. It detects minterm 0: NOT_A1 AND NOT_A0 (both inputs low).",
        action: { type: "place", gateType: "AND", label: "AND0" },
        ghost: { type: "AND", x: 340, y: 40, label: "AND0" },
      },
      {
        id: "ex6-s8",
        instruction:
          "Place AND1. It detects minterm 1: NOT_A1 AND A0.",
        action: { type: "place", gateType: "AND", label: "AND1" },
        ghost: { type: "AND", x: 340, y: 140, label: "AND1" },
      },
      {
        id: "ex6-s9",
        instruction:
          "Place AND2. It detects minterm 2: A1 AND NOT_A0.",
        action: { type: "place", gateType: "AND", label: "AND2" },
        ghost: { type: "AND", x: 340, y: 240, label: "AND2" },
      },
      {
        id: "ex6-s10",
        instruction:
          "Place AND3. It detects minterm 3: A1 AND A0.",
        action: { type: "place", gateType: "AND", label: "AND3" },
        ghost: { type: "AND", x: 340, y: 340, label: "AND3" },
      },
      {
        id: "ex6-s11",
        instruction: "Wire NOT_A1 to AND0 top input and NOT_A0 to AND0 bottom input.",
        action: {
          type: "wire",
          fromLabel: "NOT_A1",
          fromPin: 0,
          toLabel: "AND0",
          toPin: 0,
        },
        highlightLabels: ["NOT_A1", "AND0"],
      },
      {
        id: "ex6-s12",
        instruction: "Wire NOT_A0 to AND0's bottom input.",
        action: {
          type: "wire",
          fromLabel: "NOT_A0",
          fromPin: 0,
          toLabel: "AND0",
          toPin: 1,
        },
        highlightLabels: ["NOT_A0", "AND0"],
      },
      {
        id: "ex6-s13",
        instruction: "Wire NOT_A1 to AND1's top input.",
        action: {
          type: "wire",
          fromLabel: "NOT_A1",
          fromPin: 0,
          toLabel: "AND1",
          toPin: 0,
        },
        highlightLabels: ["NOT_A1", "AND1"],
      },
      {
        id: "ex6-s14",
        instruction: "Wire A0 to AND1's bottom input.",
        action: {
          type: "wire",
          fromLabel: "A0",
          fromPin: 0,
          toLabel: "AND1",
          toPin: 1,
        },
        highlightLabels: ["A0", "AND1"],
      },
      {
        id: "ex6-s15",
        instruction: "Wire A1 to AND2's top input.",
        action: {
          type: "wire",
          fromLabel: "A1",
          fromPin: 0,
          toLabel: "AND2",
          toPin: 0,
        },
        highlightLabels: ["A1", "AND2"],
      },
      {
        id: "ex6-s16",
        instruction: "Wire NOT_A0 to AND2's bottom input.",
        action: {
          type: "wire",
          fromLabel: "NOT_A0",
          fromPin: 0,
          toLabel: "AND2",
          toPin: 1,
        },
        highlightLabels: ["NOT_A0", "AND2"],
      },
      {
        id: "ex6-s17",
        instruction: "Wire A1 to AND3's top input.",
        action: {
          type: "wire",
          fromLabel: "A1",
          fromPin: 0,
          toLabel: "AND3",
          toPin: 0,
        },
        highlightLabels: ["A1", "AND3"],
      },
      {
        id: "ex6-s18",
        instruction: "Wire A0 to AND3's bottom input.",
        action: {
          type: "wire",
          fromLabel: "A0",
          fromPin: 0,
          toLabel: "AND3",
          toPin: 1,
        },
        highlightLabels: ["A0", "AND3"],
      },
      {
        id: "ex6-s19",
        instruction: "Place Output D0.",
        action: { type: "place", gateType: "OUTPUT", label: "D0" },
        ghost: { type: "OUTPUT", x: 520, y: 40, label: "D0" },
      },
      {
        id: "ex6-s20",
        instruction: "Place Output D1.",
        action: { type: "place", gateType: "OUTPUT", label: "D1" },
        ghost: { type: "OUTPUT", x: 520, y: 140, label: "D1" },
      },
      {
        id: "ex6-s21",
        instruction: "Place Output D2.",
        action: { type: "place", gateType: "OUTPUT", label: "D2" },
        ghost: { type: "OUTPUT", x: 520, y: 240, label: "D2" },
      },
      {
        id: "ex6-s22",
        instruction: "Place Output D3.",
        action: { type: "place", gateType: "OUTPUT", label: "D3" },
        ghost: { type: "OUTPUT", x: 520, y: 340, label: "D3" },
      },
      {
        id: "ex6-s23",
        instruction: "Wire AND0 output to D0.",
        action: {
          type: "wire",
          fromLabel: "AND0",
          fromPin: 0,
          toLabel: "D0",
          toPin: 0,
        },
        highlightLabels: ["AND0", "D0"],
      },
      {
        id: "ex6-s24",
        instruction: "Wire AND1 output to D1.",
        action: {
          type: "wire",
          fromLabel: "AND1",
          fromPin: 0,
          toLabel: "D1",
          toPin: 0,
        },
        highlightLabels: ["AND1", "D1"],
      },
      {
        id: "ex6-s25",
        instruction: "Wire AND2 output to D2.",
        action: {
          type: "wire",
          fromLabel: "AND2",
          fromPin: 0,
          toLabel: "D2",
          toPin: 0,
        },
        highlightLabels: ["AND2", "D2"],
      },
      {
        id: "ex6-s26",
        instruction: "Wire AND3 output to D3.",
        action: {
          type: "wire",
          fromLabel: "AND3",
          fromPin: 0,
          toLabel: "D3",
          toPin: 0,
        },
        highlightLabels: ["AND3", "D3"],
      },
      {
        id: "ex6-s27",
        instruction:
          "Verify the decoder. For each combination of A1,A0, exactly one output (D0-D3) should be HIGH.",
        hint: "A1=0,A0=0 activates D0. A1=0,A0=1 activates D1. A1=1,A0=0 activates D2. A1=1,A0=1 activates D3.",
        action: { type: "verify" },
      },
    ],
  },

  // ── Exercise 7: Build a 1-bit Comparator ────────────────────────────
  {
    id: "ex7",
    slug: "1bit-comparator",
    title: "Build a 1-bit Comparator",
    description:
      "Compare two 1-bit values A and B, producing three outputs: GT (A>B), EQ (A=B), and LT (A<B).",
    difficulty: "intermediate",
    category: "comparison",
    steps: [
      {
        id: "ex7-s1",
        instruction: "Place Input A.",
        action: { type: "place", gateType: "INPUT", label: "A" },
        ghost: { type: "INPUT", x: 40, y: 80, label: "A" },
      },
      {
        id: "ex7-s2",
        instruction: "Place Input B.",
        action: { type: "place", gateType: "INPUT", label: "B" },
        ghost: { type: "INPUT", x: 40, y: 220, label: "B" },
      },
      {
        id: "ex7-s3",
        instruction: "Place a NOT gate to invert A (needed for LT detection).",
        action: { type: "place", gateType: "NOT", label: "NOT_A" },
        ghost: { type: "NOT", x: 180, y: 80, label: "NOT_A" },
      },
      {
        id: "ex7-s4",
        instruction: "Place a NOT gate to invert B (needed for GT detection).",
        action: { type: "place", gateType: "NOT", label: "NOT_B" },
        ghost: { type: "NOT", x: 180, y: 220, label: "NOT_B" },
      },
      {
        id: "ex7-s5",
        instruction: "Wire A to NOT_A.",
        action: {
          type: "wire",
          fromLabel: "A",
          fromPin: 0,
          toLabel: "NOT_A",
          toPin: 0,
        },
        highlightLabels: ["A", "NOT_A"],
      },
      {
        id: "ex7-s6",
        instruction: "Wire B to NOT_B.",
        action: {
          type: "wire",
          fromLabel: "B",
          fromPin: 0,
          toLabel: "NOT_B",
          toPin: 0,
        },
        highlightLabels: ["B", "NOT_B"],
      },
      {
        id: "ex7-s7",
        instruction:
          "Place AND_GT. A > B when A=1 and B=0, i.e. A AND NOT_B.",
        action: { type: "place", gateType: "AND", label: "AND_GT" },
        ghost: { type: "AND", x: 340, y: 60, label: "AND_GT" },
      },
      {
        id: "ex7-s8",
        instruction: "Wire A to AND_GT top input and NOT_B to AND_GT bottom input.",
        action: {
          type: "wire",
          fromLabel: "A",
          fromPin: 0,
          toLabel: "AND_GT",
          toPin: 0,
        },
        highlightLabels: ["A", "AND_GT"],
      },
      {
        id: "ex7-s9",
        instruction: "Wire NOT_B to AND_GT's bottom input.",
        action: {
          type: "wire",
          fromLabel: "NOT_B",
          fromPin: 0,
          toLabel: "AND_GT",
          toPin: 1,
        },
        highlightLabels: ["NOT_B", "AND_GT"],
      },
      {
        id: "ex7-s10",
        instruction:
          "Place AND_LT. A < B when A=0 and B=1, i.e. NOT_A AND B.",
        action: { type: "place", gateType: "AND", label: "AND_LT" },
        ghost: { type: "AND", x: 340, y: 260, label: "AND_LT" },
      },
      {
        id: "ex7-s11",
        instruction: "Wire NOT_A to AND_LT top input.",
        action: {
          type: "wire",
          fromLabel: "NOT_A",
          fromPin: 0,
          toLabel: "AND_LT",
          toPin: 0,
        },
        highlightLabels: ["NOT_A", "AND_LT"],
      },
      {
        id: "ex7-s12",
        instruction: "Wire B to AND_LT's bottom input.",
        action: {
          type: "wire",
          fromLabel: "B",
          fromPin: 0,
          toLabel: "AND_LT",
          toPin: 1,
        },
        highlightLabels: ["B", "AND_LT"],
      },
      {
        id: "ex7-s13",
        instruction:
          "Place an XNOR gate for equality. XNOR outputs 1 when both inputs are the same.",
        action: { type: "place", gateType: "XNOR", label: "XNOR" },
        ghost: { type: "XNOR", x: 340, y: 160, label: "XNOR" },
      },
      {
        id: "ex7-s14",
        instruction: "Wire A to XNOR's top input.",
        action: {
          type: "wire",
          fromLabel: "A",
          fromPin: 0,
          toLabel: "XNOR",
          toPin: 0,
        },
        highlightLabels: ["A", "XNOR"],
      },
      {
        id: "ex7-s15",
        instruction: "Wire B to XNOR's bottom input.",
        action: {
          type: "wire",
          fromLabel: "B",
          fromPin: 0,
          toLabel: "XNOR",
          toPin: 1,
        },
        highlightLabels: ["B", "XNOR"],
      },
      {
        id: "ex7-s16",
        instruction: "Place Output GT.",
        action: { type: "place", gateType: "OUTPUT", label: "GT" },
        ghost: { type: "OUTPUT", x: 520, y: 60, label: "GT" },
      },
      {
        id: "ex7-s17",
        instruction: "Place Output EQ.",
        action: { type: "place", gateType: "OUTPUT", label: "EQ" },
        ghost: { type: "OUTPUT", x: 520, y: 160, label: "EQ" },
      },
      {
        id: "ex7-s18",
        instruction: "Place Output LT.",
        action: { type: "place", gateType: "OUTPUT", label: "LT" },
        ghost: { type: "OUTPUT", x: 520, y: 260, label: "LT" },
      },
      {
        id: "ex7-s19",
        instruction: "Wire AND_GT to GT.",
        action: {
          type: "wire",
          fromLabel: "AND_GT",
          fromPin: 0,
          toLabel: "GT",
          toPin: 0,
        },
        highlightLabels: ["AND_GT", "GT"],
      },
      {
        id: "ex7-s20",
        instruction: "Wire XNOR to EQ.",
        action: {
          type: "wire",
          fromLabel: "XNOR",
          fromPin: 0,
          toLabel: "EQ",
          toPin: 0,
        },
        highlightLabels: ["XNOR", "EQ"],
      },
      {
        id: "ex7-s21",
        instruction: "Wire AND_LT to LT.",
        action: {
          type: "wire",
          fromLabel: "AND_LT",
          fromPin: 0,
          toLabel: "LT",
          toPin: 0,
        },
        highlightLabels: ["AND_LT", "LT"],
      },
      {
        id: "ex7-s22",
        instruction:
          "Verify. For each input combination, exactly one of GT, EQ, LT should be HIGH.",
        hint: "A=1,B=0 -> GT=1. A=0,B=1 -> LT=1. A=B -> EQ=1.",
        action: { type: "verify" },
      },
    ],
  },

  // ── Exercise 8: Build a Priority Circuit ────────────────────────────
  {
    id: "ex8",
    slug: "priority-circuit",
    title: "Build a Priority Circuit",
    description:
      "A priority circuit grants access to the highest-numbered request. R1 has priority over R0. Build it with NOT and AND gates.",
    difficulty: "intermediate",
    category: "arbitration",
    steps: [
      {
        id: "ex8-s1",
        instruction: "Place Input R1 (higher priority request).",
        action: { type: "place", gateType: "INPUT", label: "R1" },
        ghost: { type: "INPUT", x: 40, y: 80, label: "R1" },
      },
      {
        id: "ex8-s2",
        instruction: "Place Input R0 (lower priority request).",
        action: { type: "place", gateType: "INPUT", label: "R0" },
        ghost: { type: "INPUT", x: 40, y: 220, label: "R0" },
      },
      {
        id: "ex8-s3",
        instruction: "Place a NOT gate to invert R1.",
        action: { type: "place", gateType: "NOT", label: "NOT_R1" },
        ghost: { type: "NOT", x: 180, y: 80, label: "NOT_R1" },
      },
      {
        id: "ex8-s4",
        instruction: "Wire R1 to NOT_R1.",
        action: {
          type: "wire",
          fromLabel: "R1",
          fromPin: 0,
          toLabel: "NOT_R1",
          toPin: 0,
        },
        highlightLabels: ["R1", "NOT_R1"],
      },
      {
        id: "ex8-s5",
        instruction:
          "Place AND gate. G0 is granted only when R0=1 AND R1=0 (no higher-priority request).",
        action: { type: "place", gateType: "AND", label: "AND" },
        ghost: { type: "AND", x: 320, y: 200, label: "AND" },
      },
      {
        id: "ex8-s6",
        instruction: "Wire R0 to AND's top input.",
        action: {
          type: "wire",
          fromLabel: "R0",
          fromPin: 0,
          toLabel: "AND",
          toPin: 0,
        },
        highlightLabels: ["R0", "AND"],
      },
      {
        id: "ex8-s7",
        instruction: "Wire NOT_R1 to AND's bottom input.",
        action: {
          type: "wire",
          fromLabel: "NOT_R1",
          fromPin: 0,
          toLabel: "AND",
          toPin: 1,
        },
        highlightLabels: ["NOT_R1", "AND"],
      },
      {
        id: "ex8-s8",
        instruction:
          "Place a BUFFER gate. G1 = R1 directly (highest priority always gets through).",
        action: { type: "place", gateType: "BUFFER", label: "BUF" },
        ghost: { type: "BUFFER", x: 320, y: 80, label: "BUF" },
      },
      {
        id: "ex8-s9",
        instruction: "Wire R1 to the BUFFER.",
        action: {
          type: "wire",
          fromLabel: "R1",
          fromPin: 0,
          toLabel: "BUF",
          toPin: 0,
        },
        highlightLabels: ["R1", "BUF"],
      },
      {
        id: "ex8-s10",
        instruction: "Place Output G1 (grant for R1).",
        action: { type: "place", gateType: "OUTPUT", label: "G1" },
        ghost: { type: "OUTPUT", x: 500, y: 80, label: "G1" },
      },
      {
        id: "ex8-s11",
        instruction: "Place Output G0 (grant for R0).",
        action: { type: "place", gateType: "OUTPUT", label: "G0" },
        ghost: { type: "OUTPUT", x: 500, y: 200, label: "G0" },
      },
      {
        id: "ex8-s12",
        instruction: "Wire BUF output to G1.",
        action: {
          type: "wire",
          fromLabel: "BUF",
          fromPin: 0,
          toLabel: "G1",
          toPin: 0,
        },
        highlightLabels: ["BUF", "G1"],
      },
      {
        id: "ex8-s13",
        instruction: "Wire AND output to G0.",
        action: {
          type: "wire",
          fromLabel: "AND",
          fromPin: 0,
          toLabel: "G0",
          toPin: 0,
        },
        highlightLabels: ["AND", "G0"],
      },
      {
        id: "ex8-s14",
        instruction:
          "Verify. When both request, only G1 is granted. When only R0 requests, G0 is granted.",
        hint: "R1=1,R0=1 -> G1=1,G0=0. R1=0,R0=1 -> G1=0,G0=1. R1=1,R0=0 -> G1=1,G0=0.",
        action: { type: "verify" },
      },
    ],
  },

  // ── Exercise 9: NOR from NAND Gates ─────────────────────────────────
  {
    id: "ex9",
    slug: "nor-from-nand",
    title: "NOR from NAND Gates",
    description:
      "Prove NAND universality by building a NOR gate using only NAND gates. NOR(A,B) = NOT(A OR B).",
    difficulty: "intermediate",
    category: "universal gates",
    steps: [
      {
        id: "ex9-s1",
        instruction: "Place Input A.",
        action: { type: "place", gateType: "INPUT", label: "A" },
        ghost: { type: "INPUT", x: 40, y: 80, label: "A" },
      },
      {
        id: "ex9-s2",
        instruction: "Place Input B.",
        action: { type: "place", gateType: "INPUT", label: "B" },
        ghost: { type: "INPUT", x: 40, y: 240, label: "B" },
      },
      {
        id: "ex9-s3",
        instruction:
          "Place NAND1. We will wire A to both inputs to get NOT A.",
        action: { type: "place", gateType: "NAND", label: "NAND1" },
        ghost: { type: "NAND", x: 200, y: 60, label: "NAND1" },
      },
      {
        id: "ex9-s4",
        instruction: "Wire A to NAND1's top input.",
        action: {
          type: "wire",
          fromLabel: "A",
          fromPin: 0,
          toLabel: "NAND1",
          toPin: 0,
        },
        highlightLabels: ["A", "NAND1"],
      },
      {
        id: "ex9-s5",
        instruction: "Wire A to NAND1's bottom input as well (self-NAND = NOT).",
        hint: "NAND(A,A) = NOT A.",
        action: {
          type: "wire",
          fromLabel: "A",
          fromPin: 0,
          toLabel: "NAND1",
          toPin: 1,
        },
        highlightLabels: ["A", "NAND1"],
      },
      {
        id: "ex9-s6",
        instruction:
          "Place NAND2. Wire B to both inputs to get NOT B.",
        action: { type: "place", gateType: "NAND", label: "NAND2" },
        ghost: { type: "NAND", x: 200, y: 220, label: "NAND2" },
      },
      {
        id: "ex9-s7",
        instruction: "Wire B to NAND2's top input.",
        action: {
          type: "wire",
          fromLabel: "B",
          fromPin: 0,
          toLabel: "NAND2",
          toPin: 0,
        },
        highlightLabels: ["B", "NAND2"],
      },
      {
        id: "ex9-s8",
        instruction: "Wire B to NAND2's bottom input.",
        action: {
          type: "wire",
          fromLabel: "B",
          fromPin: 0,
          toLabel: "NAND2",
          toPin: 1,
        },
        highlightLabels: ["B", "NAND2"],
      },
      {
        id: "ex9-s9",
        instruction:
          "Place NAND3. NAND(NOT_A, NOT_B) = A OR B (by De Morgan's).",
        action: { type: "place", gateType: "NAND", label: "NAND3" },
        ghost: { type: "NAND", x: 360, y: 140, label: "NAND3" },
      },
      {
        id: "ex9-s10",
        instruction: "Wire NAND1 output to NAND3 top input.",
        action: {
          type: "wire",
          fromLabel: "NAND1",
          fromPin: 0,
          toLabel: "NAND3",
          toPin: 0,
        },
        highlightLabels: ["NAND1", "NAND3"],
      },
      {
        id: "ex9-s11",
        instruction: "Wire NAND2 output to NAND3 bottom input.",
        action: {
          type: "wire",
          fromLabel: "NAND2",
          fromPin: 0,
          toLabel: "NAND3",
          toPin: 1,
        },
        highlightLabels: ["NAND2", "NAND3"],
      },
      {
        id: "ex9-s12",
        instruction:
          "Place NAND4. NAND(A OR B, A OR B) = NOT(A OR B) = NOR.",
        action: { type: "place", gateType: "NAND", label: "NAND4" },
        ghost: { type: "NAND", x: 500, y: 140, label: "NAND4" },
      },
      {
        id: "ex9-s13",
        instruction: "Wire NAND3 output to NAND4's top input.",
        action: {
          type: "wire",
          fromLabel: "NAND3",
          fromPin: 0,
          toLabel: "NAND4",
          toPin: 0,
        },
        highlightLabels: ["NAND3", "NAND4"],
      },
      {
        id: "ex9-s14",
        instruction: "Wire NAND3 output to NAND4's bottom input (self-NAND = NOT).",
        action: {
          type: "wire",
          fromLabel: "NAND3",
          fromPin: 0,
          toLabel: "NAND4",
          toPin: 1,
        },
        highlightLabels: ["NAND3", "NAND4"],
      },
      {
        id: "ex9-s15",
        instruction: "Place the output LED.",
        action: { type: "place", gateType: "OUTPUT", label: "Y" },
        ghost: { type: "OUTPUT", x: 640, y: 140, label: "Y" },
      },
      {
        id: "ex9-s16",
        instruction: "Wire NAND4 output to Y.",
        action: {
          type: "wire",
          fromLabel: "NAND4",
          fromPin: 0,
          toLabel: "Y",
          toPin: 0,
        },
        highlightLabels: ["NAND4", "Y"],
      },
      {
        id: "ex9-s17",
        instruction:
          "Verify the circuit behaves as NOR. Y=1 only when both A=0 and B=0.",
        hint: "NOR is the opposite of OR: output is 1 only when ALL inputs are 0.",
        action: { type: "verify" },
      },
    ],
  },

  // ── Exercise 10: XOR from NAND Gates ────────────────────────────────
  {
    id: "ex10",
    slug: "xor-from-nand",
    title: "XOR from NAND Gates",
    description:
      "Build an XOR gate using only four NAND gates. This classic construction demonstrates NAND universality at a deeper level.",
    difficulty: "advanced",
    category: "universal gates",
    steps: [
      {
        id: "ex10-s1",
        instruction: "Place Input A.",
        action: { type: "place", gateType: "INPUT", label: "A" },
        ghost: { type: "INPUT", x: 40, y: 80, label: "A" },
      },
      {
        id: "ex10-s2",
        instruction: "Place Input B.",
        action: { type: "place", gateType: "INPUT", label: "B" },
        ghost: { type: "INPUT", x: 40, y: 240, label: "B" },
      },
      {
        id: "ex10-s3",
        instruction:
          "Place NAND1. It computes NAND(A,B) — the shared intermediate signal.",
        action: { type: "place", gateType: "NAND", label: "NAND1" },
        ghost: { type: "NAND", x: 200, y: 140, label: "NAND1" },
      },
      {
        id: "ex10-s4",
        instruction: "Wire A to NAND1's top input.",
        action: {
          type: "wire",
          fromLabel: "A",
          fromPin: 0,
          toLabel: "NAND1",
          toPin: 0,
        },
        highlightLabels: ["A", "NAND1"],
      },
      {
        id: "ex10-s5",
        instruction: "Wire B to NAND1's bottom input.",
        action: {
          type: "wire",
          fromLabel: "B",
          fromPin: 0,
          toLabel: "NAND1",
          toPin: 1,
        },
        highlightLabels: ["B", "NAND1"],
      },
      {
        id: "ex10-s6",
        instruction:
          "Place NAND2. NAND(A, NAND1) produces one half of the XOR.",
        action: { type: "place", gateType: "NAND", label: "NAND2" },
        ghost: { type: "NAND", x: 360, y: 60, label: "NAND2" },
      },
      {
        id: "ex10-s7",
        instruction: "Wire A to NAND2's top input.",
        action: {
          type: "wire",
          fromLabel: "A",
          fromPin: 0,
          toLabel: "NAND2",
          toPin: 0,
        },
        highlightLabels: ["A", "NAND2"],
      },
      {
        id: "ex10-s8",
        instruction: "Wire NAND1 output to NAND2's bottom input.",
        action: {
          type: "wire",
          fromLabel: "NAND1",
          fromPin: 0,
          toLabel: "NAND2",
          toPin: 1,
        },
        highlightLabels: ["NAND1", "NAND2"],
      },
      {
        id: "ex10-s9",
        instruction:
          "Place NAND3. NAND(B, NAND1) produces the other half.",
        action: { type: "place", gateType: "NAND", label: "NAND3" },
        ghost: { type: "NAND", x: 360, y: 220, label: "NAND3" },
      },
      {
        id: "ex10-s10",
        instruction: "Wire B to NAND3's top input.",
        action: {
          type: "wire",
          fromLabel: "B",
          fromPin: 0,
          toLabel: "NAND3",
          toPin: 0,
        },
        highlightLabels: ["B", "NAND3"],
      },
      {
        id: "ex10-s11",
        instruction: "Wire NAND1 output to NAND3's bottom input.",
        action: {
          type: "wire",
          fromLabel: "NAND1",
          fromPin: 0,
          toLabel: "NAND3",
          toPin: 1,
        },
        highlightLabels: ["NAND1", "NAND3"],
      },
      {
        id: "ex10-s12",
        instruction:
          "Place NAND4. NAND(NAND2, NAND3) produces the final XOR output.",
        action: { type: "place", gateType: "NAND", label: "NAND4" },
        ghost: { type: "NAND", x: 500, y: 140, label: "NAND4" },
      },
      {
        id: "ex10-s13",
        instruction: "Wire NAND2 output to NAND4's top input.",
        action: {
          type: "wire",
          fromLabel: "NAND2",
          fromPin: 0,
          toLabel: "NAND4",
          toPin: 0,
        },
        highlightLabels: ["NAND2", "NAND4"],
      },
      {
        id: "ex10-s14",
        instruction: "Wire NAND3 output to NAND4's bottom input.",
        action: {
          type: "wire",
          fromLabel: "NAND3",
          fromPin: 0,
          toLabel: "NAND4",
          toPin: 1,
        },
        highlightLabels: ["NAND3", "NAND4"],
      },
      {
        id: "ex10-s15",
        instruction: "Place the output LED.",
        action: { type: "place", gateType: "OUTPUT", label: "Y" },
        ghost: { type: "OUTPUT", x: 640, y: 140, label: "Y" },
      },
      {
        id: "ex10-s16",
        instruction: "Wire NAND4 output to Y.",
        action: {
          type: "wire",
          fromLabel: "NAND4",
          fromPin: 0,
          toLabel: "Y",
          toPin: 0,
        },
        highlightLabels: ["NAND4", "Y"],
      },
      {
        id: "ex10-s17",
        instruction:
          "Verify the circuit matches XOR. Y=1 only when A and B differ.",
        hint: "A=0,B=0 -> 0. A=0,B=1 -> 1. A=1,B=0 -> 1. A=1,B=1 -> 0.",
        action: { type: "verify" },
      },
    ],
  },

  // ── Exercise 11: Chain Two Full Adders ──────────────────────────────
  {
    id: "ex11",
    slug: "chain-two-full-adders",
    title: "Chain Two Full Adders",
    description:
      "Chain two FULL_ADDER blocks to build a 2-bit adder. The carry-out of the first feeds the carry-in of the second.",
    difficulty: "intermediate",
    category: "arithmetic",
    steps: [
      {
        id: "ex11-s1",
        instruction: "Place Input A0 (bit 0 of first number).",
        action: { type: "place", gateType: "INPUT", label: "A0" },
        ghost: { type: "INPUT", x: 40, y: 60, label: "A0" },
      },
      {
        id: "ex11-s2",
        instruction: "Place Input B0 (bit 0 of second number).",
        action: { type: "place", gateType: "INPUT", label: "B0" },
        ghost: { type: "INPUT", x: 40, y: 140, label: "B0" },
      },
      {
        id: "ex11-s3",
        instruction: "Place Input A1 (bit 1 of first number).",
        action: { type: "place", gateType: "INPUT", label: "A1" },
        ghost: { type: "INPUT", x: 40, y: 260, label: "A1" },
      },
      {
        id: "ex11-s4",
        instruction: "Place Input B1 (bit 1 of second number).",
        action: { type: "place", gateType: "INPUT", label: "B1" },
        ghost: { type: "INPUT", x: 40, y: 340, label: "B1" },
      },
      {
        id: "ex11-s5",
        instruction: "Place FULL_ADDER block FA0 for the least-significant bit.",
        action: { type: "place", gateType: "FULL_ADDER", label: "FA0" },
        ghost: { type: "FULL_ADDER", x: 220, y: 60, label: "FA0" },
      },
      {
        id: "ex11-s6",
        instruction: "Place FULL_ADDER block FA1 for bit 1.",
        action: { type: "place", gateType: "FULL_ADDER", label: "FA1" },
        ghost: { type: "FULL_ADDER", x: 220, y: 260, label: "FA1" },
      },
      {
        id: "ex11-s7",
        instruction: "Wire A0 to FA0's A input (pin 0).",
        action: {
          type: "wire",
          fromLabel: "A0",
          fromPin: 0,
          toLabel: "FA0",
          toPin: 0,
        },
        highlightLabels: ["A0", "FA0"],
      },
      {
        id: "ex11-s8",
        instruction: "Wire B0 to FA0's B input (pin 1).",
        action: {
          type: "wire",
          fromLabel: "B0",
          fromPin: 0,
          toLabel: "FA0",
          toPin: 1,
        },
        highlightLabels: ["B0", "FA0"],
      },
      {
        id: "ex11-s9",
        instruction: "Wire A1 to FA1's A input (pin 0).",
        action: {
          type: "wire",
          fromLabel: "A1",
          fromPin: 0,
          toLabel: "FA1",
          toPin: 0,
        },
        highlightLabels: ["A1", "FA1"],
      },
      {
        id: "ex11-s10",
        instruction: "Wire B1 to FA1's B input (pin 1).",
        action: {
          type: "wire",
          fromLabel: "B1",
          fromPin: 0,
          toLabel: "FA1",
          toPin: 1,
        },
        highlightLabels: ["B1", "FA1"],
      },
      {
        id: "ex11-s11",
        instruction:
          "Chain: wire FA0's Cout (output pin 1) to FA1's Cin (input pin 2). This is the carry ripple.",
        hint: "The carry from bit 0 feeds into the addition of bit 1 — just like manual binary addition.",
        action: {
          type: "wire",
          fromLabel: "FA0",
          fromPin: 1,
          toLabel: "FA1",
          toPin: 2,
        },
        highlightLabels: ["FA0", "FA1"],
      },
      {
        id: "ex11-s12",
        instruction: "Place Output S0 for the least-significant sum bit.",
        action: { type: "place", gateType: "OUTPUT", label: "S0" },
        ghost: { type: "OUTPUT", x: 460, y: 60, label: "S0" },
      },
      {
        id: "ex11-s13",
        instruction: "Place Output S1 for bit 1 sum.",
        action: { type: "place", gateType: "OUTPUT", label: "S1" },
        ghost: { type: "OUTPUT", x: 460, y: 260, label: "S1" },
      },
      {
        id: "ex11-s14",
        instruction: "Place Output Cout for the final carry.",
        action: { type: "place", gateType: "OUTPUT", label: "Cout" },
        ghost: { type: "OUTPUT", x: 460, y: 360, label: "Cout" },
      },
      {
        id: "ex11-s15",
        instruction: "Wire FA0's Sum (output pin 0) to S0.",
        action: {
          type: "wire",
          fromLabel: "FA0",
          fromPin: 0,
          toLabel: "S0",
          toPin: 0,
        },
        highlightLabels: ["FA0", "S0"],
      },
      {
        id: "ex11-s16",
        instruction: "Wire FA1's Sum (output pin 0) to S1.",
        action: {
          type: "wire",
          fromLabel: "FA1",
          fromPin: 0,
          toLabel: "S1",
          toPin: 0,
        },
        highlightLabels: ["FA1", "S1"],
      },
      {
        id: "ex11-s17",
        instruction: "Wire FA1's Cout (output pin 1) to Cout.",
        action: {
          type: "wire",
          fromLabel: "FA1",
          fromPin: 1,
          toLabel: "Cout",
          toPin: 0,
        },
        highlightLabels: ["FA1", "Cout"],
      },
      {
        id: "ex11-s18",
        instruction:
          "Verify. Try A=11(3), B=01(1): S should be 100 (S1=0, S0=0, Cout=1).",
        hint: "3+1=4 = 100 in binary. Also try 11+11 = 110 (S1=1, S0=0, Cout=1 = 6).",
        action: { type: "verify" },
      },
    ],
  },

  // ── Exercise 12: Implement AND Using MUX ────────────────────────────
  {
    id: "ex12",
    slug: "and-using-mux",
    title: "Implement AND Using MUX",
    description:
      "A MUX can implement any Boolean function. Build an AND gate by wiring a MUX_2TO1 with the right constants: D0=0, D1=B, S=A.",
    difficulty: "intermediate",
    category: "selection",
    steps: [
      {
        id: "ex12-s1",
        instruction: "Place Input A (this will be the select signal).",
        action: { type: "place", gateType: "INPUT", label: "A" },
        ghost: { type: "INPUT", x: 40, y: 80, label: "A" },
      },
      {
        id: "ex12-s2",
        instruction: "Place Input B (this will be the D1 data input).",
        action: { type: "place", gateType: "INPUT", label: "B" },
        ghost: { type: "INPUT", x: 40, y: 200, label: "B" },
      },
      {
        id: "ex12-s3",
        instruction:
          "Place Input ZERO and leave it at 0. This constant-low signal goes to D0.",
        action: { type: "place", gateType: "INPUT", label: "ZERO" },
        ghost: { type: "INPUT", x: 40, y: 320, label: "ZERO" },
      },
      {
        id: "ex12-s4",
        instruction: "Place a MUX_2TO1 block.",
        action: { type: "place", gateType: "MUX_2TO1", label: "MUX" },
        ghost: { type: "MUX_2TO1", x: 260, y: 160, label: "MUX" },
      },
      {
        id: "ex12-s5",
        instruction:
          "Wire ZERO to MUX's D0 input (pin 0). When S=0 (A=0), output is 0.",
        hint: "AND(0, B) = 0 regardless of B, so when A=0 we want output 0.",
        action: {
          type: "wire",
          fromLabel: "ZERO",
          fromPin: 0,
          toLabel: "MUX",
          toPin: 0,
        },
        highlightLabels: ["ZERO", "MUX"],
      },
      {
        id: "ex12-s6",
        instruction:
          "Wire B to MUX's D1 input (pin 1). When S=1 (A=1), output equals B.",
        hint: "AND(1, B) = B, so when A=1 we pass B through.",
        action: {
          type: "wire",
          fromLabel: "B",
          fromPin: 0,
          toLabel: "MUX",
          toPin: 1,
        },
        highlightLabels: ["B", "MUX"],
      },
      {
        id: "ex12-s7",
        instruction: "Wire A to MUX's select input (pin 2).",
        action: {
          type: "wire",
          fromLabel: "A",
          fromPin: 0,
          toLabel: "MUX",
          toPin: 2,
        },
        highlightLabels: ["A", "MUX"],
      },
      {
        id: "ex12-s8",
        instruction: "Place the output LED.",
        action: { type: "place", gateType: "OUTPUT", label: "Y" },
        ghost: { type: "OUTPUT", x: 460, y: 160, label: "Y" },
      },
      {
        id: "ex12-s9",
        instruction: "Wire MUX output to Y.",
        action: {
          type: "wire",
          fromLabel: "MUX",
          fromPin: 0,
          toLabel: "Y",
          toPin: 0,
        },
        highlightLabels: ["MUX", "Y"],
      },
      {
        id: "ex12-s10",
        instruction:
          "Verify Y = A AND B. Test all four input combinations (keep ZERO at 0).",
        hint: "A=0,B=0->0. A=0,B=1->0. A=1,B=0->0. A=1,B=1->1. Same as AND!",
        action: { type: "verify" },
      },
    ],
  },

  // ── Exercise 13: 3-Input Majority Gate ──────────────────────────────
  {
    id: "ex13",
    slug: "3input-majority",
    title: "3-Input Majority Gate",
    description:
      "A majority gate outputs 1 when two or more of its three inputs are 1. Build it from AND and OR gates: Maj(A,B,C) = AB + BC + AC.",
    difficulty: "advanced",
    category: "combinational",
    steps: [
      {
        id: "ex13-s1",
        instruction: "Place Input A.",
        action: { type: "place", gateType: "INPUT", label: "A" },
        ghost: { type: "INPUT", x: 40, y: 60, label: "A" },
      },
      {
        id: "ex13-s2",
        instruction: "Place Input B.",
        action: { type: "place", gateType: "INPUT", label: "B" },
        ghost: { type: "INPUT", x: 40, y: 180, label: "B" },
      },
      {
        id: "ex13-s3",
        instruction: "Place Input C.",
        action: { type: "place", gateType: "INPUT", label: "C" },
        ghost: { type: "INPUT", x: 40, y: 300, label: "C" },
      },
      {
        id: "ex13-s4",
        instruction: "Place AND1 for the A AND B term.",
        action: { type: "place", gateType: "AND", label: "AND_AB" },
        ghost: { type: "AND", x: 220, y: 60, label: "AND_AB" },
      },
      {
        id: "ex13-s5",
        instruction: "Place AND2 for the B AND C term.",
        action: { type: "place", gateType: "AND", label: "AND_BC" },
        ghost: { type: "AND", x: 220, y: 180, label: "AND_BC" },
      },
      {
        id: "ex13-s6",
        instruction: "Place AND3 for the A AND C term.",
        action: { type: "place", gateType: "AND", label: "AND_AC" },
        ghost: { type: "AND", x: 220, y: 300, label: "AND_AC" },
      },
      {
        id: "ex13-s7",
        instruction: "Wire A to AND_AB top input.",
        action: {
          type: "wire",
          fromLabel: "A",
          fromPin: 0,
          toLabel: "AND_AB",
          toPin: 0,
        },
        highlightLabels: ["A", "AND_AB"],
      },
      {
        id: "ex13-s8",
        instruction: "Wire B to AND_AB bottom input.",
        action: {
          type: "wire",
          fromLabel: "B",
          fromPin: 0,
          toLabel: "AND_AB",
          toPin: 1,
        },
        highlightLabels: ["B", "AND_AB"],
      },
      {
        id: "ex13-s9",
        instruction: "Wire B to AND_BC top input.",
        action: {
          type: "wire",
          fromLabel: "B",
          fromPin: 0,
          toLabel: "AND_BC",
          toPin: 0,
        },
        highlightLabels: ["B", "AND_BC"],
      },
      {
        id: "ex13-s10",
        instruction: "Wire C to AND_BC bottom input.",
        action: {
          type: "wire",
          fromLabel: "C",
          fromPin: 0,
          toLabel: "AND_BC",
          toPin: 1,
        },
        highlightLabels: ["C", "AND_BC"],
      },
      {
        id: "ex13-s11",
        instruction: "Wire A to AND_AC top input.",
        action: {
          type: "wire",
          fromLabel: "A",
          fromPin: 0,
          toLabel: "AND_AC",
          toPin: 0,
        },
        highlightLabels: ["A", "AND_AC"],
      },
      {
        id: "ex13-s12",
        instruction: "Wire C to AND_AC bottom input.",
        action: {
          type: "wire",
          fromLabel: "C",
          fromPin: 0,
          toLabel: "AND_AC",
          toPin: 1,
        },
        highlightLabels: ["C", "AND_AC"],
      },
      {
        id: "ex13-s13",
        instruction: "Place OR1 to combine AND_AB and AND_BC.",
        action: { type: "place", gateType: "OR", label: "OR1" },
        ghost: { type: "OR", x: 400, y: 120, label: "OR1" },
      },
      {
        id: "ex13-s14",
        instruction: "Wire AND_AB output to OR1 top input.",
        action: {
          type: "wire",
          fromLabel: "AND_AB",
          fromPin: 0,
          toLabel: "OR1",
          toPin: 0,
        },
        highlightLabels: ["AND_AB", "OR1"],
      },
      {
        id: "ex13-s15",
        instruction: "Wire AND_BC output to OR1 bottom input.",
        action: {
          type: "wire",
          fromLabel: "AND_BC",
          fromPin: 0,
          toLabel: "OR1",
          toPin: 1,
        },
        highlightLabels: ["AND_BC", "OR1"],
      },
      {
        id: "ex13-s16",
        instruction: "Place OR2 to combine OR1 result with AND_AC.",
        action: { type: "place", gateType: "OR", label: "OR2" },
        ghost: { type: "OR", x: 540, y: 200, label: "OR2" },
      },
      {
        id: "ex13-s17",
        instruction: "Wire OR1 output to OR2 top input.",
        action: {
          type: "wire",
          fromLabel: "OR1",
          fromPin: 0,
          toLabel: "OR2",
          toPin: 0,
        },
        highlightLabels: ["OR1", "OR2"],
      },
      {
        id: "ex13-s18",
        instruction: "Wire AND_AC output to OR2 bottom input.",
        action: {
          type: "wire",
          fromLabel: "AND_AC",
          fromPin: 0,
          toLabel: "OR2",
          toPin: 1,
        },
        highlightLabels: ["AND_AC", "OR2"],
      },
      {
        id: "ex13-s19",
        instruction: "Place the output LED.",
        action: { type: "place", gateType: "OUTPUT", label: "Y" },
        ghost: { type: "OUTPUT", x: 680, y: 200, label: "Y" },
      },
      {
        id: "ex13-s20",
        instruction: "Wire OR2 output to Y.",
        action: {
          type: "wire",
          fromLabel: "OR2",
          fromPin: 0,
          toLabel: "Y",
          toPin: 0,
        },
        highlightLabels: ["OR2", "Y"],
      },
      {
        id: "ex13-s21",
        instruction:
          "Verify. Y=1 when 2 or more inputs are 1. Test all 8 combinations.",
        hint: "000->0, 001->0, 010->0, 011->1, 100->0, 101->1, 110->1, 111->1.",
        action: { type: "verify" },
      },
    ],
  },

  // ── Exercise 14: Half Subtractor ────────────────────────────────────
  {
    id: "ex14",
    slug: "half-subtractor",
    title: "Half Subtractor",
    description:
      "A half subtractor computes A - B, producing a Difference (XOR) and a Borrow (NOT A AND B). Build it from basic gates.",
    difficulty: "intermediate",
    category: "arithmetic",
    steps: [
      {
        id: "ex14-s1",
        instruction: "Place Input A (minuend).",
        action: { type: "place", gateType: "INPUT", label: "A" },
        ghost: { type: "INPUT", x: 40, y: 80, label: "A" },
      },
      {
        id: "ex14-s2",
        instruction: "Place Input B (subtrahend).",
        action: { type: "place", gateType: "INPUT", label: "B" },
        ghost: { type: "INPUT", x: 40, y: 220, label: "B" },
      },
      {
        id: "ex14-s3",
        instruction: "Place an XOR gate for the Difference bit (A XOR B).",
        action: { type: "place", gateType: "XOR", label: "XOR" },
        ghost: { type: "XOR", x: 220, y: 80, label: "XOR" },
      },
      {
        id: "ex14-s4",
        instruction: "Wire A to XOR's top input.",
        action: {
          type: "wire",
          fromLabel: "A",
          fromPin: 0,
          toLabel: "XOR",
          toPin: 0,
        },
        highlightLabels: ["A", "XOR"],
      },
      {
        id: "ex14-s5",
        instruction: "Wire B to XOR's bottom input.",
        action: {
          type: "wire",
          fromLabel: "B",
          fromPin: 0,
          toLabel: "XOR",
          toPin: 1,
        },
        highlightLabels: ["B", "XOR"],
      },
      {
        id: "ex14-s6",
        instruction: "Place a NOT gate to invert A (needed for the Borrow).",
        action: { type: "place", gateType: "NOT", label: "NOT_A" },
        ghost: { type: "NOT", x: 180, y: 200, label: "NOT_A" },
      },
      {
        id: "ex14-s7",
        instruction: "Wire A to NOT_A.",
        action: {
          type: "wire",
          fromLabel: "A",
          fromPin: 0,
          toLabel: "NOT_A",
          toPin: 0,
        },
        highlightLabels: ["A", "NOT_A"],
      },
      {
        id: "ex14-s8",
        instruction:
          "Place an AND gate. Borrow = NOT_A AND B (we need to borrow when A=0 and B=1).",
        action: { type: "place", gateType: "AND", label: "AND" },
        ghost: { type: "AND", x: 320, y: 220, label: "AND" },
      },
      {
        id: "ex14-s9",
        instruction: "Wire NOT_A to AND's top input.",
        action: {
          type: "wire",
          fromLabel: "NOT_A",
          fromPin: 0,
          toLabel: "AND",
          toPin: 0,
        },
        highlightLabels: ["NOT_A", "AND"],
      },
      {
        id: "ex14-s10",
        instruction: "Wire B to AND's bottom input.",
        action: {
          type: "wire",
          fromLabel: "B",
          fromPin: 0,
          toLabel: "AND",
          toPin: 1,
        },
        highlightLabels: ["B", "AND"],
      },
      {
        id: "ex14-s11",
        instruction: "Place Output Diff.",
        action: { type: "place", gateType: "OUTPUT", label: "Diff" },
        ghost: { type: "OUTPUT", x: 480, y: 80, label: "Diff" },
      },
      {
        id: "ex14-s12",
        instruction: "Place Output Borrow.",
        action: { type: "place", gateType: "OUTPUT", label: "Borrow" },
        ghost: { type: "OUTPUT", x: 480, y: 220, label: "Borrow" },
      },
      {
        id: "ex14-s13",
        instruction: "Wire XOR output to Diff.",
        action: {
          type: "wire",
          fromLabel: "XOR",
          fromPin: 0,
          toLabel: "Diff",
          toPin: 0,
        },
        highlightLabels: ["XOR", "Diff"],
      },
      {
        id: "ex14-s14",
        instruction: "Wire AND output to Borrow.",
        action: {
          type: "wire",
          fromLabel: "AND",
          fromPin: 0,
          toLabel: "Borrow",
          toPin: 0,
        },
        highlightLabels: ["AND", "Borrow"],
      },
      {
        id: "ex14-s15",
        instruction:
          "Verify. A=0,B=1 should give Diff=1, Borrow=1 (0-1 needs a borrow).",
        hint: "A=0,B=0 -> 0,0. A=0,B=1 -> 1,1. A=1,B=0 -> 1,0. A=1,B=1 -> 0,0.",
        action: { type: "verify" },
      },
    ],
  },

  // ── Exercise 15: Build a Full Subtractor ────────────────────────────
  {
    id: "ex15",
    slug: "full-subtractor",
    title: "Build a Full Subtractor",
    description:
      "A full subtractor handles a borrow-in, making it chainable. Diff = A XOR B XOR Bin, Bout = (!A AND B) OR (Bin AND !(A XOR B)).",
    difficulty: "advanced",
    category: "arithmetic",
    steps: [
      {
        id: "ex15-s1",
        instruction: "Place Input A.",
        action: { type: "place", gateType: "INPUT", label: "A" },
        ghost: { type: "INPUT", x: 40, y: 60, label: "A" },
      },
      {
        id: "ex15-s2",
        instruction: "Place Input B.",
        action: { type: "place", gateType: "INPUT", label: "B" },
        ghost: { type: "INPUT", x: 40, y: 180, label: "B" },
      },
      {
        id: "ex15-s3",
        instruction: "Place Input Bin (borrow-in).",
        action: { type: "place", gateType: "INPUT", label: "Bin" },
        ghost: { type: "INPUT", x: 40, y: 320, label: "Bin" },
      },
      {
        id: "ex15-s4",
        instruction: "Place XOR1. It computes the partial difference A XOR B.",
        action: { type: "place", gateType: "XOR", label: "XOR1" },
        ghost: { type: "XOR", x: 200, y: 80, label: "XOR1" },
      },
      {
        id: "ex15-s5",
        instruction: "Wire A to XOR1's top input.",
        action: {
          type: "wire",
          fromLabel: "A",
          fromPin: 0,
          toLabel: "XOR1",
          toPin: 0,
        },
        highlightLabels: ["A", "XOR1"],
      },
      {
        id: "ex15-s6",
        instruction: "Wire B to XOR1's bottom input.",
        action: {
          type: "wire",
          fromLabel: "B",
          fromPin: 0,
          toLabel: "XOR1",
          toPin: 1,
        },
        highlightLabels: ["B", "XOR1"],
      },
      {
        id: "ex15-s7",
        instruction: "Place XOR2. The final difference is XOR1 XOR Bin.",
        action: { type: "place", gateType: "XOR", label: "XOR2" },
        ghost: { type: "XOR", x: 360, y: 80, label: "XOR2" },
      },
      {
        id: "ex15-s8",
        instruction: "Wire XOR1 output to XOR2's top input.",
        action: {
          type: "wire",
          fromLabel: "XOR1",
          fromPin: 0,
          toLabel: "XOR2",
          toPin: 0,
        },
        highlightLabels: ["XOR1", "XOR2"],
      },
      {
        id: "ex15-s9",
        instruction: "Wire Bin to XOR2's bottom input.",
        action: {
          type: "wire",
          fromLabel: "Bin",
          fromPin: 0,
          toLabel: "XOR2",
          toPin: 1,
        },
        highlightLabels: ["Bin", "XOR2"],
      },
      {
        id: "ex15-s10",
        instruction: "Place NOT_A to invert A (for the borrow-out logic).",
        action: { type: "place", gateType: "NOT", label: "NOT_A" },
        ghost: { type: "NOT", x: 180, y: 220, label: "NOT_A" },
      },
      {
        id: "ex15-s11",
        instruction: "Wire A to NOT_A.",
        action: {
          type: "wire",
          fromLabel: "A",
          fromPin: 0,
          toLabel: "NOT_A",
          toPin: 0,
        },
        highlightLabels: ["A", "NOT_A"],
      },
      {
        id: "ex15-s12",
        instruction:
          "Place AND1 for the first borrow term: NOT_A AND B.",
        action: { type: "place", gateType: "AND", label: "AND1" },
        ghost: { type: "AND", x: 300, y: 220, label: "AND1" },
      },
      {
        id: "ex15-s13",
        instruction: "Wire NOT_A to AND1's top input.",
        action: {
          type: "wire",
          fromLabel: "NOT_A",
          fromPin: 0,
          toLabel: "AND1",
          toPin: 0,
        },
        highlightLabels: ["NOT_A", "AND1"],
      },
      {
        id: "ex15-s14",
        instruction: "Wire B to AND1's bottom input.",
        action: {
          type: "wire",
          fromLabel: "B",
          fromPin: 0,
          toLabel: "AND1",
          toPin: 1,
        },
        highlightLabels: ["B", "AND1"],
      },
      {
        id: "ex15-s15",
        instruction:
          "Place NOT_XOR1 to invert XOR1 (for the second borrow term).",
        action: { type: "place", gateType: "NOT", label: "NOT_XOR1" },
        ghost: { type: "NOT", x: 300, y: 340, label: "NOT_XOR1" },
      },
      {
        id: "ex15-s16",
        instruction: "Wire XOR1 output to NOT_XOR1.",
        action: {
          type: "wire",
          fromLabel: "XOR1",
          fromPin: 0,
          toLabel: "NOT_XOR1",
          toPin: 0,
        },
        highlightLabels: ["XOR1", "NOT_XOR1"],
      },
      {
        id: "ex15-s17",
        instruction:
          "Place AND2 for the second borrow term: Bin AND NOT(A XOR B).",
        action: { type: "place", gateType: "AND", label: "AND2" },
        ghost: { type: "AND", x: 440, y: 320, label: "AND2" },
      },
      {
        id: "ex15-s18",
        instruction: "Wire Bin to AND2's top input.",
        action: {
          type: "wire",
          fromLabel: "Bin",
          fromPin: 0,
          toLabel: "AND2",
          toPin: 0,
        },
        highlightLabels: ["Bin", "AND2"],
      },
      {
        id: "ex15-s19",
        instruction: "Wire NOT_XOR1 output to AND2's bottom input.",
        action: {
          type: "wire",
          fromLabel: "NOT_XOR1",
          fromPin: 0,
          toLabel: "AND2",
          toPin: 1,
        },
        highlightLabels: ["NOT_XOR1", "AND2"],
      },
      {
        id: "ex15-s20",
        instruction:
          "Place an OR gate. Bout = AND1 OR AND2.",
        action: { type: "place", gateType: "OR", label: "OR" },
        ghost: { type: "OR", x: 560, y: 260, label: "OR" },
      },
      {
        id: "ex15-s21",
        instruction: "Wire AND1 output to OR's top input.",
        action: {
          type: "wire",
          fromLabel: "AND1",
          fromPin: 0,
          toLabel: "OR",
          toPin: 0,
        },
        highlightLabels: ["AND1", "OR"],
      },
      {
        id: "ex15-s22",
        instruction: "Wire AND2 output to OR's bottom input.",
        action: {
          type: "wire",
          fromLabel: "AND2",
          fromPin: 0,
          toLabel: "OR",
          toPin: 1,
        },
        highlightLabels: ["AND2", "OR"],
      },
      {
        id: "ex15-s23",
        instruction: "Place Output Diff.",
        action: { type: "place", gateType: "OUTPUT", label: "Diff" },
        ghost: { type: "OUTPUT", x: 560, y: 80, label: "Diff" },
      },
      {
        id: "ex15-s24",
        instruction: "Place Output Bout.",
        action: { type: "place", gateType: "OUTPUT", label: "Bout" },
        ghost: { type: "OUTPUT", x: 680, y: 260, label: "Bout" },
      },
      {
        id: "ex15-s25",
        instruction: "Wire XOR2 output to Diff.",
        action: {
          type: "wire",
          fromLabel: "XOR2",
          fromPin: 0,
          toLabel: "Diff",
          toPin: 0,
        },
        highlightLabels: ["XOR2", "Diff"],
      },
      {
        id: "ex15-s26",
        instruction: "Wire OR output to Bout.",
        action: {
          type: "wire",
          fromLabel: "OR",
          fromPin: 0,
          toLabel: "Bout",
          toPin: 0,
        },
        highlightLabels: ["OR", "Bout"],
      },
      {
        id: "ex15-s27",
        instruction:
          "Verify all 8 input combinations match A - B - Bin subtraction.",
        hint: "A=0,B=1,Bin=1: Diff=0, Bout=1 (0-1-1 = -2, borrows). A=1,B=1,Bin=0: Diff=0, Bout=0.",
        action: { type: "verify" },
      },
    ],
  },
];

export function getExercise(slug: string): Exercise | undefined {
  return EXERCISES.find((ex) => ex.slug === slug);
}
