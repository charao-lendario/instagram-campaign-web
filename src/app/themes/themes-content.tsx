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
  const candidateFilter = (searchParams.get("candidate") ?? "charlles") as CandidateFilter

  const [chartMode, setChartMode] = useState<"bar" | "pie">("bar")

  const { data: overviewData } = useOverview()

  const candidateId =
    overviewData?.candidates
      ? getCandidateId(candidateFilter, overviewData.candidates)
      : undefined

  const { data, loading, error, refetch } = useThemes(candidateId)

  // Filter out "outros" — not useful for campaign analysis
  const meaningfulThemes = data?.themes.filter((t) => t.theme !== "outros") ?? []

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Temas Quentes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Os assuntos que os eleitores mais comentam — o que importa para eles.
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

        {!loading && !error && meaningfulThemes.length === 0 && (
          <EmptyState message="Nenhum tema identificado nos comentários." />
        )}

        {!loading && !error && meaningfulThemes.length > 0 && (
          <>
            <Card>
              <CardContent className="pt-6">
                {chartMode === "bar" ? (
                  <ThemeBarChart
                    themes={meaningfulThemes}
                    candidateFilter={candidateFilter}
                  />
                ) : (
                  <ThemePieChart
                    themes={meaningfulThemes}
                    candidateFilter={candidateFilter}
                  />
                )}
              </CardContent>
            </Card>

            {/* Theme insights */}
            <Card className="mt-4">
              <CardContent className="pt-6 space-y-3">
                <h3 className="text-sm font-medium text-white">Análise para a campanha</h3>
                {meaningfulThemes.slice(0, 3).map((theme, i) => (
                  <p key={theme.theme} className="text-sm text-muted-foreground">
                    <strong className="text-foreground">{i + 1}. {theme.theme}</strong>
                    {" "}— {theme.count} menções ({theme.percentage}%).
                    {i === 0 && " Este é o tema que mais mobiliza os eleitores."}
                    {i === 1 && " Segundo tema mais relevante na percepção pública."}
                    {i === 2 && " Terceiro assunto mais comentado."}
                  </p>
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
