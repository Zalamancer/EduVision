import type { GateType, Circuit } from "@/lib/sim-engine/types";

export interface ExerciseStep {
  id: string;
  instruction: string;
  hint?: string;
  action:
    | { type: "place"; gateType: GateType; label?: string }
    | {
        type: "wire";
        fromLabel: string;
        fromPin: number;
        toLabel: string;
        toPin: number;
      }
    | { type: "toggle"; label: string; value: boolean }
    | { type: "verify" };
  highlightLabels?: string[];
  ghost?: { type: GateType; x: number; y: number; label?: string };
}

export interface Exercise {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;
  starterCircuit?: Circuit;
  steps: ExerciseStep[];
}
