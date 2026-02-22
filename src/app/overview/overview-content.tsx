"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { useOverview } from "@/hooks/use-overview"
import { triggerScraping } from "@/lib/api"
import type { CandidateFilter } from "@/lib/constants"
import {
  CANDIDATE_A_USERNAME,
  CANDIDATE_A_CARGO,
  CANDIDATE_B_CARGO,
} from "@/lib/constants"
import { LoadingSkeleton } from "@/components/shared/loading-skeleton"
import { ErrorMessage } from "@/components/shared/error-message"
import { EmptyState } from "@/components/shared/empty-state"
import { SummaryRow } from "@/components/dashboard/summary-row"
import { MetricCard } from "@/components/dashboard/metric-card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export function OverviewContent() {
  const searchParams = useSearchParams()
  const candidateFilter = (searchParams.get("candidate") ?? "charlles") as CandidateFilter
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
        <p className="mt-1 text-sm text-muted-foreground">Carregando dados...</p>
        <div className="mt-6 space-y-6">
          <LoadingSkeleton variant="card" />
          <LoadingSkeleton variant="card" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Painel de Campanha</h1>
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
        </div>
      </div>
    )
  }

  // Show selected candidate
  const selectedUsername = candidateFilter === "charlles" ? CANDIDATE_A_USERNAME : "delegadasheila"
  const candidate = data.candidates.find((c) => c.username === selectedUsername)
  const cargo = candidateFilter === "charlles" ? CANDIDATE_A_CARGO : CANDIDATE_B_CARGO

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Painel de Campanha</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {candidate?.display_name} — {cargo} | Análise de {candidate?.total_posts} posts no Instagram
          </p>
        </div>
        <div className="flex items-center gap-3">
          {triggerMessage && (
            <span className="text-sm text-muted-foreground">{triggerMessage}</span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleTriggerScraping}
            disabled={triggering}
            className="border-border/50 bg-secondary/50 text-foreground hover:bg-secondary"
          >
            {triggering && <Loader2 className="h-4 w-4 animate-spin" />}
            {triggering ? "Executando..." : "Atualizar dados"}
          </Button>
        </div>
      </div>

      {candidate && (
        <div className="mt-6 space-y-6">
          {/* Summary row */}
          <SummaryRow
            totalComments={candidate.total_comments}
            averageSentiment={candidate.average_sentiment_score}
            lastScrape={data.last_scrape}
          />

          {/* Single candidate detail card */}
          <MetricCard candidate={candidate} />
        </div>
      )}
    </div>
  )
}
