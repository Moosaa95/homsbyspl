import Link from "next/link"
import Image from "next/image"
import { MapPin, Building2, Star } from "lucide-react"
import type { PropertyListItem } from "@/lib/types"

interface Props {
  property: PropertyListItem
}

export default function PropertyCard({ property }: Props) {
  const locationName = property.location_details?.name ?? null

  return (
    <Link href={`/properties/${property.id}`} className="group block">

      {/* Image */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 mb-3">
        {property.primary_image ? (
          <Image
            src={property.primary_image}
            alt={property.name}
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

        {/* Featured badge */}
        {property.featured && (
          <div className="absolute top-3 left-3 bg-white text-stone-900 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            Featured
          </div>
        )}

        {/* Apartment count pill */}
        <div className="absolute bottom-3 left-3 bg-black/55 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
          {property.apartment_count} apartment{property.apartment_count !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Info */}
      <div className="px-0.5">
        <h3 className="font-semibold text-stone-900 text-sm leading-snug mb-0.5 group-hover:text-emerald-700 transition-colors line-clamp-1">
          {property.name}
        </h3>
        {locationName && (
          <p className="text-stone-500 text-sm flex items-center gap-1">
            <MapPin className="w-3 h-3 shrink-0 text-stone-400" />
            {locationName}
          </p>
        )}
      </div>
    </Link>
  )
}
