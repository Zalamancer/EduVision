"use client";

import { ArrowLeft, Lightbulb, Check, ChevronRight } from "lucide-react";
import { useExerciseStore } from "@/lib/stores/exercise-store";

export default function ExerciseOverlay() {
  const activeExercise = useExerciseStore((s) => s.activeExercise);
  const currentStepIndex = useExerciseStore((s) => s.currentStepIndex);
  const completedSteps = useExerciseStore((s) => s.completedSteps);
  const showHint = useExerciseStore((s) => s.showHint);
  const validationError = useExerciseStore((s) => s.validationError);
  const exitExercise = useExerciseStore((s) => s.exitExercise);
  const advanceStep = useExerciseStore((s) => s.advanceStep);
  const toggleHint = useExerciseStore((s) => s.toggleHint);

  if (!activeExercise) return null;

  const step = activeExercise.steps[currentStepIndex];
  const allDone = completedSteps.length > 0 && completedSteps.every(Boolean);
  const totalSteps = activeExercise.steps.length;

  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 w-[420px] max-w-[calc(100%-80px)]">
      <div className="bg-zinc-900/95 backdrop-blur-xl border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-white/5">
          <button
            onClick={exitExercise}
            className="text-zinc-500 hover:text-zinc-200 transition-colors"
            title="Exit exercise"
          >
            <ArrowLeft size={14} />
          </button>
          <span className="text-[11px] font-medium text-zinc-300 flex-1 truncate">
            {activeExercise.title}
          </span>

          {/* Progress dots */}
          <div className="flex items-center gap-0.5">
            {activeExercise.steps.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  completedSteps[i]
                    ? "bg-green-400"
                    : i === currentStepIndex
                    ? "bg-white"
                    : "bg-zinc-700"
                }`}
              />
            ))}
          </div>

          <span className="text-[10px] text-zinc-500 tabular-nums ml-1">
            {currentStepIndex + 1}/{totalSteps}
          </span>
        </div>

        {/* Current step */}
        {step && !allDone && (
          <div className="px-3 py-2.5">
            <p className="text-[12px] text-zinc-200 leading-relaxed">
              {step.instruction}
            </p>

            {/* Hint */}
            {step.hint && (
              <div className="mt-2">
                {!showHint ? (
                  <button
                    onClick={toggleHint}
                    className="text-zinc-500 text-[10px] hover:text-zinc-300 transition-colors flex items-center gap-1"
                  >
                    <Lightbulb size={10} />
                    Show hint
                  </button>
                ) : (
                  <div className="bg-amber-500/8 border border-amber-500/15 rounded-lg px-2.5 py-1.5 text-[10px] text-amber-300/90 leading-relaxed">
                    {step.hint}
                  </div>
                )}
              </div>
            )}

            {/* Error */}
            {validationError && (
              <p className="text-[10px] text-red-400 mt-2">{validationError}</p>
            )}

            {/* Check button */}
            <button
              onClick={advanceStep}
              className="mt-2.5 w-full flex items-center justify-center gap-1.5 bg-primary/90 hover:bg-green-400 text-primary-foreground py-1.5 rounded-lg text-[11px] font-medium transition-colors"
            >
              Check Step
              <ChevronRight size={12} />
            </button>
          </div>
        )}

        {/* Complete state */}
        {allDone && (
          <div className="px-3 py-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-green-400 text-sm font-medium">
              <Check size={16} />
              Exercise complete!
            </div>
            <button
              onClick={exitExercise}
              className="mt-2 text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Back to exercises
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
