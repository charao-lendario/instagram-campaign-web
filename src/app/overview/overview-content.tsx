"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { useOverview } from "@/hooks/use-overview"
import { triggerScraping } from "@/lib/api"
import type { CandidateFilter } from "@/lib/constants"
import { CANDIDATE_A_USERNAME } from "@/lib/constants"
import { LoadingSkeleton } from "@/components/shared/loading-skeleton"
import { ErrorMessage } from "@/components/shared/error-message"
import { EmptyState } from "@/components/shared/empty-state"
import { SummaryRow } from "@/components/dashboard/summary-row"
import { MetricCard } from "@/components/dashboard/metric-card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export function OverviewContent() {
  const searchParams = useSearchParams()
  const candidateFilter = (searchParams.get("candidate") ?? "all") as CandidateFilter
  const { data, loading, error, refetch } = useOverview()

  const [triggering, setTriggering] = useState(false)
  const [triggerMessage, setTriggerMessage] = useState<string | null>(null)

  const handleTriggerScraping = async () => {
    setTriggering(true)
    setTriggerMessage(null)
    try {
      await triggerScraping()
      setTriggerMessage("Coleta iniciada com sucesso!")
    } catch (err) {
      if (err instanceof Error && err.message.includes("409")) {
        setTriggerMessage("Coleta já em andamento.")
      } else {
        setTriggerMessage("Erro ao iniciar coleta.")
      }
    } finally {
      setTriggering(false)
    }
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Painel de Campanha</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Carregando dados...
        </p>
        <div className="mt-6 space-y-6">
          <LoadingSkeleton variant="card" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <LoadingSkeleton variant="card" />
            <LoadingSkeleton variant="card" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Painel de Campanha</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Saúde geral da campanha do casal.
        </p>
        <div className="mt-6">
          <ErrorMessage error={error} onRetry={refetch} />
        </div>
      </div>
    )
  }

  if (!data || data.candidates.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Painel de Campanha</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Saúde geral da campanha do casal.
        </p>
        <div className="mt-6">
          <EmptyState
            message="Nenhum dado disponível. Inicie uma coleta de dados."
            actionLabel={triggering ? undefined : "Iniciar coleta"}
            onAction={triggering ? undefined : handleTriggerScraping}
          />
          {triggering && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Iniciando coleta...</span>
            </div>
          )}
          {triggerMessage && (
            <p className="mt-2 text-center text-sm text-muted-foreground">
              {triggerMessage}
            </p>
          )}
        </div>
      </div>
    )
  }

  // Filter candidates based on CandidateFilter URL param
  const filteredCandidates = data.candidates.filter((c) => {
    if (candidateFilter === "all") return true
    if (candidateFilter === "charlles") return c.username === CANDIDATE_A_USERNAME
    return c.username !== CANDIDATE_A_USERNAME
  })

  // Calculate average sentiment across candidates for the summary row
  const averageSentiment =
    data.candidates.length > 0
      ? data.candidates.reduce((sum, c) => sum + c.average_sentiment_score, 0) /
        data.candidates.length
      : 0

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Painel de Campanha</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Análise dos últimos posts de cada candidato no Instagram.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {triggerMessage && (
            <span className="text-sm text-muted-foreground">
              {triggerMessage}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleTriggerScraping}
            disabled={triggering}
            className="border-border/50 bg-secondary/50 text-foreground hover:bg-secondary"
          >
            {triggering && <Loader2 className="h-4 w-4 animate-spin" />}
            {triggering ? "Executando..." : "Executar Scraping"}
          </Button>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {/* Summary row */}
        <SummaryRow
          totalComments={data.total_comments_analyzed}
          averageSentiment={averageSentiment}
          lastScrape={data.last_scrape}
        />

        {/* Candidate metric cards */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {filteredCandidates.map((candidate) => (
            <MetricCard key={candidate.candidate_id} candidate={candidate} />
          ))}
        </div>
      </div>
    </div>
  )
}
