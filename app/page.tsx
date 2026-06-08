"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, type Variants } from "framer-motion"
import {
  Search, ArrowRight, Shield, Zap, Star,
  CheckCircle2, MapPin, Play, Pause,
} from "lucide-react"
import ApartmentCard from "@/components/ApartmentCard"
import { GridSkeleton } from "@/components/Skeletons"
import { api } from "@/lib/api"
import type { ApartmentListItem } from "@/lib/types"

const up: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.09, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
}

const TABS = [
  { label: "All", value: "" },
  { label: "Studio", value: "Studio" },
  { label: "1 Bedroom", value: "1 Bedroom" },
  { label: "2 Bedroom", value: "2 Bedroom" },
  { label: "3 Bedroom", value: "3 Bedroom" },
  { label: "Penthouse", value: "Penthouse" },
]

const TRUST = [
  { icon: Shield, label: "Verified Properties" },
  { icon: Zap, label: "Instant Booking" },
  { icon: Star, label: "Premium Quality" },
  { icon: CheckCircle2, label: "24 / 7 Support" },
]

const AREAS = [
  { name: "Maitama", city: "Abuja", color: "from-emerald-500 to-teal-600", emoji: "🏛️" },
  { name: "Victoria Island", city: "Lagos", color: "from-blue-500 to-indigo-600", emoji: "🌊" },
  { name: "Wuse II", city: "Abuja", color: "from-violet-500 to-purple-600", emoji: "🏢" },
  { name: "Lekki", city: "Lagos", color: "from-amber-500 to-orange-600", emoji: "🌴" },
  { name: "GRA", city: "Port Harcourt", color: "from-green-500 to-emerald-700", emoji: "🌿" },
  { name: "Asokoro", city: "Abuja", color: "from-rose-500 to-pink-600", emoji: "🏡" },
]

const TESTIMONIALS = [
  {
    name: "Adaeze O.",
    role: "Marketing Manager · Lagos",
    text: "I was sceptical at first — I'd had bad experiences with shortlets before. The apartment in Maitama was spotless, the WiFi was fast, and the team was genuinely helpful. Booked twice more since then.",
    initials: "AO",
    bg: "bg-emerald-100",
    color: "text-emerald-700",
  },
  {
    name: "Emeka T.",
    role: "Software Engineer · Abuja",
    text: "Perfect for my 3-week training. Kitchen fully equipped, building security was solid, bed was actually comfortable. Would recommend to anyone coming to Abuja for work.",
    initials: "ET",
    bg: "bg-amber-100",
    color: "text-amber-700",
  },
  {
    name: "Funmi A.",
    role: "Returning from the UK",
    text: "We needed somewhere to land while our place was being set up. Homsbyspl had options that felt like a real home — not a hotel with a tiny kitchenette. The 2-bedroom in Wuse II was perfect.",
    initials: "FA",
    bg: "bg-blue-100",
    color: "text-blue-700",
  },
]

const WHY_US = [
  "Every property personally inspected before listing",
  "Flexible stays — a single night or six months",
  "Utilities, WiFi, and the small things, always included",
  "Real support from real people when you need it",
]

export default function HomePage() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState("")
  const [apartments, setApartments] = useState<ApartmentListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [videoPaused, setVideoPaused] = useState(false)

  useEffect(() => {
    setLoading(true)
    api.apartments
      .list({ type: activeTab || undefined, page_size: 6, ordering: "-created_at" })
      .then((res) => setApartments(res.results))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [activeTab])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    router.push(`/apartments${search.trim() ? `?search=${encodeURIComponent(search.trim())}` : ""}`)
  }

  function toggleVideo() {
    if (!videoRef.current) return
    if (videoPaused) {
      videoRef.current.play()
      setVideoPaused(false)
    } else {
      videoRef.current.pause()
      setVideoPaused(true)
    }
  }

  return (
    <>
      {/* ═══════════════════════════════════════════════════
          HERO — video background
      ═══════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* ── Video background ── */}
        {/* Add your video file to public/hero-video.mp4 */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="/hero-poster.jpg"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Layered overlays for depth */}
        <div className="absolute inset-0 bg-[#403D3D]/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#403D3D]/60 via-[#403D3D]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#403D3D] via-transparent to-transparent opacity-60" />

        {/* ── Content ── */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 pt-28 pb-20 sm:pt-36 sm:pb-24">
          <div className="max-w-2xl">

            {/* Availability badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-8 sm:mb-10"
            >
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shrink-0" />
              <span className="text-white/80 text-xs sm:text-sm font-medium">
                Available in Abuja · Lagos · Port Harcourt
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-[clamp(2.8rem,8vw,5.5rem)] font-black text-white leading-[0.92] tracking-tight mb-6 sm:mb-7"
            >
              Stay like you
              <br />
              <span className="gradient-text">live there.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/65 text-base sm:text-lg leading-relaxed mb-8 sm:mb-10 max-w-lg"
            >
              Furnished apartments for professionals, families, and travellers
              who want more than just a room. All utilities included.
            </motion.p>

            {/* Search bar */}
            <motion.form
              onSubmit={handleSearch}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-2 bg-white rounded-2xl p-2 shadow-2xl shadow-black/40 mb-6 max-w-xl"
            >
              <div className="flex flex-1 items-center gap-3 px-4">
                <Search className="w-4 h-4 text-stone-400 shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Where do you want to stay?"
                  className="flex-1 py-3 outline-none text-[#403D3D] placeholder-stone-400 text-sm bg-transparent"
                />
              </div>
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 py-3.5 font-bold text-sm transition-colors whitespace-nowrap"
              >
                Find a stay
              </button>
            </motion.form>

            {/* Location chips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-2"
            >
              {["Abuja", "Wuse II", "Maitama", "Lekki", "Victoria Island"].map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => router.push(`/apartments?search=${encodeURIComponent(loc)}`)}
                  className="flex items-center gap-1.5 bg-white/10 hover:bg-white/18 border border-white/15 rounded-full px-3.5 py-1.5 text-white/70 hover:text-white text-xs font-medium transition-all backdrop-blur-sm"
                >
                  <MapPin className="w-3 h-3" />
                  {loc}
                </button>
              ))}
            </motion.div>
          </div>
        </div>

        {/* ── Video controls ── */}
        <button
          onClick={toggleVideo}
          className="absolute bottom-6 right-6 z-10 w-9 h-9 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all"
          aria-label={videoPaused ? "Play video" : "Pause video"}
        >
          {videoPaused
            ? <Play className="w-3.5 h-3.5 ml-0.5" />
            : <Pause className="w-3.5 h-3.5" />
          }
        </button>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/30 pointer-events-none"
        >
          <span className="text-[10px] tracking-[0.2em] uppercase font-medium">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════
          TRUST BAR
      ═══════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-stone-100">
        <div className="max-w-5xl mx-auto px-5 py-4">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {TRUST.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-[#403D3D]/60 text-sm">
                <Icon className="w-4 h-4 text-emerald-500 shrink-0" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FEATURED STAYS
      ═══════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 bg-stone-50">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">

          <motion.div
            variants={up}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10"
          >
            <div>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">✦ Curated For You</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#403D3D] leading-tight">
                Our available stays
              </h2>
            </div>
            <Link
              href="/apartments"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 group transition-colors"
            >
              View all
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Type tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 mb-7 scrollbar-none">
            {TABS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setActiveTab(value)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeTab === value
                    ? "bg-[#403D3D] text-white shadow-sm"
                    : "bg-white text-stone-600 border border-stone-200 hover:border-stone-400"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <GridSkeleton count={6} />
          ) : apartments.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-stone-400 text-base">No apartments found for this category.</p>
              <button onClick={() => setActiveTab("")} className="mt-4 text-emerald-600 font-semibold text-sm underline">
                Show all
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-9">
              {apartments.map((apt, i) => (
                <motion.div
                  key={apt.id}
                  variants={up}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  custom={i}
                >
                  <ApartmentCard apartment={apt} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-10 sm:mt-12">
            <Link
              href={`/apartments${activeTab ? `?type=${encodeURIComponent(activeTab)}` : ""}`}
              className="inline-flex items-center gap-2 bg-[#403D3D] hover:bg-[#2e2b2b] text-white rounded-xl px-8 py-3.5 font-bold text-sm transition-colors shadow-sm"
            >
              Browse all apartments
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          WHY HOMSBYSPL
      ═══════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-24 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left */}
          <motion.div variants={up} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-4">Our Promise</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#403D3D] leading-[1.1] mb-5">
              Homes that feel
              <span className="block gradient-text">like yours.</span>
            </h2>
            <p className="text-stone-500 leading-relaxed mb-8 text-[15px] max-w-md">
              We know what it feels like to need a comfortable base — whether
              you&rsquo;re on a work assignment, in transition, or just want to
              travel better. Every apartment on Homsbyspl is personally verified,
              fully furnished, and ready to make you feel at home from day one.
            </p>

            <ul className="space-y-3.5 mb-10">
              {WHY_US.map((point, i) => (
                <motion.li
                  key={i}
                  variants={up}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  custom={i}
                  className="flex items-start gap-3"
                >
                  <span className="mt-0.5 w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  </span>
                  <span className="text-[#403D3D]/75 text-sm leading-relaxed">{point}</span>
                </motion.li>
              ))}
            </ul>

            <Link
              href="/apartments"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-7 py-3.5 font-bold text-sm transition-colors shadow-sm group"
            >
              Explore Stays
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Right: stat cards */}
          <motion.div
            variants={up}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={1}
            className="relative h-[380px] lg:h-[420px] hidden lg:block"
          >
            <div className="absolute inset-6 bg-emerald-50 rounded-3xl" />

            <div className="absolute top-8 right-8 bg-white rounded-2xl shadow-xl p-4 w-44 animate-float">
              <div className="text-2xl font-extrabold text-[#403D3D]">50+</div>
              <div className="text-xs text-stone-400 mt-0.5">Premium apartments</div>
              <div className="mt-2 flex gap-0.5">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
              </div>
            </div>

            <div className="absolute bottom-14 left-8 bg-white rounded-2xl shadow-xl p-4 w-44 animate-float-slow">
              <div className="text-xs text-stone-400 mb-1">Most popular</div>
              <div className="text-sm font-bold text-[#403D3D]">2 Bedroom Flat</div>
              <div className="text-xs text-stone-400 mt-1.5">2 bath · 4 guests</div>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-600 rounded-2xl shadow-2xl p-5 text-white text-center w-36">
              <div className="text-3xl font-black">200+</div>
              <div className="text-xs text-emerald-200 mt-1">Happy guests</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-16 sm:py-20 bg-stone-50">
        <div className="max-w-5xl mx-auto px-5 sm:px-6">
          <motion.div variants={up} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-12">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-3">Simple Process</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#403D3D]">How it works</h2>
            <p className="text-stone-400 mt-3 max-w-md mx-auto text-sm leading-relaxed">
              From search to check-in in minutes. No paperwork. No surprises.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { num: "01", title: "Browse & pick", desc: "Filter by location, size, price, and dates. Every listing has real photos and honest descriptions." },
              { num: "02", title: "Book & pay", desc: "Reserve in minutes with our secure payment system. Instant confirmation sent to your email." },
              { num: "03", title: "Arrive & relax", desc: "Check in at your convenience. Everything is ready — just bring yourself and your bags." },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                variants={up}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                className="bg-white rounded-2xl p-7 border border-stone-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-5xl font-black text-stone-100 mb-4 leading-none select-none">{step.num}</div>
                <h3 className="text-base font-bold text-[#403D3D] mb-2 capitalize">{step.title}</h3>
                <p className="text-stone-400 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <motion.div variants={up} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-10">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-3">Real Guests</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#403D3D]">What our guests say</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                variants={up}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                className="bg-stone-50 rounded-2xl p-6 border border-stone-100"
              >
                <div className="flex gap-0.5 mb-4">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-[#403D3D]/70 text-sm leading-relaxed mb-5 italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 ${t.bg} rounded-full flex items-center justify-center ${t.color} text-xs font-bold shrink-0`}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-[#403D3D] text-sm">{t.name}</div>
                    <div className="text-xs text-stone-400">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          POPULAR AREAS
      ═══════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 bg-stone-50">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <motion.div variants={up} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-10">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-3">We&rsquo;re Everywhere</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#403D3D]">Popular destinations</h2>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {AREAS.map((area, i) => (
              <motion.button
                key={area.name}
                variants={up}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                onClick={() => router.push(`/apartments?search=${encodeURIComponent(area.name)}`)}
                className={`relative bg-gradient-to-br ${area.color} rounded-2xl p-4 sm:p-5 text-white text-left overflow-hidden group transition-all hover:scale-105 hover:shadow-xl`}
              >
                <div className="text-3xl mb-2 sm:mb-3">{area.emoji}</div>
                <div className="font-bold text-sm leading-tight">{area.name}</div>
                <div className="text-[11px] text-white/70 mt-0.5">{area.city}</div>
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CTA
      ═══════════════════════════════════════════════════ */}
      <section className="py-24 sm:py-28 relative overflow-hidden bg-[#403D3D]">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-emerald-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-3xl mx-auto px-5 text-center text-white">
          <motion.h2
            variants={up}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-5"
          >
            Ready to find your
            <span className="block gradient-text">home away from home?</span>
          </motion.h2>
          <motion.p
            variants={up}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={1}
            className="text-white/50 text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed"
          >
            Join hundreds of guests who chose comfort, convenience, and quality with Homsbyspl.
          </motion.p>
          <motion.div
            variants={up}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={2}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/apartments"
              className="bg-white text-[#403D3D] hover:bg-stone-100 rounded-2xl px-10 py-4 font-black text-base inline-flex items-center justify-center gap-2 transition-all shadow-2xl hover:-translate-y-0.5"
            >
              Browse Apartments
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="https://wa.me/2348000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-[#25D366] rounded-2xl px-10 py-4 font-bold text-base inline-flex items-center justify-center gap-2 transition-all"
            >
              WhatsApp Us
            </a>
          </motion.div>
        </div>
      </section>
    </>
  )
}
