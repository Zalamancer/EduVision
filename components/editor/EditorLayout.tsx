"use client";

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { TopMenuBar } from './TopMenuBar'
import { useCircuitStore } from '@/lib/stores/circuit-store'

interface EditorLayoutProps {
  leftPanel: React.ReactNode
  centerMain: React.ReactNode
  rightPanel?: React.ReactNode
  splitRight?: React.ReactNode
  showRight?: boolean
  showSplit?: boolean
  onToggleSplit?: () => void
  onToggleRight?: () => void
}

export function EditorLayout({
  leftPanel,
  centerMain,
  rightPanel,
  splitRight,
  showRight = true,
  showSplit = false,
  onToggleSplit,
  onToggleRight,
}: EditorLayoutProps) {
  const { circuit } = useCircuitStore()
  const [circuitName, setCircuitName] = useState('Untitled Circuit')

  useEffect(() => {
    setCircuitName(circuit.name)
  }, [circuit.name])

  const handleNewCircuit = () => {
    useCircuitStore.getState().clearCircuit()
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-zinc-950 overflow-hidden text-zinc-100 font-sans p-1.5 gap-1.5 touch-none overscroll-none">
      <TopMenuBar
        circuitName={circuitName}
        showTruthTable={showSplit}
        showAI={showRight}
        onToggleTruthTable={onToggleSplit || (() => {})}
        onToggleAI={onToggleRight || (() => {})}
        onNewCircuit={handleNewCircuit}
      />

      <div className="flex-1 relative min-h-0">
        {/* Truth table toggle — overlays on the border between left panel and canvas */}
        {onToggleSplit && (
          <button
            onClick={onToggleSplit}
            className="absolute top-1/2 -translate-y-1/2 z-30 w-5 h-12 bg-zinc-700 hover:bg-zinc-600 flex items-center justify-center text-zinc-400 hover:text-zinc-200 transition-colors rounded-r-md"
            style={{ left: showSplit ? 0 : 299 }}
            title={showSplit ? "Hide Truth Table" : "Show Truth Table"}
          >
            {showSplit ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        )}
        <div className="h-full flex overflow-hidden gap-1.5">
          {/* Left Panel — hidden in split mode */}
          {!showSplit && (
            <div className="w-[300px] flex-shrink-0 bg-zinc-900/80 backdrop-blur-xl border border-white/[0.06] rounded-xl overflow-hidden">
              {leftPanel}
            </div>
          )}

          {/* Canvas */}
          <div className="flex-1 min-h-0 bg-zinc-900/40 border border-white/[0.06] rounded-xl overflow-hidden">
            {centerMain}
          </div>

          {/* Split right (Truth Table) — takes half when active */}
          {showSplit && splitRight && (
            <div className="flex-1 min-h-0 bg-zinc-900/80 backdrop-blur-xl border border-white/[0.06] rounded-xl overflow-hidden">
              {splitRight}
            </div>
          )}

          {/* Right Panel (AI Tutor) — hidden in split mode */}
          {!showSplit && showRight && rightPanel && (
            <div className="w-[300px] flex-shrink-0 bg-zinc-900/80 backdrop-blur-xl border border-white/[0.06] rounded-xl overflow-hidden">
              {rightPanel}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
