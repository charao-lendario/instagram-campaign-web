"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useSuggestions } from "@/hooks/use-suggestions"
import { useOverview } from "@/hooks/use-overview"
import { fetchSuggestions } from "@/lib/api"
import type { CandidateFilter } from "@/lib/constants"
import type { Suggestion, SuggestionsResponse } from "@/lib/types"
import { getCandidateId, formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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
  const candidateFilter = (searchParams.get("candidate") ?? "all") as CandidateFilter

  // Get overview data to resolve candidate UUID
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

  // Use refreshed data if available, otherwise fall back to initial hook data
  const displayData = refreshData ?? data
  const displayError = refreshError ?? error
  const isLoading = loading && !refreshData

  const sortedSuggestions = displayData?.suggestions
    ? sortByPriority(displayData.suggestions)
    : []

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Insights Estratégicos
          </h1>
          <p className="mt-2 text-muted-foreground">
            Sugestões estratégicas baseadas em dados.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing || isLoading}
        >
          {refreshing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Gerando...
            </>
          ) : (
            "Atualizar sugestões"
          )}
        </Button>
      </div>

      {/* Last generated timestamp */}
      {displayData && (
        <p className="mt-2 text-xs text-muted-foreground">
          Gerado em: {formatDate(displayData.generated_at)} |{" "}
          {displayData.data_snapshot.total_comments_analyzed} comentários
          analisados
        </p>
      )}

      <div className="mt-6">
        {/* Loading state */}
        {(isLoading || refreshing) && sortedSuggestions.length === 0 && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <LoadingSkeleton key={i} variant="card" />
            ))}
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
              message="Dados insuficientes para gerar sugestões. Execute uma coleta de dados primeiro."
              actionLabel="Tentar novamente"
              onAction={handleRefresh}
            />
          )}

        {/* Suggestion cards */}
        {sortedSuggestions.length > 0 && !refreshing && (
          <div className="space-y-4">
            {sortedSuggestions.map((suggestion, index) => (
              <SuggestionCard key={index} suggestion={suggestion} />
            ))}
          </div>
        )}

        {/* Refreshing overlay when already have cards */}
        {refreshing && sortedSuggestions.length > 0 && (
          <div className="space-y-4 opacity-50">
            {sortedSuggestions.map((suggestion, index) => (
              <SuggestionCard key={index} suggestion={suggestion} />
            ))}
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <p className="mt-8 text-xs text-muted-foreground">
        Sugestões geradas por IA com base nos dados disponíveis. Valide com a
        equipe de campanha antes de agir.
      </p>
    </div>
  )
}
