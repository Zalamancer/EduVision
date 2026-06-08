import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-background">
      <div className="text-6xl font-black font-mono mb-4 text-zinc-800">
        404
      </div>
      <h1 className="text-2xl font-bold mb-2 text-zinc-50">
        Page not found
      </h1>
      <p className="mb-8 text-zinc-400">
        The circuit you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="px-6 py-2 rounded-lg font-semibold bg-primary text-primary-foreground hover:bg-green-400 transition-colors"
      >
        Back to home
      </Link>
    </div>
  );
}
