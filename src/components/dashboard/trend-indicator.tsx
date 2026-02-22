"use client"

import { ArrowUp, ArrowDown, Minus } from "lucide-react"

interface TrendIndicatorProps {
  direction: "improving" | "declining" | "stable"
  delta: number
}

const TREND_CONFIG = {
  improving: {
    Icon: ArrowUp,
    label: "Melhorando",
    className: "text-green-600",
  },
  declining: {
    Icon: ArrowDown,
    label: "Declinando",
    className: "text-red-600",
  },
  stable: {
    Icon: Minus,
    label: "Estavel",
    className: "text-slate-500",
  },
} as const

export function TrendIndicator({ direction, delta }: TrendIndicatorProps) {
  const { Icon, label, className } = TREND_CONFIG[direction]

  return (
    <div className={`flex items-center gap-1.5 text-sm font-medium ${className}`}>
      <Icon className="h-4 w-4" />
      <span>{label}</span>
      {delta !== 0 && (
        <span className="text-xs text-muted-foreground">
          ({delta > 0 ? "+" : ""}
          {delta.toFixed(2)})
        </span>
      )}
    </div>
  )
}
