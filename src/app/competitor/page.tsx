import { Suspense } from "react"
import { LoadingSkeleton } from "@/components/shared/loading-skeleton"
import { CompetitorContent } from "@/app/competitor/competitor-content"

export default function CompetitorPage() {
  return (
    <Suspense
      fallback={
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Inteligência Competitiva
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Carregando análise da concorrência...
          </p>
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <LoadingSkeleton variant="card" />
            <LoadingSkeleton variant="card" />
          </div>
        </div>
      }
    >
      <CompetitorContent />
    </Suspense>
  )
}
