import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { CandidateMetrics } from "@/lib/types"
import type { CandidateFilter } from "@/lib/constants"
import {
  CANDIDATE_A_USERNAME,
  CANDIDATE_B_USERNAME,
} from "@/lib/constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format an ISO date string to pt-BR format "DD/MM/YYYY HH:mm".
 * Returns "Nunca" if the value is null.
 */
export function formatDate(iso: string | null): string {
  if (!iso) return "Nunca"
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso))
}

/**
 * Format an ISO date string to short "DD/MM" for chart X-axis.
 */
export function formatDateShort(iso: string): string {
  const d = new Date(iso)
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  }).format(d)
}

/**
 * Format an ISO date string to "DD/MM/YYYY" for tooltips.
 */
export function formatDateMedium(iso: string): string {
  const d = new Date(iso)
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d)
}

// --- Theme Label Formatting ---

const THEME_LABELS: Record<string, string> = {
  saude: "Saude",
  seguranca: "Seguranca",
  educacao: "Educacao",
  economia: "Economia",
  infraestrutura: "Infraestrutura",
  corrupcao: "Corrupcao",
  emprego: "Emprego",
  meio_ambiente: "Meio Ambiente",
  outros: "Outros",
}

/**
 * Format a theme_category enum value into a human-readable label.
 * Handles known themes via map and unknown themes via fallback formatting.
 */
export function formatThemeLabel(theme: string): string {
  return (
    THEME_LABELS[theme] ??
    theme
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
  )
}

/**
 * Resolve a CandidateFilter URL param value to a candidate_id UUID.
 * Uses the overview data (candidates array) for UUID lookup.
 * Returns undefined if "all" is selected (meaning no filter).
 */
export function getCandidateId(
  filter: CandidateFilter,
  candidates: CandidateMetrics[]
): string | undefined {
  if (filter === "all") return undefined

  const username =
    filter === "charlles" ? CANDIDATE_A_USERNAME : CANDIDATE_B_USERNAME

  const candidate = candidates.find((c) => c.username === username)
  return candidate?.candidate_id
}
