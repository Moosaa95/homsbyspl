"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion, type Variants } from "framer-motion"
import {
  MapPin, Building2, ChevronRight, Share2, Grid2X2,
  CheckCircle, Star, BedDouble, Bath, Users, Calendar,
  ArrowRight, X,
} from "lucide-react"
import { toast } from "sonner"
import BookingModal from "@/components/BookingModal"
import ApartmentCard from "@/components/ApartmentCard"
import { api } from "@/lib/api"
import type { Property, ApartmentListItem, Apartment } from "@/lib/types"

const up: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
}

/* ── Photo grid (desktop) identical pattern to apartment detail ── */
function PhotoGrid({
  images,
  name,
  onShowAll,
}: {
  images: string[]
  name: string
  onShowAll: () => void
}) {
  if (images.length === 0) {
    return (
      <div className="w-full h-72 bg-stone-100 rounded-3xl flex items-center justify-center mb-2">
        <Building2 className="w-16 h-16 text-stone-300" />
      </div>
    )
  }
  if (images.length === 1) {
    return (
      <div className="relative w-full aspect-[16/7] rounded-3xl overflow-hidden mb-2">
        <Image src={images[0]} alt={name} fill className="object-cover" sizes="100vw" priority />
      </div>
    )
  }
  return (
    <div className="hidden md:grid grid-cols-2 gap-2.5 relative mb-2" style={{ height: "480px" }}>
      <div className="relative rounded-l-3xl overflow-hidden">
        <Image src={images[0]} alt={name} fill className="object-cover hover:brightness-95 transition-all" sizes="50vw" priority />
      </div>
      <div className="grid grid-cols-2 grid-rows-2 gap-2.5">
        {[0, 1, 2, 3].map((i) =>
          images[i + 1] ? (
            <div key={i} className={`relative overflow-hidden ${i === 1 ? "rounded-tr-3xl" : i === 3 ? "rounded-br-3xl" : ""}`}>
              <Image src={images[i + 1]} alt={`${name} – photo ${i + 2}`} fill className="object-cover hover:brightness-95 transition-all" sizes="25vw" />
            </div>
          ) : (
            <div key={i} className={`bg-stone-100 ${i === 1 ? "rounded-tr-3xl" : i === 3 ? "rounded-br-3xl" : ""}`} />
          )
        )}
      </div>
      <button
        onClick={onShowAll}
        className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-white/95 hover:bg-white text-stone-800 text-xs font-semibold px-3.5 py-2 rounded-xl shadow-md border border-stone-200 transition-all"
      >
        <Grid2X2 className="w-3.5 h-3.5" />
        Show all {images.length} photos
      </button>
    </div>
  )
}

/* ── Inline lightbox for property images ── */
function Lightbox({
  images,
  name,
  startIndex,
  onClose,
}: {
  images: string[]
  name: string
  startIndex: number
  onClose: () => void
}) {
  const [active, setActive] = useState(startIndex)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") setActive((i) => (i === 0 ? images.length - 1 : i - 1))
      if (e.key === "ArrowRight") setActive((i) => (i === images.length - 1 ? 0 : i + 1))
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [images.length, onClose])

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-2.5 z-10 transition-colors">
        <X className="w-5 h-5" />
      </button>
      <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/70 text-sm">
        {active + 1} / {images.length}
      </div>
      <div className="relative w-full h-full max-w-5xl max-h-[85vh] mx-4" onClick={(e) => e.stopPropagation()}>
        <Image src={images[active]} alt={`${name} – photo ${active + 1}`} fill className="object-contain" sizes="100vw" />
      </div>
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); setActive((i) => (i === 0 ? images.length - 1 : i - 1)) }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
          >
            <ChevronRight className="w-6 h-6 rotate-180" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setActive((i) => (i === images.length - 1 ? 0 : i + 1)) }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setActive(i) }}
                className={`w-2 h-2 rounded-full transition-all ${i === active ? "bg-emerald-400 scale-125" : "bg-white/40"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/* ── Apartment row card for the property detail list ── */
function ApartmentRowCard({
  apartment,
  onBook,
}: {
  apartment: ApartmentListItem
  onBook: (apt: ApartmentListItem) => void
}) {
  const price = Number(apartment.price)
  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col sm:flex-row">
      {/* Image */}
      <div className="relative w-full sm:w-52 shrink-0 aspect-[4/3] sm:aspect-auto sm:h-auto bg-stone-100">
        {apartment.primary_image ? (
          <Image
            src={apartment.primary_image}
            alt={apartment.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 208px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Building2 className="w-8 h-8 text-stone-300" />
          </div>
        )}
        {apartment.featured && (
          <div className="absolute top-2 left-2 bg-white text-stone-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            Guest favourite
          </div>
        )}
        {!apartment.is_available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white/90 text-stone-800 text-xs font-semibold px-3 py-1 rounded-full">Not available</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col justify-between p-5 flex-1 min-w-0">
        <div>
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <h3 className="font-bold text-stone-900 text-base leading-snug line-clamp-1">{apartment.title}</h3>
            <div className="flex items-center gap-0.5 shrink-0">
              <Star className="w-3.5 h-3.5 fill-stone-800 text-stone-800" />
              <span className="text-stone-700 text-xs font-semibold">4.9</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-stone-500 text-sm mb-3">
            <span className="flex items-center gap-1 capitalize">{apartment.type}</span>
            {apartment.bedrooms > 0 && (
              <span className="flex items-center gap-1">
                <BedDouble className="w-3.5 h-3.5" /> {apartment.bedrooms} bed{apartment.bedrooms !== 1 ? "s" : ""}
              </span>
            )}
            {apartment.bathrooms > 0 && (
              <span className="flex items-center gap-1">
                <Bath className="w-3.5 h-3.5" /> {apartment.bathrooms} bath{apartment.bathrooms !== 1 ? "s" : ""}
              </span>
            )}
            {apartment.guests > 0 && (
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> {apartment.guests} guests
              </span>
            )}
          </div>

          {apartment.description && (
            <p className="text-stone-500 text-sm line-clamp-2 leading-relaxed">{apartment.description}</p>
          )}
        </div>

        {/* Price + actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-stone-100">
          <div>
            <span className="font-extrabold text-stone-900 text-lg">
              {apartment.currency}{price.toLocaleString("en-NG")}
            </span>
            <span className="text-stone-400 text-sm"> / night</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/apartments/${apartment.id}`}
              className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 text-sm font-semibold hover:border-stone-400 transition-colors"
            >
              View details
            </Link>
            <button
              onClick={() => onBook(apartment)}
              disabled={!apartment.is_available}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-200 disabled:text-stone-400 text-white text-sm font-bold transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" />
              {apartment.is_available ? "Reserve" : "Unavailable"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────── */

export default function PropertyDetailPage() {
  const params = useParams<{ id: string }>()
  const [property, setProperty] = useState<Property | null>(null)
  const [apartments, setApartments] = useState<ApartmentListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [aptsLoading, setAptsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [bookingApt, setBookingApt] = useState<Apartment | null>(null)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")

  useEffect(() => {
    setLoading(true)
    setError(null)
    api.properties
      .get(params.id)
      .then((p) => {
        setProperty(p)
        // fetch apartments for this property
        setAptsLoading(true)
        return api.apartments.list({ property: p.id, page_size: 50, ordering: "price" })
      })
      .then((res) => setApartments(res.results))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load property."))
      .finally(() => { setLoading(false); setAptsLoading(false) })
  }, [params.id])

  async function handleBook(apt: ApartmentListItem) {
    // Fetch full apartment data for the booking modal
    try {
      const full = await api.apartments.get(apt.id)
      setBookingApt(full)
      setBookingOpen(true)
    } catch {
      toast.error("Could not load apartment details. Try again.")
    }
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: property?.name, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied!")
    }
  }

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="pt-[68px] bg-white min-h-screen">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-10 animate-pulse space-y-6">
          <div className="h-5 bg-stone-200 rounded w-64" />
          <div className="aspect-[16/7] bg-stone-200 rounded-3xl" />
          <div className="h-9 bg-stone-200 rounded-xl w-2/3" />
          <div className="h-4 bg-stone-100 rounded w-full" />
          <div className="h-4 bg-stone-100 rounded w-5/6" />
        </div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="pt-[68px] min-h-screen flex items-center justify-center text-center px-5">
        <div>
          <Building2 className="w-16 h-16 text-stone-200 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-stone-800 mb-2">Property Not Found</h2>
          <p className="text-stone-500 mb-6 text-sm">{error ?? "This property may no longer be available."}</p>
          <Link href="/properties" className="bg-stone-900 text-white rounded-xl px-6 py-3 font-bold text-sm inline-flex items-center gap-2">
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Properties
          </Link>
        </div>
      </div>
    )
  }

  const images = property.images?.length
    ? property.images.sort((a, b) => a.order - b.order).map((img) => img.image_url ?? img.image)
    : []

  const locationName = property.location_details?.name ?? null

  return (
    <>
      <div className="pt-[68px] bg-white min-h-screen">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center justify-between py-5">
            <nav className="flex items-center gap-1.5 text-sm text-stone-500">
              <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
              <Link href="/properties" className="hover:text-emerald-600 transition-colors">Properties</Link>
              <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
              <span className="text-stone-800 font-medium line-clamp-1 max-w-[200px]">{property.name}</span>
            </nav>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-emerald-600 transition-colors font-medium"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:block">Share</span>
            </button>
          </div>

          {/* Title */}
          <div className="mb-5">
            <div className="flex items-center gap-3 mb-2">
              {property.featured && (
                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-100">
                  <Star className="w-3 h-3 fill-current" />
                  Featured
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-100">
                <Building2 className="w-3 h-3" />
                {property.apartment_count} apartment{property.apartment_count !== 1 ? "s" : ""}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 leading-tight">
              {property.name}
            </h1>
            {locationName && (
              <div className="flex items-center gap-1.5 text-stone-500 text-sm mt-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{locationName}</span>
                {property.location_details?.state && (
                  <><span className="text-stone-300">·</span><span>{property.location_details.state}</span></>
                )}
              </div>
            )}
          </div>

          {/* Desktop photo grid */}
          <PhotoGrid images={images} name={property.name} onShowAll={() => setLightboxOpen(true)} />

          {/* Mobile hero */}
          <div className="md:hidden relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-stone-100">
            {images[0] ? (
              <>
                <Image src={images[0]} alt={property.name} fill className="object-cover" sizes="100vw" priority />
                {images.length > 1 && (
                  <button
                    onClick={() => setLightboxOpen(true)}
                    className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white/95 text-stone-800 text-xs font-semibold px-3 py-1.5 rounded-xl shadow border border-stone-200"
                  >
                    <Grid2X2 className="w-3 h-3" />
                    {images.length} photos
                  </button>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Building2 className="w-12 h-12 text-stone-300" />
              </div>
            )}
          </div>

          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-20">
            {/* Left: info */}
            <div className="lg:col-span-2 space-y-10">

              {/* Description */}
              {property.description && (
                <div className="pb-10 border-b border-stone-100">
                  <h2 className="text-xl font-bold text-stone-900 mb-4">About this property</h2>
                  <p className="text-stone-600 leading-relaxed whitespace-pre-line text-[15px]">
                    {property.description}
                  </p>
                </div>
              )}

              {/* Amenities */}
              {property.amenities?.length > 0 && (
                <div className="pb-10 border-b border-stone-100">
                  <h2 className="text-xl font-bold text-stone-900 mb-5">Building amenities</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {property.amenities.map((a) => (
                      <div
                        key={a}
                        className="flex items-center gap-2.5 py-2.5 px-3.5 bg-stone-50 rounded-xl text-sm text-stone-700 border border-stone-100"
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="capitalize">{a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Map */}
              {property.latitude && property.longitude && (
                <div className="pb-10 border-b border-stone-100">
                  <h2 className="text-xl font-bold text-stone-900 mb-4">Location</h2>
                  {property.address && (
                    <p className="text-stone-500 text-sm mb-4 flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      {property.address}
                    </p>
                  )}
                  <div className="rounded-2xl overflow-hidden h-64 border border-stone-200">
                    <iframe
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${Number(property.longitude) - 0.01}%2C${Number(property.latitude) - 0.01}%2C${Number(property.longitude) + 0.01}%2C${Number(property.latitude) + 0.01}&layer=mapnik&marker=${property.latitude}%2C${property.longitude}`}
                      className="w-full h-full border-0"
                      loading="lazy"
                      title="Property location"
                    />
                  </div>
                  <a
                    href={`https://www.google.com/maps?q=${property.latitude},${property.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-3 text-sm text-stone-700 hover:text-emerald-600 font-semibold underline transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    View on Google Maps
                  </a>
                </div>
              )}

              {/* ── APARTMENTS IN THIS PROPERTY ── */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-extrabold text-stone-900">
                      Apartments in this building
                    </h2>
                    {!aptsLoading && apartments.length > 0 && (
                      <p className="text-stone-400 text-sm mt-1">
                        {apartments.length} unit{apartments.length !== 1 ? "s" : ""} available to book
                      </p>
                    )}
                  </div>
                  {apartments.length > 0 && (
                    <div className="flex items-center gap-1 bg-stone-100 rounded-xl p-1">
                      <button
                        onClick={() => setViewMode("list")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === "list" ? "bg-white shadow-sm text-stone-900" : "text-stone-500 hover:text-stone-700"}`}
                      >
                        List
                      </button>
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-stone-900" : "text-stone-500 hover:text-stone-700"}`}
                      >
                        Grid
                      </button>
                    </div>
                  )}
                </div>

                {aptsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-40 bg-stone-100 rounded-2xl animate-pulse" />
                    ))}
                  </div>
                ) : apartments.length === 0 ? (
                  <div className="text-center py-16 bg-stone-50 rounded-2xl border border-stone-100">
                    <Building2 className="w-10 h-10 text-stone-200 mx-auto mb-3" />
                    <p className="text-stone-500 text-sm font-medium">No apartments listed yet</p>
                    <p className="text-stone-400 text-xs mt-1">Check back soon or browse all properties</p>
                    <Link
                      href="/apartments"
                      className="inline-flex items-center gap-1.5 mt-4 text-sm font-bold text-emerald-600 hover:text-emerald-700"
                    >
                      Browse all apartments
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ) : viewMode === "list" ? (
                  <div className="space-y-4">
                    {apartments.map((apt, i) => (
                      <motion.div
                        key={apt.id}
                        variants={up}
                        initial="hidden"
                        animate="show"
                        custom={i}
                      >
                        <ApartmentRowCard apartment={apt} onBook={handleBook} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-9">
                    {apartments.map((apt, i) => (
                      <motion.div
                        key={apt.id}
                        variants={up}
                        initial="hidden"
                        animate="show"
                        custom={i}
                      >
                        <ApartmentCard apartment={apt} />
                        {apt.is_available && (
                          <button
                            onClick={() => handleBook(apt)}
                            className="mt-2 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            Reserve
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: property summary card (sticky) */}
            <div className="hidden lg:block">
              <div className="sticky top-24 space-y-4">
                <div className="bg-white rounded-2xl border border-stone-200 shadow-xl p-6">
                  <p className="text-xs font-black text-stone-500 uppercase tracking-widest mb-4">Property Overview</p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-stone-500">Total units</span>
                      <span className="font-bold text-stone-900">{property.apartment_count}</span>
                    </div>
                    {locationName && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-stone-500">Location</span>
                        <span className="font-bold text-stone-900">{locationName}</span>
                      </div>
                    )}
                    {property.entity && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-stone-500">Managed by</span>
                        <span className="font-bold text-stone-900 text-right max-w-[140px] leading-snug">{property.entity}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-stone-500">Available now</span>
                      <span className="font-bold text-emerald-600">
                        {apartments.filter((a) => a.is_available).length} unit{apartments.filter((a) => a.is_available).length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  {property.address && (
                    <div className="flex items-start gap-2 py-3 border-t border-stone-100 text-sm text-stone-500">
                      <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{property.address}</span>
                    </div>
                  )}
                </div>

                <Link
                  href="/properties"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-stone-200 text-stone-600 text-sm font-semibold hover:border-stone-400 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  All Properties
                </Link>
                <Link
                  href="/apartments"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-sm font-bold transition-colors"
                >
                  Browse all apartments
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && images.length > 0 && (
        <Lightbox images={images} name={property.name} startIndex={0} onClose={() => setLightboxOpen(false)} />
      )}

      {/* Booking Modal */}
      {bookingApt && (
        <BookingModal
          isOpen={bookingOpen}
          onClose={() => { setBookingOpen(false); setBookingApt(null) }}
          apartment={bookingApt}
        />
      )}
    </>
  )
}
