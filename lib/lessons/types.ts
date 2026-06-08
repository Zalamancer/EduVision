import type { Circuit } from "@/lib/sim-engine/types";

export interface LessonStage {
  id: string;
  /** Component IDs to reveal at this stage */
  revealComponentIds: string[];
  /** Wire IDs to reveal at this stage */
  revealWireIds: string[];
  /** Explanation shown during this stage */
  explanation: string;
  /** Auto-run trace mode on the revealed portion */
  autoTrace?: boolean;
}

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  /** The full circuit that will be progressively revealed */
  fullCircuit: Circuit;
  stages: LessonStage[];
}
