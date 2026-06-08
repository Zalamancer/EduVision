import { create } from "zustand";
import type { Lesson } from "@/lib/lessons/types";
import { useCircuitStore } from "./circuit-store";

interface LessonState {
  activeLesson: Lesson | null;
  currentStageIndex: number;
  revealedComponentIds: Set<string>;
  revealedWireIds: Set<string>;

  startLesson: (lesson: Lesson) => void;
  advanceStage: () => void;
  goBackStage: () => void;
  revealAll: () => void;
  exitLesson: () => void;
}

/** Replay stages 0..upTo and collect all revealed IDs */
function collectRevealed(lesson: Lesson, upTo: number) {
  const compIds = new Set<string>();
  const wireIds = new Set<string>();
  for (let i = 0; i <= upTo; i++) {
    const stage = lesson.stages[i];
    stage.revealComponentIds.forEach((id) => compIds.add(id));
    stage.revealWireIds.forEach((id) => wireIds.add(id));
  }
  return { compIds, wireIds };
}

export const useLessonStore = create<LessonState>((set, get) => ({
  activeLesson: null,
  currentStageIndex: 0,
  revealedComponentIds: new Set<string>(),
  revealedWireIds: new Set<string>(),

  startLesson: (lesson) => {
    // Load the full circuit into circuit-store
    const circuitStore = useCircuitStore.getState();
    circuitStore.setCircuit(lesson.fullCircuit);

    // Reveal stage 0
    const { compIds, wireIds } = collectRevealed(lesson, 0);
    set({
      activeLesson: lesson,
      currentStageIndex: 0,
      revealedComponentIds: compIds,
      revealedWireIds: wireIds,
    });
  },

  advanceStage: () => {
    const { activeLesson, currentStageIndex } = get();
    if (!activeLesson) return;
    const nextIndex = currentStageIndex + 1;
    if (nextIndex >= activeLesson.stages.length) return;

    const { compIds, wireIds } = collectRevealed(activeLesson, nextIndex);
    set({
      currentStageIndex: nextIndex,
      revealedComponentIds: compIds,
      revealedWireIds: wireIds,
    });
  },

  goBackStage: () => {
    const { activeLesson, currentStageIndex } = get();
    if (!activeLesson || currentStageIndex <= 0) return;

    const prevIndex = currentStageIndex - 1;
    const { compIds, wireIds } = collectRevealed(activeLesson, prevIndex);
    set({
      currentStageIndex: prevIndex,
      revealedComponentIds: compIds,
      revealedWireIds: wireIds,
    });
  },

  revealAll: () => {
    const { activeLesson } = get();
    if (!activeLesson) return;

    const lastIndex = activeLesson.stages.length - 1;
    const { compIds, wireIds } = collectRevealed(activeLesson, lastIndex);
    set({
      currentStageIndex: lastIndex,
      revealedComponentIds: compIds,
      revealedWireIds: wireIds,
    });
  },

  exitLesson: () => {
    set({
      activeLesson: null,
      currentStageIndex: 0,
      revealedComponentIds: new Set<string>(),
      revealedWireIds: new Set<string>(),
    });
  },
}));
