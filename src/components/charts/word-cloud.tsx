"use client"

import { useState, useCallback } from "react"
import WordCloud from "react-d3-cloud"
import type { WordCloudWord } from "@/lib/types"

interface WordCloudChartProps {
  words: WordCloudWord[]
}

interface TooltipState {
  word: string
  count: number
  x: number
  y: number
}

const WORD_COLORS = [
  "#f97316", // orange-500
  "#14b8a6", // teal-500
  "#a855f7", // purple-500
  "#eab308", // yellow-500
  "#06b6d4", // cyan-500
  "#84cc16", // lime-500
  "#ec4899", // pink-500
  "#8b5cf6", // violet-500
]

export function WordCloudChart({ words }: WordCloudChartProps) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  const cloudWords = words.map((w) => ({ text: w.word, value: w.count }))

  const fontSizeMapper = useCallback((word: { value: number }) => {
    return Math.log2(word.value + 1) * 8 + 10
  }, [])

  const fillMapper = useCallback(
    (_d: unknown, i: number) => {
      return WORD_COLORS[i % WORD_COLORS.length]
    },
    []
  )

  const handleMouseOver = useCallback(
    (_event: unknown, d: { text: string; value: number }) => {
      const event = _event as MouseEvent
      setTooltip({
        word: d.text,
        count: d.value,
        x: event.clientX,
        y: event.clientY,
      })
    },
    []
  )

  const handleMouseOut = useCallback(() => {
    setTooltip(null)
  }, [])

  return (
    <div className="relative">
      <div className="flex items-center justify-center">
        <WordCloud
          data={cloudWords}
          width={800}
          height={400}
          fontSize={fontSizeMapper}
          fill={fillMapper}
          rotate={0}
          padding={4}
          onWordMouseOver={handleMouseOver}
          onWordMouseOut={handleMouseOut}
        />
      </div>

      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 rounded-lg border bg-background px-3 py-2 text-sm shadow-md"
          style={{
            left: tooltip.x + 12,
            top: tooltip.y - 10,
          }}
        >
          <span className="font-semibold">{tooltip.word}</span>
          <span className="ml-1 text-muted-foreground">
            : {tooltip.count} ocorrencias
          </span>
        </div>
      )}
    </div>
  )
}
