"use client";

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { FolderOpen, Save, Download, Upload, FileDown, Film, LogIn, LayoutPanelLeft, MessageCircle, Table2, Plus, X, Sun, Moon, Copy } from 'lucide-react'
import { useThemeStore } from '@/lib/stores/theme-store'
import { useCircuitStore } from '@/lib/stores/circuit-store'
import { parseLogisimCirc } from '@/lib/logisim/parser'
import { exportToLogisimCirc } from '@/lib/logisim/exporter'

interface MenuItem {
  id: string
  label: string
  icon: typeof Save
  shortcut?: string
  onClick: () => void
}

interface MenuSeparator { separator: true }
type MenuEntry = MenuItem | MenuSeparator

interface DropdownMenu { kind: 'dropdown'; id: string; label: string; items: MenuEntry[] }
interface DirectButton { kind: 'direct'; id: string; label: string; onClick: () => void }
type MenuDef = DropdownMenu | DirectButton

interface TopMenuBarProps {
  circuitName: string
  showTruthTable: boolean
  showAI: boolean
  onToggleTruthTable: () => void
  onToggleAI: () => void
  onNewCircuit: () => void
}

export function TopMenuBar({ circuitName, showTruthTable, showAI, onToggleTruthTable, onToggleAI, onNewCircuit }: TopMenuBarProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [hoverMode, setHoverMode] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)
  const circFileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { theme, toggleTheme } = useThemeStore()
  const setCircuit = useCircuitStore((s) => s.setCircuit)
  const circuit = useCircuitStore((s) => s.circuit)

  const handleImportCirc = useCallback(() => {
    circFileInputRef.current?.click()
  }, [])

  const handleCircFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const xmlString = reader.result as string
        const parsed = parseLogisimCirc(xmlString)
        setCircuit(parsed)
      } catch (err) {
        console.error('Failed to parse .circ file:', err)
        alert('Failed to import .circ file. Check console for details.')
      }
    }
    reader.readAsText(file)
    // Reset so the same file can be re-imported
    e.target.value = ''
  }, [setCircuit])

  const handleExportCirc = useCallback(() => {
    try {
      const xmlString = exportToLogisimCirc(circuit)
      const blob = new Blob([xmlString], { type: 'application/xml' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${circuit.name || 'circuit'}.circ`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Failed to export .circ file:', err)
      alert('Failed to export .circ file. Check console for details.')
    }
  }, [circuit])

  useEffect(() => {
    if (!openMenu) return
    const handler = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setOpenMenu(null)
        setHoverMode(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [openMenu])

  useEffect(() => {
    if (!openMenu) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpenMenu(null); setHoverMode(false) }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [openMenu])

  const handleMenuClick = useCallback((menuId: string) => {
    setOpenMenu((prev) => {
      if (prev === menuId) { setHoverMode(false); return null }
      setHoverMode(true)
      return menuId
    })
  }, [])

  const handleMenuHover = useCallback((menuId: string) => {
    if (hoverMode && openMenu) setOpenMenu(menuId)
  }, [hoverMode, openMenu])

  const handleItemClick = useCallback((item: MenuItem) => {
    item.onClick()
    setOpenMenu(null)
    setHoverMode(false)
  }, [])

  const handleDirectClick = useCallback((def: DirectButton) => {
    setOpenMenu(null)
    setHoverMode(false)
    def.onClick()
  }, [])

  const menus: MenuDef[] = [
    {
      kind: 'dropdown', id: 'file', label: 'File',
      items: [
        { id: 'new', label: 'New Circuit', icon: Plus, onClick: onNewCircuit },
        { id: 'load-demo', label: 'Load Demo Circuit', icon: FolderOpen, onClick: async () => {
          try {
            const res = await fetch('/circuits/demo-basic-logic.json');
            const c = await res.json();
            setCircuit(c);
          } catch (e) { console.error(e); }
        }},
        { separator: true },
        { id: 'save', label: 'Save', icon: Save, shortcut: '⌘S', onClick: () => {} },
        { id: 'export', label: 'Export', icon: Download, onClick: () => {} },
        { separator: true },
        { id: 'import-circ', label: 'Import .circ', icon: Upload, onClick: handleImportCirc },
        { id: 'export-circ', label: 'Export .circ', icon: FileDown, onClick: handleExportCirc },
        { separator: true },
        { id: 'copy-json', label: 'Copy Circuit JSON', icon: Copy, shortcut: '⌘⇧C', onClick: () => {
          navigator.clipboard.writeText(JSON.stringify(circuit, null, 2))
        }},
      ],
    },
    {
      kind: 'dropdown', id: 'view', label: 'View',
      items: [
        { id: 'truth-table', label: showTruthTable ? 'Truth Table  ✓' : 'Truth Table', icon: Table2, onClick: onToggleTruthTable },
        { id: 'ai-tutor', label: showAI ? 'AI Tutor  ✓' : 'AI Tutor', icon: MessageCircle, onClick: onToggleAI },
      ],
    },
    { kind: 'direct', id: 'learn', label: 'Learn', onClick: () => router.push('/learn') },
    { kind: 'direct', id: 'dashboard', label: 'Dashboard', onClick: () => router.push('/dashboard') },
  ]

  return (
    <>
    <input ref={circFileInputRef} type="file" accept=".circ" className="hidden" onChange={handleCircFileChange} />
    <div ref={barRef} className="relative z-50 flex items-center h-8 bg-zinc-900/60 backdrop-blur-xl border border-white/[0.06] rounded-xl shrink-0 select-none shadow-sm">
      <div className="flex items-center">
        {menus.map((menu) =>
          menu.kind === 'dropdown' ? (
            <DropdownMenuButton key={menu.id} menu={menu} isOpen={openMenu === menu.id} onClick={() => handleMenuClick(menu.id)} onHover={() => handleMenuHover(menu.id)} onItemClick={handleItemClick} />
          ) : (
            <DirectMenuButton key={menu.id} menu={menu} onClick={() => handleDirectClick(menu)} onHover={() => handleMenuHover(menu.id)} />
          )
        )}
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-3 pr-3">
        <span className="text-xs text-zinc-500 truncate max-w-[180px]">{circuitName}</span>
        <button onClick={toggleTheme} className="flex items-center justify-center w-7 h-7 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-colors" aria-label="Toggle theme">
          {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
        </button>
        <button onClick={() => router.push('/login')} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-colors">
          <LogIn size={13} />
          Sign In
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-green-500 hover:bg-green-400 text-white transition-colors">
          <Film size={12} />
          Export
        </button>
      </div>
    </div>
    </>
  )
}

function DropdownMenuButton({ menu, isOpen, onClick, onHover, onItemClick }: {
  menu: DropdownMenu; isOpen: boolean; onClick: () => void; onHover: () => void; onItemClick: (item: MenuItem) => void
}) {
  return (
    <div className="relative" onMouseEnter={onHover}>
      <button onClick={onClick} className={`px-3 text-xs font-medium transition-all duration-200 rounded-md mx-0.5 mt-0.5 h-7 flex items-center ${isOpen ? 'bg-zinc-800/80 text-zinc-50 shadow-sm' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'}`}>
        {menu.label}
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 z-50 min-w-[200px] py-1.5 bg-zinc-800/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg mt-1">
          {menu.items.map((entry, i) => {
            if ('separator' in entry && entry.separator) return <div key={`sep-${i}`} className="my-1 border-t border-zinc-700/50" />
            const item = entry as MenuItem
            const Icon = item.icon
            return (
              <button key={item.id} onClick={() => onItemClick(item)} className="flex items-center gap-3 px-3 py-2 text-xs transition-colors rounded-md mx-1.5 w-[calc(100%-12px)] text-zinc-300 hover:bg-zinc-700/60 hover:text-zinc-50">
                <Icon size={14} className="shrink-0 text-zinc-500" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.shortcut && <span className="text-[10px] text-zinc-600 ml-4">{item.shortcut}</span>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function DirectMenuButton({ menu, onClick, onHover }: { menu: DirectButton; onClick: () => void; onHover: () => void }) {
  return (
    <div onMouseEnter={onHover}>
      <button onClick={onClick} className="px-3 text-xs font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-all duration-200 rounded-md mx-0.5 mt-0.5 h-7 flex items-center">
        {menu.label}
      </button>
    </div>
  )
}
