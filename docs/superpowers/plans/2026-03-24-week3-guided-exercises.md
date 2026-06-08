# Week 3: Guided Exercise System

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development to implement this plan.

**Goal:** The "Learn" tab in the left panel becomes a functional exercise browser. Students select an exercise, the left panel shows step-by-step instructions, the canvas highlights where to build, and each step is validated before the next unlocks.

**Architecture:** Exercise data is static TypeScript. An exercise store manages active exercise state. The ComponentPalette "Learn" tab renders an ExercisePanel when an exercise is active. Canvas renders ghost hints (translucent placement guides) from exercise step data. Validation runs against circuit store state.

**Tech Stack:** React 19, Next.js 16, TypeScript, Zustand, SVG

---

## Task 1: Exercise Data Types + 5 Initial Exercises

**Files:**
- Create: `lib/exercises/types.ts`
- Create: `lib/exercises/data.ts`
- Create: `lib/exercises/index.ts`

### types.ts

```typescript
import type { GateType, Circuit } from "@/lib/sim-engine/types";

export interface ExerciseStep {
  id: string;
  instruction: string;
  hint?: string;
  /** What the student must do */
  action:
    | { type: "place"; gateType: GateType; label?: string }
    | { type: "wire"; fromLabel: string; fromPin: number; toLabel: string; toPin: number }
    | { type: "toggle"; label: string; value: boolean }
    | { type: "verify" }; // check truth table
  /** Component IDs/labels to highlight on canvas */
  highlightLabels?: string[];
  /** Ghost component to show as placement hint */
  ghost?: { type: GateType; x: number; y: number };
}

export interface Exercise {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;
  /** Starting circuit (pre-placed components, if any) */
  starterCircuit?: Circuit;
  steps: ExerciseStep[];
  /** Expected final truth table for full verification */
  expectedOutputLabels?: string[];
}
```

### data.ts — 5 initial exercises

**Exercise 1: "Your First AND Gate" (beginner)**
Steps:
1. Place an INPUT (label: A) — ghost at x=40, y=80
2. Place an INPUT (label: B) — ghost at x=40, y=160
3. Place an AND gate — ghost at x=200, y=100
4. Wire A output to AND input 0 — highlight A and AND
5. Wire B output to AND input 1 — highlight B and AND
6. Place an OUTPUT (label: Y) — ghost at x=360, y=100
7. Wire AND output to Y input — highlight AND and Y
8. Toggle A to 1, verify output
9. Toggle B to 1, verify AND outputs 1

**Exercise 2: "Build a Half Adder" (beginner)**
Steps:
1. Place inputs A and B
2. Place XOR gate for Sum
3. Wire A,B to XOR
4. Place AND gate for Carry
5. Wire A,B to AND
6. Place outputs Sum, Carry
7. Wire XOR to Sum, AND to Carry
8. Verify truth table

**Exercise 3: "OR from NAND Gates" (intermediate)**
Steps:
1. Place inputs A, B
2. Place NAND1 (both inputs from A) — acts as NOT
3. Wire A to both NAND1 inputs
4. Place NAND2 (both inputs from B) — acts as NOT
5. Wire B to both NAND2 inputs
6. Place NAND3
7. Wire NAND1 output to NAND3 input 0
8. Wire NAND2 output to NAND3 input 1
9. Place output Y
10. Wire NAND3 to Y
11. Verify matches OR truth table

**Exercise 4: "Build a 2:1 MUX from gates" (intermediate)**
Steps:
1. Place inputs D0, D1, S
2. Place NOT gate
3. Wire S to NOT
4. Place AND1 (NOT(S) AND D0)
5. Wire NOT output to AND1 input 0, D0 to AND1 input 1
6. Place AND2 (S AND D1)
7. Wire S to AND2 input 0, D1 to AND2 input 1
8. Place OR gate
9. Wire AND1 and AND2 to OR
10. Place output Y, wire OR to Y
11. Verify: when S=0, Y=D0; when S=1, Y=D1

**Exercise 5: "Build a Full Adder" (intermediate)**
Steps:
1. Place inputs A, B, Cin
2. Place XOR1 for first half-add
3. Wire A, B to XOR1
4. Place XOR2 for Sum
5. Wire XOR1 output and Cin to XOR2
6. Place AND1
7. Wire A, B to AND1
8. Place AND2
9. Wire XOR1 output and Cin to AND2
10. Place OR gate for Cout
11. Wire AND1 and AND2 to OR
12. Place outputs Sum, Cout
13. Wire XOR2 to Sum, OR to Cout
14. Verify all 8 truth table rows

- [ ] Step 1: Create types.ts
- [ ] Step 2: Create data.ts with all 5 exercises
- [ ] Step 3: Create index.ts barrel export
- [ ] Step 4: Build check

---

## Task 2: Exercise Store

**Files:**
- Create: `lib/stores/exercise-store.ts`

### What it does

Zustand store managing the active exercise state.

```typescript
interface ExerciseState {
  activeExercise: Exercise | null;
  currentStepIndex: number;
  completedSteps: boolean[];
  showHint: boolean;
  validationError: string | null;

  startExercise: (exercise: Exercise) => void;
  exitExercise: () => void;
  validateCurrentStep: () => boolean;
  advanceStep: () => void;
  goBackStep: () => void;
  toggleHint: () => void;
  setValidationError: (msg: string | null) => void;
}
```

Key behaviors:
- `startExercise(exercise)`: loads the exercise, sets currentStepIndex to 0, loads starterCircuit if any into circuit-store
- `validateCurrentStep()`: checks the current step's action against circuit-store state:
  - "place": checks if a component of the right type exists (added since exercise started)
  - "wire": checks if a wire connects the specified labels/pins
  - "toggle": checks if the INPUT with that label has the correct value
  - "verify": runs truth table and compares
- `advanceStep()`: marks current step complete, moves to next
- `exitExercise()`: clears everything

Validation helpers need to read from `useCircuitStore.getState()`.

- [ ] Step 1: Create exercise-store.ts
- [ ] Step 2: Build check

---

## Task 3: Exercise Panel UI

**Files:**
- Create: `components/simulator/ExercisePanel.tsx`
- Modify: `components/simulator/ComponentPalette.tsx` — Learn tab renders ExercisePanel

### ExercisePanel.tsx

Two states:

**State A: Exercise Browser** (no active exercise)
Shows a list of exercises as cards in a vertical list:
```
GUIDED EXERCISES

[card] Your First AND Gate
       beginner · 9 steps

[card] Build a Half Adder
       beginner · 8 steps

[card] OR from NAND Gates
       intermediate · 11 steps

...
```

Each card: glass-card style (bg-zinc-800/60 border border-zinc-800/50 rounded-lg p-3). Clicking starts the exercise.

**State B: Active Exercise** (exercise in progress)
```
← Back                     [2/9]

BUILD A HALF ADDER
beginner

─────────────────────

✓ Step 1: Place input A
✓ Step 2: Place input B

→ Step 3: Place an XOR gate
  "This will compute the Sum bit.
   XOR outputs 1 when inputs differ."

  [Show Hint]  [Check Step ▶]

  🔒 Step 4: Wire A to XOR...
  🔒 Step 5: Wire B to XOR...
```

- Back arrow exits exercise
- Completed steps: green checkmark, collapsed to one line, zinc-500 text
- Current step: green left border (4px), full instruction text, hint button, check button
- Upcoming steps: lock icon, blurred/truncated, zinc-600 text
- "Check Step" validates and advances on success
- On failure: red shake + error message below

### ComponentPalette.tsx changes

The "Learn" tab currently shows "Tutorials & examples coming soon". Replace with:
```tsx
{activeTab === "learn" && (
  <ExercisePanel />
)}
```

- [ ] Step 1: Create ExercisePanel.tsx with browser + active states
- [ ] Step 2: Update ComponentPalette.tsx Learn tab
- [ ] Step 3: Build check

---

## Task 4: Canvas Ghost Hints

**Files:**
- Modify: `components/simulator/Canvas.tsx`

### What it does

When an exercise is active and the current step has a `ghost` property, render a translucent "ghost" component on the canvas showing where to place the gate.

Ghost rendering:
- Same gate shape as the target type, but with:
  - opacity: 0.15
  - stroke: dashed (strokeDasharray="4 2")
  - fill: transparent
  - Subtle pulsing animation (opacity oscillates 0.1 to 0.2 using trace-pulse keyframe)
- Label text shows the suggested label in zinc-500

When the current step has `highlightLabels`, find those components on the canvas and render a pulsing blue ring around them (similar to the green trace highlight but in blue #3b82f6 to distinguish "where to wire" from "signal tracing").

Implementation:
- Import useExerciseStore
- Read activeExercise, currentStepIndex
- Get current step's ghost and highlightLabels
- Render ghost components and highlight rings in the world-space transform group

- [ ] Step 1: Add ghost rendering to Canvas.tsx
- [ ] Step 2: Add highlight rings for highlightLabels
- [ ] Step 3: Build check

---

## Task 5: Validation Logic

**Files:**
- Modify: `lib/stores/exercise-store.ts` — implement validateCurrentStep fully

### Validation for each action type

**"place"**:
```typescript
const comps = useCircuitStore.getState().circuit.components;
const found = comps.some(c => c.type === step.action.gateType);
```
If label specified, also check that a component with that label exists.

**"wire"**:
```typescript
const { components, wires } = useCircuitStore.getState().circuit;
const fromComp = components.find(c => c.label === step.action.fromLabel);
const toComp = components.find(c => c.label === step.action.toLabel);
if (!fromComp || !toComp) return false;
return wires.some(w =>
  w.from.componentId === fromComp.id && w.from.pinIndex === step.action.fromPin &&
  w.to.componentId === toComp.id && w.to.pinIndex === step.action.toPin
);
```

**"toggle"**:
```typescript
const comp = useCircuitStore.getState().circuit.components.find(
  c => c.label === step.action.label && c.type === "INPUT"
);
return comp?.value === step.action.value;
```

**"verify"**:
Run generateTruthTable on current circuit and compare output columns.

- [ ] Step 1: Implement all validation cases
- [ ] Step 2: Build check + test with an exercise

---

## Verification Checklist

- [ ] Learn tab shows exercise list with cards
- [ ] Clicking an exercise enters guided mode with step sidebar
- [ ] Current step shows instruction + hint button + check button
- [ ] Ghost components appear on canvas at correct positions
- [ ] Highlight rings pulse on components mentioned in highlightLabels
- [ ] "Check Step" validates correctly (accepts right action, rejects wrong)
- [ ] Completed steps show green checkmarks
- [ ] Upcoming steps show lock icons
- [ ] Back arrow exits exercise and returns to browser
- [ ] Build passes: `npx next build`
