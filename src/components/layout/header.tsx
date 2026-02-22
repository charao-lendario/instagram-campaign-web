import { Suspense } from "react"
import { CandidateFilter } from "@/components/layout/candidate-filter"

export function Header() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
          Instagram Campaign Analytics
        </h1>
        <Suspense fallback={null}>
          <CandidateFilter />
        </Suspense>
      </div>
    </header>
  )
}
