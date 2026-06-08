import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "sonner"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: {
    default: "Homsbyspl – Stay Like You Live There",
    template: "%s | Homsbyspl",
  },
  description:
    "Premium furnished shortlet apartments across Nigeria. Flexible stays, all utilities included, instant booking. Your home away from home.",
  keywords: [
    "shortlet", "furnished apartment", "short stay", "Abuja shortlet",
    "Lagos shortlet", "Nigeria furnished apartment", "homsbyspl",
  ],
  openGraph: {
    title: "Homsbyspl – Stay Like You Live There",
    description: "Premium furnished shortlet apartments. Flexible stays, instant booking.",
    type: "website",
    siteName: "Homsbyspl",
  },
  twitter: {
    card: "summary_large_image",
    title: "Homsbyspl – Stay Like You Live There",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Toaster
          richColors
          position="top-right"
          toastOptions={{
            style: { fontFamily: "var(--font-inter)" },
          }}
        />
      </body>
    </html>
  )
}
