"use client";

import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PANEL } from './tokens'

interface PanelInputProps {
  label?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  icon?: LucideIcon
  className?: string
  type?: string
}

export function PanelInput({ label, value, onChange, placeholder, icon: Icon, className, type = 'text' }: PanelInputProps) {
  const input = (
    <div className="relative flex-1">
      {Icon && <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(PANEL.input, 'w-full', Icon && 'pl-9', className)}
      />
    </div>
  )

  if (!label) return <div className="mb-3">{input}</div>

  return (
    <div className="flex items-center gap-3 mb-3 min-w-0">
      <span className={PANEL.labelFixed}>{label}</span>
      {input}
    </div>
  )
}
