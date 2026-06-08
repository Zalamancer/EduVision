import Link from "next/link";
import { EPISODES } from "@/lib/episodes-data";
import CompletionBadge from "@/components/dashboard/CompletionBadge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn Digital Logic — EduVision",
  description: "Chapter 1: Gates and Boolean Logic. 8-episode video course.",
};

function fmtDuration(s: number) {
  const m = Math.floor(s / 60);
  return `${m} min`;
}

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 bg-zinc-800/80 text-primary border border-white/[0.06]">
            Chapter 1
          </div>
          <h1 className="text-3xl font-black mb-3 text-zinc-50">
            Gates &amp; Boolean Logic
          </h1>
          <p className="text-zinc-400">
            8 episodes &middot; ~65 minutes &middot; Beginner
          </p>
        </div>

        {/* Episode list */}
        <div className="flex flex-col gap-3">
          {EPISODES.map((ep) => (
            <Link
              key={ep.id}
              href={`/learn/${ep.id}`}
              className="glass-card flex items-start gap-4 p-4 rounded-xl transition-all hover:border-white/[0.12]"
            >
              {/* Episode number */}
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-bold font-mono text-sm bg-zinc-800 text-primary">
                {String(ep.episode).padStart(2, "0")}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm text-zinc-50">
                    {ep.title}
                  </h3>
                  <CompletionBadge type="lesson" slug={ep.id} />
                  {!ep.videoUrl && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500">
                      Coming soon
                    </span>
                  )}
                </div>
                <p className="text-xs leading-relaxed text-zinc-400">
                  {ep.description}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {ep.topics.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-500"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex-shrink-0 text-xs font-mono text-zinc-500">
                {fmtDuration(ep.durationSeconds)}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
