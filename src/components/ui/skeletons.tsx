import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ArticleCardSkeleton() {
  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="relative h-48 bg-muted">
        <Skeleton className="h-full w-full" />
      </div>
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>
      <CardContent className="flex-grow">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-0">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </CardFooter>
    </Card>
  )
}

export function FilterSidebarSkeleton() {
  return (
    <div className="bg-card rounded-lg border p-4 h-full">
      <Skeleton className="h-6 w-1/2 mb-4" />

      <div className="mb-6">
        <Skeleton className="h-4 w-16 mb-2" />
        <Skeleton className="h-10 w-full mb-2" />
      </div>

      <div className="mb-6">
        <Skeleton className="h-4 w-24 mb-2" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <Skeleton className="h-4 w-4 rounded-sm" />
              <Skeleton className="h-4 w-28" />
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <Skeleton className="h-4 w-16 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>

      <Skeleton className="h-10 w-full mt-6" />
    </div>
  )
}

export function SearchBarSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8 w-full">
      <div className="flex-1 flex gap-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-24" />
      </div>
      <Skeleton className="h-10 w-28 md:w-32" />
    </div>
  )
}

export function TabsSkeleton() {
  return (
    <div className="mb-6">
      <Skeleton className="h-10 w-full max-w-md" />
    </div>
  )
}

