import { Skeleton } from "@/components/ui/skeleton"

interface LoadingSkeletonProps {
  variant: "card" | "chart" | "table" | "text"
}

function CardSkeleton() {
  return (
    <div className="rounded-lg border p-6">
      <Skeleton className="mb-4 h-4 w-1/3" />
      <Skeleton className="mb-2 h-8 w-1/2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  )
}

function ChartSkeleton() {
  return (
    <div className="rounded-lg border p-6">
      <Skeleton className="mb-4 h-4 w-1/4" />
      <div className="flex items-end gap-2">
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  )
}

function TableSkeleton() {
  return (
    <div className="rounded-lg border">
      <div className="border-b p-4">
        <Skeleton className="h-4 w-full" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4 border-b p-4 last:border-b-0">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/6" />
          <Skeleton className="h-4 w-1/6" />
        </div>
      ))}
    </div>
  )
}

function TextSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
    </div>
  )
}

const VARIANT_MAP = {
  card: CardSkeleton,
  chart: ChartSkeleton,
  table: TableSkeleton,
  text: TextSkeleton,
} as const

export function LoadingSkeleton({ variant }: LoadingSkeletonProps) {
  const Component = VARIANT_MAP[variant]
  return <Component />
}
