"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useCallback } from "react"
import {
  CANDIDATE_OPTIONS,
  type CandidateFilter as CandidateFilterType,
} from "@/lib/constants"
import { cn } from "@/lib/utils"

export function CandidateFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const currentValue = (searchParams.get("candidate") ?? "charlles") as CandidateFilterType

  const handleChange = useCallback(
    (value: CandidateFilterType) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("candidate", value)
      const query = params.toString()
      router.push(query ? `${pathname}?${query}` : pathname)
    },
    [router, searchParams, pathname]
  )

  return (
    <div className="flex items-center gap-1 rounded-lg border border-border/50 bg-[#0a1220] p-1">
      {CANDIDATE_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => handleChange(option.value)}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            currentValue === option.value
              ? "bg-secondary text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
