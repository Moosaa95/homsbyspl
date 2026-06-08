import Link from "next/link"
import Image from "next/image"
import { MapPin, BedDouble, Users, Star, Building2, Heart } from "lucide-react"
import type { ApartmentListItem } from "@/lib/types"

interface Props {
  apartment: ApartmentListItem
}

export default function ApartmentCard({ apartment }: Props) {
  const price = Number(apartment.price)
  const locationName =
    apartment.location_data_details?.name ?? apartment.location ?? null

  return (
    <Link href={`/apartments/${apartment.id}`} className="group block">

      {/* ─── Image ─── */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 mb-3">
        {apartment.primary_image ? (
          <Image
            src={apartment.primary_image}
            alt={apartment.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-stone-100 to-stone-200">
            <Building2 className="w-10 h-10 text-stone-300" />
            <span className="text-xs text-stone-400">No photo yet</span>
          </div>
        )}

        {/* Wishlist button — decorative for now */}
        <button
          onClick={(e) => e.preventDefault()}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-sm transition-all duration-200 hover:scale-110"
          aria-label="Save"
        >
          <Heart className="w-3.5 h-3.5 text-stone-400" />
        </button>

        {/* Guest favourite badge */}
        {apartment.featured && (
          <div className="absolute top-3 left-3 bg-white text-stone-900 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm tracking-tight">
            Guest favourite
          </div>
        )}

        {/* Not available overlay */}
        {!apartment.is_available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
            <span className="bg-white/90 text-stone-800 font-semibold text-sm px-4 py-2 rounded-full">
              Not available
            </span>
          </div>
        )}
      </div>

      {/* ─── Info ─── */}
      <div className="px-0.5">
        <div className="flex justify-between items-start gap-2 mb-0.5">
          <h3 className="font-semibold text-stone-900 text-sm leading-snug line-clamp-1 group-hover:text-emerald-700 transition-colors">
            {apartment.title}
          </h3>
          {/* Placeholder rating — replace with real data when available */}
          <div className="flex items-center gap-0.5 shrink-0 ml-2">
            <Star className="w-3 h-3 fill-stone-800 text-stone-800" />
            <span className="text-stone-800 text-xs font-medium">4.9</span>
          </div>
        </div>

        {locationName && (
          <p className="text-stone-500 text-sm line-clamp-1 mb-0.5 flex items-center gap-1">
            <MapPin className="w-3 h-3 shrink-0 text-stone-400" />
            {locationName}
          </p>
        )}

        <p className="text-stone-400 text-sm mb-1.5 flex items-center gap-2">
          <span className="capitalize">{apartment.type}</span>
          {apartment.bedrooms > 0 && (
            <>
              <span>·</span>
              <span className="flex items-center gap-1">
                <BedDouble className="w-3 h-3" />
                {apartment.bedrooms} {apartment.bedrooms === 1 ? "bed" : "beds"}
              </span>
            </>
          )}
          {apartment.guests > 0 && (
            <>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {apartment.guests}
              </span>
            </>
          )}
        </p>

        <p className="text-sm text-stone-900">
          <span className="font-bold">
            {apartment.currency}
            {price.toLocaleString("en-NG")}
          </span>
          <span className="text-stone-500 font-normal"> night</span>
        </p>
      </div>
    </Link>
  )
}
