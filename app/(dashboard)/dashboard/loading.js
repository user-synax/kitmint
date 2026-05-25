export default function Loading() {
  return (
    <div className="p-8 max-w-[1200px] mx-auto space-y-10">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 w-40 bg-[#1A1A1A] animate-pulse rounded" />
          <div className="h-4 w-56 bg-[#1A1A1A] animate-pulse rounded" />
        </div>
        <div className="h-11 w-32 bg-[#1A1A1A] animate-pulse rounded-md" />
      </div>

      <div className="h-[120px] w-full max-w-md bg-[#1A1A1A] animate-pulse rounded-xl" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-[200px] w-full bg-[#1A1A1A] animate-pulse rounded-md" />
        ))}
      </div>
    </div>
  );
}
