import { create } from "zustand";
import type { Exercise, ExerciseStep } from "@/lib/exercises/types";
import { useCircuitStore } from "./circuit-store";
import { useProgressStore } from "./progress-store";
import { generateTruthTable } from "@/lib/sim-engine/truth-table";

interface ExerciseState {
  activeExercise: Exercise | null;
  currentStepIndex: number;
  completedSteps: boolean[];
  showHint: boolean;
  validationError: string | null;
  /** Snapshot of component counts when exercise started, for tracking new placements */
  _baselineCounts: Record<string, number>;

  startExercise: (exercise: Exercise) => void;
  exitExercise: () => void;
  validateCurrentStep: () => boolean;
  advanceStep: () => void;
  goBackStep: () => void;
  toggleHint: () => void;
  setValidationError: (msg: string | null) => void;
}

/** Count components by type */
function countByType(components: { type: string }[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const c of components) {
    counts[c.type] = (counts[c.type] || 0) + 1;
  }
  return counts;
}

/** Get how many of each type were expected to be placed by step index */
function expectedPlacementsByStep(steps: ExerciseStep[], upToIndex: number): Record<string, number> {
  const counts: Record<string, number> = {};
  for (let i = 0; i <= upToIndex; i++) {
    const action = steps[i].action;
    if (action.type === "place") {
      counts[action.gateType] = (counts[action.gateType] || 0) + 1;
    }
  }
  return counts;
}

function validateStep(step: ExerciseStep, stepIndex: number, exercise: Exercise, baselineCounts: Record<string, number>): { valid: boolean; error?: string } {
  const { action } = step;
  const { components, wires } = useCircuitStore.getState().circuit;
  const currentCounts = countByType(components);

  switch (action.type) {
    case "place": {
      // Check that enough components of this type exist (baseline + expected placements up to this step)
      const expectedPlacements = expectedPlacementsByStep(exercise.steps, stepIndex);
      const gateType = action.gateType;
      const baseline = baselineCounts[gateType] || 0;
      const needed = baseline + (expectedPlacements[gateType] || 0);
      const actual = currentCounts[gateType] || 0;

      if (actual < needed) {
        return { valid: false, error: `Place a ${gateType} component on the canvas.` };
      }
      return { valid: true };
    }

    case "wire": {
      // Find components by TYPE, not label. Check if any component of the from-type
      // is connected to any component of the to-type at the specified pins.
      // Determine the gate types from the labels (e.g., "A" → INPUT, "AND" → AND)
      const fromType = inferGateType(action.fromLabel, components);
      const toType = inferGateType(action.toLabel, components);

      if (!fromType || !toType) {
        // Fallback: check if ANY wire exists with the right pin indices between matching types
        const hasAnyWire = wires.length > 0;
        if (!hasAnyWire) {
          return { valid: false, error: "Connect the components with a wire." };
        }
        return { valid: true };
      }

      const fromComps = components.filter(c => c.type === fromType);
      const toComps = components.filter(c => c.type === toType);

      const hasWire = wires.some(w => {
        const fromMatch = fromComps.some(c => c.id === w.from.componentId) && w.from.pinIndex === action.fromPin;
        const toMatch = toComps.some(c => c.id === w.to.componentId) && w.to.pinIndex === action.toPin;
        return fromMatch && toMatch;
      });

      if (!hasWire) {
        return { valid: false, error: `Wire a ${fromType} output to a ${toType} input.` };
      }
      return { valid: true };
    }

    case "toggle": {
      // Check if ANY input is set to the expected value
      const inputs = components.filter(c => c.type === "INPUT");
      const hasCorrectValue = inputs.some(c => c.value === action.value);
      if (!hasCorrectValue) {
        return { valid: false, error: `Toggle an input to ${action.value ? "1 (HIGH)" : "0 (LOW)"}.` };
      }
      return { valid: true };
    }

    case "verify": {
      const circuit = useCircuitStore.getState().circuit;
      const inputs = circuit.components.filter(c => c.type === "INPUT");
      const outputs = circuit.components.filter(c => c.type === "OUTPUT");
      if (inputs.length === 0 || outputs.length === 0) {
        return { valid: false, error: "Add at least one INPUT and one OUTPUT to verify." };
      }
      const table = generateTruthTable(circuit);
      if (table.rows.length === 0) {
        return { valid: false, error: "Circuit is not complete — check all connections." };
      }
      return { valid: true };
    }

    default:
      return { valid: false, error: "Unknown step type." };
  }
}

/** Infer gate type from exercise label hints like "A" → INPUT, "AND" → AND, "XOR1" → XOR */
function inferGateType(label: string, components: { type: string; label: string }[]): string | null {
  // Direct match by label
  const exact = components.find(c => c.label === label);
  if (exact) return exact.type;

  // Match by type name prefix (e.g., "AND" matches AND type, "NAND1" matches NAND)
  const upperLabel = label.toUpperCase();
  const typeNames = ["NAND", "NOR", "XNOR", "XOR", "AND", "OR", "NOT", "MUX_2TO1", "FULL_ADDER", "DECODER_2TO4", "INPUT", "OUTPUT"];
  for (const typeName of typeNames) {
    if (upperLabel.startsWith(typeName) || upperLabel === typeName) {
      return typeName;
    }
  }

  // Single letter labels like "A", "B" are likely INPUTs; "Y" is likely OUTPUT
  if (label.length === 1 && label >= "A" && label <= "D") return "INPUT";
  if (label === "Y" || label === "Sum" || label === "Carry" || label === "Cout" || label === "Diff" || label === "Borrow") return "OUTPUT";

  return null;
}

export const useExerciseStore = create<ExerciseState>((set, get) => ({
  activeExercise: null,
  currentStepIndex: 0,
  completedSteps: [],
  showHint: false,
  validationError: null,
  _baselineCounts: {},

  startExercise: (exercise) => {
    const circuitStore = useCircuitStore.getState();
    circuitStore.clearCircuit();

    if (exercise.starterCircuit) {
      circuitStore.setCircuit(exercise.starterCircuit);
    }

    const baseline = countByType(useCircuitStore.getState().circuit.components);

    set({
      activeExercise: exercise,
      currentStepIndex: 0,
      completedSteps: new Array(exercise.steps.length).fill(false),
      showHint: false,
      validationError: null,
      _baselineCounts: baseline,
    });
  },

  exitExercise: () => {
    set({
      activeExercise: null,
      currentStepIndex: 0,
      completedSteps: [],
      showHint: false,
      validationError: null,
      _baselineCounts: {},
    });
  },

  validateCurrentStep: () => {
    const { activeExercise, currentStepIndex, _baselineCounts } = get();
    if (!activeExercise) return false;

    const step = activeExercise.steps[currentStepIndex];
    if (!step) return false;

    const result = validateStep(step, currentStepIndex, activeExercise, _baselineCounts);

    if (!result.valid) {
      set({ validationError: result.error || "Step not complete." });
    } else {
      set({ validationError: null });
    }

    return result.valid;
  },

  advanceStep: () => {
    const { activeExercise, currentStepIndex, completedSteps } = get();
    if (!activeExercise) return;

    const isValid = get().validateCurrentStep();
    if (!isValid) return;

    const nextCompleted = [...completedSteps];
    nextCompleted[currentStepIndex] = true;

    const nextIndex = currentStepIndex + 1;
    const atEnd = nextIndex >= activeExercise.steps.length;

    // Mark exercise complete when all steps are done
    if (atEnd && nextCompleted.every(Boolean)) {
      useProgressStore.getState().markComplete("exercise", activeExercise.slug);
    }

    set({
      completedSteps: nextCompleted,
      currentStepIndex: atEnd ? currentStepIndex : nextIndex,
      showHint: false,
      validationError: null,
    });
  },

  goBackStep: () => {
    const { currentStepIndex } = get();
    if (currentStepIndex <= 0) return;

    set({
      currentStepIndex: currentStepIndex - 1,
      showHint: false,
      validationError: null,
    });
  },

  toggleHint: () => {
    set((s) => ({ showHint: !s.showHint }));
  },

  setValidationError: (msg) => {
    set({ validationError: msg });
  },
}));
