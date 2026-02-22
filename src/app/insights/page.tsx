import { Suspense } from "react"
import { LoadingSkeleton } from "@/components/shared/loading-skeleton"
import { InsightsContent } from "@/app/insights/insights-content"

export default function InsightsPage() {
  return (
    <Suspense
      fallback={
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Insights Estratégicos
          </h1>
          <p className="mt-2 text-muted-foreground">
            Sugestões estratégicas baseadas em dados.
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
