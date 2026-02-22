import { Suspense } from "react"
import { LoadingSkeleton } from "@/components/shared/loading-skeleton"
import { WordsContent } from "@/app/words/words-content"

export default function WordsPage() {
  return (
    <Suspense
      fallback={
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">O Que Falam</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            As palavras e expressões mais usadas pelo público nos comentários.
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
