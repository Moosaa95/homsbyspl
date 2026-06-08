"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Home as HomeIcon } from "lucide-react"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === "/"

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const transparent = isHome && !scrolled

  const links = [
    { href: "/properties", label: "Properties" },
    { href: "/apartments", label: "Apartments" },
    { href: "/#how-it-works", label: "How It Works" },
    { href: "/#contact", label: "Contact" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        transparent
          ? "bg-transparent border-transparent"
          : "bg-white/96 backdrop-blur-md border-b border-stone-100 shadow-sm"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <div className="flex items-center justify-between h-[68px]">

          {/* ─── Logo ─── */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                transparent ? "bg-white/15 border border-white/25" : "bg-emerald-600"
              }`}>
                <HomeIcon className="w-4.5 h-4.5 text-white" />
              </div>
            </div>
            <span className={`font-bold text-[17px] tracking-tight transition-colors ${
              transparent ? "text-white" : "text-[#403D3D]"
            }`}>
              homs<span className={transparent ? "text-emerald-300" : "text-emerald-600"}>byspl</span>
            </span>
          </Link>

          {/* ─── Desktop nav ─── */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? "text-emerald-600 bg-emerald-50"
                      : transparent
                      ? "text-white/80 hover:text-white hover:bg-white/10"
                      : "text-[#403D3D]/70 hover:text-[#403D3D] hover:bg-stone-50"
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* ─── CTA ─── */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/apartments"
              className={`text-sm font-semibold rounded-xl px-5 py-2.5 transition-all ${
                transparent
                  ? "bg-white text-emerald-700 hover:bg-white/90"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow"
              }`}
            >
              Book a Stay
            </Link>
          </div>

          {/* ─── Mobile toggle ─── */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            className={`md:hidden p-2 rounded-xl transition-colors ${
              transparent ? "text-white hover:bg-white/10" : "text-[#403D3D] hover:bg-stone-100"
            }`}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ─── Mobile drawer ─── */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-stone-100 shadow-xl">
          <div className="px-5 py-4 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-emerald-50 text-emerald-600"
                    : "text-[#403D3D]/75 hover:bg-stone-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              <Link
                href="/apartments"
                onClick={() => setMobileOpen(false)}
                className="flex justify-center items-center w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 text-sm font-bold transition-colors"
              >
                Book a Stay
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
