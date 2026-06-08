"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronDown, Cpu, Zap, BookOpen, ToggleLeft, GitBranch, Calculator, Database, Cable } from "lucide-react";
import { GateType } from "@/lib/sim-engine/types";
import { useCircuitStore } from "@/lib/stores/circuit-store";
import { TabNavigation, type Tab } from "@/components/ui/TabNavigation";
import { PanelSearchInput } from "@/components/ui/panel-controls";
import ExercisePanel from "./ExercisePanel";

/* ── Main groups (dropdown) ── */
const GROUPS = [
  { id: "gates", label: "Gates", icon: Cpu },
  { id: "saved", label: "Saved", icon: Zap },
  { id: "learn", label: "Learn", icon: BookOpen },
] as const;

type GroupId = (typeof GROUPS)[number]["id"];

/* ── Sub-tabs for "Gates" group (white pills) ── */
const GATE_SUB_TABS: Tab[] = [
  { id: "io", icon: ToggleLeft, label: "In/Out" },
  { id: "logic", icon: Cpu, label: "Logic" },
  { id: "plexer", icon: GitBranch, label: "Plexers" },
  { id: "arith", icon: Calculator, label: "Arithmetic" },
  { id: "memory", icon: Database, label: "Memory" },
  { id: "wiring", icon: Cable, label: "Wiring" },
];

interface PaletteItem {
  type: GateType;
  label: string;
}

const SUB_TAB_ITEMS: Record<string, PaletteItem[]> = {
  io: [
    { type: "INPUT", label: "Input" },
    { type: "OUTPUT", label: "Output" },
    { type: "BUTTON", label: "Button" },
    { type: "SEVEN_SEGMENT", label: "7-Seg" },
    { type: "HEX_DISPLAY", label: "Hex" },
    { type: "LED_MATRIX", label: "LED Grid" },
  ],
  logic: [
    { type: "AND", label: "AND" },
    { type: "OR", label: "OR" },
    { type: "NOT", label: "NOT" },
    { type: "NAND", label: "NAND" },
    { type: "NOR", label: "NOR" },
    { type: "XOR", label: "XOR" },
    { type: "XNOR", label: "XNOR" },
    { type: "BUFFER", label: "Buffer" },
    { type: "CONTROLLED_BUFFER", label: "Ctrl Buf" },
    { type: "CONTROLLED_INVERTER", label: "Ctrl Inv" },
  ],
  plexer: [
    { type: "MUX_2TO1", label: "MUX 2:1" },
    { type: "MUX_4TO1", label: "MUX 4:1" },
    { type: "MUX_8TO1", label: "MUX 8:1" },
    { type: "DEMUX_1TO4", label: "DEMUX" },
    { type: "DECODER_2TO4", label: "Decoder" },
    { type: "PRIORITY_ENCODER", label: "Pri Enc" },
    { type: "BIT_SELECTOR", label: "Bit Sel" },
  ],
  arith: [
    { type: "FULL_ADDER", label: "Full Adder" },
    { type: "SUBTRACTOR", label: "Subtractor" },
    { type: "MULTIPLIER", label: "Multiplier" },
    { type: "DIVIDER", label: "Divider" },
    { type: "NEGATOR", label: "Negator" },
    { type: "COMPARATOR", label: "Comparator" },
    { type: "SHIFTER", label: "Shifter" },
    { type: "BIT_ADDER", label: "Half Adder" },
  ],
  memory: [
    { type: "D_FLIP_FLOP", label: "D FF" },
    { type: "T_FLIP_FLOP", label: "T FF" },
    { type: "JK_FLIP_FLOP", label: "JK FF" },
    { type: "SR_FLIP_FLOP", label: "SR FF" },
    { type: "REGISTER", label: "Register" },
    { type: "COUNTER", label: "Counter" },
    { type: "SHIFT_REGISTER", label: "Shift Reg" },
  ],
  wiring: [
    { type: "CLOCK", label: "Clock" },
    { type: "CONSTANT", label: "Constant" },
    { type: "POWER", label: "Power" },
    { type: "GROUND", label: "Ground" },
    { type: "PROBE", label: "Probe" },
    { type: "TUNNEL", label: "Tunnel" },
    { type: "SPLITTER", label: "Splitter" },
  ],
};

/* ── Mini SVG gate thumbnails ── */
function GateThumb({ type }: { type: GateType }) {
  const s = "#22c55e";       // stroke / signal-high
  const f = "#18181b";       // body fill
  const lo = "#52525b";      // low / inactive
  const lbl = "#71717a";     // label text
  const w = 1.2;

  switch (type) {
    /* ─── Logic gates (existing) ─── */
    case "AND":
      return (
        <svg viewBox="0 0 60 40" className="w-full h-full">
          <path d="M8,6 L32,6 Q50,6 50,20 Q50,34 32,34 L8,34 Z" fill={f} stroke={s} strokeWidth={w} />
          <line x1="0" y1="12" x2="8" y2="12" stroke={lo} strokeWidth={w} />
          <line x1="0" y1="28" x2="8" y2="28" stroke={lo} strokeWidth={w} />
          <line x1="50" y1="20" x2="60" y2="20" stroke={s} strokeWidth={w} />
        </svg>
      );
    case "OR":
      return (
        <svg viewBox="0 0 60 40" className="w-full h-full">
          <path d="M6,6 Q16,6 32,6 Q52,6 52,20 Q52,34 32,34 Q16,34 6,34 Q18,20 6,6 Z" fill={f} stroke={s} strokeWidth={w} />
          <line x1="0" y1="12" x2="10" y2="12" stroke={lo} strokeWidth={w} />
          <line x1="0" y1="28" x2="10" y2="28" stroke={lo} strokeWidth={w} />
          <line x1="52" y1="20" x2="60" y2="20" stroke={s} strokeWidth={w} />
        </svg>
      );
    case "NOT":
      return (
        <svg viewBox="0 0 60 40" className="w-full h-full">
          <path d="M6,6 L46,20 L6,34 Z" fill={f} stroke={s} strokeWidth={w} />
          <circle cx="49" cy="20" r="3" fill={f} stroke={s} strokeWidth={w} />
          <line x1="0" y1="20" x2="6" y2="20" stroke={lo} strokeWidth={w} />
          <line x1="52" y1="20" x2="60" y2="20" stroke={s} strokeWidth={w} />
        </svg>
      );
    case "NAND":
      return (
        <svg viewBox="0 0 60 40" className="w-full h-full">
          <path d="M8,6 L30,6 Q46,6 46,20 Q46,34 30,34 L8,34 Z" fill={f} stroke={s} strokeWidth={w} />
          <circle cx="49" cy="20" r="3" fill={f} stroke={s} strokeWidth={w} />
          <line x1="0" y1="12" x2="8" y2="12" stroke={lo} strokeWidth={w} />
          <line x1="0" y1="28" x2="8" y2="28" stroke={lo} strokeWidth={w} />
          <line x1="52" y1="20" x2="60" y2="20" stroke={s} strokeWidth={w} />
        </svg>
      );
    case "NOR":
      return (
        <svg viewBox="0 0 60 40" className="w-full h-full">
          <path d="M6,6 Q16,6 32,6 Q48,6 48,20 Q48,34 32,34 Q16,34 6,34 Q18,20 6,6 Z" fill={f} stroke={s} strokeWidth={w} />
          <circle cx="51" cy="20" r="3" fill={f} stroke={s} strokeWidth={w} />
          <line x1="0" y1="12" x2="10" y2="12" stroke={lo} strokeWidth={w} />
          <line x1="0" y1="28" x2="10" y2="28" stroke={lo} strokeWidth={w} />
          <line x1="54" y1="20" x2="60" y2="20" stroke={s} strokeWidth={w} />
        </svg>
      );
    case "XOR":
      return (
        <svg viewBox="0 0 60 40" className="w-full h-full">
          <path d="M8,6 Q18,6 34,6 Q52,6 52,20 Q52,34 34,34 Q18,34 8,34 Q20,20 8,6 Z" fill={f} stroke={s} strokeWidth={w} />
          <path d="M3,6 Q15,20 3,34" fill="none" stroke={s} strokeWidth={w} />
          <line x1="0" y1="12" x2="10" y2="12" stroke={lo} strokeWidth={w} />
          <line x1="0" y1="28" x2="10" y2="28" stroke={lo} strokeWidth={w} />
          <line x1="52" y1="20" x2="60" y2="20" stroke={s} strokeWidth={w} />
        </svg>
      );
    case "XNOR":
      return (
        <svg viewBox="0 0 60 40" className="w-full h-full">
          <path d="M8,6 Q18,6 34,6 Q48,6 48,20 Q48,34 34,34 Q18,34 8,34 Q20,20 8,6 Z" fill={f} stroke={s} strokeWidth={w} />
          <path d="M3,6 Q15,20 3,34" fill="none" stroke={s} strokeWidth={w} />
          <circle cx="51" cy="20" r="3" fill={f} stroke={s} strokeWidth={w} />
          <line x1="0" y1="12" x2="10" y2="12" stroke={lo} strokeWidth={w} />
          <line x1="0" y1="28" x2="10" y2="28" stroke={lo} strokeWidth={w} />
          <line x1="54" y1="20" x2="60" y2="20" stroke={s} strokeWidth={w} />
        </svg>
      );
    case "BUFFER":
      return (
        <svg viewBox="0 0 60 40" className="w-full h-full">
          <path d="M8,6 L48,20 L8,34 Z" fill={f} stroke={s} strokeWidth={w} />
          <line x1="0" y1="20" x2="8" y2="20" stroke={lo} strokeWidth={w} />
          <line x1="48" y1="20" x2="60" y2="20" stroke={s} strokeWidth={w} />
        </svg>
      );

    /* ─── I/O (existing) ─── */
    case "INPUT":
      return (
        <svg viewBox="0 0 60 40" className="w-full h-full">
          <rect x="4" y="8" width="44" height="24" rx="5" fill={f} stroke={s} strokeWidth={w} />
          <rect x="26" y="13" width="16" height="14" rx="3" fill={s} />
          <text x="26" y="24" textAnchor="middle" fill={f} fontSize="10" fontFamily="monospace" fontWeight="bold">1</text>
          <line x1="48" y1="20" x2="60" y2="20" stroke={s} strokeWidth={w} />
        </svg>
      );
    case "OUTPUT":
      return (
        <svg viewBox="0 0 60 40" className="w-full h-full">
          <line x1="0" y1="20" x2="14" y2="20" stroke={lo} strokeWidth={w} />
          <circle cx="34" cy="20" r="14" fill={f} stroke={s} strokeWidth={w} />
          <circle cx="34" cy="20" r="8" fill={s} opacity="0.3" />
          <text x="34" y="24" textAnchor="middle" fill={s} fontSize="10" fontFamily="monospace" fontWeight="bold">1</text>
        </svg>
      );

    /* ─── I/O (new) ─── */
    case "BUTTON":
      return (
        <svg viewBox="0 0 60 40" className="w-full h-full">
          <rect x="12" y="4" width="36" height="32" rx="3" fill={f} stroke={s} strokeWidth={w} />
          <circle cx="30" cy="20" r="9" fill="none" stroke={s} strokeWidth={w} />
          <circle cx="30" cy="20" r="4" fill={s} opacity="0.5" />
          <line x1="48" y1="20" x2="60" y2="20" stroke={s} strokeWidth={w} />
        </svg>
      );
    case "SEVEN_SEGMENT":
      return (
        <svg viewBox="0 0 60 40" className="w-full h-full">
          <rect x="10" y="3" width="40" height="34" rx="3" fill={f} stroke={s} strokeWidth={w} />
          {/* 7-segment "8": a(top) b(tr) c(br) d(bot) e(bl) f(tl) g(mid) */}
          <line x1="23" y1="8" x2="37" y2="8" stroke={s} strokeWidth={2} strokeLinecap="round" />
          <line x1="38" y1="9" x2="38" y2="19" stroke={s} strokeWidth={2} strokeLinecap="round" />
          <line x1="38" y1="21" x2="38" y2="31" stroke={s} strokeWidth={2} strokeLinecap="round" />
          <line x1="23" y1="32" x2="37" y2="32" stroke={s} strokeWidth={2} strokeLinecap="round" />
          <line x1="22" y1="21" x2="22" y2="31" stroke={s} strokeWidth={2} strokeLinecap="round" />
          <line x1="22" y1="9" x2="22" y2="19" stroke={s} strokeWidth={2} strokeLinecap="round" />
          <line x1="23" y1="20" x2="37" y2="20" stroke={s} strokeWidth={2} strokeLinecap="round" />
        </svg>
      );
    case "HEX_DISPLAY":
      return (
        <svg viewBox="0 0 60 40" className="w-full h-full">
          <rect x="10" y="4" width="40" height="32" rx="3" fill={f} stroke={s} strokeWidth={w} />
          <text x="30" y="26" textAnchor="middle" fill={s} fontSize="16" fontFamily="monospace" fontWeight="bold">F</text>
        </svg>
      );
    case "LED_MATRIX":
      return (
        <svg viewBox="0 0 60 40" className="w-full h-full">
          <rect x="10" y="4" width="40" height="32" rx="3" fill={f} stroke={s} strokeWidth={w} />
          {/* 3x3 grid of dots */}
          {[0, 1, 2].map(r =>
            [0, 1, 2].map(c => (
              <circle key={`${r}-${c}`} cx={22 + c * 8} cy={12 + r * 8} r="2.5"
                fill={r === 1 && c === 1 ? s : lo} opacity={r === 1 && c === 1 ? 1 : 0.6} />
            ))
          )}
        </svg>
      );

    /* ─── Plexers (MUX_2TO1 existing) ─── */
    case "MUX_2TO1":
      return (
        <svg viewBox="0 0 60 40" className="w-full h-full">
          {/* Trapezoid: narrow left, wide right */}
          <path d="M8,8 L8,32 L48,36 L48,4 Z" fill={f} stroke={s} strokeWidth={w} />
          <line x1="0" y1="14" x2="8" y2="14" stroke={lo} strokeWidth={w} />
          <line x1="0" y1="26" x2="8" y2="26" stroke={lo} strokeWidth={w} />
          <line x1="28" y1="36" x2="28" y2="40" stroke={lo} strokeWidth={w} />
          <text x="28" y="39" textAnchor="middle" fill={lbl} fontSize="6" fontFamily="monospace">S</text>
          <line x1="48" y1="20" x2="60" y2="20" stroke={s} strokeWidth={w} />
        </svg>
      );
    case "MUX_4TO1":
      return (
        <svg viewBox="0 0 60 40" className="w-full h-full">
          <path d="M8,4 L8,36 L48,38 L48,2 Z" fill={f} stroke={s} strokeWidth={w} />
          <line x1="0" y1="9" x2="8" y2="9" stroke={lo} strokeWidth={w} />
          <line x1="0" y1="16" x2="8" y2="16" stroke={lo} strokeWidth={w} />
          <line x1="0" y1="24" x2="8" y2="24" stroke={lo} strokeWidth={w} />
          <line x1="0" y1="31" x2="8" y2="31" stroke={lo} strokeWidth={w} />
          <line x1="28" y1="38" x2="28" y2="40" stroke={lo} strokeWidth={w} />
          <text x="28" y="39" textAnchor="middle" fill={lbl} fontSize="6" fontFamily="monospace">S</text>
          <line x1="48" y1="20" x2="60" y2="20" stroke={s} strokeWidth={w} />
        </svg>
      );
    case "MUX_8TO1":
      return (
        <svg viewBox="0 0 60 40" className="w-full h-full">
          <path d="M8,2 L8,38 L48,40 L48,0 Z" fill={f} stroke={s} strokeWidth={w} />
          <line x1="0" y1="6" x2="8" y2="6" stroke={lo} strokeWidth={w} />
          <line x1="0" y1="11" x2="8" y2="11" stroke={lo} strokeWidth={w} />
          <line x1="0" y1="16" x2="8" y2="16" stroke={lo} strokeWidth={w} />
          {/* dots indicating more inputs */}
          <circle cx="4" cy="21" r="0.8" fill={lo} />
          <circle cx="4" cy="24" r="0.8" fill={lo} />
          <circle cx="4" cy="27" r="0.8" fill={lo} />
          <line x1="0" y1="31" x2="8" y2="31" stroke={lo} strokeWidth={w} />
          <line x1="0" y1="36" x2="8" y2="36" stroke={lo} strokeWidth={w} />
          <line x1="48" y1="20" x2="60" y2="20" stroke={s} strokeWidth={w} />
        </svg>
      );
    case "DEMUX_1TO4":
      return (
        <svg viewBox="0 0 60 40" className="w-full h-full">
          {/* Inverted trapezoid: wide left, narrow right */}
          <path d="M12,4 L12,36 L52,32 L52,8 Z" fill={f} stroke={s} strokeWidth={w} />
          <line x1="0" y1="20" x2="12" y2="20" stroke={lo} strokeWidth={w} />
          <line x1="52" y1="12" x2="60" y2="12" stroke={s} strokeWidth={w} />
          <line x1="52" y1="18" x2="60" y2="18" stroke={s} strokeWidth={w} />
          <line x1="52" y1="24" x2="60" y2="24" stroke={s} strokeWidth={w} />
          <line x1="52" y1="30" x2="60" y2="30" stroke={s} strokeWidth={w} />
          <line x1="32" y1="36" x2="32" y2="40" stroke={lo} strokeWidth={w} />
          <text x="32" y="39" textAnchor="middle" fill={lbl} fontSize="6" fontFamily="monospace">S</text>
        </svg>
      );
    case "DECODER_2TO4":
      return (
        <svg viewBox="0 0 60 40" className="w-full h-full">
          <rect x="8" y="2" width="44" height="36" rx={3} fill={f} stroke={s} strokeWidth={w} />
          <text x="30" y="24" textAnchor="middle" fill={s} fontSize="9" fontFamily="monospace" fontWeight="bold">DEC</text>
          <line x1="0" y1="12" x2="8" y2="12" stroke={lo} strokeWidth={w} />
          <line x1="0" y1="28" x2="8" y2="28" stroke={lo} strokeWidth={w} />
          <line x1="52" y1="8" x2="60" y2="8" stroke={s} strokeWidth={w} />
          <line x1="52" y1="16" x2="60" y2="16" stroke={s} strokeWidth={w} />
          <line x1="52" y1="24" x2="60" y2="24" stroke={s} strokeWidth={w} />
          <line x1="52" y1="32" x2="60" y2="32" stroke={s} strokeWidth={w} />
        </svg>
      );
    case "PRIORITY_ENCODER":
      return (
        <svg viewBox="0 0 60 40" className="w-full h-full">
          <rect x="8" y="4" width="44" height="32" rx={3} fill={f} stroke={s} strokeWidth={w} />
          <text x="26" y="17" textAnchor="middle" fill={lbl} fontSize="7" fontFamily="monospace">PRI</text>
          {/* right-pointing arrow */}
          <path d="M20,24 L38,24 L34,20 M38,24 L34,28" fill="none" stroke={s} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
          <line x1="0" y1="12" x2="8" y2="12" stroke={lo} strokeWidth={w} />
          <line x1="0" y1="20" x2="8" y2="20" stroke={lo} strokeWidth={w} />
          <line x1="0" y1="28" x2="8" y2="28" stroke={lo} strokeWidth={w} />
          <line x1="52" y1="15" x2="60" y2="15" stroke={s} strokeWidth={w} />
          <line x1="52" y1="25" x2="60" y2="25" stroke={s} strokeWidth={w} />
        </svg>
      );
    case "BIT_SELECTOR":
      return (
        <svg viewBox="0 0 60 40" className="w-full h-full">
          <rect x="8" y="4" width="44" height="32" rx={3} fill={f} stroke={s} strokeWidth={w} />
          {/* Array of bits on left side */}
          {[0, 1, 2, 3].map(i => (
            <rect key={i} x="14" y={10 + i * 6} width="8" height="4" rx="1" fill={i === 1 ? s : lo} opacity={i === 1 ? 1 : 0.4} stroke="none" />
          ))}
          {/* Arrow pulling one bit out */}
          <path d="M22,15 L40,20" fill="none" stroke={s} strokeWidth={w} strokeLinecap="round" />
          <circle cx="42" cy="20" r="3" fill={s} opacity="0.4" stroke={s} strokeWidth={w} />
          <line x1="0" y1="20" x2="8" y2="20" stroke={lo} strokeWidth={w} />
          <line x1="30" y1="36" x2="30" y2="40" stroke={lo} strokeWidth={w} />
          <line x1="52" y1="20" x2="60" y2="20" stroke={s} strokeWidth={w} />
        </svg>
      );

    /* ─── Arithmetic (FULL_ADDER existing) ─── */
    case "FULL_ADDER":
      return (
        <svg viewBox="0 0 60 40" className="w-full h-full">
          <rect x="8" y="4" width="44" height="32" rx={3} fill={f} stroke={s} strokeWidth={w} />
          <text x="30" y="24" textAnchor="middle" fill={s} fontSize="9" fontFamily="monospace" fontWeight="bold">FA</text>
          <line x1="0" y1="10" x2="8" y2="10" stroke={lo} strokeWidth={w} />
          <line x1="0" y1="20" x2="8" y2="20" stroke={lo} strokeWidth={w} />
          <line x1="0" y1="30" x2="8" y2="30" stroke={lo} strokeWidth={w} />
          <line x1="52" y1="15" x2="60" y2="15" stroke={s} strokeWidth={w} />
          <line x1="52" y1="25" x2="60" y2="25" stroke={s} strokeWidth={w} />
        </svg>
      );
    case "SUBTRACTOR":
      return (
        <svg viewBox="0 0 60 40" className="w-full h-full">
          <rect x="8" y="4" width="44" height="32" rx={3} fill={f} stroke={s} strokeWidth={w} />
          <text x="30" y="26" textAnchor="middle" fill={s} fontSize="18" fontFamily="monospace" fontWeight="bold">&minus;</text>
          <line x1="0" y1="12" x2="8" y2="12" stroke={lo} strokeWidth={w} />
          <line x1="0" y1="28" x2="8" y2="28" stroke={lo} strokeWidth={w} />
          <line x1="52" y1="20" x2="60" y2="20" stroke={s} strokeWidth={w} />
        </svg>
      );
    case "MULTIPLIER":
      return (
        <svg viewBox="0 0 60 40" className="w-full h-full">
          <rect x="8" y="4" width="44" height="32" rx={3} fill={f} stroke={s} strokeWidth={w} />
          <text x="30" y="26" textAnchor="middle" fill={s} fontSize="16" fontFamily="monospace" fontWeight="bold">&times;</text>
          <line x1="0" y1="12" x2="8" y2="12" stroke={lo} strokeWidth={w} />
          <line x1="0" y1="28" x2="8" y2="28" stroke={lo} strokeWidth={w} />
          <line x1="52" y1="20" x2="60" y2="20" stroke={s} strokeWidth={w} />
        </svg>
      );
    case "DIVIDER":
      return (
        <svg viewBox="0 0 60 40" className="w-full h-full">
          <rect x="8" y="4" width="44" height="32" rx={3} fill={f} stroke={s} strokeWidth={w} />
          <text x="30" y="26" textAnchor="middle" fill={s} fontSize="16" fontFamily="monospace" fontWeight="bold">&divide;</text>
          <line x1="0" y1="12" x2="8" y2="12" stroke={lo} strokeWidth={w} />
          <line x1="0" y1="28" x2="8" y2="28" stroke={lo} strokeWidth={w} />
          <line x1="52" y1="20" x2="60" y2="20" stroke={s} strokeWidth={w} />
        </svg>
      );
    case "NEGATOR":
      return (
        <svg viewBox="0 0 60 40" className="w-full h-full">
          <rect x="8" y="4" width="44" height="32" rx={3} fill={f} stroke={s} strokeWidth={w} />
          <text x="30" y="26" textAnchor="middle" fill={s} fontSize="14" fontFamily="monospace" fontWeight="bold">~</text>
          <line x1="0" y1="20" x2="8" y2="20" stroke={lo} strokeWidth={w} />
          <line x1="52" y1="20" x2="60" y2="20" stroke={s} strokeWidth={w} />
        </svg>
      );
    case "COMPARATOR":
      return (
        <svg viewBox="0 0 60 40" className="w-full h-full">
          <rect x="8" y="4" width="44" height="32" rx={3} fill={f} stroke={s} strokeWidth={w} />
          {/* Three comparison symbols stacked */}
          <text x="30" y="15" textAnchor="middle" fill={s} fontSize="7" fontFamily="monospace" fontWeight="bold">&lt;</text>
          <text x="30" y="23" textAnchor="middle" fill={s} fontSize="7" fontFamily="monospace" fontWeight="bold">=</text>
          <text x="30" y="31" textAnchor="middle" fill={s} fontSize="7" fontFamily="monospace" fontWeight="bold">&gt;</text>
          <line x1="0" y1="14" x2="8" y2="14" stroke={lo} strokeWidth={w} />
          <line x1="0" y1="26" x2="8" y2="26" stroke={lo} strokeWidth={w} />
          <line x1="52" y1="10" x2="60" y2="10" stroke={s} strokeWidth={w} />
          <line x1="52" y1="20" x2="60" y2="20" stroke={s} strokeWidth={w} />
          <line x1="52" y1="30" x2="60" y2="30" stroke={s} strokeWidth={w} />
        </svg>
      );
    case "SHIFTER":
      return (
        <svg viewBox="0 0 60 40" className="w-full h-full">
          <rect x="8" y="4" width="44" height="32" rx={3} fill={f} stroke={s} strokeWidth={w} />
          {/* Triple right-shift arrows */}
          <path d="M18,20 L26,20 M23,16 L27,20 L23,24" fill="none" stroke={s} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M28,20 L36,20 M33,16 L37,20 L33,24" fill="none" stroke={s} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M38,20 L46,20 M43,16 L47,20 L43,24" fill="none" stroke={s} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
          <line x1="0" y1="20" x2="8" y2="20" stroke={lo} strokeWidth={w} />
          <line x1="52" y1="20" x2="60" y2="20" stroke={s} strokeWidth={w} />
        </svg>
      );
    case "BIT_ADDER":
      return (
        <svg viewBox="0 0 60 40" className="w-full h-full">
          <rect x="8" y="4" width="44" height="32" rx={3} fill={f} stroke={s} strokeWidth={w} />
          <text x="30" y="26" textAnchor="middle" fill={s} fontSize="18" fontFamily="monospace" fontWeight="bold">+</text>
          <line x1="0" y1="14" x2="8" y2="14" stroke={lo} strokeWidth={w} />
          <line x1="0" y1="26" x2="8" y2="26" stroke={lo} strokeWidth={w} />
          <line x1="52" y1="15" x2="60" y2="15" stroke={s} strokeWidth={w} />
          <line x1="52" y1="25" x2="60" y2="25" stroke={s} strokeWidth={w} />
        </svg>
      );

    /* ─── Memory / Sequential ─── */
    case "D_FLIP_FLOP":
      return (
        <svg viewBox="0 0 60 40" className="w-full h-full">
          <rect x="12" y="4" width="36" height="32" rx={2} fill={f} stroke={s} strokeWidth={w} />
          <text x="18" y="22" textAnchor="middle" fill={lbl} fontSize="8" fontFamily="monospace" fontWeight="bold">D</text>
          <text x="42" y="22" textAnchor="middle" fill={s} fontSize="8" fontFamily="monospace" fontWeight="bold">Q</text>
          {/* Clock triangle */}
          <path d="M12,30 L17,26 L12,22" fill="none" stroke={s} strokeWidth={w} strokeLinejoin="round" />
          <line x1="0" y1="16" x2="12" y2="16" stroke={lo} strokeWidth={w} />
          <line x1="0" y1="26" x2="12" y2="26" stroke={lo} strokeWidth={w} />
          <line x1="48" y1="16" x2="60" y2="16" stroke={s} strokeWidth={w} />
        </svg>
      );
    case "T_FLIP_FLOP":
      return (
        <svg viewBox="0 0 60 40" className="w-full h-full">
          <rect x="12" y="4" width="36" height="32" rx={2} fill={f} stroke={s} strokeWidth={w} />
          <text x="18" y="22" textAnchor="middle" fill={lbl} fontSize="8" fontFamily="monospace" fontWeight="bold">T</text>
          <text x="42" y="22" textAnchor="middle" fill={s} fontSize="8" fontFamily="monospace" fontWeight="bold">Q</text>
          <path d="M12,30 L17,26 L12,22" fill="none" stroke={s} strokeWidth={w} strokeLinejoin="round" />
          <line x1="0" y1="16" x2="12" y2="16" stroke={lo} strokeWidth={w} />
          <line x1="0" y1="26" x2="12" y2="26" stroke={lo} strokeWidth={w} />
          <line x1="48" y1="16" x2="60" y2="16" stroke={s} strokeWidth={w} />
        </svg>
      );
    case "JK_FLIP_FLOP":
      return (
        <svg viewBox="0 0 60 40" className="w-full h-full">
          <rect x="12" y="4" width="36" height="32" rx={2} fill={f} stroke={s} strokeWidth={w} />
          <text x="18" y="16" textAnchor="middle" fill={lbl} fontSize="7" fontFamily="monospace" fontWeight="bold">J</text>
          <text x="18" y="30" textAnchor="middle" fill={lbl} fontSize="7" fontFamily="monospace" fontWeight="bold">K</text>
          <text x="42" y="22" textAnchor="middle" fill={s} fontSize="8" fontFamily="monospace" fontWeight="bold">Q</text>
          <path d="M12,32 L17,28 L12,24" fill="none" stroke={s} strokeWidth={w} strokeLinejoin="round" />
          <line x1="0" y1="12" x2="12" y2="12" stroke={lo} strokeWidth={w} />
          <line x1="0" y1="28" x2="12" y2="28" stroke={lo} strokeWidth={w} />
          <line x1="48" y1="16" x2="60" y2="16" stroke={s} strokeWidth={w} />
        </svg>
      );
    case "SR_FLIP_FLOP":
      return (
        <svg viewBox="0 0 60 40" className="w-full h-full">
          <rect x="12" y="4" width="36" height="32" rx={2} fill={f} stroke={s} strokeWidth={w} />
          <text x="18" y="16" textAnchor="middle" fill={lbl} fontSize="7" fontFamily="monospace" fontWeight="bold">S</text>
          <text x="18" y="30" textAnchor="middle" fill={lbl} fontSize="7" fontFamily="monospace" fontWeight="bold">R</text>
          <text x="42" y="22" textAnchor="middle" fill={s} fontSize="8" fontFamily="monospace" fontWeight="bold">Q</text>
          <path d="M12,32 L17,28 L12,24" fill="none" stroke={s} strokeWidth={w} strokeLinejoin="round" />
          <line x1="0" y1="12" x2="12" y2="12" stroke={lo} strokeWidth={w} />
          <line x1="0" y1="28" x2="12" y2="28" stroke={lo} strokeWidth={w} />
          <line x1="48" y1="16" x2="60" y2="16" stroke={s} strokeWidth={w} />
        </svg>
      );
    case "REGISTER":
      return (
        <svg viewBox="0 0 60 40" className="w-full h-full">
          <rect x="6" y="4" width="48" height="32" rx={2} fill={f} stroke={s} strokeWidth={w} />
          <text x="30" y="18" textAnchor="middle" fill={s} fontSize="9" fontFamily="monospace" fontWeight="bold">REG</text>
          {/* Multiple data pins */}
          <line x1="0" y1="10" x2="6" y2="10" stroke={lo} strokeWidth={w} />
          <line x1="0" y1="18" x2="6" y2="18" stroke={lo} strokeWidth={w} />
          <line x1="0" y1="26" x2="6" y2="26" stroke={lo} strokeWidth={w} />
          <line x1="54" y1="10" x2="60" y2="10" stroke={s} strokeWidth={w} />
          <line x1="54" y1="18" x2="60" y2="18" stroke={s} strokeWidth={w} />
          <line x1="54" y1="26" x2="60" y2="26" stroke={s} strokeWidth={w} />
          {/* Clock triangle at bottom */}
          <path d="M6,32 L11,28 L6,24" fill="none" stroke={s} strokeWidth={w} strokeLinejoin="round" />
          <text x="30" y="31" textAnchor="middle" fill={lbl} fontSize="6" fontFamily="monospace">CLK</text>
        </svg>
      );
    case "COUNTER":
      return (
        <svg viewBox="0 0 60 40" className="w-full h-full">
          <rect x="8" y="4" width="44" height="32" rx={2} fill={f} stroke={s} strokeWidth={w} />
          <text x="30" y="18" textAnchor="middle" fill={s} fontSize="9" fontFamily="monospace" fontWeight="bold">CTR</text>
          {/* Rising-edge triangle */}
          <path d="M8,32 L13,28 L8,24" fill="none" stroke={s} strokeWidth={w} strokeLinejoin="round" />
          {/* Step count indicator */}
          <text x="30" y="30" textAnchor="middle" fill={lbl} fontSize="7" fontFamily="monospace">0..N</text>
          <line x1="52" y1="12" x2="60" y2="12" stroke={s} strokeWidth={w} />
          <line x1="52" y1="20" x2="60" y2="20" stroke={s} strokeWidth={w} />
          <line x1="52" y1="28" x2="60" y2="28" stroke={s} strokeWidth={w} />
        </svg>
      );
    case "SHIFT_REGISTER":
      return (
        <svg viewBox="0 0 60 40" className="w-full h-full">
          <rect x="4" y="6" width="52" height="28" rx={2} fill={f} stroke={s} strokeWidth={w} />
          {/* Cascading arrows */}
          <path d="M12,20 L18,20 M16,17 L19,20 L16,23" fill="none" stroke={s} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M22,20 L28,20 M26,17 L29,20 L26,23" fill="none" stroke={s} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M32,20 L38,20 M36,17 L39,20 L36,23" fill="none" stroke={s} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M42,20 L48,20 M46,17 L49,20 L46,23" fill="none" stroke={s} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
          {/* Clock triangle */}
          <path d="M4,30 L9,26 L4,22" fill="none" stroke={s} strokeWidth={w} strokeLinejoin="round" />
        </svg>
      );

    /* ─── Wiring ─── */
    case "CLOCK":
      return (
        <svg viewBox="0 0 60 40" className="w-full h-full">
          {/* Square wave: 3 pulses */}
          <polyline points="4,28 4,12 14,12 14,28 24,28 24,12 34,12 34,28 44,28 44,12 54,12 54,28"
            fill="none" stroke={s} strokeWidth={1.5} strokeLinejoin="miter" />
          <line x1="54" y1="20" x2="60" y2="20" stroke={s} strokeWidth={w} />
        </svg>
      );
    case "CONSTANT":
      return (
        <svg viewBox="0 0 60 40" className="w-full h-full">
          <circle cx="26" cy="20" r="14" fill={f} stroke={s} strokeWidth={w} />
          <text x="26" y="25" textAnchor="middle" fill={s} fontSize="16" fontFamily="monospace" fontWeight="bold">1</text>
          <line x1="40" y1="20" x2="60" y2="20" stroke={s} strokeWidth={w} />
        </svg>
      );
    case "POWER":
      return (
        <svg viewBox="0 0 60 40" className="w-full h-full">
          {/* VCC symbol: upward arrow */}
          <line x1="30" y1="34" x2="30" y2="10" stroke={s} strokeWidth={1.5} />
          <path d="M24,16 L30,8 L36,16" fill="none" stroke={s} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <text x="30" y="39" textAnchor="middle" fill={lbl} fontSize="6" fontFamily="monospace">VCC</text>
        </svg>
      );
    case "GROUND":
      return (
        <svg viewBox="0 0 60 40" className="w-full h-full">
          {/* Standard ground symbol: vertical line + 3 horizontal lines */}
          <line x1="30" y1="6" x2="30" y2="18" stroke={s} strokeWidth={1.5} />
          <line x1="18" y1="18" x2="42" y2="18" stroke={s} strokeWidth={1.5} />
          <line x1="22" y1="24" x2="38" y2="24" stroke={s} strokeWidth={1.5} />
          <line x1="26" y1="30" x2="34" y2="30" stroke={s} strokeWidth={1.5} />
        </svg>
      );
    case "PROBE":
      return (
        <svg viewBox="0 0 60 40" className="w-full h-full">
          {/* Eye icon: ellipse outline + circle pupil */}
          <ellipse cx="34" cy="20" rx="16" ry="10" fill="none" stroke={s} strokeWidth={w} />
          <circle cx="34" cy="20" r="5" fill={s} opacity="0.4" stroke={s} strokeWidth={w} />
          <circle cx="34" cy="20" r="2" fill={s} />
          <line x1="0" y1="20" x2="18" y2="20" stroke={lo} strokeWidth={w} />
        </svg>
      );
    case "TUNNEL":
      return (
        <svg viewBox="0 0 60 40" className="w-full h-full">
          {/* Pentagon/arrow shape pointing right */}
          <path d="M6,8 L40,8 L52,20 L40,32 L6,32 Z" fill={f} stroke={s} strokeWidth={w} />
          <text x="26" y="24" textAnchor="middle" fill={lbl} fontSize="9" fontFamily="monospace" fontWeight="bold">T</text>
          <line x1="0" y1="20" x2="6" y2="20" stroke={lo} strokeWidth={w} />
        </svg>
      );
    case "SPLITTER":
      return (
        <svg viewBox="0 0 60 40" className="w-full h-full">
          {/* Single line fanning out to 3 */}
          <line x1="0" y1="20" x2="24" y2="20" stroke={lo} strokeWidth={1.5} />
          <circle cx="24" cy="20" r="2" fill={s} />
          <line x1="24" y1="20" x2="54" y2="8" stroke={s} strokeWidth={w} />
          <line x1="24" y1="20" x2="54" y2="20" stroke={s} strokeWidth={w} />
          <line x1="24" y1="20" x2="54" y2="32" stroke={s} strokeWidth={w} />
          <circle cx="54" cy="8" r="1.5" fill={s} />
          <circle cx="54" cy="20" r="1.5" fill={s} />
          <circle cx="54" cy="32" r="1.5" fill={s} />
        </svg>
      );

    /* ─── Controlled gates ─── */
    case "CONTROLLED_BUFFER":
      return (
        <svg viewBox="0 0 60 40" className="w-full h-full">
          {/* Buffer triangle with enable line */}
          <path d="M8,6 L48,20 L8,34 Z" fill={f} stroke={s} strokeWidth={w} />
          <line x1="0" y1="20" x2="8" y2="20" stroke={lo} strokeWidth={w} />
          <line x1="48" y1="20" x2="60" y2="20" stroke={s} strokeWidth={w} />
          {/* Enable line from bottom */}
          <line x1="28" y1="40" x2="28" y2="26" stroke={lo} strokeWidth={w} />
          <text x="28" y="39" textAnchor="middle" fill={lbl} fontSize="6" fontFamily="monospace">EN</text>
        </svg>
      );
    case "CONTROLLED_INVERTER":
      return (
        <svg viewBox="0 0 60 40" className="w-full h-full">
          {/* NOT triangle with bubble + enable line */}
          <path d="M6,6 L42,20 L6,34 Z" fill={f} stroke={s} strokeWidth={w} />
          <circle cx="45" cy="20" r="3" fill={f} stroke={s} strokeWidth={w} />
          <line x1="0" y1="20" x2="6" y2="20" stroke={lo} strokeWidth={w} />
          <line x1="48" y1="20" x2="60" y2="20" stroke={s} strokeWidth={w} />
          {/* Enable line from bottom */}
          <line x1="24" y1="40" x2="24" y2="26" stroke={lo} strokeWidth={w} />
          <text x="24" y="39" textAnchor="middle" fill={lbl} fontSize="6" fontFamily="monospace">EN</text>
        </svg>
      );

    /* ─── Fallback (should never be reached now) ─── */
    default:
      return (
        <svg viewBox="0 0 60 40" className="w-full h-full">
          <rect x="4" y="4" width="52" height="32" rx="4" fill={f} stroke={lo} strokeWidth={w} />
          <text x="30" y="24" textAnchor="middle" fill={lbl} fontSize="8" fontFamily="monospace" fontWeight="bold">
            {(type as string).replace(/_/g, " ").slice(0, 6)}
          </text>
        </svg>
      );
  }
}

/* ── Dropdown group header (< prev | Title ▾ | next >) ── */
function GroupHeader({
  activeGroup,
  onChangeGroup,
}: {
  activeGroup: GroupId;
  onChangeGroup: (id: GroupId) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentIndex = GROUPS.findIndex((g) => g.id === activeGroup);
  const current = GROUPS[currentIndex];
  const Icon = current.icon;

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const goPrev = () => {
    const prev = currentIndex <= 0 ? GROUPS.length - 1 : currentIndex - 1;
    onChangeGroup(GROUPS[prev].id);
  };
  const goNext = () => {
    const next = currentIndex >= GROUPS.length - 1 ? 0 : currentIndex + 1;
    onChangeGroup(GROUPS[next].id);
  };

  return (
    <div className="shrink-0 flex items-center gap-1 px-3 py-2 border-b border-white/5">
      <button
        onClick={goPrev}
        className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.06] transition-colors"
      >
        <ChevronLeft size={16} />
      </button>

      <div ref={ref} className="relative flex-1 min-w-0">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-[13px] font-medium text-zinc-200 hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          <Icon size={14} className="shrink-0 text-zinc-400" />
          <span className="truncate">{current.label}</span>
          <ChevronDown
            size={14}
            className={`shrink-0 text-zinc-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-zinc-800 border border-white/10 rounded-xl shadow-2xl py-1.5">
            {GROUPS.map((group) => {
              const GIcon = group.icon;
              const isActive = group.id === activeGroup;
              return (
                <button
                  key={group.id}
                  onClick={() => {
                    onChangeGroup(group.id);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-[13px] transition-colors ${
                    isActive
                      ? "bg-green-500/10 text-green-400"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06]"
                  }`}
                >
                  <GIcon size={15} className="shrink-0" />
                  <span className="truncate">{group.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <button
        onClick={goNext}
        className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.06] transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

/* ── Gate grid (shared by all sub-tabs) ── */
function GateGrid({
  items,
  placingType,
  onSelect,
}: {
  items: PaletteItem[];
  placingType: GateType | null;
  onSelect: (type: GateType) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {items.map(({ type, label }) => {
        const active = placingType === type;
        return (
          <button
            key={type}
            draggable
            onDragStart={(e) => e.dataTransfer.setData("gate-type", type)}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all border cursor-grab active:cursor-grabbing ${
              active
                ? "bg-zinc-800 border-primary ring-1 ring-primary/30"
                : "border-zinc-800/50 hover:bg-zinc-800/60 hover:border-zinc-700"
            }`}
            onClick={() => onSelect(type)}
          >
            <div className="w-full aspect-[3/2]">
              <GateThumb type={type} />
            </div>
            <span className={`text-[10px] font-medium ${active ? "text-primary" : "text-zinc-300"}`}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ── Main palette ── */
export default function ComponentPalette() {
  const { setPlacingType, setSelectedTool, placingType } = useCircuitStore();
  const [activeGroup, setActiveGroup] = useState<GroupId>("gates");
  const [activeSubTab, setActiveSubTab] = useState("io");
  const [search, setSearch] = useState("");

  const handleSelect = (type: GateType) => {
    setPlacingType(type);
    setSelectedTool("place");
  };

  const filterItems = (items: PaletteItem[]) =>
    items.filter(
      (item) =>
        !search ||
        item.label.toLowerCase().includes(search.toLowerCase()) ||
        item.type.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="h-full flex flex-col">
      {/* Dropdown header */}
      <GroupHeader activeGroup={activeGroup} onChangeGroup={setActiveGroup} />

      {/* Gates group */}
      {activeGroup === "gates" && (
        <>
          {/* Sub-tab pills */}
          <div className="px-2 pt-2">
            <TabNavigation
              tabs={GATE_SUB_TABS}
              activeTab={activeSubTab}
              onTabChange={setActiveSubTab}
              animated
              size="sm"
            />
          </div>

          {/* Search */}
          <div className="px-2 pt-2">
            <PanelSearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search components..."
            />
          </div>



          <div className="flex-1 overflow-y-auto px-2 pt-2 pb-2">
            <GateGrid
              items={filterItems(SUB_TAB_ITEMS[activeSubTab] ?? [])}
              placingType={placingType}
              onSelect={handleSelect}
            />
          </div>


        </>
      )}

      {/* Saved group */}
      {activeGroup === "saved" && (
        <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm px-4 text-center">
          Saved circuits will appear here
        </div>
      )}

      {/* Learn group */}
      {activeGroup === "learn" && (
        <div className="flex-1 overflow-y-auto">
          <ExercisePanel />
        </div>
      )}
    </div>
  );
}
