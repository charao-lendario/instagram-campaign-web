"use client"

import { ResponsiveContainer, LineChart, Line } from "recharts"

interface SparklineProps {
  previousAvg: number
  recentAvg: number
  color: string
}

export function Sparkline({ previousAvg, recentAvg, color }: SparklineProps) {
  const data = [{ value: previousAvg }, { value: recentAvg }]

  return (
    <ResponsiveContainer width="100%" height={60}>
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
