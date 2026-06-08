import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Browse Properties",
  description:
    "Explore shortlet properties and buildings in Abuja. View apartments available per property and book instantly.",
  openGraph: {
    title: "Browse Properties – Homsbyspl",
    description: "Shortlet properties and buildings in Abuja. Find your perfect stay.",
  },
  alternates: {
    canonical: "/properties",
  },
}

export default function PropertiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
