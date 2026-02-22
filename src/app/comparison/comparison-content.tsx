"use client"

import { useComparison } from "@/hooks/use-comparison"
import type { CandidateComparison } from "@/lib/types"
import {
  CANDIDATE_A_USERNAME,
  CANDIDATE_A_COLOR,
  CANDIDATE_B_COLOR,
} from "@/lib/constants"
import { formatThemeLabel } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSkeleton } from "@/components/shared/loading-skeleton"
import { ErrorMessage } from "@/components/shared/error-message"
import { EmptyState } from "@/components/shared/empty-state"
import { SentimentBadge } from "@/components/dashboard/sentiment-badge"
import { SentimentBar } from "@/components/dashboard/sentiment-bar"
import { TrendIndicator } from "@/components/dashboard/trend-indicator"
import { Sparkline } from "@/components/charts/sparkline"

function CandidateComparisonCard({
  candidate,
  color,
}: {
  candidate: CandidateComparison
  color: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{candidate.display_name}</CardTitle>
        <CardDescription>@{candidate.username}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Average sentiment */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Sentimento médio</span>
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

        {/* Sentiment distribution */}
        <div>
          <p className="mb-2 text-sm font-medium">Distribuição de sentimento</p>
          <SentimentBar
            distribution={candidate.sentiment_distribution}
            totalComments={candidate.total_comments}
          />
        </div>

        {/* Top 3 themes */}
        <div>
          <p className="mb-2 text-sm font-medium">Top temas</p>
          <div className="flex flex-wrap gap-2">
            {candidate.top_themes.map((t) => (
              <Badge key={t.theme} variant="secondary">
                {formatThemeLabel(t.theme)} ({t.count})
              </Badge>
            ))}
          </div>
        </div>

        {/* Trend */}
        <div>
          <p className="mb-2 text-sm font-medium">Tendência</p>
          <TrendIndicator
            direction={candidate.trend.direction}
            delta={candidate.trend.delta}
          />
        </div>

        {/* Sparkline */}
        <div>
          <Sparkline
            previousAvg={candidate.trend.previous_avg}
            recentAvg={candidate.trend.recent_avg}
            color={color}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export function ComparisonContent() {
  const { data, loading, error, refetch } = useComparison()

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Comparativo</h1>
      <p className="mt-2 text-muted-foreground">
        Comparação lado a lado entre candidatos.
      </p>

      <div className="mt-6">
        {loading && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <LoadingSkeleton variant="card" />
            <LoadingSkeleton variant="card" />
          </div>
        )}

        {error && <ErrorMessage error={error} onRetry={refetch} />}

        {!loading && !error && data && data.candidates.length === 0 && (
          <EmptyState message="Nenhum dado de comparação disponível." />
        )}

        {!loading && !error && data && data.candidates.length > 0 && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {data.candidates.map((candidate) => (
              <CandidateComparisonCard
                key={candidate.candidate_id}
                candidate={candidate}
                color={
                  candidate.username === CANDIDATE_A_USERNAME
                    ? CANDIDATE_A_COLOR
                    : CANDIDATE_B_COLOR
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
