import { create } from "zustand";
import { Circuit, SignalState, PropagationTrace } from "@/lib/sim-engine/types";
import { propagateLevels } from "@/lib/sim-engine/level-propagator";

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

export const useTeachingStore = create<TeachingState>((set, get) => ({
  mode: "off",
  trace: null,
  currentStep: -1,
  highlightedComponentIds: [],
  highlightedWireIds: [],
  visibleSignalState: {},
  playSpeed: 1000,
  _playTimer: null,

  enterStepMode: (circuit) => {
    const trace = propagateLevels(circuit);
    set({
      mode: "stepping",
      trace,
      currentStep: -1,
      highlightedComponentIds: [],
      highlightedWireIds: [],
      visibleSignalState: {},
    });
  },

  exitTeachingMode: () => {
    const timer = get()._playTimer;
    if (timer) clearInterval(timer);
    set({
      mode: "off",
      trace: null,
      currentStep: -1,
      highlightedComponentIds: [],
      highlightedWireIds: [],
      visibleSignalState: {},
      _playTimer: null,
    });
  },

  stepForward: () => {
    const { trace, currentStep } = get();
    if (!trace) return;
    const next = currentStep + 1;
    if (next >= trace.totalSteps) return;

    const level = trace.levels[next];
    set({
      currentStep: next,
      highlightedComponentIds: level.evaluatedIds,
      highlightedWireIds: level.activeWireIds,
      visibleSignalState: level.signalState,
    });
  },

  stepBackward: () => {
    const { trace, currentStep } = get();
    if (!trace || currentStep <= -1) return;

    const prev = currentStep - 1;
    if (prev < 0) {
      set({
        currentStep: -1,
        highlightedComponentIds: [],
        highlightedWireIds: [],
        visibleSignalState: {},
      });
    } else {
      const level = trace.levels[prev];
      set({
        currentStep: prev,
        highlightedComponentIds: level.evaluatedIds,
        highlightedWireIds: level.activeWireIds,
        visibleSignalState: level.signalState,
      });
    }
  },

  jumpToEnd: () => {
    const { trace } = get();
    if (!trace || trace.totalSteps === 0) return;

    const last = trace.totalSteps - 1;
    const level = trace.levels[last];
    set({
      currentStep: last,
      highlightedComponentIds: level.evaluatedIds,
      highlightedWireIds: level.activeWireIds,
      visibleSignalState: level.signalState,
    });
  },

  reset: () => {
    const timer = get()._playTimer;
    if (timer) clearInterval(timer);
    set({
      mode: "stepping",
      currentStep: -1,
      highlightedComponentIds: [],
      highlightedWireIds: [],
      visibleSignalState: {},
      _playTimer: null,
    });
  },

  startPlaying: () => {
    const { playSpeed } = get();
    const timer = setInterval(() => {
      const { currentStep, trace } = get();
      if (!trace || currentStep >= trace.totalSteps - 1) {
        get().stopPlaying();
        return;
      }
      get().stepForward();
    }, playSpeed);

    set({ mode: "playing", _playTimer: timer });
  },

  stopPlaying: () => {
    const timer = get()._playTimer;
    if (timer) clearInterval(timer);
    set({ mode: "stepping", _playTimer: null });
  },

  setPlaySpeed: (ms) => {
    set({ playSpeed: ms });
    // If currently playing, restart the timer with the new speed
    const { mode } = get();
    if (mode === "playing") {
      get().stopPlaying();
      get().startPlaying();
    }
  },
}));
