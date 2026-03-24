"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/learn", label: "Learn" },
  { href: "/simulator", label: "Simulator" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{ background: "#0A0A1A", borderColor: "#1E1E3A" }}
    >
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span
            className="w-7 h-7 rounded flex items-center justify-center text-xs font-black"
            style={{ background: "#58C4DD", color: "#0A0A1A" }}
          >
            EV
          </span>
          <span style={{ color: "#E8E8F0" }}>
            Edu<span style={{ color: "#58C4DD" }}>Vision</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-1.5 rounded text-sm font-medium transition-colors"
                style={{
                  color: active ? "#58C4DD" : "#8888AA",
                  background: active ? "#1E1E3A" : "transparent",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/login"
            className="px-3 py-1.5 text-sm rounded transition-colors"
            style={{ color: "#8888AA" }}
          >
            Sign in
          </Link>
          <Link
            href="/login?tab=signup"
            className="px-3 py-1.5 text-sm rounded font-medium transition-colors"
            style={{ background: "#58C4DD", color: "#0A0A1A" }}
          >
            Get started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ color: "#E8E8F0" }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            {mobileOpen ? (
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            ) : (
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden border-t px-4 py-3 flex flex-col gap-2"
          style={{ background: "#12122A", borderColor: "#1E1E3A" }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="py-2 text-sm font-medium"
              style={{ color: "#E8E8F0" }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="py-2 text-sm"
            style={{ color: "#58C4DD" }}
            onClick={() => setMobileOpen(false)}
          >
            Sign in / Get started
          </Link>
        </div>
      )}
    </header>
  );
}
