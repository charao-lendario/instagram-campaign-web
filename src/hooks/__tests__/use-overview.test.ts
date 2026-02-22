import { renderHook, waitFor, act } from "@testing-library/react"
import { useOverview } from "@/hooks/use-overview"
import type { OverviewData } from "@/lib/types"

const mockOverview: OverviewData = {
  candidates: [
    {
      candidate_id: "uuid-1",
      username: "charlles.evangelista",
      display_name: "Charlles Evangelista",
      total_posts: 10,
      total_comments: 487,
      average_sentiment_score: 0.15,
      sentiment_distribution: { positive: 210, negative: 127, neutral: 150 },
      total_engagement: 3542,
    },
  ],
  last_scrape: "2026-02-21T14:00:00Z",
  total_comments_analyzed: 487,
}

describe("useOverview", () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it("should start with loading=true and data=null", () => {
    global.fetch = jest.fn().mockReturnValue(new Promise(() => {}))
    const { result } = renderHook(() => useOverview())
    expect(result.current.loading).toBe(true)
    expect(result.current.data).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it("should set data on successful fetch", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockOverview),
    })

    const { result } = renderHook(() => useOverview())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toEqual(mockOverview)
    expect(result.current.error).toBeNull()
  })

  it("should set error on failed fetch", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    })

    const { result } = renderHook(() => useOverview())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toBeNull()
    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error?.message).toContain("500")
  })

  it("should refetch when refetch is called", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockOverview),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            ...mockOverview,
            total_comments_analyzed: 999,
          }),
      })

    const { result } = renderHook(() => useOverview())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data?.total_comments_analyzed).toBe(487)

    await act(async () => {
      result.current.refetch()
    })

    await waitFor(() => {
      expect(result.current.data?.total_comments_analyzed).toBe(999)
    })
  })
})
