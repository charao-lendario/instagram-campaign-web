"use client"

import { fetchOverview } from "@/lib/api"
import type { OverviewData } from "@/lib/types"
import { useApiData, type UseApiDataResult } from "@/hooks/use-api-data"

export function useOverview(): UseApiDataResult<OverviewData> {
  return useApiData(() => fetchOverview(), [])
}
