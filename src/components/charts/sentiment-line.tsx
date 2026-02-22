"use client"

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts"
import type { TimelineDataPoint } from "@/lib/types"
import type { CandidateFilter } from "@/lib/constants"
import {
  CANDIDATE_A_USERNAME,
  CANDIDATE_B_USERNAME,
  CANDIDATE_A_DISPLAY,
  CANDIDATE_B_DISPLAY,
} from "@/lib/constants"
import { formatDateShort, formatDateMedium } from "@/lib/utils"

interface SentimentLineChartProps {
  dataPoints: TimelineDataPoint[]
  candidateFilter: CandidateFilter
}

interface ChartDataPoint {
  date: string
  dateISO: string
  caption: string
  [key: string]: string | number | undefined
}

function transformData(
  dataPoints: TimelineDataPoint[],
  candidateFilter: CandidateFilter
): ChartDataPoint[] {
  // Filter by candidate if needed
  const filtered = dataPoints.filter((dp) => {
    if (candidateFilter === "charlles")
      return dp.candidate_username === CANDIDATE_A_USERNAME
    return dp.candidate_username === CANDIDATE_B_USERNAME
  })

  // Sort by posted_at date
  const sorted = [...filtered].sort(
    (a, b) => new Date(a.posted_at).getTime() - new Date(b.posted_at).getTime()
  )

  // Each data point is one post. We create one row per post.
  // Since different candidates post at different times, each row may only
  // have one candidate's value.
  return sorted.map((dp) => {
    const row: ChartDataPoint = {
      date: formatDateShort(dp.posted_at),
      dateISO: dp.posted_at,
      caption: dp.post_caption,
    }

    if (dp.candidate_username === CANDIDATE_A_USERNAME) {
      row[CANDIDATE_A_USERNAME] = dp.average_sentiment_score
    } else {
      row[CANDIDATE_B_USERNAME] = dp.average_sentiment_score
    }

    return row
  })
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    dataKey: string
    value: number
    color: string
    name: string
  }>
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null

  // Find the full data row to get caption and full date
  const firstPayload = payload[0]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const row = (firstPayload as any)?.payload as ChartDataPoint | undefined

  return (
    <div className="rounded-lg border bg-background p-3 shadow-md text-sm">
      <p className="font-semibold">
        {row?.dateISO ? formatDateMedium(row.dateISO) : label}
      </p>
      {row?.caption && (
        <p className="mt-1 max-w-[250px] text-xs text-muted-foreground">
          {row.caption.length > 60
            ? `${row.caption.slice(0, 60)}...`
            : row.caption}
        </p>
      )}
      <div className="mt-2 space-y-1">
        {payload.map((entry) => (
          <p key={entry.dataKey} style={{ color: entry.color }}>
            {entry.name}: {Number(entry.value).toFixed(2)}
          </p>
        ))}
      </div>
    </div>
  )
}

export function SentimentLineChart({
  dataPoints,
  candidateFilter,
}: SentimentLineChartProps) {
  const chartData = transformData(dataPoints, candidateFilter)

  const showCandidateA = candidateFilter === "charlles"
  const showCandidateB = candidateFilter === "sheila"

  return (
    <div style={{ height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            stroke="var(--muted-foreground)"
          />
          <YAxis
            domain={[-1, 1]}
            tickCount={5}
            tickFormatter={(v: number) => v.toFixed(1)}
            tick={{ fontSize: 12 }}
            stroke="var(--muted-foreground)"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <ReferenceLine
            y={0}
            stroke="var(--muted-foreground)"
            strokeDasharray="6 3"
            label={{ value: "Neutro", position: "right", fontSize: 11, fill: "var(--muted-foreground)" }}
          />
          {showCandidateA && (
            <Line
              type="monotone"
              dataKey={CANDIDATE_A_USERNAME}
              name={CANDIDATE_A_DISPLAY}
              stroke="var(--candidate-a)"
              dot={false}
              activeDot={{ r: 6 }}
              connectNulls
              strokeWidth={2}
            />
          )}
          {showCandidateB && (
            <Line
              type="monotone"
              dataKey={CANDIDATE_B_USERNAME}
              name={CANDIDATE_B_DISPLAY}
              stroke="var(--candidate-b)"
              dot={false}
              activeDot={{ r: 6 }}
              connectNulls
              strokeWidth={2}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
