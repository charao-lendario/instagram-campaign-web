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
  positive: "bg-green-100 text-green-800 border-green-200",
  negative: "bg-red-100 text-red-800 border-red-200",
  neutral: "bg-slate-100 text-slate-700 border-slate-200",
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
