"use client";

import { useTeachingStore } from "@/lib/stores/teaching-store";

const SPEEDS = [
  { ms: 2000, label: "Slow" },
  { ms: 1000, label: "Med" },
  { ms: 500, label: "Fast" },
];

export default function StepControls() {
  const {
    mode,
    currentStep,
    trace,
    stepForward,
    stepBackward,
    jumpToEnd,
    reset,
    startPlaying,
    stopPlaying,
    playSpeed,
    setPlaySpeed,
  } = useTeachingStore();

  if (mode === "off") return null;

  const totalSteps = trace?.totalSteps ?? 0;
  const isPlaying = mode === "playing";
  const atEnd = currentStep >= totalSteps - 1;
  const atStart = currentStep <= -1;

  const btn =
    "flex items-center justify-center w-7 h-7 rounded-lg transition-all";

  return (
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 px-3 py-2 bg-zinc-900/90 backdrop-blur-xl border border-white/[0.06] rounded-xl shadow-lg">
      {/* Reset */}
      <button
        title="Reset"
        className={`${btn} ${atStart ? "text-zinc-700" : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80"}`}
        onClick={reset}
        disabled={atStart}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <rect x="1" y="3" width="3" height="10" rx="0.5" />
          <path d="M6 8l7-5v10L6 8z" />
        </svg>
      </button>

      {/* Back */}
      <button
        title="Step Back"
        className={`${btn} ${atStart ? "text-zinc-700" : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80"}`}
        onClick={stepBackward}
        disabled={atStart}
      >
        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
          <path d="M12 2L4 8l8 6V2z" />
        </svg>
      </button>

      {/* Step counter */}
      <span className="text-zinc-400 text-xs font-mono px-2 min-w-[90px] text-center select-none">
        {currentStep === -1 ? "Ready" : `Step ${currentStep + 1} of ${totalSteps}`}
      </span>

      {/* Forward */}
      <button
        title="Step Forward"
        className={`${btn} ${atEnd ? "text-zinc-700" : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80"}`}
        onClick={stepForward}
        disabled={atEnd}
      >
        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
          <path d="M4 2l8 6-8 6V2z" />
        </svg>
      </button>

      {/* Jump to End */}
      <button
        title="Jump to End"
        className={`${btn} ${atEnd ? "text-zinc-700" : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80"}`}
        onClick={jumpToEnd}
        disabled={atEnd}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <path d="M3 3l7 5-7 5V3z" />
          <rect x="12" y="3" width="3" height="10" rx="0.5" />
        </svg>
      </button>

      {/* Divider */}
      <div className="w-px h-5 mx-1 bg-white/[0.06]" />

      {/* Play / Pause */}
      <button
        title={isPlaying ? "Pause" : "Play"}
        className={`${btn} ${isPlaying ? "text-zinc-100 bg-zinc-700" : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80"}`}
        onClick={isPlaying ? stopPlaying : startPlaying}
      >
        {isPlaying ? (
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
            <rect x="3" y="2" width="4" height="12" rx="0.5" />
            <rect x="9" y="2" width="4" height="12" rx="0.5" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4 2l10 6-10 6V2z" />
          </svg>
        )}
      </button>

      {/* Speed dots */}
      <div className="flex items-center gap-1 ml-0.5">
        {SPEEDS.map(({ ms, label }) => (
          <button
            key={ms}
            title={label}
            className={`w-2 h-2 rounded-full transition-all ${
              playSpeed === ms
                ? "bg-zinc-100"
                : "bg-zinc-600 hover:bg-zinc-400"
            }`}
            onClick={() => setPlaySpeed(ms)}
          />
        ))}
      </div>
    </div>
  );
}
