import Link from "next/link";

const FEATURES = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
    title: "Video Lessons",
    description:
      "Structured chapter-based video curriculum covering binary logic, gates, combinational circuits, and more.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
    title: "Live Simulator",
    description:
      "Drag-and-drop circuit canvas. Place gates, connect wires, toggle inputs, and see signals propagate in real time.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: "AI Tutor",
    description:
      "Ask the AI to build circuits from description, explain your design, or diagnose errors. Powered by Claude Sonnet.",
  },
];

export default function HomePage() {
  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[calc(100vh-56px)] flex flex-col items-center justify-center px-4 text-center">
        {/* Background grid */}
        <div className="absolute inset-0 bg-grid opacity-100" />

        {/* Top glow — green accent */}
        <div
          className="hero-glow animate-glow-pulse"
          style={{
            top: "-20vh",
            left: "50%",
            transform: "translateX(-50%)",
            width: "80vw",
            height: "60vh",
            background: "rgba(34, 197, 94, 0.04)",
          }}
        />

        {/* Bottom glow */}
        <div
          className="hero-glow"
          style={{
            bottom: "-10vh",
            left: "50%",
            transform: "translateX(-50%)",
            width: "60vw",
            height: "30vh",
            background: "rgba(34, 197, 94, 0.03)",
          }}
        />

        {/* Floating gate illustration */}
        <div className="relative mb-8 opacity-30 hidden sm:block animate-float">
          <svg width="460" height="120" viewBox="0 0 460 120">
            <g transform="translate(20,30)">
              <path d="M0,0 L40,0 Q70,0 70,25 Q70,50 40,50 L0,50 Z" fill="#18181b" stroke="#22c55e" strokeWidth="1.5" />
              <line x1="70" y1="25" x2="90" y2="25" stroke="#22c55e" strokeWidth="2" />
              <line x1="0" y1="12" x2="-20" y2="12" stroke="#22c55e" strokeWidth="2" />
              <line x1="0" y1="38" x2="-20" y2="38" stroke="#52525b" strokeWidth="2" />
              <text x="22" y="30" fill="#71717a" fontSize="10" fontFamily="monospace">AND</text>
            </g>
            <line x1="110" y1="55" x2="160" y2="55" stroke="#22c55e" strokeWidth="2" />
            <g transform="translate(160,30)">
              <path d="M0,0 Q15,0 40,0 Q75,0 75,25 Q75,50 40,50 Q15,50 0,50 Q20,25 0,0 Z" fill="#18181b" stroke="#22c55e" strokeWidth="1.5" />
              <line x1="75" y1="25" x2="95" y2="25" stroke="#22c55e" strokeWidth="2" />
              <line x1="10" y1="12" x2="-10" y2="12" stroke="#22c55e" strokeWidth="2" />
              <line x1="10" y1="38" x2="-10" y2="38" stroke="#52525b" strokeWidth="2" />
              <text x="25" y="30" fill="#71717a" fontSize="10" fontFamily="monospace">OR</text>
            </g>
            <line x1="255" y1="55" x2="300" y2="55" stroke="#22c55e" strokeWidth="2" />
            <g transform="translate(300,30)">
              <path d="M0,0 L60,25 L0,50 Z" fill="#18181b" stroke="#22c55e" strokeWidth="1.5" />
              <circle cx="64" cy="25" r="4" fill="#18181b" stroke="#22c55e" strokeWidth="1.5" />
              <line x1="68" y1="25" x2="88" y2="25" stroke="#ef4444" strokeWidth="2" />
              <line x1="0" y1="25" x2="-20" y2="25" stroke="#22c55e" strokeWidth="2" />
              <text x="18" y="30" fill="#71717a" fontSize="10" fontFamily="monospace">NOT</text>
            </g>
          </svg>
        </div>

        <div className="relative z-10 max-w-3xl animate-fade-in-up">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-6 bg-zinc-800/80 text-primary border border-white/[0.06]">
            AI-Powered Digital Logic Education
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 leading-tight text-zinc-50">
            Learn Digital Logic
            <br />
            <span className="text-primary">with AI</span>
          </h1>

          <p className="text-lg sm:text-xl mb-10 max-w-xl mx-auto leading-relaxed text-zinc-400">
            Build circuits visually, watch structured lessons, and ask an AI tutor anything — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/simulator"
              className="px-8 py-3 rounded-lg font-semibold text-base transition-all bg-primary text-primary-foreground hover:bg-green-400 glow-green"
            >
              Open Simulator
            </Link>
            <Link
              href="/learn"
              className="px-8 py-3 rounded-lg font-semibold text-base transition-all glass text-zinc-50 hover:bg-zinc-700/60"
            >
              Start Learning →
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 bg-zinc-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-zinc-50">
              Everything you need to master digital logic
            </h2>
            <p className="text-zinc-400">Three integrated tools that reinforce each other.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="glass-card rounded-xl p-6 hover:border-white/[0.12] transition-all group"
              >
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-zinc-800 text-primary group-hover:bg-primary/10 transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-zinc-50">
                  {f.title}
                </h3>
                <p className="text-zinc-400">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-zinc-50">
            How EduVision works
          </h2>
          <p className="mb-16 text-zinc-400">
            A simple, effective learning loop.
          </p>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { num: "01", title: "Watch a lesson", desc: "Short, focused videos explain one concept at a time." },
              { num: "02", title: "Build in the simulator", desc: "Immediately apply what you learned by constructing the circuit." },
              { num: "03", title: "Ask the AI tutor", desc: "Stuck? Ask in plain English and get instant, contextual help." },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="text-4xl font-black mb-4 font-mono text-zinc-800">
                  {step.num}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-zinc-50">
                  {step.title}
                </h3>
                <p className="text-sm text-zinc-400">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <Link
              href="/learn"
              className="inline-block px-10 py-4 rounded-lg font-bold text-lg transition-all bg-primary text-primary-foreground hover:bg-green-400 glow-green"
            >
              Start Chapter 1 →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 px-4 text-center text-sm text-zinc-500">
        © 2026 EduVision. Built with Next.js, Claude API, and SVG circuits.
      </footer>
    </div>
  );
}
