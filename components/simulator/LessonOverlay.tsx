"use client";

import { ArrowLeft, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useLessonStore } from "@/lib/stores/lesson-store";

export default function LessonOverlay() {
  const activeLesson = useLessonStore((s) => s.activeLesson);
  const currentStageIndex = useLessonStore((s) => s.currentStageIndex);
  const advanceStage = useLessonStore((s) => s.advanceStage);
  const goBackStage = useLessonStore((s) => s.goBackStage);
  const revealAll = useLessonStore((s) => s.revealAll);
  const exitLesson = useLessonStore((s) => s.exitLesson);

  if (!activeLesson) return null;

  const stage = activeLesson.stages[currentStageIndex];
  const totalStages = activeLesson.stages.length;
  const isFirst = currentStageIndex === 0;
  const isLast = currentStageIndex === totalStages - 1;

  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 w-[420px] max-w-[calc(100%-80px)]">
      <div className="bg-zinc-900/95 backdrop-blur-xl border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-white/5">
          <button
            onClick={exitLesson}
            className="text-zinc-500 hover:text-zinc-200 transition-colors"
            title="Exit lesson"
          >
            <ArrowLeft size={14} />
          </button>
          <span className="text-[11px] font-medium text-zinc-300 flex-1 truncate">
            {activeLesson.title}
          </span>

          {/* Progress dots */}
          <div className="flex items-center gap-0.5">
            {activeLesson.stages.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i < currentStageIndex
                    ? "bg-blue-400"
                    : i === currentStageIndex
                    ? "bg-white"
                    : "bg-zinc-700"
                }`}
              />
            ))}
          </div>

          <span className="text-[10px] text-zinc-500 tabular-nums ml-1">
            {currentStageIndex + 1}/{totalStages}
          </span>
        </div>

        {/* Stage explanation */}
        {stage && (
          <div className="px-3 py-2.5">
            <p className="text-[12px] text-zinc-200 leading-relaxed">
              {stage.explanation}
            </p>

            {/* Controls */}
            <div className="flex items-center gap-2 mt-2.5">
              <button
                onClick={goBackStage}
                disabled={isFirst}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              >
                <ChevronLeft size={12} />
                Previous
              </button>

              {!isLast ? (
                <button
                  onClick={advanceStage}
                  className="flex-1 flex items-center justify-center gap-1 bg-primary/90 hover:bg-green-400 text-primary-foreground py-1.5 rounded-lg text-[11px] font-medium transition-colors"
                >
                  Next
                  <ChevronRight size={12} />
                </button>
              ) : (
                <div className="flex-1 text-center text-[11px] text-blue-400 font-medium py-1.5">
                  Lesson complete
                </div>
              )}

              {!isLast && (
                <button
                  onClick={revealAll}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  title="Show all layers"
                >
                  <Eye size={12} />
                  Show All
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
