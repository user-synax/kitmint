export default function Loading() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 pt-8 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 lg:gap-12">
        <div className="space-y-12">
          {/* Header Skeleton */}
          <div className="space-y-4">
            <div className="h-3 w-24 bg-[#1A1A1A] animate-pulse rounded" />
            <div className="h-6 w-full bg-[#1A1A1A] animate-pulse rounded border-l-2 border-primary/20" />
          </div>

          {/* Section Skeletons */}
          <div className="space-y-4">
            <div className="h-3 w-32 bg-[#1A1A1A] animate-pulse rounded" />
            <div className="h-[140px] w-full bg-[#1A1A1A] animate-pulse rounded-md" />
          </div>
          <div className="space-y-4">
            <div className="h-3 w-32 bg-[#1A1A1A] animate-pulse rounded" />
            <div className="h-[280px] w-full bg-[#1A1A1A] animate-pulse rounded-md" />
          </div>
          <div className="space-y-4">
            <div className="h-3 w-32 bg-[#1A1A1A] animate-pulse rounded" />
            <div className="h-[180px] w-full bg-[#1A1A1A] animate-pulse rounded-md" />
          </div>
          <div className="space-y-4">
            <div className="h-3 w-32 bg-[#1A1A1A] animate-pulse rounded" />
            <div className="h-[120px] w-full bg-[#1A1A1A] animate-pulse rounded-md" />
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="hidden lg:block">
          <div className="h-[300px] w-full bg-[#1A1A1A] animate-pulse rounded-lg" />
        </div>
      </div>
    </div>
  );
}
