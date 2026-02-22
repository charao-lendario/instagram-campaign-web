"use client"

import { fetchThemes } from "@/lib/api"
import type { ThemesResponse } from "@/lib/types"
import { useApiData, type UseApiDataResult } from "@/hooks/use-api-data"

export function useThemes(
  candidateId?: string
): UseApiDataResult<ThemesResponse> {
  return useApiData(
    () => fetchThemes({ candidate_id: candidateId }),
    [candidateId]
  )
}
