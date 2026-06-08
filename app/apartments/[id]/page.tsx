"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  MapPin, BedDouble, Bath, Users, Car, Maximize,
  ChevronLeft, Calendar, Star, CheckCircle, Building2,
  Share2, Grid2X2, ChevronRight,
} from "lucide-react"
import { toast } from "sonner"
import ImageGallery from "@/components/ImageGallery"
import BookingModal from "@/components/BookingModal"
import { ApartmentDetailSkeleton } from "@/components/Skeletons"
import ApartmentCard from "@/components/ApartmentCard"
import { api } from "@/lib/api"
import type { Apartment, ApartmentListItem } from "@/lib/types"

/* ── Airbnb-style photo grid (desktop only) ── */
function PhotoGrid({
  images,
  title,
  onShowAll,
}: {
  images: string[]
  title: string
  onShowAll: () => void
}) {
  const main = images[0]
  const thumbs = images.slice(1, 5)

  if (images.length === 0) {
    return (
      <div className="w-full h-80 bg-stone-100 rounded-3xl flex items-center justify-center mb-2">
        <Building2 className="w-16 h-16 text-stone-300" />
      </div>
    )
  }

  if (images.length === 1) {
    return (
      <div className="relative w-full aspect-[16/7] rounded-3xl overflow-hidden mb-2">
        <Image src={main} alt={title} fill className="object-cover" sizes="100vw" priority />
        <button
          onClick={onShowAll}
          className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-white/95 hover:bg-white text-stone-800 text-xs font-semibold px-3.5 py-2 rounded-xl shadow-md border border-stone-200 transition-all"
        >
          <Grid2X2 className="w-3.5 h-3.5" />
          Show all photos
        </button>
      </div>
    )
  }

  return (
    <div className="hidden md:grid grid-cols-2 gap-2.5 relative mb-2" style={{ height: "480px" }}>
      {/* Main image */}
      <div className="relative rounded-l-3xl overflow-hidden">
        <Image
          src={main}
          alt={title}
          fill
          className="object-cover hover:brightness-95 transition-all"
          sizes="50vw"
          priority
        />
      </div>

      {/* 2x2 thumbnails */}
      <div className="grid grid-cols-2 grid-rows-2 gap-2.5">
        {[0, 1, 2, 3].map((i) =>
          thumbs[i] ? (
            <div
              key={i}
              className={`relative overflow-hidden ${
                i === 1 ? "rounded-tr-3xl" : i === 3 ? "rounded-br-3xl" : ""
              }`}
            >
              <Image
                src={thumbs[i]}
                alt={`${title} – photo ${i + 2}`}
                fill
                className="object-cover hover:brightness-95 transition-all"
                sizes="25vw"
              />
            </div>
          ) : (
            <div key={i} className={`bg-stone-100 ${i === 1 ? "rounded-tr-3xl" : i === 3 ? "rounded-br-3xl" : ""}`} />
          )
        )}
      </div>

      {/* Show all button */}
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

export default function ApartmentDetailPage() {
  const params = useParams<{ id: string }>()
  const [apartment, setApartment] = useState<Apartment | null>(null)
  const [similar, setSimilar] = useState<ApartmentListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [galleryOpen, setGalleryOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const apt = await api.apartments.get(params.id)
        setApartment(apt)
        api.apartments
          .list({ page_size: 4, ordering: "-created_at" })
          .then((res) => setSimilar(res.results.filter((a) => a.id !== apt.id).slice(0, 3)))
          .catch(() => {})
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load apartment.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [params.id])

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: apartment?.title, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied!")
    }
  }

  if (loading) {
    return (
      <div className="pt-[68px] max-w-6xl mx-auto px-5 sm:px-6 py-10">
        <ApartmentDetailSkeleton />
      </div>
    )
  }

  if (error || !apartment) {
    return (
      <div className="pt-[68px] min-h-screen flex items-center justify-center text-center px-5">
        <div>
          <Building2 className="w-16 h-16 text-stone-200 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-stone-800 mb-2">Apartment Not Found</h2>
          <p className="text-stone-500 mb-6 text-sm">{error ?? "This apartment may no longer be available."}</p>
          <Link
            href="/apartments"
            className="bg-stone-900 text-white rounded-xl px-6 py-3 font-bold text-sm inline-flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Apartments
          </Link>
        </div>
      </div>
    )
  }

  // apartment.images is already string[] (list of full URLs from the serializer)
  const images = apartment.images?.length
    ? apartment.images
    : apartment.primary_image
    ? [apartment.primary_image]
    : []

  const price = Number(apartment.price)
  const locationName =
    apartment.location_data_details?.name ?? apartment.location ?? null

  return (
    <>
      <div className="pt-[68px] bg-white min-h-screen">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          {/* Breadcrumb + actions */}
          <div className="flex items-center justify-between py-5">
            <nav className="flex items-center gap-1.5 text-sm text-stone-500">
              <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
              <Link href="/apartments" className="hover:text-emerald-600 transition-colors">Apartments</Link>
              <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
              <span className="text-stone-800 font-medium line-clamp-1 max-w-[200px]">{apartment.title}</span>
            </nav>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-emerald-600 transition-colors font-medium"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:block">Share</span>
            </button>
          </div>

          {/* Page title – above gallery like Airbnb */}
          <div className="mb-5">
            <div className="flex items-center gap-3 mb-1.5">
              {apartment.featured && (
                <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-100">
                  <Star className="w-3 h-3 fill-current" />
                  Guest favourite
                </div>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight">
              {apartment.title}
            </h1>
            {locationName && (
              <div className="flex items-center gap-1.5 text-stone-500 text-sm mt-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{locationName}</span>
                {apartment.property_details?.name && (
                  <><span className="text-stone-300">·</span><span>{apartment.property_details.name}</span></>
                )}
              </div>
            )}
          </div>

          {/* ── Desktop 5-photo grid ── */}
          <PhotoGrid images={images} title={apartment.title} onShowAll={() => setGalleryOpen(true)} />

          {/* ── Mobile: single hero image with gallery button ── */}
          <div className="md:hidden relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-stone-100">
            {images[0] ? (
              <>
                <Image src={images[0]} alt={apartment.title} fill className="object-cover" sizes="100vw" priority />
                {images.length > 1 && (
                  <button
                    onClick={() => setGalleryOpen(true)}
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-28 lg:pb-20">
            {/* ── Left: Details ── */}
            <div className="lg:col-span-2">

              {/* Key stats bar */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 py-6 border-b border-stone-100 mb-8 text-sm text-stone-600">
                <span className="flex items-center gap-1.5 font-medium text-stone-800">
                  <BedDouble className="w-4 h-4 text-stone-500" />
                  {apartment.bedrooms} bedroom{apartment.bedrooms !== 1 ? "s" : ""}
                </span>
                <span className="flex items-center gap-1.5 font-medium text-stone-800">
                  <Bath className="w-4 h-4 text-stone-500" />
                  {apartment.bathrooms} bathroom{apartment.bathrooms !== 1 ? "s" : ""}
                </span>
                <span className="flex items-center gap-1.5 font-medium text-stone-800">
                  <Users className="w-4 h-4 text-stone-500" />
                  {apartment.guests} guest{apartment.guests !== 1 ? "s" : ""}
                </span>
                {apartment.area && (
                  <span className="flex items-center gap-1.5 font-medium text-stone-800">
                    <Maximize className="w-4 h-4 text-stone-500" />
                    {apartment.area} m²
                  </span>
                )}
                {apartment.garages ? (
                  <span className="flex items-center gap-1.5 font-medium text-stone-800">
                    <Car className="w-4 h-4 text-stone-500" />
                    {apartment.garages} parking
                  </span>
                ) : null}
              </div>

              {/* Description */}
              {apartment.description && (
                <div className="mb-10 pb-10 border-b border-stone-100">
                  <h2 className="text-xl font-bold text-stone-900 mb-4">About this place</h2>
                  <p className="text-stone-600 leading-relaxed whitespace-pre-line text-[15px]">
                    {apartment.description}
                  </p>
                </div>
              )}

              {/* Amenities */}
              {apartment.amenities?.length > 0 && (
                <div className="mb-10 pb-10 border-b border-stone-100">
                  <h2 className="text-xl font-bold text-stone-900 mb-5">What this place offers</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {apartment.amenities.map((a) => (
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

              {/* House rules */}
              <div className="mb-10 pb-10 border-b border-stone-100">
                <h2 className="text-xl font-bold text-stone-900 mb-5">House rules</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "Check-in after 2:00 PM",
                    "Checkout before 11:00 AM",
                    "No smoking indoors",
                    "No parties or events",
                  ].map((rule) => (
                    <div key={rule} className="flex items-center gap-2.5 text-sm text-stone-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      {rule}
                    </div>
                  ))}
                </div>
              </div>

              {/* Map */}
              {apartment.latitude && apartment.longitude && (
                <div className="mb-10">
                  <h2 className="text-xl font-bold text-stone-900 mb-4">Location</h2>
                  <div className="rounded-2xl overflow-hidden h-64 border border-stone-200">
                    <iframe
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                        Number(apartment.longitude) - 0.01
                      }%2C${Number(apartment.latitude) - 0.01}%2C${
                        Number(apartment.longitude) + 0.01
                      }%2C${Number(apartment.latitude) + 0.01}&layer=mapnik&marker=${
                        apartment.latitude
                      }%2C${apartment.longitude}`}
                      className="w-full h-full border-0"
                      loading="lazy"
                      title="Property location"
                    />
                  </div>
                  <a
                    href={`https://www.google.com/maps?q=${apartment.latitude},${apartment.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-3 text-sm text-stone-700 hover:text-emerald-600 font-semibold underline transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    View on Google Maps
                  </a>
                </div>
              )}
            </div>

            {/* ── Right: Booking card (sticky) ── */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
                  {/* Price */}
                  <div className="p-6 pb-5">
                    <div className="flex items-baseline justify-between mb-5">
                      <div>
                        <span className="text-2xl font-extrabold text-stone-900">
                          {apartment.currency}{price.toLocaleString("en-NG")}
                        </span>
                        <span className="text-stone-500 text-base ml-1">/ night</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm font-semibold text-stone-800">
                        <Star className="w-4 h-4 fill-stone-800 text-stone-800" />
                        4.9
                      </div>
                    </div>

                    {/* Availability */}
                    <div
                      className={`flex items-center gap-2 rounded-xl px-3.5 py-2.5 mb-5 text-sm font-semibold ${
                        apartment.is_available
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : "bg-red-50 text-red-600 border border-red-100"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          apartment.is_available ? "bg-emerald-500 animate-pulse" : "bg-red-400"
                        }`}
                      />
                      {apartment.is_available ? "Available — book your dates" : "Currently unavailable"}
                    </div>

                    <button
                      onClick={() => apartment.is_available && setBookingOpen(true)}
                      disabled={!apartment.is_available}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-stone-200 disabled:text-stone-400 text-white rounded-xl py-4 font-black text-base transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Calendar className="w-5 h-5" />
                      {apartment.is_available ? "Reserve" : "Unavailable"}
                    </button>

                    <p className="text-center text-xs text-stone-400 mt-2.5">
                      You won&apos;t be charged yet
                    </p>
                  </div>

                  {/* Quick specs */}
                  <div className="grid grid-cols-3 divide-x divide-stone-100 border-t border-stone-100">
                    {[
                      { icon: BedDouble, label: `${apartment.bedrooms} Bed` },
                      { icon: Bath, label: `${apartment.bathrooms} Bath` },
                      { icon: Users, label: `${apartment.guests} Guests` },
                    ].map(({ icon: Icon, label }) => (
                      <div key={label} className="flex flex-col items-center gap-1 py-4">
                        <Icon className="w-4 h-4 text-emerald-600" />
                        <span className="text-[11px] font-medium text-stone-600">{label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Security note */}
                  <div className="px-5 py-3 bg-stone-50 border-t border-stone-100 text-center text-xs text-stone-400 flex items-center justify-center gap-1.5">
                    <span>🔒</span>
                    Secured by Paystack
                  </div>
                </div>

                {/* Agent */}
                {apartment.agent && (
                  <div className="mt-4 bg-white rounded-2xl border border-stone-100 p-5 shadow-sm">
                    <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-3">Managed by</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-emerald-700 font-bold text-sm">
                          {apartment.agent.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-stone-900 text-sm">{apartment.agent.name}</div>
                        {apartment.agent.phone && (
                          <a href={`tel:${apartment.agent.phone}`} className="text-xs text-emerald-600 hover:underline">
                            {apartment.agent.phone}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Similar apartments */}
          {similar.length > 0 && (
            <div className="pb-20 pt-6 border-t border-stone-100">
              <h2 className="text-2xl font-extrabold text-stone-900 mb-8">More places you might like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                {similar.map((apt) => (
                  <ApartmentCard key={apt.id} apartment={apt} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-stone-100 shadow-2xl px-5 py-3.5 flex items-center justify-between">
        <div>
          <div className="font-extrabold text-stone-900 text-lg">
            {apartment.currency}{price.toLocaleString("en-NG")}
            <span className="text-sm font-normal text-stone-500"> / night</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-stone-500">
            <Star className="w-3 h-3 fill-stone-800 text-stone-800" />
            <span className="text-stone-800 font-semibold">4.9</span>
          </div>
        </div>
        <button
          onClick={() => apartment.is_available && setBookingOpen(true)}
          disabled={!apartment.is_available}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-200 disabled:text-stone-400 text-white rounded-xl px-7 py-3.5 font-black text-sm transition-colors flex items-center gap-2 shadow-sm"
        >
          <Calendar className="w-4 h-4" />
          {apartment.is_available ? "Reserve" : "Unavailable"}
        </button>
      </div>

      {/* Image Gallery lightbox */}
      <ImageGallery
        images={images}
        title={apartment.title}
        externalOpen={galleryOpen}
        onExternalClose={() => setGalleryOpen(false)}
      />

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        apartment={apartment}
      />
    </>
  )
}
