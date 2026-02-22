"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { useSentimentTimeline } from "@/hooks/use-sentiment-timeline"
import { useOverview } from "@/hooks/use-overview"
import type { CandidateFilter } from "@/lib/constants"
import { getCandidateId } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ErrorMessage } from "@/components/shared/error-message"
import { EmptyState } from "@/components/shared/empty-state"
import { SentimentLineChart } from "@/components/charts/sentiment-line"

function getDefaultStartDate(): string {
  const d = new Date()
  d.setDate(d.getDate() - 30)
  return d.toISOString().split("T")[0]
}

function getDefaultEndDate(): string {
  return new Date().toISOString().split("T")[0]
}

export function SentimentContent() {
  const searchParams = useSearchParams()
  const candidateFilter = (searchParams.get("candidate") ?? "all") as CandidateFilter

  const [startDate, setStartDate] = useState(getDefaultStartDate)
  const [endDate, setEndDate] = useState(getDefaultEndDate)

  // Get overview data to resolve candidate UUID
  const { data: overviewData } = useOverview()

  const candidateId =
    overviewData?.candidates
      ? getCandidateId(candidateFilter, overviewData.candidates)
      : undefined

  const { data, loading, error, refetch } = useSentimentTimeline(
    candidateId,
    startDate,
    endDate
  )

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Linha do Tempo de Sentimento</h1>
      <p className="mt-2 text-muted-foreground">
        Evolução do sentimento ao longo do tempo por candidato.
      </p>

      {/* Date range inputs */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Período</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="start-date" className="text-sm text-muted-foreground">
                De:
              </label>
              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-md border bg-background px-3 py-1.5 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="end-date" className="text-sm text-muted-foreground">
                Até:
              </label>
              <input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-md border bg-background px-3 py-1.5 text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart area */}
      <div className="mt-6">
        {loading && (
          <div className="rounded-lg border p-6">
            <div className="h-[400px] animate-pulse rounded-md bg-accent" />
          </div>
        )}

        {error && <ErrorMessage error={error} onRetry={refetch} />}

        {!loading && !error && data && data.data_points.length === 0 && (
          <EmptyState message="Nenhum dado para o período selecionado." />
        )}

        {!loading && !error && data && data.data_points.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <SentimentLineChart
                dataPoints={data.data_points}
                candidateFilter={candidateFilter}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
