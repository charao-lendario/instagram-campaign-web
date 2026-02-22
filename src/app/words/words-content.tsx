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

export function WordsContent() {
  const searchParams = useSearchParams()
  const candidateFilter = (searchParams.get("candidate") ?? "charlles") as CandidateFilter

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
        As expressões e assuntos mais mencionados nos comentários do público.
      </p>

      {data && (
        <p className="mt-1 text-xs text-muted-foreground/60">
          {data.total_unique_words} expressões extraídas dos comentários
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

            {/* Top expressions list */}
            <Card className="mt-4">
              <CardContent className="pt-6">
                <h3 className="mb-3 text-sm font-medium text-white">Expressões mais frequentes</h3>
                <div className="grid grid-cols-1 gap-y-1 sm:grid-cols-2">
                  {data.words.slice(0, 20).map((word, i) => (
                    <div key={word.word} className="flex items-center justify-between py-1.5 pr-4">
                      <span className="text-sm text-foreground/80">
                        {i + 1}. {word.word}
                      </span>
                      <span className="text-xs font-medium text-muted-foreground">
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
