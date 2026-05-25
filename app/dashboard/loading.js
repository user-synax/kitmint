export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <div className="h-8 w-48 bg-[#1A1A1A] animate-pulse rounded" />
        <div className="h-4 w-64 bg-[#1A1A1A] animate-pulse rounded" />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-[200px] w-full bg-[#1A1A1A] animate-pulse rounded-md" />
        ))}
      </div>
    </div>
  );
}
