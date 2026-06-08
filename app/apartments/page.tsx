"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Search, SlidersHorizontal, X, Building2, ChevronLeft, ChevronRight } from "lucide-react"
import ApartmentCard from "@/components/ApartmentCard"
import { GridSkeleton } from "@/components/Skeletons"
import { api } from "@/lib/api"
import type { ApartmentListItem } from "@/lib/types"

const APARTMENT_TYPES = [
  "Self Contain",
  "1 Bedroom",
  "2 Bedroom",
  "3 Bedroom",
  "Studio",
  "Penthouse",
  "Duplex",
]

function ApartmentsContent() {
  const searchParams = useSearchParams()

  // Filters
  const [search, setSearch] = useState(searchParams.get("search") ?? "")
  const [debouncedSearch, setDebouncedSearch] = useState(search)
  const [type, setType] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [minBeds, setMinBeds] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)

  // Data
  const [apartments, setApartments] = useState<ApartmentListItem[]>([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const PAGE_SIZE = 12
  const totalPages = Math.ceil(count / PAGE_SIZE)

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(t)
  }, [search])

  // Reset page on filter change
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, type, maxPrice, minBeds])

  const fetchApartments = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.apartments.list({
        search: debouncedSearch || undefined,
        type: type || undefined,
        max_price: maxPrice ? Number(maxPrice) : undefined,
        bedrooms: minBeds ? Number(minBeds) : undefined,
        page,
        page_size: PAGE_SIZE,
        ordering: "-created_at",
      })
      setApartments(res.results)
      setCount(res.count)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load apartments.")
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, type, maxPrice, minBeds, page])

  useEffect(() => {
    fetchApartments()
  }, [fetchApartments])

  const hasActiveFilters = type || maxPrice || minBeds

  function clearFilters() {
    setType("")
    setMaxPrice("")
    setMinBeds("")
    setSearch("")
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-[68px]">
      {/* Page header */}
      <div className="bg-stone-900 pt-14 pb-10 px-5">
        <div className="max-w-6xl mx-auto">
          <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">✦ All Properties</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-2">
            Find your stay
          </h1>
          <p className="text-stone-400 text-base">
            {count > 0
              ? `${count} apartment${count !== 1 ? "s" : ""} available right now`
              : "Premium furnished shortlets, ready to move in"}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-6 py-8">
        {/* Search + Filter bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-4 mb-8 sticky top-[68px] z-30">
          <div className="flex gap-3">
            {/* Search */}
            <div className="flex flex-1 items-center gap-3 bg-stone-50 rounded-xl px-4 py-2.5 border border-stone-200 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-50 transition-all">
              <Search className="w-4 h-4 text-stone-400 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, location, or type…"
                className="flex-1 bg-transparent outline-none text-sm text-stone-700 placeholder-stone-400"
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-stone-400 hover:text-stone-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                showFilters || hasActiveFilters
                  ? "bg-stone-900 text-white border-stone-900"
                  : "bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-400"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:block">Filters</span>
              {hasActiveFilters && (
                <span className="w-4 h-4 bg-emerald-500 text-white rounded-full text-[10px] flex items-center justify-center font-black">
                  ✓
                </span>
              )}
            </button>
          </div>

          {/* Expanded filters */}
          {showFilters && (
            <div className="mt-5 pt-5 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Type */}
              <div>
                <label className="block text-[11px] font-black text-stone-500 mb-2.5 uppercase tracking-widest">
                  Apartment Type
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {APARTMENT_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setType(type === t ? "" : t)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        type === t
                          ? "bg-stone-900 text-white"
                          : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max price */}
              <div>
                <label className="block text-[11px] font-black text-stone-500 mb-2.5 uppercase tracking-widest">
                  Max Price / Night (₦)
                </label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="e.g. 50,000"
                  className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all bg-stone-50"
                />
              </div>

              {/* Min beds */}
              <div>
                <label className="block text-[11px] font-black text-stone-500 mb-2.5 uppercase tracking-widest">
                  Min Bedrooms
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((n) => (
                    <button
                      key={n}
                      onClick={() => setMinBeds(minBeds === String(n) ? "" : String(n))}
                      className={`flex-1 py-2.5 rounded-xl border text-sm font-bold transition-all ${
                        minBeds === String(n)
                          ? "bg-stone-900 text-white border-stone-900"
                          : "border-stone-200 text-stone-600 hover:border-stone-400 bg-stone-50"
                      }`}
                    >
                      {n}+
                    </button>
                  ))}
                </div>
              </div>

              {hasActiveFilters && (
                <div className="sm:col-span-3 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1.5 text-red-500 hover:text-red-700 text-sm font-semibold transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        {error ? (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4 text-sm">{error}</p>
            <button
              onClick={fetchApartments}
              className="bg-emerald-600 text-white rounded-xl px-6 py-2.5 text-sm font-bold"
            >
              Try Again
            </button>
          </div>
        ) : loading ? (
          <GridSkeleton count={PAGE_SIZE} />
        ) : apartments.length === 0 ? (
          <div className="text-center py-24">
            <Building2 className="w-14 h-14 text-stone-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-stone-700 mb-2">No apartments found</h3>
            <p className="text-stone-400 mb-6 text-sm">
              Try adjusting your search or clearing the filters.
            </p>
            <button
              onClick={clearFilters}
              className="bg-stone-900 text-white rounded-xl px-6 py-2.5 text-sm font-bold"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="text-sm text-stone-400 mb-6">
              Showing <strong className="text-stone-700">{apartments.length}</strong> of{" "}
              <strong className="text-stone-700">{count}</strong> results
              {(debouncedSearch || type) && (
                <span className="ml-1">
                  for{" "}
                  <strong className="text-stone-700">
                    {[debouncedSearch, type].filter(Boolean).join(", ")}
                  </strong>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {apartments.map((apt) => (
                <ApartmentCard key={apt.id} apartment={apt} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-14">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-semibold text-stone-600 hover:border-stone-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .reduce<(number | "...")[]>((acc, p, i, arr) => {
                      if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...")
                      acc.push(p)
                      return acc
                    }, [])
                    .map((p, i) =>
                      p === "..." ? (
                        <span key={`e-${i}`} className="px-2 text-stone-400 text-sm">
                          …
                        </span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setPage(p as number)}
                          className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors ${
                            page === p
                              ? "bg-stone-900 text-white"
                              : "text-stone-600 hover:bg-stone-100"
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-semibold text-stone-600 hover:border-stone-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function ApartmentsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 pt-32 flex items-start justify-center"><GridSkeleton count={6} /></div>}>
      <ApartmentsContent />
    </Suspense>
  )
}
