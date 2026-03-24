import Link from "next/link";
import { EPISODES } from "@/lib/episodes-data";
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
    <div className="min-h-screen px-4 py-10" style={{ background: "#0A0A1A" }}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div
            className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-4"
            style={{ background: "#1E1E3A", color: "#58C4DD" }}
          >
            Chapter 1
          </div>
          <h1 className="text-3xl font-black mb-3" style={{ color: "#E8E8F0" }}>
            Gates & Boolean Logic
          </h1>
          <p style={{ color: "#8888AA" }}>
            8 episodes · ~65 minutes · Beginner
          </p>
        </div>

        {/* Episode list */}
        <div className="flex flex-col gap-3">
          {EPISODES.map((ep, i) => (
            <Link
              key={ep.id}
              href={`/learn/${ep.id}`}
              className="flex items-start gap-4 p-4 rounded-xl border transition-all hover:border-[#58C4DD]/40"
              style={{ background: "#12122A", border: "1px solid #1E1E3A" }}
            >
              {/* Episode number */}
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-bold font-mono text-sm"
                style={{ background: "#1E1E3A", color: "#58C4DD" }}
              >
                {String(ep.episode).padStart(2, "0")}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm" style={{ color: "#E8E8F0" }}>
                    {ep.title}
                  </h3>
                  {!ep.videoUrl && (
                    <span
                      className="text-xs px-1.5 py-0.5 rounded"
                      style={{ background: "#1E1E3A", color: "#4A4A5A" }}
                    >
                      Coming soon
                    </span>
                  )}
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "#8888AA" }}>
                  {ep.description}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {ep.topics.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-1.5 py-0.5 rounded"
                      style={{ background: "#0A0A1A", color: "#4A4A5A" }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div
                className="flex-shrink-0 text-xs font-mono"
                style={{ color: "#4A4A5A" }}
              >
                {fmtDuration(ep.durationSeconds)}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
