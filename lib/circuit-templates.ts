/**
 * Programmatic circuit template generators.
 * These produce guaranteed-correct circuits that would be too complex
 * for an LLM to wire reliably (comparators, adders, etc.).
 */

interface Component {
  id: string;
  type: string;
  x: number;
  y: number;
  rotation: number;
  label: string;
  value: boolean;
}

interface WireEnd {
  componentId: string;
  pinIndex: number;
}

interface Wire {
  id: string;
  from: WireEnd;
  to: WireEnd;
}

export interface Circuit {
  id: string;
  name: string;
  components: Component[];
  wires: Wire[];
}

// ── Builder helpers ──────────────────────────────────────────────

class CircuitBuilder {
  components: Component[] = [];
  wires: Wire[] = [];
  private cCount = 0;
  private wCount = 0;

  addComp(type: string, x: number, y: number, label: string): string {
    const id = `c${++this.cCount}`;
    this.components.push({ id, type, x, y, rotation: 0, label, value: false });
    return id;
  }

  addWire(fromId: string, fromPin: number, toId: string, toPin: number): void {
    this.wires.push({
      id: `w${++this.wCount}`,
      from: { componentId: fromId, pinIndex: fromPin },
      to: { componentId: toId, pinIndex: toPin },
    });
  }

  build(id: string, name: string): Circuit {
    return { id, name, components: this.components, wires: this.wires };
  }
}

// ── N-Bit Comparator ─────────────────────────────────────────────
//
// For each bit i (MSB-first):
//   gt_i = A_i AND NOT(B_i)
//   eq_i = A_i XNOR B_i
//   lt_i = NOT(A_i) AND B_i
//
// Cascade (2+ bits):
//   cumEq[0]    = eq[0]
//   cumEq[i]    = cumEq[i-1] AND eq[i]
//   A>B         = gt[0] OR (cumEq[0] AND gt[1]) OR (cumEq[1] AND gt[2]) OR ...
//   A=B         = cumEq[n-1]
//   A<B         = lt[0] OR (cumEq[0] AND lt[1]) OR (cumEq[1] AND lt[2]) OR ...

export function generateComparator(bits: number): Circuit {
  const b = new CircuitBuilder();

  const COL_INPUT = 40;
  const COL_NOT = 200;
  const COL_BITGATE = 380;
  const COL_CASCADE_AND = 560;
  const COL_CASCADE_OR = 720;
  const COL_OUTPUT_MULTI = 880;
  const COL_OUTPUT_1BIT = 560;

  const ROW = 180; // vertical space per bit pair

  // ── Inputs ──
  const aIn: string[] = [];
  const bIn: string[] = [];
  for (let i = 0; i < bits; i++) {
    const bitLabel = bits - 1 - i;
    const baseY = i * ROW + 60;
    aIn.push(b.addComp("INPUT", COL_INPUT, baseY, `A${bitLabel}`));
    bIn.push(b.addComp("INPUT", COL_INPUT, baseY + 80, `B${bitLabel}`));
  }

  // ── Per-bit comparison gates ──
  const gtBit: string[] = [];
  const eqBit: string[] = [];
  const ltBit: string[] = [];

  for (let i = 0; i < bits; i++) {
    const baseY = i * ROW + 60;

    // gt: A AND NOT(B)
    const notB = b.addComp("NOT", COL_NOT, baseY - 10, "");
    b.addWire(bIn[i], 0, notB, 0);
    const andGt = b.addComp("AND", COL_BITGATE, baseY - 10, "");
    b.addWire(aIn[i], 0, andGt, 0);
    b.addWire(notB, 0, andGt, 1);
    gtBit.push(andGt);

    // eq: XNOR
    const xnor = b.addComp("XNOR", COL_BITGATE, baseY + 40, "");
    b.addWire(aIn[i], 0, xnor, 0);
    b.addWire(bIn[i], 0, xnor, 1);
    eqBit.push(xnor);

    // lt: NOT(A) AND B
    const notA = b.addComp("NOT", COL_NOT, baseY + 90, "");
    b.addWire(aIn[i], 0, notA, 0);
    const andLt = b.addComp("AND", COL_BITGATE, baseY + 90, "");
    b.addWire(notA, 0, andLt, 0);
    b.addWire(bIn[i], 0, andLt, 1);
    ltBit.push(andLt);
  }

  // ── Cascade logic ──
  let finalGt: string;
  let finalEq: string;
  let finalLt: string;

  if (bits === 1) {
    finalGt = gtBit[0];
    finalEq = eqBit[0];
    finalLt = ltBit[0];
  } else {
    // Cumulative equality chain
    const cumEq: string[] = [eqBit[0]];
    for (let i = 1; i < bits; i++) {
      const andEq = b.addComp("AND", COL_CASCADE_AND, i * ROW + 20, "");
      b.addWire(cumEq[i - 1], 0, andEq, 0);
      b.addWire(eqBit[i], 0, andEq, 1);
      cumEq.push(andEq);
    }
    finalEq = cumEq[bits - 1];

    // A>B chain
    let orChainGt: string = gtBit[0];
    for (let i = 1; i < bits; i++) {
      const andTerm = b.addComp("AND", COL_CASCADE_AND, i * ROW - 50, "");
      b.addWire(cumEq[i - 1], 0, andTerm, 0);
      b.addWire(gtBit[i], 0, andTerm, 1);

      const orGate = b.addComp("OR", COL_CASCADE_OR, i * ROW - 50, "");
      b.addWire(orChainGt, 0, orGate, 0);
      b.addWire(andTerm, 0, orGate, 1);
      orChainGt = orGate;
    }
    finalGt = orChainGt;

    // A<B chain
    let orChainLt: string = ltBit[0];
    for (let i = 1; i < bits; i++) {
      const andTerm = b.addComp("AND", COL_CASCADE_AND, i * ROW + 90, "");
      b.addWire(cumEq[i - 1], 0, andTerm, 0);
      b.addWire(ltBit[i], 0, andTerm, 1);

      const orGate = b.addComp("OR", COL_CASCADE_OR, i * ROW + 90, "");
      b.addWire(orChainLt, 0, orGate, 0);
      b.addWire(andTerm, 0, orGate, 1);
      orChainLt = orGate;
    }
    finalLt = orChainLt;
  }

  // ── Outputs ──
  const outX = bits === 1 ? COL_OUTPUT_1BIT : COL_OUTPUT_MULTI;
  const midY = (bits * ROW) / 2;
  const outGt = b.addComp("OUTPUT", outX, midY - 60, "A>B");
  const outEq = b.addComp("OUTPUT", outX, midY, "A=B");
  const outLt = b.addComp("OUTPUT", outX, midY + 60, "A<B");

  b.addWire(finalGt, 0, outGt, 0);
  b.addWire(finalEq, 0, outEq, 0);
  b.addWire(finalLt, 0, outLt, 0);

  return b.build(`comparator-${bits}bit`, `${bits}-Bit Comparator`);
}

// ── Template lookup ──────────────────────────────────────────────

/**
 * Try to match a user message to a known circuit template.
 * Returns the circuit if matched, null otherwise.
 */
export function matchTemplate(text: string): { circuit: Circuit; explanation: string } | null {
  const comparatorMatch = text.match(/(\d)\s*-?\s*bits?\s*(?:comparator|compare)/i)
    ?? text.match(/(?:comparator|compare)\s*.*?(\d)\s*-?\s*bits?/i);

  if (comparatorMatch) {
    const bits = parseInt(comparatorMatch[1], 10);
    if (bits >= 1 && bits <= 4) {
      const circuit = generateComparator(bits);
      const compCount = circuit.components.length;
      const wireCount = circuit.wires.length;
      return {
        circuit,
        explanation: `Generated a ${bits}-bit comparator with ${compCount} components and ${wireCount} wires. It compares two ${bits}-bit binary numbers (A and B) and outputs A>B, A=B, and A<B.`,
      };
    }
  }

  return null;
}
