"use client"

import type { CandidateMetrics } from "@/lib/types"
import {
  CANDIDATE_A_USERNAME,
  CANDIDATE_A_CARGO,
  CANDIDATE_B_CARGO,
} from "@/lib/constants"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { SentimentBadge } from "@/components/dashboard/sentiment-badge"
import { SentimentBar } from "@/components/dashboard/sentiment-bar"

interface MetricCardProps {
  candidate: CandidateMetrics
  isHighlighted?: boolean
}

function getSentimentInterpretation(score: number): string {
  if (score >= 0.1) return "O público está bastante receptivo."
  if (score >= 0.05) return "Sentimento levemente positivo."
  if (score >= -0.05) return "Sentimento neutro — sem tendência clara."
  if (score >= -0.1) return "Atenção: leve negatividade nos comentários."
  return "Alerta: mais negatividade que o ideal."
}

export function MetricCard({ candidate, isHighlighted }: MetricCardProps) {
  const cargo = candidate.username === CANDIDATE_A_USERNAME
    ? CANDIDATE_A_CARGO
    : CANDIDATE_B_CARGO

  return (
    <Card
      className={
        isHighlighted ? "border-2 border-primary/30" : undefined
      }
    >
      <CardHeader>
        <CardTitle className="text-white">{candidate.display_name}</CardTitle>
        <CardDescription>
          {cargo} — @{candidate.username}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Average sentiment with interpretation */}
        <div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Sentimento médio
            </span>
            <SentimentBadge score={candidate.average_sentiment_score} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground/70">
            {getSentimentInterpretation(candidate.average_sentiment_score)}
          </p>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-white">{candidate.total_posts}</p>
            <p className="text-xs text-muted-foreground">Posts</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{candidate.total_comments}</p>
            <p className="text-xs text-muted-foreground">Comentários</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">
              {candidate.total_engagement.toLocaleString("pt-BR")}
            </p>
            <p className="text-xs text-muted-foreground">Engajamento</p>
          </div>
        </div>

        {/* Sentiment distribution bars */}
        <div>
          <p className="mb-2 text-sm font-medium text-foreground/80">Distribuição de sentimento</p>
          <SentimentBar
            distribution={candidate.sentiment_distribution}
            totalComments={candidate.total_comments}
          />
        </div>
      </CardContent>
    </Card>
  )
}
