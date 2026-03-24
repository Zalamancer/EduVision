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
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-4"
      style={{ background: "#0A0A1A" }}
    >
      <div
        className="text-5xl mb-4 font-mono font-black"
        style={{ color: "#FC6255" }}
      >
        ERROR
      </div>
      <h1 className="text-2xl font-bold mb-2" style={{ color: "#E8E8F0" }}>
        Something went wrong
      </h1>
      <p className="mb-8 max-w-md" style={{ color: "#8888AA" }}>
        {error.message || "An unexpected error occurred."}
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="px-6 py-2 rounded-lg font-semibold"
          style={{ background: "#58C4DD", color: "#0A0A1A" }}
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-6 py-2 rounded-lg font-semibold border"
          style={{ borderColor: "#1E1E3A", color: "#E8E8F0" }}
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
