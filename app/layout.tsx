import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalHeader from "@/components/layout/ConditionalHeader";
import ConditionalMain from "@/components/layout/ConditionalMain";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduVision — Learn Digital Logic with AI",
  description:
    "Master digital logic circuits with interactive simulations, video lessons, and an AI tutor. Build AND gates, half adders, multiplexers and more.",
  openGraph: {
    title: "EduVision — Learn Digital Logic with AI",
    description:
      "Master digital logic circuits with interactive simulations, video lessons, and an AI tutor.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          <TooltipProvider>
            <ConditionalHeader />
            <ConditionalMain>{children}</ConditionalMain>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
