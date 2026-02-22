import { Suspense } from "react"
import { LoadingSkeleton } from "@/components/shared/loading-skeleton"
import { ComparisonContent } from "@/app/comparison/comparison-content"

export default function ComparisonPage() {
  return (
    <Suspense
      fallback={
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Comparativo</h1>
          <p className="mt-2 text-muted-foreground">
            Comparacao lado a lado entre candidatos.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <LoadingSkeleton variant="card" />
            <LoadingSkeleton variant="card" />
          </div>
        </div>
      }
    >
      <ComparisonContent />
    </Suspense>
  )
}
