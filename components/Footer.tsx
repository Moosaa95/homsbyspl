import Link from "next/link"
import { Home as HomeIcon, Mail, Phone, MapPin, MessageCircle } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#403D3D] text-stone-400" id="contact">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center">
                <HomeIcon className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="font-bold text-white text-[17px] tracking-tight">
                homs<span className="text-emerald-400">byspl</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 text-white/40">
              Where comfort meets convenience. Premium furnished apartments for professionals, families, and travellers who want more than just a room.
            </p>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/2348000000000?text=Hi%2C%20I%20want%20to%20book%20a%20shortlet%20apartment"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] rounded-xl px-4 py-2.5 text-sm font-semibold transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp
            </a>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white/80 font-semibold mb-4 text-sm uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { href: "/properties", label: "Browse Properties" },
                { href: "/apartments", label: "Browse Apartments" },
                { href: "/apartments?featured=true", label: "Featured Stays" },
                { href: "/#how-it-works", label: "How It Works" },
                { href: "/apartments?type=Studio", label: "Studio Apartments" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-white/50 hover:text-emerald-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white/80 font-semibold mb-4 text-sm uppercase tracking-wider">
              Support
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                "Booking Policy",
                "Cancellation Policy",
                "Payment & Refunds",
                "Privacy Policy",
                "Terms of Service",
              ].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/50 hover:text-emerald-400 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white/80 font-semibold mb-4 text-sm uppercase tracking-wider">
              Get in Touch
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-white/50 leading-relaxed">Jabi, Abuja, Federal Capital Territory, Nigeria</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <a href="tel:+2348000000000" className="text-white/50 hover:text-emerald-400 transition-colors">
                  +234 800 000 0000
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <a href="mailto:hello@homsbyspl.com" className="text-white/50 hover:text-emerald-400 transition-colors">
                  hello@homsbyspl.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/30">
          <p>© {new Date().getFullYear()} Homsbyspl. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Secure payments by <span className="text-emerald-500 font-semibold">Paystack</span></span>
          </div>
        </div>
      </div>
    </footer>
  )
}
