"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, Expand } from "lucide-react"

interface Props {
  images: string[]
  title: string
  externalOpen?: boolean
  onExternalClose?: () => void
}

export default function ImageGallery({ images, title, externalOpen, onExternalClose }: Props) {
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  const isLightboxOpen = lightbox || (externalOpen ?? false)

  function closeLightbox() {
    setLightbox(false)
    onExternalClose?.()
  }

  const prev = useCallback(() => {
    setActive((i) => (i === 0 ? images.length - 1 : i - 1))
  }, [images.length])

  const next = useCallback(() => {
    setActive((i) => (i === images.length - 1 ? 0 : i + 1))
  }, [images.length])

  useEffect(() => {
    if (!isLightboxOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox()
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLightboxOpen, prev, next])

  if (!images.length) return null

  const mainSrc = images[active]

  return (
    <>
      {/* Main gallery */}
      <div className="relative">
        {/* Main image */}
        <div
          className="relative h-72 sm:h-96 rounded-2xl overflow-hidden cursor-zoom-in bg-gray-100"
          onClick={() => setLightbox(true)}
        >
          <Image
            src={mainSrc}
            alt={`${title} – photo ${active + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 66vw"
            priority={active === 0}
          />
          {/* Expand hint */}
          <div className="absolute bottom-3 right-3 glass rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 text-white text-xs">
            <Expand className="w-3.5 h-3.5" />
            View full screen
          </div>
          {/* Counter */}
          <div className="absolute top-3 right-3 glass rounded-lg px-2.5 py-1 text-white text-xs font-medium">
            {active + 1} / {images.length}
          </div>
        </div>

        {/* Prev/Next on main */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev() }}
              className="absolute left-3 top-1/2 -translate-y-1/2 glass text-white rounded-full p-2 hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next() }}
              className="absolute right-3 top-1/2 -translate-y-1/2 glass text-white rounded-full p-2 hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1 scrollbar-thin">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                i === active
                  ? "border-emerald-500 scale-[1.03] shadow-md"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={src}
                alt={`Thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-2.5 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Counter */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            {active + 1} / {images.length}
          </div>

          {/* Image */}
          <div
            className="relative w-full h-full max-w-5xl max-h-[85vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={mainSrc}
              alt={`${title} – photo ${active + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev() }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next() }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Thumbnail strip */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setActive(i) }}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === active ? "bg-emerald-400 scale-125" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  )
}
