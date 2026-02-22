"use client"

import type { PieLabelRenderProps } from "recharts"
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts"
import type { ThemeData } from "@/lib/types"
import type { CandidateFilter } from "@/lib/constants"
import {
  CANDIDATE_A_USERNAME,
  CANDIDATE_B_USERNAME,
  CANDIDATE_A_DISPLAY,
  CANDIDATE_B_DISPLAY,
} from "@/lib/constants"
import { formatThemeLabel } from "@/lib/utils"

const PIE_COLORS = [
  "#3b82f6",
  "#ef4444",
  "#22c55e",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#6366f1",
]

interface PieDataPoint {
  name: string
  value: number
}

function toPieData(
  themes: ThemeData[],
  candidateUsername: string
): PieDataPoint[] {
  return themes
    .map((t) => ({
      name: formatThemeLabel(t.theme),
      value:
        t.by_candidate.find((c) => c.username === candidateUsername)?.count ?? 0,
    }))
    .filter((d) => d.value > 0)
}

interface ThemePieChartProps {
  themes: ThemeData[]
  candidateFilter: CandidateFilter
}

function renderLabel(props: PieLabelRenderProps) {
  const cx = Number(props.cx ?? 0)
  const cy = Number(props.cy ?? 0)
  const midAngle = Number(props.midAngle ?? 0)
  const innerRadius = Number(props.innerRadius ?? 0)
  const outerRadius = Number(props.outerRadius ?? 0)
  const percent = Number(props.percent ?? 0)
  const name = String(props.name ?? "")

  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 1.4
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  if (percent < 0.05) return null

  return (
    <text
      x={x}
      y={y}
      fill="var(--foreground)"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={11}
    >
      {name} ({(percent * 100).toFixed(0)}%)
    </text>
  )
}

function SinglePie({
  data,
  title,
}: {
  data: PieDataPoint[]
  title: string
}) {
  return (
    <div className="flex flex-col items-center">
      <p className="mb-2 text-sm font-medium text-muted-foreground">{title}</p>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label={renderLabel}
              labelLine={false}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={PIE_COLORS[index % PIE_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function ThemePieChart({ themes, candidateFilter }: ThemePieChartProps) {
  const username =
    candidateFilter === "charlles" ? CANDIDATE_A_USERNAME : CANDIDATE_B_USERNAME
  const displayName =
    candidateFilter === "charlles" ? CANDIDATE_A_DISPLAY : CANDIDATE_B_DISPLAY
  const data = toPieData(themes, username)

  return <SinglePie data={data} title={displayName} />
}
