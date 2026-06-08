"use client";

import { ArrowLeft, Check, Lock, Lightbulb, BookOpen } from "lucide-react";
import { useExerciseStore } from "@/lib/stores/exercise-store";
import { useLessonStore } from "@/lib/stores/lesson-store";
import { EXERCISES } from "@/lib/exercises";
import { LESSONS } from "@/lib/lessons";
import type { Exercise } from "@/lib/exercises";
import type { Lesson } from "@/lib/lessons";

/* ── Difficulty badge colors ── */
const DIFFICULTY_COLOR: Record<Exercise["difficulty"], string> = {
  beginner: "text-green-400",
  intermediate: "text-amber-400",
  advanced: "text-red-400",
};

/* ── Category badge color ── */
const CATEGORY_COLOR: Record<string, string> = {
  arithmetic: "text-blue-400",
  selection: "text-purple-400",
};

/* ── Exercise Browser (no active exercise) ── */
function ExerciseBrowser({
  onStart,
  onStartLesson,
}: {
  onStart: (ex: Exercise) => void;
  onStartLesson: (lesson: Lesson) => void;
}) {
  return (
    <div className="flex flex-col gap-2 p-2">
      {/* ── Lessons section ── */}
      <p className="text-[10px] px-1 py-1 uppercase tracking-widest font-semibold text-zinc-500">
        Lessons
      </p>

      {LESSONS.map((lesson) => (
        <button
          key={lesson.id}
          className="bg-zinc-800/60 border border-zinc-800/50 rounded-lg p-3 hover:border-zinc-700 cursor-pointer transition-all text-left"
          onClick={() => onStartLesson(lesson)}
        >
          <div className="flex items-center gap-1.5">
            <BookOpen size={13} className="text-blue-400 shrink-0" />
            <p className="text-sm font-medium text-zinc-100">{lesson.title}</p>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`bg-zinc-800 rounded text-[10px] px-1.5 py-0.5 font-medium ${CATEGORY_COLOR[lesson.category] ?? "text-zinc-400"}`}
            >
              {lesson.category}
            </span>
            <span className="text-[10px] text-zinc-500">
              {lesson.stages.length} stages
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1.5 line-clamp-2">
            {lesson.description}
          </p>
        </button>
      ))}

      {/* ── Exercises section ── */}
      <p className="text-[10px] px-1 py-1 mt-2 uppercase tracking-widest font-semibold text-zinc-500">
        Guided Exercises
      </p>

      {EXERCISES.map((ex) => (
        <button
          key={ex.id}
          className="bg-zinc-800/60 border border-zinc-800/50 rounded-lg p-3 hover:border-zinc-700 cursor-pointer transition-all text-left"
          onClick={() => onStart(ex)}
        >
          <p className="text-sm font-medium text-zinc-100">{ex.title}</p>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`bg-zinc-800 rounded text-[10px] px-1.5 py-0.5 font-medium ${DIFFICULTY_COLOR[ex.difficulty]}`}
            >
              {ex.difficulty}
            </span>
            <span className="text-[10px] text-zinc-500">
              {ex.steps.length} steps
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1.5 line-clamp-2">
            {ex.description}
          </p>
        </button>
      ))}
    </div>
  );
}

/* ── Active Exercise (step-by-step sidebar) ── */
function ActiveExercise() {
  const activeExercise = useExerciseStore((s) => s.activeExercise)!;
  const currentStepIndex = useExerciseStore((s) => s.currentStepIndex);
  const completedSteps = useExerciseStore((s) => s.completedSteps);
  const showHint = useExerciseStore((s) => s.showHint);
  const validationError = useExerciseStore((s) => s.validationError);
  const exitExercise = useExerciseStore((s) => s.exitExercise);
  const advanceStep = useExerciseStore((s) => s.advanceStep);
  const toggleHint = useExerciseStore((s) => s.toggleHint);

  const allDone =
    completedSteps.length > 0 && completedSteps.every(Boolean);

  return (
    <div className="flex flex-col h-full">
      {/* ── Header ── */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/5">
        <button
          onClick={exitExercise}
          className="text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft size={16} />
        </button>
        <p className="text-sm font-medium text-zinc-100 flex-1 truncate">
          {activeExercise.title}
        </p>
        <span className="bg-zinc-800 rounded text-[10px] px-1.5 py-0.5 font-medium text-zinc-300 tabular-nums">
          {currentStepIndex + 1}/{activeExercise.steps.length}
        </span>
      </div>

      {/* ── Step list ── */}
      <div className="flex-1 overflow-y-auto px-2 py-2 flex flex-col gap-1.5">
        {activeExercise.steps.map((step, idx) => {
          const isCompleted = idx < currentStepIndex || completedSteps[idx];
          const isCurrent = idx === currentStepIndex;
          const isUpcoming = idx > currentStepIndex;

          /* ── Completed step ── */
          if (isCompleted && !isCurrent) {
            return (
              <div
                key={step.id}
                className="flex items-center gap-2 px-2 py-1.5 rounded"
              >
                <Check size={14} className="text-green-400 shrink-0" />
                <span className="text-xs text-zinc-500 truncate">
                  {step.instruction}
                </span>
              </div>
            );
          }

          /* ── Current step ── */
          if (isCurrent) {
            return (
              <div
                key={step.id}
                className="bg-zinc-800/60 border border-zinc-800/50 rounded-lg overflow-hidden"
                style={{ borderLeft: "4px solid #22c55e" }}
              >
                <div className="p-3">
                  <p className="text-xs text-zinc-200 leading-relaxed">
                    {step.instruction}
                  </p>

                  {/* Hint toggle */}
                  {step.hint && (
                    <div className="mt-2">
                      <button
                        onClick={toggleHint}
                        className="text-zinc-400 text-xs hover:text-zinc-200 transition-colors flex items-center gap-1"
                      >
                        <Lightbulb size={12} />
                        {showHint ? "Hide Hint" : "Show Hint"}
                      </button>
                      {showHint && (
                        <div className="mt-1.5 bg-amber-400/10 rounded-lg p-2 text-xs text-amber-300 leading-relaxed">
                          {step.hint}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Check Step button */}
                  {!allDone && (
                    <button
                      onClick={advanceStep}
                      className="bg-primary text-primary-foreground hover:bg-green-400 w-full py-2 rounded-lg font-medium text-sm mt-3 transition-colors"
                    >
                      Check Step
                    </button>
                  )}

                  {allDone && (
                    <div className="mt-3 text-center text-xs text-green-400 font-medium py-2">
                      Exercise complete!
                    </div>
                  )}

                  {/* Validation error */}
                  {validationError && (
                    <p className="text-xs text-red-400 mt-2">
                      {validationError}
                    </p>
                  )}
                </div>
              </div>
            );
          }

          /* ── Upcoming step ── */
          if (isUpcoming) {
            return (
              <div
                key={step.id}
                className="flex items-center gap-2 px-2 py-1.5 rounded pointer-events-none"
              >
                <Lock size={14} className="text-zinc-600 shrink-0" />
                <span className="text-xs text-zinc-600 truncate">
                  {step.instruction}
                </span>
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}

/* ── Main panel: switches between browser and active state ── */
export default function ExercisePanel() {
  const activeExercise = useExerciseStore((s) => s.activeExercise);
  const startExercise = useExerciseStore((s) => s.startExercise);
  const activeLesson = useLessonStore((s) => s.activeLesson);
  const startLesson = useLessonStore((s) => s.startLesson);

  if (activeExercise) {
    return <ActiveExercise />;
  }

  if (activeLesson) {
    return <ActiveLessonSidebar />;
  }

  return <ExerciseBrowser onStart={startExercise} onStartLesson={startLesson} />;
}

/* ── Active Lesson sidebar view ── */
function ActiveLessonSidebar() {
  const activeLesson = useLessonStore((s) => s.activeLesson)!;
  const currentStageIndex = useLessonStore((s) => s.currentStageIndex);
  const exitLesson = useLessonStore((s) => s.exitLesson);

  return (
    <div className="flex flex-col h-full">
      {/* ── Header ── */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/5">
        <button
          onClick={exitLesson}
          className="text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft size={16} />
        </button>
        <p className="text-sm font-medium text-zinc-100 flex-1 truncate">
          {activeLesson.title}
        </p>
        <span className="bg-zinc-800 rounded text-[10px] px-1.5 py-0.5 font-medium text-zinc-300 tabular-nums">
          {currentStageIndex + 1}/{activeLesson.stages.length}
        </span>
      </div>

      {/* ── Stage list ── */}
      <div className="flex-1 overflow-y-auto px-2 py-2 flex flex-col gap-1.5">
        {activeLesson.stages.map((stage, idx) => {
          const isPast = idx < currentStageIndex;
          const isCurrent = idx === currentStageIndex;
          const isUpcoming = idx > currentStageIndex;

          if (isPast) {
            return (
              <div
                key={stage.id}
                className="flex items-center gap-2 px-2 py-1.5 rounded"
              >
                <Check size={14} className="text-blue-400 shrink-0" />
                <span className="text-xs text-zinc-500 truncate">
                  {stage.explanation}
                </span>
              </div>
            );
          }

          if (isCurrent) {
            return (
              <div
                key={stage.id}
                className="bg-zinc-800/60 border border-zinc-800/50 rounded-lg overflow-hidden"
                style={{ borderLeft: "4px solid #3b82f6" }}
              >
                <div className="p-3">
                  <p className="text-xs text-zinc-200 leading-relaxed">
                    {stage.explanation}
                  </p>
                </div>
              </div>
            );
          }

          if (isUpcoming) {
            return (
              <div
                key={stage.id}
                className="flex items-center gap-2 px-2 py-1.5 rounded pointer-events-none"
              >
                <Lock size={14} className="text-zinc-600 shrink-0" />
                <span className="text-xs text-zinc-600 truncate">
                  {stage.explanation}
                </span>
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
