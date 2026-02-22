import { Suspense } from "react"
import { LoadingSkeleton } from "@/components/shared/loading-skeleton"
import { SentimentContent } from "@/app/sentiment/sentiment-content"

export default function SentimentPage() {
  return (
    <Suspense
      fallback={
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Linha do Tempo de Sentimento</h1>
          <p className="mt-2 text-muted-foreground">
            Evolução do sentimento ao longo do tempo por candidato.
          </p>
          <div className="mt-6">
            <LoadingSkeleton variant="chart" />
          </div>
        </div>
      }
    >
      <SentimentContent />
    </Suspense>
  )
}
