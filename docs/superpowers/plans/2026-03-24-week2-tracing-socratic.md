# Week 2: Signal Tracing + Step-Through Mode + Socratic AI Tutor

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development to implement this plan.

**Goal:** Students can step through signal propagation one gate-level at a time with visual highlighting, and the AI tutor asks Socratic questions instead of giving answers.

**Architecture:** A new `level-propagator.ts` does topological sort into depth levels. A `teaching-store.ts` manages trace state. `StepControls.tsx` is a floating HUD. Canvas reads from teaching store when trace mode is active. AI tutor routes get a Socratic system prompt.

**Tech Stack:** React 19, Next.js 16, TypeScript, Zustand, SVG animations

---

## Task 1: Level-by-Level Propagator

**Files:**
- Create: `lib/sim-engine/level-propagator.ts`
- Modify: `lib/sim-engine/types.ts` — add PropagationLevel, PropagationTrace types
- Modify: `lib/sim-engine/index.ts` — re-export

### What it does

Topologically sorts the circuit DAG by depth from INPUTs. Returns an ordered array of levels, each containing the component IDs evaluated at that depth, the wire IDs feeding into them, and the cumulative SignalState after that level resolves.

### Types to add in types.ts

```typescript
export interface PropagationLevel {
  depth: number;
  evaluatedIds: string[];
  activeWireIds: string[];
  signalState: SignalState;
}

export interface PropagationTrace {
  levels: PropagationLevel[];
  totalSteps: number;
}
```

### Algorithm for level-propagator.ts

```typescript
import { Circuit, SignalState, PropagationLevel, PropagationTrace } from "./types";
import { evaluateGate, INPUT_COUNTS } from "./gates";

export function propagateByLevel(circuit: Circuit): PropagationTrace {
  const state: SignalState = {};
  const compMap = new Map(circuit.components.map(c => [c.id, c]));

  // Build wire lookup: for each component input pin, which wire feeds it
  const wireMap: Record<string, Record<number, { fromId: string; fromPin: number; wireId: string }>> = {};
  for (const comp of circuit.components) wireMap[comp.id] = {};
  for (const wire of circuit.wires) {
    wireMap[wire.to.componentId][wire.to.pinIndex] = {
      fromId: wire.from.componentId,
      fromPin: wire.from.pinIndex,
      wireId: wire.id,
    };
  }

  // Build adjacency: which components does each component feed into
  const dependsOn: Record<string, Set<string>> = {};
  for (const comp of circuit.components) dependsOn[comp.id] = new Set();
  for (const wire of circuit.wires) {
    dependsOn[wire.to.componentId].add(wire.from.componentId);
  }

  // Compute depth via BFS from INPUTs
  const depth: Record<string, number> = {};
  const queue: string[] = [];

  for (const comp of circuit.components) {
    if (comp.type === "INPUT") {
      depth[comp.id] = 0;
      state[comp.id] = [comp.value ?? false];
      queue.push(comp.id);
    }
  }

  // BFS to assign depths
  while (queue.length > 0) {
    const id = queue.shift()!;
    const d = depth[id];
    // Find all components this one feeds into
    for (const wire of circuit.wires) {
      if (wire.from.componentId === id) {
        const targetId = wire.to.componentId;
        const newDepth = d + 1;
        if (!(targetId in depth) || depth[targetId] < newDepth) {
          depth[targetId] = newDepth;
          queue.push(targetId);
        }
      }
    }
  }

  // Group by depth (skip depth 0 which is INPUTs)
  const maxDepth = Math.max(0, ...Object.values(depth));
  const levels: PropagationLevel[] = [];

  // Level 0: INPUTs (already seeded)
  const inputIds = circuit.components.filter(c => c.type === "INPUT").map(c => c.id);
  levels.push({
    depth: 0,
    evaluatedIds: inputIds,
    activeWireIds: [],
    signalState: { ...state },
  });

  // Levels 1..maxDepth
  for (let d = 1; d <= maxDepth; d++) {
    const idsAtLevel = circuit.components
      .filter(c => depth[c.id] === d && c.type !== "INPUT")
      .map(c => c.id);

    if (idsAtLevel.length === 0) continue;

    const activeWireIds: string[] = [];

    for (const compId of idsAtLevel) {
      const comp = compMap.get(compId)!;
      if (comp.type === "OUTPUT") continue;

      const inputCount = INPUT_COUNTS[comp.type];
      const inputs: boolean[] = [];

      for (let i = 0; i < inputCount; i++) {
        const feed = wireMap[compId][i];
        if (feed) {
          activeWireIds.push(feed.wireId);
          const srcState = state[feed.fromId];
          inputs.push(srcState?.[feed.fromPin] ?? false);
        } else {
          inputs.push(false);
        }
      }

      state[compId] = evaluateGate(comp.type, inputs);
    }

    levels.push({
      depth: d,
      evaluatedIds: idsAtLevel,
      activeWireIds,
      signalState: { ...state },
    });
  }

  return { levels, totalSteps: levels.length };
}
```

- [ ] Step 1: Add types to types.ts
- [ ] Step 2: Create level-propagator.ts with the algorithm above
- [ ] Step 3: Add export to index.ts
- [ ] Step 4: Build check

---

## Task 2: Teaching Store

**Files:**
- Create: `lib/stores/teaching-store.ts`

### What it does

Zustand store that manages trace mode state. When `mode !== 'off'`, the Canvas renders using the teaching store's partial signal state instead of the live circuit store signal state.

```typescript
import { create } from "zustand";
import { Circuit, SignalState, PropagationTrace } from "@/lib/sim-engine/types";
import { propagateByLevel } from "@/lib/sim-engine/level-propagator";

interface TeachingState {
  mode: "off" | "stepping" | "playing";
  trace: PropagationTrace | null;
  currentStep: number; // -1 = not started, 0 = inputs, 1..N = gate levels
  highlightedComponentIds: string[];
  highlightedWireIds: string[];
  visibleSignalState: SignalState;
  playSpeed: number; // ms per step

  enterStepMode: (circuit: Circuit) => void;
  exitTeachingMode: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  jumpToEnd: () => void;
  reset: () => void;
  startPlaying: () => void;
  stopPlaying: () => void;
  setPlaySpeed: (ms: number) => void;

  _playTimer: ReturnType<typeof setInterval> | null;
}
```

Key behaviors:
- `enterStepMode(circuit)` calls `propagateByLevel(circuit)`, stores the trace, sets currentStep to -1 (nothing shown yet), mode to "stepping"
- `stepForward()` increments currentStep, updates visibleSignalState from trace.levels[currentStep].signalState, sets highlightedComponentIds/wireIds from that level
- `stepBackward()` decrements, rebuilds state from previous level
- `startPlaying()` sets mode to "playing", starts interval that calls stepForward at playSpeed
- `exitTeachingMode()` clears everything, stops timer

- [ ] Step 1: Create teaching-store.ts
- [ ] Step 2: Build check

---

## Task 3: Step Controls HUD

**Files:**
- Create: `components/simulator/StepControls.tsx`

### What it does

A floating control bar at the bottom-center of the canvas (similar to the Toolbar float style). Shows when teaching mode is active.

Layout: `[Reset] [Back] Step 2 of 5 [Forward] [End] | [Play/Pause] [Speed: slow/med/fast]`

Style: Same as Toolbar — `absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 p-1.5 bg-zinc-900/90 backdrop-blur-xl border border-white/[0.06] rounded-xl shadow-lg`

Reads from and dispatches actions to teaching-store.

- [ ] Step 1: Create StepControls.tsx
- [ ] Step 2: Build check

---

## Task 4: Canvas Integration — Trace Mode Rendering

**Files:**
- Modify: `components/simulator/Canvas.tsx`
- Modify: `components/simulator/GateBase.tsx`
- Modify: `components/simulator/WireRenderer.tsx`
- Modify: `app/simulator/page.tsx`

### What changes

**Canvas.tsx:**
- Import useTeachingStore
- When `mode !== 'off'`, use `visibleSignalState` instead of `signalState` from circuit store
- Render StepControls component when mode !== 'off'
- Make circuit read-only when in trace mode (disable placing, wiring, deleting)

**GateBase.tsx:**
- Accept optional `highlighted?: boolean` prop
- When highlighted, render a green glow ring (pulsing animation) around the gate, different from the dashed selection ring
- Use CSS animation: `@keyframes trace-pulse { 0%,100% { opacity: 0.3 } 50% { opacity: 0.8 } }`
- When NOT highlighted AND trace mode is active, dim the gate to opacity 0.4

**WireRenderer.tsx:**
- Accept optional `highlightedWireIds?: string[]` prop
- Highlighted wires get thicker stroke (3px) and a brighter green
- Non-highlighted wires when trace mode is active get dimmed to opacity 0.3

**simulator/page.tsx:**
- Add a "Trace" button to the Toolbar (or a separate toggle)
- Wire up entering/exiting trace mode

### Toolbar change
Add a "step" icon button to Toolbar.tsx that calls `useTeachingStore.getState().enterStepMode(circuit)` when clicked, and `exitTeachingMode()` when clicked again while active.

- [ ] Step 1: Modify Canvas.tsx — conditional signal state source + read-only in trace mode
- [ ] Step 2: Modify GateBase.tsx — highlighted prop with glow animation
- [ ] Step 3: Modify WireRenderer.tsx — highlighted wire IDs with dimming
- [ ] Step 4: Add Trace toggle to Toolbar and StepControls to simulator page
- [ ] Step 5: Add trace-pulse CSS animation to globals.css
- [ ] Step 6: Build check + visual verification

---

## Task 5: Socratic AI Tutor Mode

**Files:**
- Modify: `app/api/ai/tutor/route.ts`
- Modify: `app/api/ai/explain-circuit/route.ts`

### What changes

Instead of giving answers directly, the AI asks guiding questions.

**tutor/route.ts system prompt change:**
```
You are a Socratic tutor for digital logic circuits. NEVER give the answer directly.
Instead:
1. Ask the student what they think the answer might be
2. If they're wrong, ask them to check a specific part of the circuit
3. Give hints that lead them to discover the answer themselves
4. Only after 3+ exchanges where the student is still stuck, provide a direct explanation

Example:
Student: "Why isn't my circuit working?"
BAD: "You need to connect wire X to pin Y"
GOOD: "Let's trace the signals together. What value do you see at the output of your AND gate? Is that what you expected?"
```

**explain-circuit/route.ts system prompt change:**
```
You are explaining a circuit's behavior. Instead of stating what the circuit does:
1. Ask the student to identify the gate types they see
2. Ask what they think each gate outputs for the current inputs
3. Guide them through tracing the signal path step by step
4. Confirm their understanding at each step before moving to the next
```

- [ ] Step 1: Update tutor route system prompt
- [ ] Step 2: Update explain-circuit route system prompt
- [ ] Step 3: Build check

---

## Verification Checklist

- [ ] `propagateByLevel()` returns correct levels for a half-adder circuit (3 levels: inputs, XOR+AND, outputs)
- [ ] Teaching store enters/exits trace mode correctly
- [ ] StepControls appear when trace mode is active, disappear when not
- [ ] Stepping forward shows gates lighting up level by level
- [ ] Gates dim when not yet evaluated in trace mode
- [ ] Wires highlight when their level is active
- [ ] Wire value labels show during trace mode
- [ ] Play mode auto-advances through levels
- [ ] AI tutor asks questions instead of giving direct answers
- [ ] Build passes: `npx next build` succeeds
