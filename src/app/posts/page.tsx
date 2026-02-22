import { Suspense } from "react"
import { LoadingSkeleton } from "@/components/shared/loading-skeleton"
import { PostsContent } from "@/app/posts/posts-content"

export default function PostsPage() {
  return (
    <Suspense
      fallback={
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Posts</h1>
          <p className="mt-2 text-muted-foreground">
            Ranking de posts por engajamento e sentimento.
          </p>
          <div className="mt-6">
            <LoadingSkeleton variant="table" />
          </div>
        </div>
      }
    >
      <PostsContent />
    </Suspense>
  )
}
