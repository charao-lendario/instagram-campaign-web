"use client"

import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorMessageProps {
  error: Error
  onRetry?: () => void
}

export function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5 px-6 py-8 text-center">
      <AlertCircle className="mb-3 h-8 w-8 text-destructive" />
      <p className="mb-1 font-medium text-foreground">
        Nao foi possivel carregar os dados.
      </p>
      <p className="mb-4 text-sm text-muted-foreground">
        {error.message}
      </p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
    </div>
  )
}
