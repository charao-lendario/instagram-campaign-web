"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { ArrowUp, ArrowDown, ExternalLink } from "lucide-react"
import { useOverview } from "@/hooks/use-overview"
import { fetchPosts } from "@/lib/api"
import type { CandidateFilter } from "@/lib/constants"
import type { PostData } from "@/lib/types"
import { getCandidateId, formatDateMedium } from "@/lib/utils"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { LoadingSkeleton } from "@/components/shared/loading-skeleton"
import { ErrorMessage } from "@/components/shared/error-message"
import { EmptyState } from "@/components/shared/empty-state"
import { SentimentBadge } from "@/components/dashboard/sentiment-badge"
import { useApiData } from "@/hooks/use-api-data"

type SortColumn =
  | "comment_count"
  | "like_count"
  | "positive_ratio"
  | "negative_ratio"
  | "sentiment_score"

const SORTABLE_COLUMNS: Array<{
  key: SortColumn
  label: string
}> = [
  { key: "like_count", label: "Curtidas" },
  { key: "comment_count", label: "Comentários" },
  { key: "positive_ratio", label: "% Positivo" },
  { key: "negative_ratio", label: "% Negativo" },
  { key: "sentiment_score", label: "Sentimento" },
]

const PAGE_SIZE = 20

function truncateCaption(caption: string, maxLength: number = 40): string {
  if (caption.length <= maxLength) return caption
  return caption.slice(0, maxLength).trim() + "..."
}

export function PostsContent() {
  const searchParams = useSearchParams()
  const candidateFilter = (searchParams.get("candidate") ?? "charlles") as CandidateFilter

  const [sortColumn, setSortColumn] = useState<SortColumn>("comment_count")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [extraPosts, setExtraPosts] = useState<PostData[]>([])
  const [loadingMore, setLoadingMore] = useState(false)
  const [currentOffset, setCurrentOffset] = useState(0)

  const { data: overviewData } = useOverview()

  const candidateId =
    overviewData?.candidates
      ? getCandidateId(candidateFilter, overviewData.candidates)
      : undefined

  const { data, loading, error, refetch } = useApiData(
    () =>
      fetchPosts({
        candidate_id: candidateId,
        sort_by: sortColumn,
        order: sortOrder,
        limit: PAGE_SIZE,
        offset: 0,
      }),
    [candidateId, sortColumn, sortOrder]
  )

  const allPosts = data?.posts
    ? [...data.posts, ...extraPosts]
    : []

  const totalPosts = data?.total ?? 0

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
    } else {
      setSortColumn(column)
      setSortOrder("desc")
    }
    setExtraPosts([])
    setCurrentOffset(0)
  }

  const handleLoadMore = async () => {
    const nextOffset = currentOffset + PAGE_SIZE
    setLoadingMore(true)
    try {
      const result = await fetchPosts({
        candidate_id: candidateId,
        sort_by: sortColumn,
        order: sortOrder,
        limit: PAGE_SIZE,
        offset: nextOffset,
      })
      setExtraPosts((prev) => [...prev, ...result.posts])
      setCurrentOffset(nextOffset)
    } catch {
      // Silently fail; user can retry
    } finally {
      setLoadingMore(false)
    }
  }

  const showLoadMore = allPosts.length < totalPosts && allPosts.length > 0

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-white">Desempenho de Posts</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Qual conteúdo funciona melhor — clique na legenda para abrir o post no Instagram.
      </p>

      <div className="mt-6">
        {loading && allPosts.length === 0 && (
          <LoadingSkeleton variant="table" />
        )}

        {error && <ErrorMessage error={error} onRetry={refetch} />}

        {!loading && !error && allPosts.length === 0 && (
          <EmptyState message="Nenhum post encontrado." />
        )}

        {allPosts.length > 0 && (
          <>
            <div className="overflow-x-auto rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-secondary/30">
                    <TableHead className="w-[100px]">Data</TableHead>
                    <TableHead className="min-w-[120px]">Legenda</TableHead>
                    {SORTABLE_COLUMNS.map((col) => (
                      <TableHead
                        key={col.key}
                        className="cursor-pointer select-none whitespace-nowrap"
                        onClick={() => handleSort(col.key)}
                      >
                        <span className="flex items-center gap-1">
                          {col.label}
                          {sortColumn === col.key && (
                            sortOrder === "desc" ? (
                              <ArrowDown className="h-3.5 w-3.5" />
                            ) : (
                              <ArrowUp className="h-3.5 w-3.5" />
                            )
                          )}
                        </span>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allPosts.map((post) => (
                    <TableRow key={post.post_id} className="border-border hover:bg-secondary/20">
                      <TableCell className="whitespace-nowrap text-xs">
                        {formatDateMedium(post.posted_at)}
                      </TableCell>
                      <TableCell className="max-w-[180px]">
                        {post.url ? (
                          <a
                            href={post.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-1 text-blue-400 hover:text-blue-300"
                            title={post.caption}
                          >
                            <span className="truncate text-sm">
                              {truncateCaption(post.caption)}
                            </span>
                            <ExternalLink className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-100" />
                          </a>
                        ) : (
                          <span className="text-sm" title={post.caption}>
                            {truncateCaption(post.caption)}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{post.like_count.toLocaleString("pt-BR")}</TableCell>
                      <TableCell>{post.comment_count}</TableCell>
                      <TableCell>
                        {(post.positive_ratio * 100).toFixed(0)}%
                      </TableCell>
                      <TableCell>
                        {(post.negative_ratio * 100).toFixed(0)}%
                      </TableCell>
                      <TableCell>
                        <SentimentBadge score={post.average_sentiment_score} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {showLoadMore && (
              <div className="mt-4 flex justify-center">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="border-border/50 bg-secondary/50 text-foreground hover:bg-secondary"
                >
                  {loadingMore ? "Carregando..." : "Carregar mais"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
