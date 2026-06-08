"use client";

import { Loader2, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PANEL } from './tokens'

interface PanelActionButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'destructive' | 'accent'
  icon?: LucideIcon
  loading?: boolean
  disabled?: boolean
  className?: string
  fullWidth?: boolean
}

const variantMap = {
  primary: PANEL.btnPrimary,
  secondary: PANEL.btnSecondary,
  destructive: PANEL.btnDestructive,
  accent: PANEL.btnAccent,
}

export function PanelActionButton({ label, onClick, variant = 'primary', icon: Icon, loading, disabled, className, fullWidth }: PanelActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantMap[variant],
        fullWidth && 'w-full',
        className
      )}
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : Icon && <Icon size={14} />}
      {label}
    </button>
  )
}
