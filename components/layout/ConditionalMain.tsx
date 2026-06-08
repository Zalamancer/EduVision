"use client";

import { usePathname } from "next/navigation";

const FULL_SCREEN_ROUTES = ["/simulator", "/challenge"];

export default function ConditionalMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFullScreen = FULL_SCREEN_ROUTES.some((r) => pathname.startsWith(r));

  if (isFullScreen) return <>{children}</>;
  return <main className="flex-1 pt-14">{children}</main>;
}
