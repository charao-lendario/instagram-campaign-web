import { renderHook, waitFor } from "@testing-library/react"
import { useSentimentTimeline } from "@/hooks/use-sentiment-timeline"
import type { SentimentTimelineData } from "@/lib/types"

const mockTimeline: SentimentTimelineData = {
  data_points: [
    {
      candidate_id: "uuid-1",
      candidate_username: "charlles.evangelista",
      post_id: "post-1",
      post_url: "https://instagram.com/p/abc123",
      post_caption: "Hoje visitamos o bairro...",
      posted_at: "2026-02-15T10:30:00Z",
      average_sentiment_score: 0.23,
      comment_count: 45,
    },
  ],
}

describe("useSentimentTimeline", () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it("should start with loading=true and data=null", () => {
    global.fetch = jest.fn().mockReturnValue(new Promise(() => {}))
    const { result } = renderHook(() => useSentimentTimeline())
    expect(result.current.loading).toBe(true)
    expect(result.current.data).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it("should set data on successful fetch", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockTimeline),
    })

    const { result } = renderHook(() => useSentimentTimeline())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toEqual(mockTimeline)
    expect(result.current.error).toBeNull()
  })

  it("should set error on failed fetch", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 503,
      statusText: "Service Unavailable",
    })

    const { result } = renderHook(() => useSentimentTimeline())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toBeNull()
    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error?.message).toContain("503")
  })

  it("should refetch when parameters change", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTimeline),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data_points: [] }),
      })

    const { result, rerender } = renderHook(
      ({ candidateId }: { candidateId?: string }) =>
        useSentimentTimeline(candidateId),
      { initialProps: { candidateId: undefined } }
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data?.data_points).toHaveLength(1)

    rerender({ candidateId: "uuid-2" })

    await waitFor(() => {
      expect(result.current.data?.data_points).toHaveLength(0)
    })
  })
})
