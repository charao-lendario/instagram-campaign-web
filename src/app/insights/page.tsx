import { Suspense } from "react"
import { LoadingSkeleton } from "@/components/shared/loading-skeleton"
import { InsightsContent } from "@/app/insights/insights-content"

export default function InsightsPage() {
  return (
    <Suspense
      fallback={
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Estratégia de Campanha
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Recomendações geradas por IA baseadas na análise dos comentários reais.
          </p>
          <div className="mt-6 space-y-4">
            <LoadingSkeleton variant="card" />
            <LoadingSkeleton variant="card" />
            <LoadingSkeleton variant="card" />
          </div>
        </div>
      }
    >
      <InsightsContent />
    </Suspense>
  )
}
