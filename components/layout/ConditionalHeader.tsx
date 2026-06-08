"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

const FULL_SCREEN_ROUTES = ["/simulator", "/challenge"];

export default function ConditionalHeader() {
  const pathname = usePathname();
  const isFullScreen = FULL_SCREEN_ROUTES.some((r) => pathname.startsWith(r));

  if (isFullScreen) return null;
  return <Header />;
}
