"use client";

import { useEffect, useState, use } from "react";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { CHALLENGES, getChallenge } from "@/lib/challenges-data";
import { useCircuitStore } from "@/lib/stores/circuit-store";
import { generateTruthTable } from "@/lib/sim-engine/truth-table";
import ComponentPalette from "@/components/simulator/ComponentPalette";
import Toolbar from "@/components/simulator/Toolbar";

const Canvas = dynamic(() => import("@/components/simulator/Canvas"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center text-zinc-500">
      Loading...
    </div>
  ),
});

interface Props {
  params: Promise<{ slug: string }>;
}

function compareTruthTables(
  student: ReturnType<typeof generateTruthTable>,
  solution: ReturnType<typeof generateTruthTable>
): boolean {
  if (student.rows.length !== solution.rows.length) return false;
  return student.rows.every((row, i) => {
    const solRow = solution.rows[i];
    return student.outputLabels.every((label, j) => {
      const solLabel = solution.outputLabels[j];
      return row.outputs[label] === solRow.outputs[solLabel];
    });
  });
}

const difficultyClasses: Record<string, string> = {
  beginner: "text-green-400",
  intermediate: "text-amber-400",
  advanced: "text-red-400",
};

export default function ChallengePage({ params }: Props) {
  const { slug } = use(params);
  const challenge = getChallenge(slug);

  const { circuit, setCircuit } = useCircuitStore();
  const [result, setResult] = useState<"idle" | "success" | "failure">("idle");
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    if (challenge?.starterCircuit) {
      setCircuit(challenge.starterCircuit);
    } else {
      useCircuitStore.getState().clearCircuit();
    }
  }, [slug]);

  if (!challenge) return notFound();

  const checkAnswer = async () => {
    try {
      const studentTable = generateTruthTable(circuit);
      const solutionTable = generateTruthTable(challenge.solutionCircuit);
      const correct = compareTruthTables(studentTable, solutionTable);

      setResult(correct ? "success" : "failure");

      if (correct) {
        setConfetti(true);
        const confettiModule = await import("canvas-confetti");
        confettiModule.default({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#22c55e", "#3b82f6", "#eab308"],
        });
        setTimeout(() => setConfetti(false), 3000);
      }
    } catch {
      setResult("failure");
    }
  };

  return (
    <div className="flex bg-background" style={{ height: "calc(100vh - 56px)" }}>
      {/* Left: instructions */}
      <div className="w-80 flex-shrink-0 flex flex-col border-r border-zinc-800 bg-zinc-900">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800">
          <span
            className={`text-xs px-2 py-0.5 rounded font-medium bg-zinc-800 ${
              difficultyClasses[challenge.difficulty] || "text-zinc-400"
            }`}
          >
            {challenge.difficulty}
          </span>
          <h1 className="text-lg font-bold mt-2 text-zinc-50">
            {challenge.title}
          </h1>
        </div>

        {/* Instructions */}
        <div className="flex-1 overflow-y-auto p-4 text-sm leading-relaxed text-zinc-400">
          {challenge.instructions.split("\n").map((line, i) => {
            if (line.startsWith("## ")) return <h2 key={i} className="text-base font-bold mt-0 mb-2 text-zinc-50">{line.slice(3)}</h2>;
            if (line.startsWith("### ")) return <h3 key={i} className="text-sm font-semibold mt-3 mb-1 text-primary">{line.slice(4)}</h3>;
            if (line.startsWith("**") && line.endsWith("**")) return <p key={i} className="font-semibold mb-2 text-zinc-50">{line.slice(2,-2)}</p>;
            if (line.startsWith("> ")) return <blockquote key={i} className="pl-3 border-l-2 border-primary my-2 italic text-zinc-400">{line.slice(2)}</blockquote>;
            if (line.startsWith("- ")) return <li key={i} className="ml-3 mb-1">{line.slice(2)}</li>;
            if (line.startsWith("|")) return <p key={i} className="font-mono text-xs my-0.5 text-zinc-500">{line}</p>;
            if (line.trim() === "") return <div key={i} className="h-2" />;
            return <p key={i} className="mb-2">{line}</p>;
          })}
        </div>

        {/* Check answer */}
        <div className="p-4 border-t border-zinc-800">
          {result === "success" && (
            <div className="mb-3 p-3 rounded-lg text-sm font-medium bg-green-950/50 text-green-400">
              Correct! Circuit matches the expected truth table.
            </div>
          )}
          {result === "failure" && (
            <div className="mb-3 p-3 rounded-lg text-sm font-medium bg-red-950/50 text-red-400">
              Not quite right. Check your truth table and try again.
            </div>
          )}
          <button
            className="w-full py-2.5 rounded-lg font-semibold text-sm transition-all bg-primary text-primary-foreground hover:bg-green-400"
            onClick={checkAnswer}
          >
            Check My Answer
          </button>
        </div>
      </div>

      {/* Right: simulator */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="w-48 hidden">
          <ComponentPalette />
        </div>
        <Toolbar />
        <div className="flex flex-1 min-h-0">
          <div className="w-44 flex-shrink-0 hidden md:block">
            <ComponentPalette />
          </div>
          <div className="flex-1 min-w-0">
            <Canvas />
          </div>
        </div>
      </div>
    </div>
  );
}
