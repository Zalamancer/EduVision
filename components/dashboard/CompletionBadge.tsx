"use client";

import { useProgressStore } from "@/lib/stores/progress-store";

export default function CompletionBadge({
  type,
  slug,
}: {
  type: "lesson" | "exercise" | "challenge";
  slug: string;
}) {
  const isComplete = useProgressStore((s) => s.isComplete);

  if (!isComplete(type, slug)) return null;

  return (
    <span
      className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center"
      title="Completed"
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path
          d="M2.5 6L5 8.5L9.5 3.5"
          stroke="#22c55e"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
