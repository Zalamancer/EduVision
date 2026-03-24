import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-4"
      style={{ background: "#0A0A1A" }}
    >
      <div className="text-6xl font-black font-mono mb-4" style={{ color: "#1E1E3A" }}>
        404
      </div>
      <h1 className="text-2xl font-bold mb-2" style={{ color: "#E8E8F0" }}>
        Page not found
      </h1>
      <p className="mb-8" style={{ color: "#8888AA" }}>
        The circuit you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="px-6 py-2 rounded-lg font-semibold"
        style={{ background: "#58C4DD", color: "#0A0A1A" }}
      >
        Back to home
      </Link>
    </div>
  );
}
