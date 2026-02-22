import { renderHook, waitFor, act } from "@testing-library/react"
import { useHealth } from "@/hooks/use-health"
import type { HealthStatus } from "@/lib/types"

const mockHealth: HealthStatus = {
  status: "ok",
  database: "connected",
  scheduler: "running",
  last_scrape: "2026-02-21T14:00:00Z",
}

describe("useHealth", () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it("should start with loading=true and data=null", () => {
    global.fetch = jest.fn().mockReturnValue(new Promise(() => {}))
    const { result } = renderHook(() => useHealth())
    expect(result.current.loading).toBe(true)
    expect(result.current.data).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it("should set data on successful fetch", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockHealth),
    })

    const { result } = renderHook(() => useHealth())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toEqual(mockHealth)
    expect(result.current.error).toBeNull()
  })

  it("should set error on failed fetch", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 503,
      statusText: "Service Unavailable",
    })

    const { result } = renderHook(() => useHealth())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toBeNull()
    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error?.message).toContain("503")
  })

  it("should refetch when refetch is called", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockHealth),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({ ...mockHealth, status: "degraded" as const }),
      })

    const { result } = renderHook(() => useHealth())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data?.status).toBe("ok")

    await act(async () => {
      result.current.refetch()
    })

    await waitFor(() => {
      expect(result.current.data?.status).toBe("degraded")
    })
  })
})
