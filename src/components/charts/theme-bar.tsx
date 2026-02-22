"use client"

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
} from "recharts"
import type { ThemeData } from "@/lib/types"
import type { CandidateFilter } from "@/lib/constants"
import {
  CANDIDATE_A_USERNAME,
  CANDIDATE_B_USERNAME,
  CANDIDATE_A_DISPLAY,
  CANDIDATE_B_DISPLAY,
  CANDIDATE_A_COLOR,
  CANDIDATE_B_COLOR,
} from "@/lib/constants"
import { formatThemeLabel } from "@/lib/utils"

interface BarChartDataPoint {
  theme: string
  charlles: number
  sheila: number
}

function toBarChartData(themes: ThemeData[]): BarChartDataPoint[] {
  return themes
    .sort((a, b) => b.count - a.count)
    .map((t) => ({
      theme: formatThemeLabel(t.theme),
      charlles:
        t.by_candidate.find((c) => c.username === CANDIDATE_A_USERNAME)
          ?.count ?? 0,
      sheila:
        t.by_candidate.find((c) => c.username === CANDIDATE_B_USERNAME)
          ?.count ?? 0,
    }))
}

interface ThemeBarChartProps {
  themes: ThemeData[]
  candidateFilter: CandidateFilter
}

export function ThemeBarChart({ themes, candidateFilter }: ThemeBarChartProps) {
  const data = toBarChartData(themes)

  const showCandidateA =
    candidateFilter === "all" || candidateFilter === "charlles"
  const showCandidateB =
    candidateFilter === "all" || candidateFilter === "sheila"

  return (
    <div style={{ height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="theme"
            tick={{ fontSize: 12 }}
            stroke="var(--muted-foreground)"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            stroke="var(--muted-foreground)"
          />
          <Tooltip />
          <Legend />
          {showCandidateA && (
            <Bar
              dataKey="charlles"
              name={CANDIDATE_A_DISPLAY}
              fill={CANDIDATE_A_COLOR}
            >
              <LabelList dataKey="charlles" position="top" fontSize={11} />
            </Bar>
          )}
          {showCandidateB && (
            <Bar
              dataKey="sheila"
              name={CANDIDATE_B_DISPLAY}
              fill={CANDIDATE_B_COLOR}
            >
              <LabelList dataKey="sheila" position="top" fontSize={11} />
            </Bar>
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
