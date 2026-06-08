"use client";

import { useRef, useEffect } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface PanelHeaderProps {
  icon: LucideIcon
  title: string
  iconClassName?: string
  trailing?: React.ReactNode
  searchBar?: {
    isOpen: boolean
    onToggle: () => void
    query: string
    onQueryChange: (value: string) => void
    placeholder?: string
    isLoading?: boolean
  }
}

export function PanelHeader({ icon: Icon, title, iconClassName, trailing, searchBar }: PanelHeaderProps) {
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (searchBar?.isOpen) {
      requestAnimationFrame(() => searchInputRef.current?.focus())
    }
  }, [searchBar?.isOpen])

  if (searchBar?.isOpen) {
    return (
      <div className="flex items-center gap-2">
        <Search size={14} className="text-zinc-500 flex-shrink-0" />
        <input
          ref={searchInputRef}
          type="text"
          value={searchBar.query}
          onChange={(e) => searchBar.onQueryChange(e.target.value)}
          placeholder={searchBar.placeholder || 'Search...'}
          className="flex-1 min-w-0 bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
        />
        {searchBar.isLoading && (
          <Loader2 size={14} className="animate-spin text-zinc-500 flex-shrink-0" />
        )}
        <button
          onClick={searchBar.onToggle}
          className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex-shrink-0"
        >
          <X size={14} />
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Icon size={16} className={iconClassName} />
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      {trailing && <div className="ml-auto">{trailing}</div>}
    </div>
  )
}

interface PanelLayoutProps {
  icon: LucideIcon
  title: string
  iconClassName?: string
  trailing?: React.ReactNode
  searchBar?: PanelHeaderProps['searchBar']
  footer?: React.ReactNode
  children: React.ReactNode
}

export function PanelLayout({ icon, title, iconClassName, trailing, searchBar, footer, children }: PanelLayoutProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-none flex items-center min-h-[49px] px-3 py-2 border-b border-white/5">
        <div className="flex-1 min-w-0">
          <PanelHeader icon={icon} title={title} iconClassName={iconClassName} trailing={trailing} searchBar={searchBar} />
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
        {children}
      </div>
      {footer && (
        <div className="shrink-0 border-t border-white/5 px-4 py-3 bg-zinc-900/50 backdrop-blur-sm">
          {footer}
        </div>
      )}
    </div>
  )
}
