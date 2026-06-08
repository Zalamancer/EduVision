"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-background">
      <div className="text-5xl mb-4 font-mono font-black text-red-400">
        ERROR
      </div>
      <h1 className="text-2xl font-bold mb-2 text-zinc-50">
        Something went wrong
      </h1>
      <p className="mb-8 max-w-md text-zinc-400">
        {error.message || "An unexpected error occurred."}
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="px-6 py-2 rounded-lg font-semibold bg-primary text-primary-foreground"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="glass px-6 py-2 rounded-lg font-semibold text-zinc-50"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
