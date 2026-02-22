"use client"

import { fetchPosts } from "@/lib/api"
import type { PostsResponse } from "@/lib/types"
import { useApiData, type UseApiDataResult } from "@/hooks/use-api-data"

export function usePosts(
  candidateId?: string,
  sortBy?: string,
  order?: string,
  limit?: number,
  offset?: number
): UseApiDataResult<PostsResponse> {
  return useApiData(
    () =>
      fetchPosts({
        candidate_id: candidateId,
        sort_by: sortBy,
        order,
        limit,
        offset,
      }),
    [candidateId, sortBy, order, limit, offset]
  )
}
