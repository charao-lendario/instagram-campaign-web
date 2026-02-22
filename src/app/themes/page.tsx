import { Suspense } from "react"
import { LoadingSkeleton } from "@/components/shared/loading-skeleton"
import { ThemesContent } from "@/app/themes/themes-content"

export default function ThemesPage() {
  return (
    <Suspense
      fallback={
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Temas</h1>
          <p className="mt-2 text-muted-foreground">
            Distribuição de temas por candidato.
          </p>
          <div className="mt-6">
            <LoadingSkeleton variant="chart" />
          </div>
        </div>
      }
    >
      <ThemesContent />
    </Suspense>
  )
}
