"use client"

import { Info } from "lucide-react"
import type { Suggestion } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SuggestionCardProps {
  suggestion: Suggestion
}

const PRIORITY_BORDER: Record<Suggestion["priority"], string> = {
  high: "border-l-4 border-l-red-500",
  medium: "border-l-4 border-l-yellow-500",
  low: "border-l-4 border-l-green-500",
}

const PRIORITY_BADGE_LABEL: Record<Suggestion["priority"], string> = {
  high: "Alta",
  medium: "Média",
  low: "Baixa",
}

const PRIORITY_BADGE_CLASS: Record<Suggestion["priority"], string> = {
  high: "bg-red-100 text-red-800 border-red-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  low: "bg-green-100 text-green-800 border-green-200",
}

export function SuggestionCard({ suggestion }: SuggestionCardProps) {
  return (
    <Card className={PRIORITY_BORDER[suggestion.priority]}>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-base">{suggestion.title}</CardTitle>
          <Badge
            variant="outline"
            className={PRIORITY_BADGE_CLASS[suggestion.priority]}
          >
            {PRIORITY_BADGE_LABEL[suggestion.priority]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {suggestion.description}
        </p>

        {suggestion.supporting_data && (
          <div className="flex gap-2 rounded border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            <span>{suggestion.supporting_data}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
