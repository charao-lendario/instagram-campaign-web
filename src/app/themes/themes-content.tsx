"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { useThemes } from "@/hooks/use-themes"
import { useOverview } from "@/hooks/use-overview"
import type { CandidateFilter } from "@/lib/constants"
import { getCandidateId } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LoadingSkeleton } from "@/components/shared/loading-skeleton"
import { ErrorMessage } from "@/components/shared/error-message"
import { EmptyState } from "@/components/shared/empty-state"
import { ThemeBarChart } from "@/components/charts/theme-bar"
import { ThemePieChart } from "@/components/charts/theme-pie"

export function ThemesContent() {
  const searchParams = useSearchParams()
  const candidateFilter = (searchParams.get("candidate") ?? "all") as CandidateFilter

  const [chartMode, setChartMode] = useState<"bar" | "pie">("bar")

  // Get overview data to resolve candidate UUID
  const { data: overviewData } = useOverview()

  const candidateId =
    overviewData?.candidates
      ? getCandidateId(candidateFilter, overviewData.candidates)
      : undefined

  const { data, loading, error, refetch } = useThemes(candidateId)

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Temas Quentes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Os assuntos que mais aparecem nos comentários dos eleitores.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setChartMode((m) => (m === "bar" ? "pie" : "bar"))}
          className="border-border/50 bg-secondary/50 text-foreground hover:bg-secondary"
        >
          {chartMode === "bar" ? "Ver como pizza" : "Ver como barras"}
        </Button>
      </div>

      <div className="mt-6">
        {loading && <LoadingSkeleton variant="chart" />}

        {error && <ErrorMessage error={error} onRetry={refetch} />}

        {!loading && !error && data && data.themes.length === 0 && (
          <EmptyState message="Nenhum tema identificado nos comentários." />
        )}

        {!loading && !error && data && data.themes.length > 0 && (
          <>
            <Card>
              <CardContent className="pt-6">
                {chartMode === "bar" ? (
                  <ThemeBarChart
                    themes={data.themes}
                    candidateFilter={candidateFilter}
                  />
                ) : (
                  <ThemePieChart
                    themes={data.themes}
                    candidateFilter={candidateFilter}
                  />
                )}
              </CardContent>
            </Card>

            {/* Theme interpretation */}
            {data.themes[0] && (
              <Card className="mt-4">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">
                    O tema mais mencionado é <strong className="text-foreground">{data.themes[0].theme}</strong> com{" "}
                    {data.themes[0].count} menções ({data.themes[0].percentage}%).
                    {data.themes[1] && (
                      <> Em segundo lugar vem <strong className="text-foreground">{data.themes[1].theme}</strong> com{" "}
                      {data.themes[1].count} menções.</>
                    )}
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}
