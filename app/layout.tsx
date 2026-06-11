import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import { Toaster } from "sonner"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://homsbyspl.com"
const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "Homsbyspl – Premium Shortlet Apartments in Abuja",
    template: "%s | Homsbyspl",
  },
  description:
    "Book premium furnished shortlet apartments in Abuja — Jabi, Maitama, Wuse II, Asokoro and more. All utilities included, instant booking, flexible stays from 1 night to 6 months.",

  keywords: [
    "shortlet Abuja",
    "furnished apartment Abuja",
    "short stay Abuja",
    "Jabi shortlet",
    "Maitama shortlet",
    "Wuse II shortlet",
    "Asokoro shortlet",
    "Abuja serviced apartment",
    "homsbyspl",
    "shortlet FCT",
    "furnished flat Abuja",
    "short term rental Abuja",
  ],

  authors: [{ name: "Homsbyspl" }],
  creator: "Homsbyspl",
  publisher: "Homsbyspl",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    title: "Homsbyspl – Premium Shortlet Apartments in Abuja",
    description:
      "Furnished shortlet apartments in Jabi, Maitama, Wuse II & Asokoro. Instant booking, all utilities included.",
    url: BASE_URL,
    siteName: "Homsbyspl",
    type: "website",
    locale: "en_NG",
  },

  twitter: {
    card: "summary_large_image",
    title: "Homsbyspl – Premium Shortlet Apartments in Abuja",
    description:
      "Furnished shortlet apartments in Jabi, Maitama & more. Instant booking, all utilities included.",
  },

  alternates: {
    canonical: BASE_URL,
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: "Homsbyspl",
  description:
    "Premium furnished shortlet apartments in Abuja. Flexible stays, all utilities included, instant booking.",
  url: BASE_URL,
  telephone: "+2348000000000",
  email: "hello@homsbyspl.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Jabi",
    addressLocality: "Abuja",
    addressRegion: "Federal Capital Territory",
    addressCountry: "NG",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 9.0765,
    longitude: 7.3986,
  },
  priceRange: "₦₦–₦₦₦",
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "WiFi", value: true },
    { "@type": "LocationFeatureSpecification", name: "Air conditioning", value: true },
    { "@type": "LocationFeatureSpecification", name: "Fully equipped kitchen", value: true },
  ],
  areaServed: [
    { "@type": "City", name: "Abuja" },
  ],
  sameAs: [],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { page_path: window.location.pathname });
              `}
            </Script>
          </>
        )}
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
