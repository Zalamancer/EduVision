"use client";

import { cn } from '@/lib/utils'

interface PanelCategoryTabsProps {
  tabs: { id: string; label: string }[]
  activeTab: string
  onTabChange: (id: string) => void
  compact?: boolean
  className?: string
}

export function PanelCategoryTabs({ tabs, activeTab, onTabChange, compact, className }: PanelCategoryTabsProps) {
  return (
    <div className={cn('flex gap-1 mb-3', className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'px-3 rounded-lg text-sm font-medium transition-colors',
              compact ? 'py-1 text-xs' : 'py-1.5',
              isActive
                ? 'bg-zinc-700 text-white'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
            )}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
