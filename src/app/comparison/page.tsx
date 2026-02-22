import { Suspense } from "react"
import { LoadingSkeleton } from "@/components/shared/loading-skeleton"
import { ComparisonContent } from "@/app/comparison/comparison-content"

export default function ComparisonPage() {
  return (
    <Suspense
      fallback={
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Perfil do Candidato</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Análise detalhada — desempenho, sentimento e tendência.
          </p>
          <div className="mt-6 max-w-lg">
            <LoadingSkeleton variant="card" />
          </div>
        </div>
      }
    >
      <ComparisonContent />
    </Suspense>
  )
}
