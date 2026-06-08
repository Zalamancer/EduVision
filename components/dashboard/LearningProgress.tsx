"use client";

import { useProgressStore } from "@/lib/stores/progress-store";
import { EPISODES } from "@/lib/episodes-data";
import { EXERCISES } from "@/lib/exercises";
import { CHALLENGES } from "@/lib/challenges-data";

const TOTALS = {
  lessons: EPISODES.length,
  exercises: EXERCISES.length,
  challenges: CHALLENGES.length,
};

function ProgressRing({
  completed,
  total,
  label,
  color,
}: {
  completed: number;
  total: number;
  label: string;
  color: string;
}) {
  const circumference = 2 * Math.PI * 28; // ~175.9
  const progress = total > 0 ? (completed / total) * circumference : 0;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="64" height="64" viewBox="0 0 64 64">
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke="#27272a"
          strokeWidth="4"
        />
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={`${progress} ${circumference}`}
          transform="rotate(-90 32 32)"
          strokeLinecap="round"
        />
        <text
          x="32"
          y="36"
          textAnchor="middle"
          fill="white"
          fontSize="14"
          fontWeight="bold"
        >
          {completed}
        </text>
      </svg>
      <div className="text-center">
        <div className="text-xs font-medium text-zinc-300">{label}</div>
        <div className="text-xs text-zinc-500">
          {completed}/{total}
        </div>
      </div>
    </div>
  );
}

export default function LearningProgress() {
  const completedLessons = useProgressStore((s) => s.completedLessons);
  const completedExercises = useProgressStore((s) => s.completedExercises);
  const completedChallenges = useProgressStore((s) => s.completedChallenges);

  const totalCompleted =
    completedLessons.length +
    completedExercises.length +
    completedChallenges.length;
  const totalAll = TOTALS.lessons + TOTALS.exercises + TOTALS.challenges;

  return (
    <section className="mb-10">
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-lg font-bold text-zinc-50 mb-5">Your Progress</h2>

        {/* Progress rings */}
        <div className="flex items-center justify-around mb-6">
          <ProgressRing
            completed={completedLessons.length}
            total={TOTALS.lessons}
            label="Lessons"
            color="#22c55e"
          />
          <ProgressRing
            completed={completedExercises.length}
            total={TOTALS.exercises}
            label="Exercises"
            color="#3b82f6"
          />
          <ProgressRing
            completed={completedChallenges.length}
            total={TOTALS.challenges}
            label="Challenges"
            color="#f59e0b"
          />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-zinc-800/60 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-zinc-50">
              {totalCompleted}
            </div>
            <div className="text-xs text-zinc-500">
              of {totalAll} completed
            </div>
          </div>
          <div className="bg-zinc-800/60 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-zinc-50">
              {totalAll > 0
                ? Math.round((totalCompleted / totalAll) * 100)
                : 0}
              %
            </div>
            <div className="text-xs text-zinc-500">overall progress</div>
          </div>
        </div>

        {/* Recent activity */}
        {totalCompleted > 0 && (
          <div className="mt-5">
            <h3 className="text-sm font-semibold text-zinc-400 mb-2">
              Recently Completed
            </h3>
            <div className="flex flex-col gap-1.5">
              {[
                ...completedLessons.map((slug) => ({
                  slug,
                  type: "Lesson" as const,
                  label:
                    EPISODES.find((e) => e.id === slug)?.title ?? slug,
                })),
                ...completedExercises.map((slug) => ({
                  slug,
                  type: "Exercise" as const,
                  label:
                    EXERCISES.find((e) => e.slug === slug)?.title ?? slug,
                })),
                ...completedChallenges.map((slug) => ({
                  slug,
                  type: "Challenge" as const,
                  label:
                    CHALLENGES.find((c) => c.slug === slug)?.title ?? slug,
                })),
              ]
                .slice(-5)
                .reverse()
                .map((item) => {
                  const badgeColor = {
                    Lesson: "text-green-400 bg-green-400/10",
                    Exercise: "text-blue-400 bg-blue-400/10",
                    Challenge: "text-amber-400 bg-amber-400/10",
                  }[item.type];

                  return (
                    <div
                      key={`${item.type}-${item.slug}`}
                      className="flex items-center gap-2 text-sm"
                    >
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded font-medium ${badgeColor}`}
                      >
                        {item.type}
                      </span>
                      <span className="text-zinc-300 truncate">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
