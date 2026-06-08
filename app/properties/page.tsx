"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Search, Building2, X } from "lucide-react"
import { motion, type Variants } from "framer-motion"
import PropertyCard from "@/components/PropertyCard"
import { api } from "@/lib/api"
import type { PropertyListItem } from "@/lib/types"

const up: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
}

function PropertyCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/3] rounded-2xl bg-stone-200 mb-3" />
      <div className="h-4 bg-stone-200 rounded-lg w-3/4 mb-2" />
      <div className="h-3 bg-stone-100 rounded-lg w-1/2" />
    </div>
  )
}

function PropertiesContent() {
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("search") ?? "")
  const [debouncedSearch, setDebouncedSearch] = useState(search)
  const [properties, setProperties] = useState<PropertyListItem[]>([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(t)
  }, [search])

  const fetchProperties = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.properties.list({
        search: debouncedSearch || undefined,
        page_size: 24,
        ordering: "-created_at",
      })
      setProperties(res.results)
      setCount(res.count)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load properties.")
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch])

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  return (
    <div className="min-h-screen bg-stone-50 pt-[68px]">
      {/* Header */}
      <div className="bg-stone-900 pt-14 pb-10 px-5">
        <div className="max-w-6xl mx-auto">
          <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">✦ All Buildings</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-2">
            Our properties
          </h1>
          <p className="text-stone-400 text-base">
            {count > 0
              ? `${count} propert${count !== 1 ? "ies" : "y"} available`
              : "Premium buildings and complexes across Nigeria"}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-6 py-8">
        {/* Search bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-4 mb-8 sticky top-[68px] z-30">
          <div className="flex flex-1 items-center gap-3 bg-stone-50 rounded-xl px-4 py-2.5 border border-stone-200 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-50 transition-all">
            <Search className="w-4 h-4 text-stone-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search properties by name or location…"
              className="flex-1 bg-transparent outline-none text-sm text-stone-700 placeholder-stone-400"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-stone-400 hover:text-stone-600 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {error ? (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4 text-sm">{error}</p>
            <button
              onClick={fetchProperties}
              className="bg-emerald-600 text-white rounded-xl px-6 py-2.5 text-sm font-bold"
            >
              Try Again
            </button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {Array.from({ length: 6 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-24">
            <Building2 className="w-14 h-14 text-stone-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-stone-700 mb-2">No properties found</h3>
            <p className="text-stone-400 mb-6 text-sm">
              {debouncedSearch
                ? `No results for "${debouncedSearch}". Try a different search.`
                : "Check back soon — more properties are being added."}
            </p>
            {debouncedSearch && (
              <button
                onClick={() => setSearch("")}
                className="bg-stone-900 text-white rounded-xl px-6 py-2.5 text-sm font-bold"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <>
            <p className="text-sm text-stone-400 mb-6">
              Showing <strong className="text-stone-700">{properties.length}</strong> of{" "}
              <strong className="text-stone-700">{count}</strong> properties
              {debouncedSearch && (
                <span> for <strong className="text-stone-700">&ldquo;{debouncedSearch}&rdquo;</strong></span>
              )}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {properties.map((property, i) => (
                <motion.div
                  key={property.id}
                  variants={up}
                  initial="hidden"
                  animate="show"
                  custom={i % 9}
                >
                  <PropertyCard property={property} />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function PropertiesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-50 pt-[68px]">
          <div className="bg-stone-900 pt-14 pb-10 px-5">
            <div className="max-w-6xl mx-auto">
              <div className="h-6 bg-stone-700 rounded-lg w-40 mb-3 animate-pulse" />
              <div className="h-10 bg-stone-800 rounded-xl w-64 animate-pulse" />
            </div>
          </div>
          <div className="max-w-6xl mx-auto px-5 sm:px-6 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/3] rounded-2xl bg-stone-200 mb-3" />
                  <div className="h-4 bg-stone-200 rounded-lg w-3/4 mb-2" />
                  <div className="h-3 bg-stone-100 rounded-lg w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <PropertiesContent />
    </Suspense>
  )
}
