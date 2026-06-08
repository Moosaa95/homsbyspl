import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Browse Apartments",
  description:
    "Browse furnished shortlet apartments in Abuja — Jabi, Maitama, Wuse II and more. Studios, 1–3 bedrooms and penthouses available. Instant booking, all utilities included.",
  openGraph: {
    title: "Browse Apartments – Homsbyspl",
    description: "Furnished shortlet apartments across Abuja. Instant booking, flexible stays.",
  },
  alternates: {
    canonical: "/apartments",
  },
}

export default function ApartmentsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
