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
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8 flex gap-6">
        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Video */}
          <Player src={ep.videoUrl} title={ep.title} />

          {/* Episode info */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2 py-0.5 rounded font-mono bg-zinc-800 text-primary">
                Ch.{ep.chapter} &middot; Ep.{ep.episode}
              </span>
            </div>
            <h1 className="text-2xl font-black mb-3 text-zinc-50">
              {ep.title}
            </h1>
            <p className="leading-relaxed text-zinc-400">
              {ep.description}
            </p>

            {/* Topics */}
            <div className="flex flex-wrap gap-2 mt-4">
              {ep.topics.map((t) => (
                <span
                  key={t}
                  className="text-xs px-2 py-1 rounded bg-zinc-800 text-zinc-400"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Try in simulator */}
            <div className="glass-card mt-8 p-4 rounded-xl">
              <h3 className="font-semibold mb-2 text-zinc-50">
                Apply what you learned
              </h3>
              <p className="text-sm mb-4 text-zinc-400">
                Open the simulator and build the circuit covered in this episode.
              </p>
              <Link
                href="/simulator"
                className="inline-block px-4 py-2 rounded-lg text-sm font-medium transition-all bg-primary text-primary-foreground hover:bg-green-400"
              >
                Open Simulator &rarr;
              </Link>
            </div>

            {/* Navigation */}
            <div className="flex gap-4 mt-8">
              {prev && (
                <Link
                  href={`/learn/${prev.id}`}
                  className="glass-card flex-1 p-3 rounded-lg text-sm transition-all hover:border-white/[0.12]"
                >
                  <div className="text-xs mb-1 text-zinc-500">&larr; Previous</div>
                  <div className="text-zinc-50">{prev.title}</div>
                </Link>
              )}
              {next && (
                <Link
                  href={`/learn/${next.id}`}
                  className="glass-card flex-1 p-3 rounded-lg text-sm text-right transition-all hover:border-white/[0.12]"
                >
                  <div className="text-xs mb-1 text-zinc-500">Next &rarr;</div>
                  <div className="text-zinc-50">{next.title}</div>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar: episode list */}
        <div className="w-64 flex-shrink-0 hidden lg:block">
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="px-3 py-2 border-b border-zinc-800 text-xs font-bold tracking-widest uppercase text-zinc-400">
              Chapter 1
            </div>
            {EPISODES.map((e) => {
              const isActive = e.id === id;
              return (
                <Link
                  key={e.id}
                  href={`/learn/${e.id}`}
                  className={`flex items-center gap-2 px-3 py-2.5 text-sm border-b border-zinc-800 transition-all ${
                    isActive
                      ? "bg-zinc-800 text-primary"
                      : "text-zinc-400 hover:bg-zinc-800/50"
                  }`}
                >
                  <span
                    className={`font-mono text-xs flex-shrink-0 ${
                      isActive ? "text-primary" : "text-zinc-500"
                    }`}
                  >
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
