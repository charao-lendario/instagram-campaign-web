"use client"

import type { CandidateMetrics } from "@/lib/types"
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

export function MetricCard({ candidate, isHighlighted }: MetricCardProps) {
  return (
    <Card
      className={
        isHighlighted ? "border-2 border-primary/30" : undefined
      }
    >
      <CardHeader>
        <CardTitle>{candidate.display_name}</CardTitle>
        <CardDescription>@{candidate.username}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Average sentiment */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Sentimento médio
          </span>
          <SentimentBadge score={candidate.average_sentiment_score} />
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">{candidate.total_posts}</p>
            <p className="text-xs text-muted-foreground">Posts</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{candidate.total_comments}</p>
            <p className="text-xs text-muted-foreground">Comentários</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {candidate.total_engagement.toLocaleString("pt-BR")}
            </p>
            <p className="text-xs text-muted-foreground">Engajamento</p>
          </div>
        </div>

        {/* Sentiment distribution bars */}
        <div>
          <p className="mb-2 text-sm font-medium">Distribuição de sentimento</p>
          <SentimentBar
            distribution={candidate.sentiment_distribution}
            totalComments={candidate.total_comments}
          />
        </div>
      </CardContent>
    </Card>
  )
}
