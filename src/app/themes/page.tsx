import { Suspense } from "react"
import { LoadingSkeleton } from "@/components/shared/loading-skeleton"
import { ThemesContent } from "@/app/themes/themes-content"

export default function ThemesPage() {
  return (
    <Suspense
      fallback={
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Temas Quentes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Os assuntos que mais aparecem nos comentários dos eleitores.
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
