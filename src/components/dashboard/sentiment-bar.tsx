"use client"

import type { SentimentDistribution } from "@/lib/types"

interface SentimentBarProps {
  distribution: SentimentDistribution
  totalComments: number
}

interface BarSegment {
  label: string
  count: number
  percentage: number
  colorClass: string
}

export function SentimentBar({ distribution, totalComments }: SentimentBarProps) {
  if (totalComments === 0) {
    return (
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Sem dados de sentimento</p>
      </div>
    )
  }

  const segments: BarSegment[] = [
    {
      label: "Positivo",
      count: distribution.positive,
      percentage: (distribution.positive / totalComments) * 100,
      colorClass: "bg-green-500",
    },
    {
      label: "Negativo",
      count: distribution.negative,
      percentage: (distribution.negative / totalComments) * 100,
      colorClass: "bg-red-500",
    },
    {
      label: "Neutro",
      count: distribution.neutral,
      percentage: (distribution.neutral / totalComments) * 100,
      colorClass: "bg-slate-500",
    },
  ]

  return (
    <div className="space-y-2">
      {segments.map((segment) => (
        <div key={segment.label} className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{segment.label}</span>
            <span className="font-medium text-foreground/80">
              {segment.count} ({segment.percentage.toFixed(1)}%)
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className={`h-full rounded-full transition-all ${segment.colorClass}`}
              style={{ width: `${segment.percentage}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
