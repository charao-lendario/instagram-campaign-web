"use client"

import { fetchSuggestions } from "@/lib/api"
import type { SuggestionsResponse } from "@/lib/types"
import { useApiData, type UseApiDataResult } from "@/hooks/use-api-data"

export function useSuggestions(
  candidateId?: string
): UseApiDataResult<SuggestionsResponse> {
  return useApiData(
    () => fetchSuggestions({ candidate_id: candidateId }),
    [candidateId]
  )
}
