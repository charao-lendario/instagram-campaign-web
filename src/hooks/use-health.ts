"use client"

import { fetchHealth } from "@/lib/api"
import type { HealthStatus } from "@/lib/types"
import { useApiData, type UseApiDataResult } from "@/hooks/use-api-data"

export function useHealth(): UseApiDataResult<HealthStatus> {
  return useApiData(() => fetchHealth(), [])
}
