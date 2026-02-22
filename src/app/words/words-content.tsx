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
      return "Ambos os candidatos"
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
      <h1 className="text-2xl font-bold tracking-tight text-white">O Que Falam</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        As palavras e expressões mais usadas pelo público nos comentários.
      </p>

      {/* Subtitle with filter and count */}
      {data && (
        <p className="mt-1 text-xs text-muted-foreground/60">
          {getFilterLabel(candidateFilter)} — {data.total_unique_words} palavras únicas encontradas
        </p>
      )}

      <div className="mt-6">
        {loading && <LoadingSkeleton variant="chart" />}

        {error && <ErrorMessage error={error} onRetry={refetch} />}

        {!loading && !error && data && data.words.length === 0 && (
          <EmptyState message="Nenhum comentário coletado ainda." />
        )}

        {!loading && !error && data && data.words.length > 0 && (
          <>
            <Card>
              <CardContent className="pt-6">
                <WordCloudChart words={data.words} />
              </CardContent>
            </Card>

            {/* Top 20 word list */}
            <Card className="mt-4">
              <CardContent className="pt-6">
                <h3 className="mb-3 text-sm font-medium text-white">Top 20 palavras mais frequentes</h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-1 sm:grid-cols-4">
                  {data.words.slice(0, 20).map((word, i) => (
                    <div key={word.word} className="flex items-center justify-between py-1">
                      <span className="text-sm text-foreground/80">
                        {i + 1}. {word.word}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {word.count}x
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
