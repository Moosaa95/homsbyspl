"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  CheckCircle2, XCircle, Loader2, Calendar, Hash,
  ArrowRight, Home, MessageCircle,
} from "lucide-react"
import { api } from "@/lib/api"

/* ── What the backend actually returns from /payments/verify/ ── */
interface VerifyResponse {
  success: boolean
  message?: string
  status?: string       // "successful" | "failed" | "pending" | ...
  booking_id?: string
  reference?: string
  amount?: number | string
  currency?: string
}

function VerifyContent() {
  const searchParams = useSearchParams()
  const reference = searchParams.get("reference")
  const bookingIdFromUrl = searchParams.get("booking_id")

  const [state, setState] = useState<"loading" | "success" | "error">("loading")
  const [result, setResult] = useState<VerifyResponse | null>(null)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    if (!reference) {
      setState("error")
      setErrorMessage("No payment reference found in the URL.")
      return
    }

    api.payments
      .verify(reference)
      .then((res) => {
        // Backend returns { success: boolean, status: "successful"|"failed"|..., booking_id, ... }
        const raw = res as unknown as VerifyResponse
        if (raw.success || raw.status === "successful") {
          setState("success")
          setResult(raw)
        } else {
          setState("error")
          setErrorMessage(
            raw.message ?? "Payment could not be confirmed. Please contact support."
          )
        }
      })
      .catch((err) => {
        setState("error")
        setErrorMessage(
          err instanceof Error ? err.message : "Verification failed. Please contact support."
        )
      })
  }, [reference])

  const bookingId = result?.booking_id ?? bookingIdFromUrl

  /* ── Loading ── */
  if (state === "loading") {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <Loader2 className="w-9 h-9 text-emerald-500 animate-spin" />
        </div>
        <h2 className="text-2xl font-bold text-stone-800 mb-2">Verifying payment…</h2>
        <p className="text-stone-400 text-sm">This takes just a moment</p>
      </div>
    )
  }

  /* ── Error ── */
  if (state === "error") {
    return (
      <div className="text-center py-20 max-w-md mx-auto">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-stone-800 mb-3">Verification failed</h2>
        <p className="text-stone-500 mb-8 leading-relaxed text-sm max-w-sm mx-auto">{errorMessage}</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/apartments"
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 py-3 font-bold text-sm inline-flex items-center justify-center gap-2 transition-colors"
          >
            Browse Apartments
          </Link>
          <a
            href="https://wa.me/2348000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-stone-200 text-stone-600 rounded-xl px-6 py-3 font-semibold text-sm inline-flex items-center justify-center gap-2 hover:bg-stone-50 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp Support
          </a>
        </div>

        {reference && (
          <p className="mt-6 text-xs text-stone-400">
            Reference: <code className="bg-stone-100 px-2 py-0.5 rounded font-mono">{reference}</code>
          </p>
        )}
      </div>
    )
  }

  /* ── Success ── */
  return (
    <div className="max-w-lg mx-auto py-10">
      {/* Icon */}
      <div className="text-center mb-8">
        <div className="relative w-24 h-24 mx-auto mb-5">
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-14 h-14 text-emerald-500" />
          </div>
          <div className="absolute inset-0 bg-emerald-300/20 rounded-full animate-ping" />
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 mb-2">Booking Confirmed!</h1>
        <p className="text-stone-400 text-sm max-w-sm mx-auto leading-relaxed">
          Your payment was successful and your stay is booked.
          A confirmation will be sent to your email.
        </p>
      </div>

      {/* Confirmation card */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden mb-6">
        {/* Header strip */}
        <div className="bg-emerald-600 px-6 py-4 text-white">
          <div className="text-xs font-bold uppercase tracking-widest text-emerald-200 mb-1">
            Booking Reference
          </div>
          <div className="font-mono font-black text-xl tracking-widest">
            {bookingId
              ? bookingId.split("-")[0].toUpperCase()
              : reference?.toUpperCase().slice(0, 8) ?? "CONFIRMED"}
          </div>
        </div>

        <div className="p-6 space-y-4">
          {bookingId && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-stone-50 rounded-xl flex items-center justify-center shrink-0">
                <Hash className="w-4 h-4 text-stone-500" />
              </div>
              <div>
                <div className="text-xs text-stone-400 font-medium mb-0.5">Booking ID</div>
                <div className="font-mono text-sm text-stone-800 font-semibold leading-snug break-all">
                  {bookingId}
                </div>
              </div>
            </div>
          )}

          {reference && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-stone-50 rounded-xl flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 text-stone-500" />
              </div>
              <div>
                <div className="text-xs text-stone-400 font-medium mb-0.5">Transaction Reference</div>
                <div className="font-mono text-sm text-stone-800 font-semibold">{reference}</div>
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-stone-100">
            <div className="flex items-center gap-2 text-sm text-emerald-600 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              Payment verified and booking secured
            </div>
          </div>
        </div>
      </div>

      {/* What's next */}
      <div className="bg-stone-50 rounded-2xl border border-stone-100 p-5 mb-8">
        <p className="text-xs font-black text-stone-500 uppercase tracking-widest mb-3">What happens next</p>
        <ul className="space-y-2.5 text-sm text-stone-600">
          {[
            "You'll receive a confirmation email with all booking details",
            "Our team will reach out with check-in instructions",
            "Have questions? WhatsApp us any time",
          ].map((step) => (
            <li key={step} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              {step}
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="flex-1 flex items-center justify-center gap-2 border border-stone-200 text-stone-700 rounded-xl py-3.5 font-semibold text-sm hover:bg-stone-50 transition-colors"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
        <Link
          href="/apartments"
          className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3.5 font-bold text-sm transition-colors"
        >
          Book Another Stay
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}

export default function PaymentVerifyPage() {
  return (
    <div className="min-h-screen bg-stone-50 pt-[68px] px-5 sm:px-6">
      <Suspense
        fallback={
          <div className="text-center py-20">
            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto mb-4" />
            <p className="text-stone-400 text-sm">Loading…</p>
          </div>
        }
      >
        <VerifyContent />
      </Suspense>
    </div>
  )
}
