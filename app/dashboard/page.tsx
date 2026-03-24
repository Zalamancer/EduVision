"use client";

import Link from "next/link";
import { EPISODES } from "@/lib/episodes-data";
import { CHALLENGES } from "@/lib/challenges-data";

const EXAMPLE_CIRCUITS = [
  { name: "AND / OR / NOT Demo", file: "and-or-not", desc: "Basic gate demonstration" },
  { name: "Half Adder", file: "half-adder", desc: "1-bit addition circuit" },
  { name: "Full Adder", file: "full-adder", desc: "Full 1-bit adder with carry-in" },
  { name: "AND from NAND", file: "nand-and", desc: "Universal gate demonstration" },
  { name: "2-to-1 Multiplexer", file: "mux-2to1", desc: "2-input mux circuit" },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen px-4 py-10" style={{ background: "#0A0A1A" }}>
      <div className="max-w-5xl mx-auto">
        {/* Welcome */}
        <div className="mb-10">
          <h1 className="text-3xl font-black mb-2" style={{ color: "#E8E8F0" }}>
            Dashboard
          </h1>
          <p style={{ color: "#8888AA" }}>Your learning hub for digital logic.</p>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {[
            { label: "New Circuit", href: "/simulator", color: "#58C4DD", icon: "⊕" },
            { label: "Continue Learning", href: "/learn/ch1-ep1", color: "#83C167", icon: "▶" },
            { label: "Try a Challenge", href: "/challenge/and-from-nand", color: "#FFFF00", icon: "⚡" },
            { label: "Browse Examples", href: "#examples", color: "#FC6255", icon: "◈" },
          ].map((a) => (
            <Link
              key={a.label}
              href={a.href}
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all text-center"
              style={{ background: "#12122A", borderColor: "#1E1E3A" }}
            >
              <span className="text-2xl" style={{ color: a.color }}>{a.icon}</span>
              <span className="text-sm font-medium" style={{ color: "#E8E8F0" }}>{a.label}</span>
            </Link>
          ))}
        </div>

        {/* Continue Learning */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold" style={{ color: "#E8E8F0" }}>
              Chapter 1: Gates & Boolean Logic
            </h2>
            <Link href="/learn" className="text-sm" style={{ color: "#58C4DD" }}>View all →</Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {EPISODES.slice(0, 4).map((ep) => (
              <Link
                key={ep.id}
                href={`/learn/${ep.id}`}
                className="p-3 rounded-xl border transition-all"
                style={{ background: "#12122A", border: "1px solid #1E1E3A" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-xs font-mono font-bold w-6 h-6 flex items-center justify-center rounded"
                    style={{ background: "#1E1E3A", color: "#58C4DD" }}
                  >
                    {ep.episode}
                  </span>
                  {!ep.videoUrl && (
                    <span className="text-xs" style={{ color: "#4A4A5A" }}>Soon</span>
                  )}
                </div>
                <h3 className="text-sm font-semibold leading-tight" style={{ color: "#E8E8F0" }}>
                  {ep.title}
                </h3>
                <p className="text-xs mt-1 line-clamp-2" style={{ color: "#8888AA" }}>
                  {ep.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Challenges */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold" style={{ color: "#E8E8F0" }}>Challenges</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {CHALLENGES.map((ch) => {
              const color = { beginner: "#83C167", intermediate: "#FFFF00", advanced: "#FC6255" }[ch.difficulty];
              return (
                <Link
                  key={ch.id}
                  href={`/challenge/${ch.slug}`}
                  className="p-4 rounded-xl border transition-all"
                  style={{ background: "#12122A", border: "1px solid #1E1E3A" }}
                >
                  <div
                    className="text-xs px-2 py-0.5 rounded inline-block mb-2 font-medium"
                    style={{ background: "#1E1E3A", color }}
                  >
                    {ch.difficulty}
                  </div>
                  <h3 className="font-semibold text-sm" style={{ color: "#E8E8F0" }}>
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
            <h2 className="text-xl font-bold" style={{ color: "#E8E8F0" }}>Example Circuits</h2>
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
      className="p-4 rounded-xl border text-left transition-all w-full"
      style={{ background: "#12122A", border: "1px solid #1E1E3A", color: "#E8E8F0" }}
    >
      <div
        className="w-8 h-8 rounded flex items-center justify-center mb-3 text-sm"
        style={{ background: "#1E1E3A", color: "#58C4DD" }}
      >
        ◈
      </div>
      <h3 className="font-semibold text-sm mb-1">{name}</h3>
      <p className="text-xs" style={{ color: "#8888AA" }}>{desc}</p>
      <p className="text-xs mt-2" style={{ color: "#58C4DD" }}>Load in simulator →</p>
    </button>
  );
}
