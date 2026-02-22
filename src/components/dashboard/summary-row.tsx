"use client"

import { Card, CardContent } from "@/components/ui/card"
import { SentimentBadge } from "@/components/dashboard/sentiment-badge"
import { formatDate } from "@/lib/utils"

interface SummaryRowProps {
  totalComments: number
  averageSentiment: number
  lastScrape: string | null
}

export function SummaryRow({
  totalComments,
  averageSentiment,
  lastScrape,
}: SummaryRowProps) {
  return (
    <Card>
      <CardContent>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Total de comentários analisados:
            </span>
            <span className="text-lg font-bold">
              {totalComments.toLocaleString("pt-BR")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Sentimento geral:
            </span>
            <SentimentBadge score={averageSentiment} />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Última coleta:
            </span>
            <span className="text-sm font-medium">
              {formatDate(lastScrape)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
