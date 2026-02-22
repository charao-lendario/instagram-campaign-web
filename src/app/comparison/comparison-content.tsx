"use client"

import { useComparison } from "@/hooks/use-comparison"
import type { CandidateComparison } from "@/lib/types"
import {
  CANDIDATE_A_USERNAME,
  CANDIDATE_A_COLOR,
  CANDIDATE_B_COLOR,
  CANDIDATE_A_CARGO,
  CANDIDATE_B_CARGO,
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

function CandidateProfileCard({
  candidate,
  color,
}: {
  candidate: CandidateComparison
  color: string
}) {
  const cargo = candidate.username === CANDIDATE_A_USERNAME
    ? CANDIDATE_A_CARGO
    : CANDIDATE_B_CARGO

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-white">{candidate.display_name}</CardTitle>
        <CardDescription>{cargo} — @{candidate.username}</CardDescription>
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

        {/* Sentiment distribution */}
        <div>
          <p className="mb-2 text-sm font-medium text-foreground/80">Distribuição de sentimento</p>
          <SentimentBar
            distribution={candidate.sentiment_distribution}
            totalComments={candidate.total_comments}
          />
        </div>

        {/* Top 3 themes */}
        <div>
          <p className="mb-2 text-sm font-medium text-foreground/80">Temas mais citados</p>
          <div className="flex flex-wrap gap-2">
            {candidate.top_themes.map((t) => (
              <Badge key={t.theme} variant="secondary" className="bg-secondary text-foreground/80">
                {formatThemeLabel(t.theme)} ({t.count})
              </Badge>
            ))}
          </div>
        </div>

        {/* Trend */}
        <div>
          <p className="mb-2 text-sm font-medium text-foreground/80">Tendência do candidato</p>
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
      <h1 className="text-2xl font-bold tracking-tight text-white">Perfil Individual</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Análise detalhada de cada candidato — desempenho, sentimento e tendência.
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
          <EmptyState message="Nenhum dado disponível." />
        )}

        {!loading && !error && data && data.candidates.length > 0 && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {data.candidates.map((candidate) => (
              <CandidateProfileCard
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
