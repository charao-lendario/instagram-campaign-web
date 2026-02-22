"use client"

import { Badge } from "@/components/ui/badge"

interface SentimentBadgeProps {
  score: number
}

type SentimentVariant = "positive" | "negative" | "neutral"

function getSentimentVariant(score: number): SentimentVariant {
  if (score >= 0.05) return "positive"
  if (score <= -0.05) return "negative"
  return "neutral"
}

const VARIANT_STYLES: Record<SentimentVariant, string> = {
  positive: "bg-green-900/40 text-green-300 border-green-700/50",
  negative: "bg-red-900/40 text-red-300 border-red-700/50",
  neutral: "bg-slate-800/40 text-slate-300 border-slate-600/50",
}

const VARIANT_LABELS: Record<SentimentVariant, string> = {
  positive: "Positivo",
  negative: "Negativo",
  neutral: "Neutro",
}

export function SentimentBadge({ score }: SentimentBadgeProps) {
  const variant = getSentimentVariant(score)

  return (
    <Badge variant="outline" className={VARIANT_STYLES[variant]}>
      {score.toFixed(2)} {VARIANT_LABELS[variant]}
    </Badge>
  )
}
