import { notFound } from "next/navigation";
import Link from "next/link";
import Player from "@/components/video/Player";
import { EPISODES, getEpisode, getAdjacentEpisodes } from "@/lib/episodes-data";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const ep = getEpisode(id);
  if (!ep) return {};
  return {
    title: `${ep.title} — EduVision`,
    description: ep.description,
  };
}

export function generateStaticParams() {
  return EPISODES.map((ep) => ({ id: ep.id }));
}

export default async function EpisodePage({ params }: Props) {
  const { id } = await params;
  const ep = getEpisode(id);
  if (!ep) notFound();

  const { prev, next } = getAdjacentEpisodes(id);

  return (
    <div className="min-h-screen" style={{ background: "#0A0A1A" }}>
      <div className="max-w-5xl mx-auto px-4 py-8 flex gap-6">
        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Video */}
          <Player src={ep.videoUrl} title={ep.title} />

          {/* Episode info */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-xs px-2 py-0.5 rounded font-mono"
                style={{ background: "#1E1E3A", color: "#58C4DD" }}
              >
                Ch.{ep.chapter} · Ep.{ep.episode}
              </span>
            </div>
            <h1 className="text-2xl font-black mb-3" style={{ color: "#E8E8F0" }}>
              {ep.title}
            </h1>
            <p className="leading-relaxed" style={{ color: "#8888AA" }}>
              {ep.description}
            </p>

            {/* Topics */}
            <div className="flex flex-wrap gap-2 mt-4">
              {ep.topics.map((t) => (
                <span
                  key={t}
                  className="text-xs px-2 py-1 rounded"
                  style={{ background: "#1E1E3A", color: "#8888AA" }}
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Try in simulator */}
            <div className="mt-8 p-4 rounded-xl border" style={{ background: "#12122A", borderColor: "#1E1E3A" }}>
              <h3 className="font-semibold mb-2" style={{ color: "#E8E8F0" }}>
                Apply what you learned
              </h3>
              <p className="text-sm mb-4" style={{ color: "#8888AA" }}>
                Open the simulator and build the circuit covered in this episode.
              </p>
              <Link
                href="/simulator"
                className="inline-block px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ background: "#58C4DD", color: "#0A0A1A" }}
              >
                Open Simulator →
              </Link>
            </div>

            {/* Navigation */}
            <div className="flex gap-4 mt-8">
              {prev && (
                <Link
                  href={`/learn/${prev.id}`}
                  className="flex-1 p-3 rounded-lg border text-sm transition-all"
                  style={{ background: "#12122A", borderColor: "#1E1E3A", color: "#8888AA" }}
                >
                  <div className="text-xs mb-1" style={{ color: "#4A4A5A" }}>← Previous</div>
                  <div style={{ color: "#E8E8F0" }}>{prev.title}</div>
                </Link>
              )}
              {next && (
                <Link
                  href={`/learn/${next.id}`}
                  className="flex-1 p-3 rounded-lg border text-sm text-right transition-all"
                  style={{ background: "#12122A", borderColor: "#1E1E3A", color: "#8888AA" }}
                >
                  <div className="text-xs mb-1" style={{ color: "#4A4A5A" }}>Next →</div>
                  <div style={{ color: "#E8E8F0" }}>{next.title}</div>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar: episode list */}
        <div className="w-64 flex-shrink-0 hidden lg:block">
          <div
            className="rounded-xl border overflow-hidden"
            style={{ background: "#12122A", borderColor: "#1E1E3A" }}
          >
            <div className="px-3 py-2 border-b text-xs font-bold tracking-widest uppercase" style={{ borderColor: "#1E1E3A", color: "#8888AA" }}>
              Chapter 1
            </div>
            {EPISODES.map((e) => {
              const isActive = e.id === id;
              return (
                <Link
                  key={e.id}
                  href={`/learn/${e.id}`}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm border-b transition-all"
                  style={{
                    borderColor: "#1E1E3A",
                    background: isActive ? "#1E1E3A" : "transparent",
                    color: isActive ? "#58C4DD" : "#8888AA",
                  }}
                >
                  <span className="font-mono text-xs flex-shrink-0" style={{ color: isActive ? "#58C4DD" : "#4A4A5A" }}>
                    {String(e.episode).padStart(2, "0")}
                  </span>
                  <span className="truncate">{e.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
