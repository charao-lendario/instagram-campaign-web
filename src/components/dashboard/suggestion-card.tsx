"use client"

import { useState } from "react"
import {
  Info,
  Target,
  Video,
  FileText,
  ChevronDown,
  ChevronUp,
  Users,
  TrendingUp,
  Zap,
} from "lucide-react"
import type { Suggestion } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SuggestionCardProps {
  suggestion: Suggestion
  index: number
}

const PRIORITY_BORDER: Record<Suggestion["priority"], string> = {
  high: "border-l-4 border-l-red-500",
  medium: "border-l-4 border-l-yellow-500",
  low: "border-l-4 border-l-green-500",
}

const PRIORITY_BADGE_LABEL: Record<Suggestion["priority"], string> = {
  high: "Urgente",
  medium: "Importante",
  low: "Oportunidade",
}

const PRIORITY_BADGE_CLASS: Record<Suggestion["priority"], string> = {
  high: "bg-red-900/40 text-red-300 border-red-700/50",
  medium: "bg-yellow-900/40 text-yellow-300 border-yellow-700/50",
  low: "bg-green-900/40 text-green-300 border-green-700/50",
}

const CATEGORIA_LABELS: Record<string, string> = {
  conteudo: "Conteúdo",
  engajamento: "Engajamento",
  posicionamento: "Posicionamento",
  gestao_crise: "Gestão de Crise",
  alianca_estrategica: "Aliança Estratégica",
}

const PARA_QUEM_LABELS: Record<string, string> = {
  charlles: "Charlles",
  sheila: "Sheila",
  ambos: "Ambos",
}

const PARA_QUEM_CLASS: Record<string, string> = {
  charlles: "bg-blue-900/40 text-blue-300 border-blue-700/50",
  sheila: "bg-pink-900/40 text-pink-300 border-pink-700/50",
  ambos: "bg-purple-900/40 text-purple-300 border-purple-700/50",
}

export function SuggestionCard({ suggestion, index }: SuggestionCardProps) {
  const [expanded, setExpanded] = useState(false)

  const hasExpandableContent =
    suggestion.acoes_concretas?.length ||
    suggestion.exemplo_post ||
    suggestion.roteiro_video

  return (
    <Card className={`${PRIORITY_BORDER[suggestion.priority]} transition-all`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white">
              {index + 1}
            </span>
            <div>
              <CardTitle className="text-base text-white">
                {suggestion.title}
              </CardTitle>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className={PRIORITY_BADGE_CLASS[suggestion.priority]}
                >
                  {PRIORITY_BADGE_LABEL[suggestion.priority]}
                </Badge>
                {suggestion.categoria && (
                  <Badge variant="outline" className="bg-slate-800/50 text-slate-300 border-slate-600/50">
                    {CATEGORIA_LABELS[suggestion.categoria] ?? suggestion.categoria}
                  </Badge>
                )}
                {suggestion.para_quem && (
                  <Badge
                    variant="outline"
                    className={PARA_QUEM_CLASS[suggestion.para_quem] ?? "bg-slate-800/50 text-slate-300 border-slate-600/50"}
                  >
                    {PARA_QUEM_LABELS[suggestion.para_quem] ?? suggestion.para_quem}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm leading-relaxed text-muted-foreground">
          {suggestion.description}
        </p>

        {/* Supporting data */}
        {suggestion.supporting_data && (
          <div className="flex gap-2 rounded-lg border border-blue-800/30 bg-blue-950/30 p-3 text-sm">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
            <span className="text-blue-200">{suggestion.supporting_data}</span>
          </div>
        )}

        {/* Target audience & expected impact - always visible */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {suggestion.publico_alvo && (
            <div className="flex gap-2 rounded-lg border border-border/30 bg-secondary/30 p-3 text-sm">
              <Users className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />
              <div>
                <p className="text-xs font-medium text-violet-300">Público-Alvo</p>
                <p className="mt-0.5 text-foreground/70">{suggestion.publico_alvo}</p>
              </div>
            </div>
          )}
          {suggestion.impacto_esperado && (
            <div className="flex gap-2 rounded-lg border border-border/30 bg-secondary/30 p-3 text-sm">
              <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              <div>
                <p className="text-xs font-medium text-emerald-300">Impacto Esperado</p>
                <p className="mt-0.5 text-foreground/70">{suggestion.impacto_esperado}</p>
              </div>
            </div>
          )}
        </div>

        {/* Expandable content */}
        {hasExpandableContent && (
          <>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-border/30 bg-secondary/20 py-2 text-sm font-medium text-foreground/60 transition-colors hover:bg-secondary/40 hover:text-foreground/80"
            >
              <Zap className="h-4 w-4" />
              {expanded ? "Esconder conteúdo prático" : "Ver ações concretas, copy e roteiro"}
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {expanded && (
              <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
                {/* Concrete actions */}
                {suggestion.acoes_concretas && suggestion.acoes_concretas.length > 0 && (
                  <div className="rounded-lg border border-amber-800/30 bg-amber-950/20 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Target className="h-4 w-4 text-amber-400" />
                      <p className="text-sm font-medium text-amber-300">Ações Concretas</p>
                    </div>
                    <ul className="ml-6 space-y-1.5">
                      {suggestion.acoes_concretas.map((acao, i) => (
                        <li key={i} className="text-sm text-foreground/70 list-disc">
                          {acao}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Post example */}
                {suggestion.exemplo_post && (
                  <div className="rounded-lg border border-cyan-800/30 bg-cyan-950/20 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-cyan-400" />
                      <p className="text-sm font-medium text-cyan-300">Copy para Postagem</p>
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/70">
                      {suggestion.exemplo_post}
                    </p>
                  </div>
                )}

                {/* Video script */}
                {suggestion.roteiro_video && (
                  <div className="rounded-lg border border-rose-800/30 bg-rose-950/20 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Video className="h-4 w-4 text-rose-400" />
                      <p className="text-sm font-medium text-rose-300">Roteiro para Reels/Stories</p>
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/70">
                      {suggestion.roteiro_video}
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
