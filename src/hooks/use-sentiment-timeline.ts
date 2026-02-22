"use client"

import { fetchSentimentTimeline } from "@/lib/api"
import type { SentimentTimelineData } from "@/lib/types"
import { useApiData, type UseApiDataResult } from "@/hooks/use-api-data"

export function useSentimentTimeline(
  candidateId?: string,
  startDate?: string,
  endDate?: string
): UseApiDataResult<SentimentTimelineData> {
  return useApiData(
    () =>
      fetchSentimentTimeline({
        candidate_id: candidateId,
        start_date: startDate,
        end_date: endDate,
      }),
    [candidateId, startDate, endDate]
  )
}
