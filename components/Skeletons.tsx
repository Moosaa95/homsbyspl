export function ApartmentCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
      <div className="h-52 bg-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </div>
      <div className="p-5 space-y-3">
        <div className="flex justify-between gap-2">
          <div className="h-5 bg-gray-100 rounded-lg w-3/4" />
          <div className="h-5 bg-gray-100 rounded-md w-16" />
        </div>
        <div className="h-4 bg-gray-100 rounded w-1/2" />
        <div className="space-y-2">
          <div className="h-3.5 bg-gray-100 rounded w-full" />
          <div className="h-3.5 bg-gray-100 rounded w-4/5" />
        </div>
        <div className="flex gap-4 pt-3 border-t border-gray-50">
          <div className="h-4 bg-gray-100 rounded w-16" />
          <div className="h-4 bg-gray-100 rounded w-16" />
          <div className="h-4 bg-gray-100 rounded w-20" />
        </div>
      </div>
    </div>
  )
}

export function ApartmentDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-80 bg-gray-100 rounded-2xl mb-3 relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </div>
      <div className="flex gap-2 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 flex-1 bg-gray-100 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-8 bg-gray-100 rounded-xl w-3/4" />
          <div className="h-4 bg-gray-100 rounded w-1/3" />
          <div className="h-4 bg-gray-100 rounded-xl w-full" />
          <div className="h-4 bg-gray-100 rounded-xl w-5/6" />
          <div className="h-4 bg-gray-100 rounded-xl w-4/6" />
        </div>
        <div className="h-96 bg-gray-100 rounded-2xl" />
      </div>
    </div>
  )
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ApartmentCardSkeleton key={i} />
      ))}
    </div>
  )
}
