export default function Loading() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center gap-3">
        <div className="h-8 w-32 bg-[#1A1A1A] animate-pulse rounded" />
        <div className="h-6 w-24 bg-[#1A1A1A] animate-pulse rounded-full" />
      </div>
      
      <div className="h-10 w-full max-w-md bg-[#1A1A1A] animate-pulse rounded-md" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="h-[200px] w-full bg-[#1A1A1A] animate-pulse rounded-md" />
        ))}
      </div>
    </div>
  );
}
