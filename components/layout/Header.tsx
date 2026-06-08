"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useThemeStore } from "@/lib/stores/theme-store";

const NAV_LINKS = [
  { href: "/learn", label: "Learn" },
  { href: "/simulator", label: "Simulator" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-black bg-primary text-primary-foreground">
            EV
          </span>
          <span className="text-zinc-50">
            Edu<span className="text-primary">Vision</span>
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
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-zinc-800/80 text-zinc-50"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
          <Link
            href="/login"
            className="px-3 py-1.5 text-sm rounded-lg text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/login?tab=signup"
            className="px-4 py-1.5 text-sm rounded-lg font-medium bg-primary text-primary-foreground hover:bg-green-400 transition-colors"
          >
            Get started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-zinc-300 hover:text-zinc-100"
          onClick={() => setMobileOpen(!mobileOpen)}
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
        <div className="md:hidden border-t border-white/[0.06] px-4 py-3 flex flex-col gap-1 glass">
          {NAV_LINKS.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  active ? "text-zinc-50 bg-zinc-800/60" : "text-zinc-400"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
          <button
            onClick={toggleTheme}
            className="py-2 px-3 rounded-lg text-sm font-medium text-zinc-400 flex items-center gap-2"
          >
            {theme === "dark" ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
                Light mode
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
                Dark mode
              </>
            )}
          </button>
          <Link
            href="/login"
            className="py-2 px-3 text-sm text-primary"
            onClick={() => setMobileOpen(false)}
          >
            Sign in / Get started
          </Link>
        </div>
      )}
    </header>
  );
}
