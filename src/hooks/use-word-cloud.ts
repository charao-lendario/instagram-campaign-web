"use client"

import { fetchWordCloud } from "@/lib/api"
import type { WordCloudData } from "@/lib/types"
import { useApiData, type UseApiDataResult } from "@/hooks/use-api-data"

export function useWordCloud(
  candidateId?: string
): UseApiDataResult<WordCloudData> {
  return useApiData(
    () => fetchWordCloud({ candidate_id: candidateId }),
    [candidateId]
  )
}
