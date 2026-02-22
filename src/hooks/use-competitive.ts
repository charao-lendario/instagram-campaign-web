"use client"

import { fetchCompetitiveAnalysis } from "@/lib/api"
import type { CompetitiveAnalysisData } from "@/lib/types"
import { useApiData, type UseApiDataResult } from "@/hooks/use-api-data"

export function useCompetitive(
  ourUsername: string = "delegadasheila",
  competitorUsername: string = "delegadaione",
): UseApiDataResult<CompetitiveAnalysisData> {
  return useApiData(
    () =>
      fetchCompetitiveAnalysis({
        our_username: ourUsername,
        competitor_username: competitorUsername,
      }),
    [ourUsername, competitorUsername],
  )
}
