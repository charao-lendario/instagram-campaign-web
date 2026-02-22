import { Suspense } from "react"
import { LoadingSkeleton } from "@/components/shared/loading-skeleton"
import { WordsContent } from "@/app/words/words-content"

export default function WordsPage() {
  return (
    <Suspense
      fallback={
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Word Cloud</h1>
          <p className="mt-2 text-muted-foreground">
            Palavras mais frequentes nos comentarios.
          </p>
          <div className="mt-6">
            <LoadingSkeleton variant="chart" />
          </div>
        </div>
      }
    >
      <WordsContent />
    </Suspense>
  )
}
