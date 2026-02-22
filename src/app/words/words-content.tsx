"use client"

import dynamic from "next/dynamic"
import { useSearchParams } from "next/navigation"
import { useWordCloud } from "@/hooks/use-word-cloud"
import { useOverview } from "@/hooks/use-overview"
import type { CandidateFilter } from "@/lib/constants"
import { getCandidateId } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { LoadingSkeleton } from "@/components/shared/loading-skeleton"
import { ErrorMessage } from "@/components/shared/error-message"
import { EmptyState } from "@/components/shared/empty-state"

const WordCloudChart = dynamic(
  () =>
    import("@/components/charts/word-cloud").then((mod) => ({
      default: mod.WordCloudChart,
    })),
  {
    ssr: false,
    loading: () => <LoadingSkeleton variant="chart" />,
  }
)

function getFilterLabel(filter: CandidateFilter): string {
  switch (filter) {
    case "charlles":
      return "Charlles Evangelista"
    case "sheila":
      return "Delegada Sheila"
    default:
      return "Todos os candidatos"
  }
}

export function WordsContent() {
  const searchParams = useSearchParams()
  const candidateFilter = (searchParams.get("candidate") ?? "all") as CandidateFilter

  // Get overview data to resolve candidate UUID
  const { data: overviewData } = useOverview()

  const candidateId =
    overviewData?.candidates
      ? getCandidateId(candidateFilter, overviewData.candidates)
      : undefined

  const { data, loading, error, refetch } = useWordCloud(candidateId)

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Nuvem de Palavras</h1>
      <p className="mt-2 text-muted-foreground">
        Palavras mais frequentes nos comentários.
      </p>

      {/* Subtitle with filter and count */}
      {data && (
        <p className="mt-1 text-sm text-muted-foreground">
          {getFilterLabel(candidateFilter)} — {data.total_unique_words} palavras
          únicas
        </p>
      )}

      <div className="mt-6">
        {loading && <LoadingSkeleton variant="chart" />}

        {error && <ErrorMessage error={error} onRetry={refetch} />}

        {!loading && !error && data && data.words.length === 0 && (
          <EmptyState message="Nenhum comentário coletado ainda." />
        )}

        {!loading && !error && data && data.words.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <WordCloudChart words={data.words} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
