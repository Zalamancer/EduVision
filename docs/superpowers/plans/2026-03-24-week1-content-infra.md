# Week 1: Wire Labels + Compound Gates + 12 Challenges

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship wire value labels, 3 compound gate primitives (MUX_2TO1, FULL_ADDER, DECODER_2TO4), and 12 new challenges covering exam topics.

**Architecture:** Wire labels are SVG overlays in WireRenderer. Compound gates extend the existing GateType union, evaluateGate switch, PIN_POSITIONS map, and GateShapes components. Challenges are static data entries in challenges-data.ts. No new npm dependencies.

**Tech Stack:** React 19, Next.js 16, TypeScript, SVG, Zustand

---

## Task 1: Wire Value Labels

**Files:**
- Modify: `components/simulator/WireRenderer.tsx`
- Modify: `components/simulator/Toolbar.tsx`
- Modify: `components/simulator/Canvas.tsx`

### What it does
Renders a small `0` or `1` badge at the midpoint of every wire. Green pill for HIGH, dark pill for LOW. Toggled via an eye icon in the floating toolbar.

- [ ] **Step 1: Add showLabels state to Canvas**

In `app/simulator/page.tsx`, add `showLabels` state and pass it through EditorLayout to the canvas area. The Toolbar gets a toggle callback.

- [ ] **Step 2: Add toggle button to Toolbar**

Add an eye icon button after the undo/redo divider in `Toolbar.tsx`. Clicking toggles `showLabels`. Active state uses `text-primary`.

- [ ] **Step 3: Render value badges in WireRenderer**

Add a `showLabels?: boolean` prop to `WireRenderer`. For each wire, compute the midpoint of the Manhattan path (the center of the vertical segment). Render:
```tsx
<rect x={mx-8} y={my-7} width={16} height={14} rx={4}
  fill={isHigh ? "#052e16" : "#27272a"} />
<text x={mx} y={my+4} textAnchor="middle"
  fill={isHigh ? "#4ade80" : "#71717a"}
  fontSize="9" fontFamily="monospace" fontWeight="bold">
  {isHigh ? "1" : "0"}
</text>
```

Manhattan midpoint calculation: for path `M x1 y1 L midX y1 L midX y2 L x2 y2`, the vertical segment midpoint is `(midX, (y1+y2)/2)`.

- [ ] **Step 4: Verify visually**

Place 2+ gates, wire them, toggle inputs. Verify labels appear/disappear with the toggle. Labels should show correct 0/1 values and update when inputs change.

- [ ] **Step 5: Commit**

```
feat(simulator): add wire value labels with toggle
```

---

## Task 2: Compound Gate Types (MUX_2TO1, FULL_ADDER, DECODER_2TO4)

**Files:**
- Modify: `lib/sim-engine/types.ts` -- add to GateType union
- Modify: `lib/sim-engine/gates.ts` -- add INPUT_COUNTS, OUTPUT_COUNTS, evaluateGate cases, PIN_POSITIONS
- Create: `components/simulator/CompoundShapes.tsx` -- SVG shapes for compound gates
- Modify: `components/simulator/GateComponent.tsx` -- add switch cases
- Modify: `components/simulator/GateBase.tsx` -- handle variable bounding box sizes
- Modify: `components/simulator/ComponentPalette.tsx` -- add compound section to palette

### 2A: Extend GateType and gate logic

- [ ] **Step 1: Add types**

In `types.ts`, extend `GateType`:
```typescript
export type GateType =
  | "AND" | "OR" | "NOT" | "NAND" | "NOR" | "XOR" | "XNOR"
  | "INPUT" | "OUTPUT" | "BUFFER"
  | "MUX_2TO1" | "FULL_ADDER" | "DECODER_2TO4";
```

- [ ] **Step 2: Add gate logic in gates.ts**

Add to `INPUT_COUNTS`:
```typescript
MUX_2TO1: 3,      // D0, D1, S
FULL_ADDER: 3,    // A, B, Cin
DECODER_2TO4: 2,  // A1, A0
```

Add to `OUTPUT_COUNTS`:
```typescript
MUX_2TO1: 1,      // Y
FULL_ADDER: 2,    // Sum, Cout
DECODER_2TO4: 4,  // D0, D1, D2, D3
```

Add to `evaluateGate`:
```typescript
case "MUX_2TO1":
  return [inputs[2] ? inputs[1] : inputs[0]]; // S ? D1 : D0

case "FULL_ADDER": {
  const a = inputs[0], b = inputs[1], cin = inputs[2];
  const sum = a !== b !== cin; // XOR chain
  const cout = (a && b) || (cin && (a !== b));
  return [sum, cout];
}

case "DECODER_2TO4": {
  const a1 = inputs[0], a0 = inputs[1];
  return [
    !a1 && !a0,  // D0
    !a1 && a0,   // D1
    a1 && !a0,   // D2
    a1 && a0,    // D3
  ];
}
```

Add to `PIN_POSITIONS`:
```typescript
MUX_2TO1:     { inputs: [[0, 12], [0, 48], [40, 60]], outputs: [[80, 30]] },
FULL_ADDER:   { inputs: [[0, 10], [0, 30], [0, 50]], outputs: [[80, 20], [80, 40]] },
DECODER_2TO4: { inputs: [[0, 20], [0, 60]], outputs: [[80, 10], [80, 30], [80, 50], [80, 70]] },
```

Note: DECODER_2TO4 uses an 80x80 bounding box (taller than standard 80x60).

- [ ] **Step 3: Verify build passes**

Run `npx next build` to ensure no type errors.

- [ ] **Step 4: Commit gate logic**

```
feat(sim-engine): add MUX_2TO1, FULL_ADDER, DECODER_2TO4 gate types
```

### 2B: SVG Shapes for Compound Gates

- [ ] **Step 5: Create CompoundShapes.tsx**

Create `components/simulator/CompoundShapes.tsx` with shapes for each compound gate. These are rectangular block shapes (not ANSI curves) with labeled pins:

- **MUX_2TO1**: 80x60 rect with "MUX" label, pin labels D0/D1/S on left, Y on right
- **FULL_ADDER**: 80x60 rect with "FA" label, pin labels A/B/Cin on left, S/Co on right
- **DECODER_2TO4**: 80x80 rect with "DEC" label, pin labels A1/A0 on left, D0-D3 on right

Style: `fill="#18181b" stroke="#22c55e" strokeWidth="1.2"`. Pin labels in 7px monospace `fill="#71717a"`. Block name centered in 11px monospace bold `fill="#22c55e"`.

- [ ] **Step 6: Add to GateComponent.tsx**

Add switch cases for `MUX_2TO1`, `FULL_ADDER`, `DECODER_2TO4` importing from CompoundShapes.

- [ ] **Step 7: Handle variable bounding box in GateBase.tsx**

Add a `BOUNDING_BOX` map for components that aren't 80x60:
```typescript
const BOUNDING_BOX: Partial<Record<GateType, { w: number; h: number }>> = {
  DECODER_2TO4: { w: 80, h: 80 },
};
```
Use this in the selection ring dimensions. Default to `{ w: 80, h: 60 }`.

- [ ] **Step 8: Add to ComponentPalette.tsx**

Add a "Components" section after "Logic Gates" with MUX_2TO1, FULL_ADDER, DECODER_2TO4. Add GateThumb SVG thumbnails for each (simplified rectangular blocks).

- [ ] **Step 9: Verify visually**

Place each compound gate on canvas, wire inputs, toggle them, verify correct outputs. Check truth table for FULL_ADDER (8 rows) and DECODER_2TO4 (4 rows with one-hot outputs).

- [ ] **Step 10: Commit shapes and palette**

```
feat(simulator): add compound gate shapes and palette entries
```

---

## Task 3: 12 New Challenges

**Files:**
- Modify: `lib/challenges-data.ts` -- add 12 challenge entries

### Challenge list

All challenges use existing basic gates (AND, OR, NOT, NAND, NOR, XOR, XNOR) plus the new compound types. Each has instructions markdown, difficulty rating, and a solution circuit.

| # | Slug | Title | Difficulty | Gates used |
|---|------|-------|------------|------------|
| 4 | or-from-nand | OR from NAND gates | beginner | NAND |
| 5 | nor-from-nand | NOR from basic gates | beginner | AND, OR, NOT |
| 6 | xnor-gate | Build an XNOR gate | beginner | XOR, NOT |
| 7 | full-adder | Build a full adder | intermediate | XOR, AND, OR |
| 8 | 2to1-mux | Build a 2:1 multiplexer | intermediate | AND, OR, NOT |
| 9 | full-adder-chain | Chain two full adders | intermediate | FULL_ADDER |
| 10 | priority-2bit | 2-bit priority circuit | intermediate | AND, NOT |
| 11 | 1bit-comparator | 1-bit comparator (GT/EQ/LT) | intermediate | AND, NOT, XNOR |
| 12 | decoder-2to4 | Build a 2-to-4 decoder | intermediate | AND, NOT |
| 13 | mux-implements-and | Implement AND using a MUX | intermediate | MUX_2TO1, INPUT |
| 14 | half-subtractor | Build a half subtractor | intermediate | XOR, AND, NOT |
| 15 | 3input-majority | 3-input majority gate | advanced | AND, OR |

- [ ] **Step 1: Write challenges 4-7**

Add OR-from-NAND (3 NANDs), XNOR (XOR+NOT), NOR-from-basic (OR+NOT), and full adder (2 XOR + 2 AND + 1 OR) to CHALLENGES array. Include instructions markdown with truth tables, hints, and solution circuits with positioned components and wires.

- [ ] **Step 2: Write challenges 8-11**

Add 2:1 MUX (AND+OR+NOT), full adder chain (2 FULL_ADDER blocks), priority circuit (AND+NOT), and 1-bit comparator (AND+NOT+XNOR).

- [ ] **Step 3: Write challenges 12-15**

Add decoder (AND+NOT), MUX-implements-AND, half subtractor (XOR+AND+NOT), and majority gate (AND+OR).

- [ ] **Step 4: Verify challenge pages load**

Navigate to `/challenge/or-from-nand`, `/challenge/full-adder`, `/challenge/decoder-2to4` etc. Verify instructions render, solution circuits are valid (truth tables generate correctly), and "Check My Answer" works.

- [ ] **Step 5: Build check**

Run `npx next build` to verify all pages generate.

- [ ] **Step 6: Commit all challenges**

```
feat(challenges): add 12 new challenges covering exam topics
```

---

## Verification Checklist

- [ ] Wire value labels toggle on/off, show correct 0/1 for all wire states
- [ ] MUX_2TO1 evaluates correctly: Y = S ? D1 : D0
- [ ] FULL_ADDER evaluates correctly: Sum and Cout for all 8 input combinations
- [ ] DECODER_2TO4 evaluates correctly: one-hot output for all 4 input combinations
- [ ] All 15 challenges (3 existing + 12 new) load and pass truth table verification
- [ ] Build passes: `npx next build` succeeds with 0 errors
- [ ] All compound gates appear in the left panel with SVG thumbnails
