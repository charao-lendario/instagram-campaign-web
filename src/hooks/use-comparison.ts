"use client"

import { fetchComparison } from "@/lib/api"
import type { ComparisonData } from "@/lib/types"
import { useApiData, type UseApiDataResult } from "@/hooks/use-api-data"

export function useComparison(): UseApiDataResult<ComparisonData> {
  return useApiData(() => fetchComparison(), [])
}
