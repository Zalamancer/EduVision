"use client";

import Link from "next/link";
import { EPISODES } from "@/lib/episodes-data";
import { CHALLENGES } from "@/lib/challenges-data";
import { useProgressStore } from "@/lib/stores/progress-store";
import LearningProgress from "@/components/dashboard/LearningProgress";

const EXAMPLE_CIRCUITS = [
  { name: "AND / OR / NOT Demo", file: "and-or-not", desc: "Basic gate demonstration" },
  { name: "Half Adder", file: "half-adder", desc: "1-bit addition circuit" },
  { name: "Full Adder", file: "full-adder", desc: "Full 1-bit adder with carry-in" },
  { name: "AND from NAND", file: "nand-and", desc: "Universal gate demonstration" },
  { name: "2-to-1 Multiplexer", file: "mux-2to1", desc: "2-input mux circuit" },
];

export default function DashboardPage() {
  const isComplete = useProgressStore((s) => s.isComplete);

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Welcome */}
        <div className="mb-10">
          <h1 className="text-3xl font-black mb-2 text-zinc-50">
            Dashboard
          </h1>
          <p className="text-zinc-500">Your learning hub for digital logic.</p>
        </div>

        {/* Progress overview */}
        <LearningProgress />

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {[
            { label: "New Circuit", href: "/simulator", color: "text-primary", icon: "+" },
            { label: "Continue Learning", href: "/learn/ch1-ep1", color: "text-green-400", icon: ">" },
            { label: "Try a Challenge", href: "/challenge/and-from-nand", color: "text-amber-400", icon: "!" },
            { label: "Browse Examples", href: "#examples", color: "text-red-400", icon: "<>" },
          ].map((a) => (
            <Link
              key={a.label}
              href={a.href}
              className="glass-card flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-all text-center hover:bg-zinc-800/40 hover:border-white/[0.12]"
            >
              <span className={`text-2xl ${a.color}`}>{a.icon}</span>
              <span className="text-sm font-medium text-zinc-50">{a.label}</span>
            </Link>
          ))}
        </div>

        {/* Continue Learning */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-zinc-50">
              Chapter 1: Gates & Boolean Logic
            </h2>
            <Link href="/learn" className="text-sm text-primary hover:text-green-400 transition-colors">View all &rarr;</Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {EPISODES.slice(0, 4).map((ep) => (
              <Link
                key={ep.id}
                href={`/learn/${ep.id}`}
                className="glass-card p-3 rounded-xl transition-all hover:bg-zinc-800/40 hover:border-white/[0.12]"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-bold w-6 h-6 flex items-center justify-center rounded bg-zinc-800 text-primary">
                    {ep.episode}
                  </span>
                  {!ep.videoUrl && (
                    <span className="text-xs text-zinc-500">Soon</span>
                  )}
                </div>
                <h3 className="text-sm font-semibold leading-tight text-zinc-50">
                  {ep.title}
                </h3>
                <p className="text-xs mt-1 line-clamp-2 text-zinc-400">
                  {ep.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Challenges */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-zinc-50">Challenges</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {CHALLENGES.map((ch) => {
              const colorClass = {
                beginner: "text-green-400",
                intermediate: "text-amber-400",
                advanced: "text-red-400",
              }[ch.difficulty];
              const done = isComplete("challenge", ch.slug);
              return (
                <Link
                  key={ch.id}
                  href={`/challenge/${ch.slug}`}
                  className="glass-card p-4 rounded-xl transition-all hover:bg-zinc-800/40 hover:border-white/[0.12] relative"
                >
                  {done && (
                    <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center" title="Completed">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  )}
                  <div
                    className={`text-xs px-2 py-0.5 rounded inline-block mb-2 font-medium bg-zinc-800 ${colorClass}`}
                  >
                    {ch.difficulty}
                  </div>
                  <h3 className="font-semibold text-sm text-zinc-50">
                    {ch.title}
                  </h3>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Example circuits */}
        <section id="examples" className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-zinc-50">Example Circuits</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {EXAMPLE_CIRCUITS.map((ex) => (
              <ExampleCircuitCard key={ex.file} name={ex.name} file={ex.file} desc={ex.desc} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function ExampleCircuitCard({ name, file, desc }: { name: string; file: string; desc: string }) {
  const loadExample = async () => {
    try {
      const res = await fetch(`/examples/${file}.json`);
      const circuit = await res.json();
      // Redirect to simulator with circuit in URL state
      const { useCircuitStore } = await import("@/lib/stores/circuit-store");
      useCircuitStore.getState().setCircuit(circuit);
      window.location.href = "/simulator";
    } catch {
      console.error("Failed to load example");
    }
  };

  return (
    <button
      onClick={loadExample}
      className="glass-card p-4 rounded-xl text-left transition-all w-full hover:bg-zinc-800/40 hover:border-white/[0.12]"
    >
      <div className="w-8 h-8 rounded flex items-center justify-center mb-3 text-sm bg-zinc-800 text-primary">
        &lt;&gt;
      </div>
      <h3 className="font-semibold text-sm mb-1 text-zinc-50">{name}</h3>
      <p className="text-xs text-zinc-400">{desc}</p>
      <p className="text-xs mt-2 text-primary">Load in simulator &rarr;</p>
    </button>
  );
}
