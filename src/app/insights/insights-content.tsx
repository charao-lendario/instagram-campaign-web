"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Loader2, Brain, Sparkles } from "lucide-react"
import { useSuggestions } from "@/hooks/use-suggestions"
import { useOverview } from "@/hooks/use-overview"
import { fetchSuggestions } from "@/lib/api"
import type { CandidateFilter } from "@/lib/constants"
import type { Suggestion, SuggestionsResponse } from "@/lib/types"
import { getCandidateId, formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LoadingSkeleton } from "@/components/shared/loading-skeleton"
import { ErrorMessage } from "@/components/shared/error-message"
import { EmptyState } from "@/components/shared/empty-state"
import { SuggestionCard } from "@/components/dashboard/suggestion-card"

const PRIORITY_ORDER: Record<Suggestion["priority"], number> = {
  high: 0,
  medium: 1,
  low: 2,
}

function sortByPriority(suggestions: Suggestion[]): Suggestion[] {
  return [...suggestions].sort(
    (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
  )
}

export function InsightsContent() {
  const searchParams = useSearchParams()
  const candidateFilter = (searchParams.get("candidate") ?? "charlles") as CandidateFilter

  const { data: overviewData } = useOverview()

  const candidateId =
    overviewData?.candidates
      ? getCandidateId(candidateFilter, overviewData.candidates)
      : undefined

  const { data, loading, error, refetch } = useSuggestions(candidateId)

  const [refreshing, setRefreshing] = useState(false)
  const [refreshData, setRefreshData] = useState<SuggestionsResponse | null>(null)
  const [refreshError, setRefreshError] = useState<Error | null>(null)

  const handleRefresh = async () => {
    setRefreshing(true)
    setRefreshError(null)
    try {
      const result = await fetchSuggestions({
        candidate_id: candidateId,
      })
      setRefreshData(result)
    } catch (err) {
      setRefreshError(
        err instanceof Error
          ? err
          : new Error("Não foi possível gerar sugestões. Tente novamente.")
      )
    } finally {
      setRefreshing(false)
    }
  }

  const displayData = refreshData ?? data
  const displayError = refreshError ?? error
  const isLoading = loading && !refreshData

  const sortedSuggestions = displayData?.suggestions
    ? sortByPriority(displayData.suggestions)
    : []

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Estratégia de Campanha
              </h1>
              <p className="text-sm text-muted-foreground">
                Consultoria IA inspirada em Marcelo Vitorino — o maior marketeiro político do Brasil
              </p>
            </div>
          </div>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={refreshing || isLoading}
          className="bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 border-0 shadow-lg shadow-violet-900/30"
        >
          {refreshing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              A IA está analisando...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Gerar Estratégia
            </>
          )}
        </Button>
      </div>

      {/* Metadata */}
      {displayData && (
        <p className="mt-3 text-xs text-muted-foreground/60">
          Gerado em: {formatDate(displayData.generated_at)} |{" "}
          {displayData.data_snapshot.total_comments_analyzed} comentários
          analisados
        </p>
      )}

      <div className="mt-6 space-y-6">
        {/* Loading state */}
        {(isLoading || refreshing) && sortedSuggestions.length === 0 && (
          <div className="space-y-4">
            <LoadingSkeleton variant="card" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <LoadingSkeleton key={i} variant="card" />
              ))}
            </div>
          </div>
        )}

        {/* Error state */}
        {displayError && !isLoading && !refreshing && (
          <ErrorMessage
            error={
              new Error(
                "Não foi possível gerar sugestões. Tente novamente."
              )
            }
            onRetry={refreshData ? handleRefresh : refetch}
          />
        )}

        {/* Empty state */}
        {!isLoading &&
          !refreshing &&
          !displayError &&
          displayData &&
          sortedSuggestions.length === 0 && (
            <EmptyState
              message="Clique em 'Gerar Estratégia' para a IA analisar os comentários reais e criar um plano estratégico completo para a campanha."
              actionLabel="Gerar Estratégia"
              onAction={handleRefresh}
            />
          )}

        {/* Executive summary */}
        {displayData?.resumo_executivo && !refreshing && (
          <Card className="border-violet-800/30 bg-gradient-to-br from-violet-950/40 to-purple-950/30">
            <CardContent className="p-5">
              <div className="mb-3 flex items-center gap-2">
                <Brain className="h-5 w-5 text-violet-400" />
                <h2 className="text-sm font-semibold text-violet-300">
                  Resumo Executivo
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-foreground/80">
                {displayData.resumo_executivo}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Suggestion cards */}
        {sortedSuggestions.length > 0 && !refreshing && (
          <div className="space-y-4">
            {sortedSuggestions.map((suggestion, index) => (
              <SuggestionCard
                key={index}
                suggestion={suggestion}
                index={index}
              />
            ))}
          </div>
        )}

        {/* Refreshing overlay when already have cards */}
        {refreshing && sortedSuggestions.length > 0 && (
          <div className="space-y-4 opacity-40">
            {displayData?.resumo_executivo && (
              <Card className="border-violet-800/30 bg-gradient-to-br from-violet-950/40 to-purple-950/30">
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <Brain className="h-5 w-5 text-violet-400" />
                    <h2 className="text-sm font-semibold text-violet-300">
                      Resumo Executivo
                    </h2>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/80">
                    {displayData.resumo_executivo}
                  </p>
                </CardContent>
              </Card>
            )}
            <div className="space-y-4">
              {sortedSuggestions.map((suggestion, index) => (
                <SuggestionCard
                  key={index}
                  suggestion={suggestion}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <p className="mt-8 text-xs text-muted-foreground/50">
        Estratégias geradas por IA com base nos comentários reais do Instagram.
        Valide com a equipe de campanha antes de executar.
      </p>
    </div>
  )
}
