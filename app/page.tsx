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
    color: "#58C4DD",
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
    color: "#83C167",
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
    color: "#FFFF00",
  },
];

export default function HomePage() {
  return (
    <div style={{ background: "#0A0A1A" }}>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[calc(100vh-56px)] flex flex-col items-center justify-center px-4 text-center">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(#1E1E3A 1px, transparent 1px), linear-gradient(90deg, #1E1E3A 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Floating gate illustration */}
        <div className="relative mb-8 opacity-30 hidden sm:block">
          <svg width="460" height="120" viewBox="0 0 460 120">
            <g transform="translate(20,30)">
              <path d="M0,0 L40,0 Q70,0 70,25 Q70,50 40,50 L0,50 Z" fill="#1E1E3A" stroke="#58C4DD" strokeWidth="1.5" />
              <line x1="70" y1="25" x2="90" y2="25" stroke="#83C167" strokeWidth="2" />
              <line x1="0" y1="12" x2="-20" y2="12" stroke="#83C167" strokeWidth="2" />
              <line x1="0" y1="38" x2="-20" y2="38" stroke="#4A4A5A" strokeWidth="2" />
              <text x="22" y="30" fill="#8888AA" fontSize="10" fontFamily="monospace">AND</text>
            </g>
            <line x1="110" y1="55" x2="160" y2="55" stroke="#83C167" strokeWidth="2" />
            <g transform="translate(160,30)">
              <path d="M0,0 Q15,0 40,0 Q75,0 75,25 Q75,50 40,50 Q15,50 0,50 Q20,25 0,0 Z" fill="#1E1E3A" stroke="#58C4DD" strokeWidth="1.5" />
              <line x1="75" y1="25" x2="95" y2="25" stroke="#83C167" strokeWidth="2" />
              <line x1="10" y1="12" x2="-10" y2="12" stroke="#83C167" strokeWidth="2" />
              <line x1="10" y1="38" x2="-10" y2="38" stroke="#4A4A5A" strokeWidth="2" />
              <text x="25" y="30" fill="#8888AA" fontSize="10" fontFamily="monospace">OR</text>
            </g>
            <line x1="255" y1="55" x2="300" y2="55" stroke="#83C167" strokeWidth="2" />
            <g transform="translate(300,30)">
              <path d="M0,0 L60,25 L0,50 Z" fill="#1E1E3A" stroke="#58C4DD" strokeWidth="1.5" />
              <circle cx="64" cy="25" r="4" fill="#1E1E3A" stroke="#58C4DD" strokeWidth="1.5" />
              <line x1="68" y1="25" x2="88" y2="25" stroke="#FC6255" strokeWidth="2" />
              <line x1="0" y1="25" x2="-20" y2="25" stroke="#83C167" strokeWidth="2" />
              <text x="18" y="30" fill="#8888AA" fontSize="10" fontFamily="monospace">NOT</text>
            </g>
          </svg>
        </div>

        <div className="relative z-10 max-w-3xl">
          <div
            className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-6"
            style={{ background: "#1E1E3A", color: "#58C4DD" }}
          >
            AI-Powered Digital Logic Education
          </div>

          <h1
            className="text-4xl sm:text-6xl font-black tracking-tight mb-6 leading-tight"
            style={{ color: "#E8E8F0" }}
          >
            Learn Digital Logic
            <br />
            <span style={{ color: "#58C4DD" }}>with AI</span>
          </h1>

          <p
            className="text-lg sm:text-xl mb-10 max-w-xl mx-auto leading-relaxed"
            style={{ color: "#8888AA" }}
          >
            Build circuits visually, watch structured lessons, and ask an AI tutor anything — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/simulator"
              className="px-8 py-3 rounded-lg font-semibold text-base transition-all hover:opacity-90"
              style={{ background: "#58C4DD", color: "#0A0A1A" }}
            >
              Open Simulator
            </Link>
            <Link
              href="/learn"
              className="px-8 py-3 rounded-lg font-semibold text-base transition-all border"
              style={{ border: "1px solid #1E1E3A", color: "#E8E8F0", background: "#12122A" }}
            >
              Start Learning →
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4" style={{ background: "#12122A" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4" style={{ color: "#E8E8F0" }}>
              Everything you need to master digital logic
            </h2>
            <p style={{ color: "#8888AA" }}>Three integrated tools that reinforce each other.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-xl p-6 border"
                style={{ background: "#0A0A1A", border: "1px solid #1E1E3A" }}
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: "#1E1E3A", color: f.color }}
                >
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: "#E8E8F0" }}>
                  {f.title}
                </h3>
                <p style={{ color: "#8888AA" }}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4" style={{ background: "#0A0A1A" }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: "#E8E8F0" }}>
            How EduVision works
          </h2>
          <p className="mb-16" style={{ color: "#8888AA" }}>
            A simple, effective learning loop.
          </p>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { num: "01", title: "Watch a lesson", desc: "Short, focused videos explain one concept at a time." },
              { num: "02", title: "Build in the simulator", desc: "Immediately apply what you learned by constructing the circuit." },
              { num: "03", title: "Ask the AI tutor", desc: "Stuck? Ask in plain English and get instant, contextual help." },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div
                  className="text-4xl font-black mb-4 font-mono"
                  style={{ color: "#1E1E3A" }}
                >
                  {step.num}
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: "#E8E8F0" }}>
                  {step.title}
                </h3>
                <p className="text-sm" style={{ color: "#8888AA" }}>{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <Link
              href="/learn"
              className="inline-block px-10 py-4 rounded-lg font-bold text-lg transition-all hover:opacity-90"
              style={{ background: "#58C4DD", color: "#0A0A1A" }}
            >
              Start Chapter 1 →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4 text-center text-sm" style={{ borderColor: "#1E1E3A", color: "#8888AA" }}>
        © 2026 EduVision. Built with Next.js, Claude API, and SVG circuits.
      </footer>
    </div>
  );
}
