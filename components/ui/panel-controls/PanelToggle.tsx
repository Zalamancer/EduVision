"use client";

import { cn } from '@/lib/utils'

interface PanelToggleProps {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
  description?: string
  className?: string
}

export function PanelToggle({ label, checked, onChange, description, className }: PanelToggleProps) {
  return (
    <div className={cn('flex items-center justify-between gap-3 mb-3', className)}>
      <div className="min-w-0">
        <span className="text-sm text-zinc-400">{label}</span>
        {description && <p className="text-xs text-zinc-500 mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200',
          checked ? 'bg-green-500' : 'bg-zinc-700'
        )}
      >
        <span
          className={cn(
            'inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform duration-200',
            checked ? 'translate-x-[18px]' : 'translate-x-[3px]'
          )}
        />
      </button>
    </div>
  )
}
