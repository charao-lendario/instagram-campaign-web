import { Suspense } from "react"
import { LoadingSkeleton } from "@/components/shared/loading-skeleton"
import { OverviewContent } from "@/app/overview/overview-content"

export default function OverviewPage() {
  return (
    <Suspense
      fallback={
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Visão Geral</h1>
          <p className="mt-2 text-muted-foreground">
            Visão geral das métricas de campanha.
          </p>
          <div className="mt-6 space-y-6">
            <LoadingSkeleton variant="card" />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <LoadingSkeleton variant="card" />
              <LoadingSkeleton variant="card" />
            </div>
          </div>
        </div>
      }
    >
      <OverviewContent />
    </Suspense>
  )
}
