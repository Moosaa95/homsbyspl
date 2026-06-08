"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  X, Minus, Plus, Loader2, AlertCircle, Calendar, User, Mail, Phone,
  MessageSquare, MapPin, FileText, ChevronDown, Info,
} from "lucide-react"
import { format, differenceInDays } from "date-fns"
import { toast } from "sonner"
import DateRangePicker from "./DateRangePicker"
import { api } from "@/lib/api"
import type { ApartmentListItem, BookedDateRange } from "@/lib/types"

const ID_TYPES = [
  { value: "national_id", label: "National ID Card" },
  { value: "passport", label: "International Passport" },
  { value: "drivers_license", label: "Driver's License" },
  { value: "voters_card", label: "Voter's Card" },
]

interface Props {
  isOpen: boolean
  onClose: () => void
  apartment: ApartmentListItem
}

type Step = "dates" | "details" | "processing"

export default function BookingModal({ isOpen, onClose, apartment }: Props) {
  const router = useRouter()

  // Dates & guests
  const [checkIn, setCheckIn] = useState<Date | null>(null)
  const [checkOut, setCheckOut] = useState<Date | null>(null)
  const [guests, setGuests] = useState(1)
  const [step, setStep] = useState<Step>("dates")

  // Customer details
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [specialRequests, setSpecialRequests] = useState("")

  // Verification fields
  const [address, setAddress] = useState("")
  const [idType, setIdType] = useState("")

  // Meta
  const [bookedDates, setBookedDates] = useState<BookedDateRange[]>([])
  const [paystackKey, setPaystackKey] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadingMeta, setLoadingMeta] = useState(false)

  const paystackLoaded = useRef(false)

  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0
  const pricePerNight = Number(apartment.price)
  const totalAmount = nights * pricePerNight

  // Load Paystack inline script once
  useEffect(() => {
    if (paystackLoaded.current) return
    const s = document.createElement("script")
    s.src = "https://js.paystack.co/v1/inline.js"
    s.async = true
    s.onload = () => { paystackLoaded.current = true }
    document.head.appendChild(s)
  }, [])

  // Fetch booked dates + Paystack config on open
  useEffect(() => {
    if (!isOpen) return
    setStep("dates")
    setError(null)
    setLoadingMeta(true)
    Promise.all([
      api.apartments.bookedDates(apartment.id),
      api.payments.config(),
    ])
      .then(([dates, cfg]) => {
        setBookedDates(dates)
        setPaystackKey(cfg.public_key)
      })
      .catch(() => {})
      .finally(() => setLoadingMeta(false))
  }, [isOpen, apartment.id])

  // Lock body scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""
    return () => { document.body.style.overflow = "" }
  }, [isOpen])


  function resetAndClose() {
    setCheckIn(null); setCheckOut(null); setGuests(1)
    setName(""); setEmail(""); setPhone(""); setSpecialRequests("")
    setAddress(""); setIdType("")
    setError(null); setStep("dates")
    onClose()
  }

  function handleDatesConfirm() {
    if (!checkIn || !checkOut) return setError("Please select your check-in and check-out dates.")
    if (nights < 1) return setError("Check-out must be after check-in.")
    setError(null)
    setStep("details")
  }

  async function handlePayment() {
    if (!name.trim()) return setError("Please enter your full name.")
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setError("Please enter a valid email address.")
    if (!phone.trim()) return setError("Please enter your phone number.")
    if (!address.trim()) return setError("Please enter your home address.")
    if (!idType) return setError("Please select your ID document type.")
    if (!checkIn || !checkOut) return setError("Please select your dates.")

    setError(null)
    setLoading(true)
    setStep("processing")

    try {
      const booking = await api.bookings.create({
        apartment_id: apartment.id,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        check_in: format(checkIn, "yyyy-MM-dd"),
        check_out: format(checkOut, "yyyy-MM-dd"),
        guests,
        special_requests: specialRequests.trim() || undefined,
        address: address.trim(),
        id_type: idType,
      })

      const paymentInit = await api.payments.initialize(booking.booking_id)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const PaystackPop = (window as any).PaystackPop as {
        setup: (cfg: Record<string, unknown>) => { openIframe: () => void }
      } | undefined

      if (PaystackPop && paystackKey && paymentInit.reference) {
        setLoading(false)
        const handler = PaystackPop.setup({
          key: paystackKey,
          email: email.trim(),
          amount: Math.round(totalAmount * 100),
          ref: paymentInit.reference,
          metadata: {
            booking_id: booking.booking_id,
            custom_fields: [
              { display_name: "Apartment", variable_name: "apartment", value: apartment.title },
              { display_name: "Nights", variable_name: "nights", value: nights },
            ],
          },
          onClose: () => {
            setStep("details")
            toast.info("Payment cancelled — you can try again when ready.")
          },
          callback: (response: { reference: string }) => {
            router.push(`/payment/verify?reference=${response.reference}&booking_id=${booking.booking_id}`)
          },
        })
        handler.openIframe()
      } else if (paymentInit.authorization_url) {
        window.location.href = paymentInit.authorization_url
      } else {
        throw new Error("Could not open payment. Please try again.")
      }
    } catch (err) {
      setLoading(false)
      setStep("details")
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={resetAndClose} />

      {/* Modal card */}
      <div className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[96vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 shrink-0">
          <div>
            <h2 className="font-bold text-stone-900 text-lg leading-tight">Reserve your stay</h2>
            <p className="text-sm text-stone-500 line-clamp-1 mt-0.5">{apartment.title}</p>
          </div>
          <button
            onClick={resetAndClose}
            className="p-2 hover:bg-stone-100 rounded-xl transition-colors text-stone-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Price bar */}
        <div className="px-6 py-3 bg-emerald-50 border-b border-emerald-100 shrink-0 flex items-center justify-between">
          <span className="text-sm text-emerald-700">
            {apartment.currency}{pricePerNight.toLocaleString("en-NG")} × {nights > 0 ? `${nights} night${nights !== 1 ? "s" : ""}` : "—"}
          </span>
          <span className="font-bold text-emerald-700 text-base">
            {nights > 0 ? `${apartment.currency}${totalAmount.toLocaleString("en-NG")}` : "—"}
          </span>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-3 px-6 pt-4 shrink-0">
          {([["dates", "1. Dates"], ["details", "2. Details"]] as [Step, string][]).map(([s, label], i) => (
            <div key={s} className="flex items-center gap-2">
              {i > 0 && <div className="w-6 h-px bg-stone-200 hidden sm:block" />}
              <div className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                step === s || (step === "processing" && s === "details")
                  ? "text-emerald-600"
                  : step === "details" && s === "dates"
                  ? "text-stone-400"
                  : "text-stone-300"
              }`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                  step === s || (step === "processing" && s === "details")
                    ? "bg-emerald-600 text-white"
                    : step === "details" && s === "dates"
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-stone-100 text-stone-400"
                }`}>
                  {step === "details" && s === "dates" ? "✓" : i + 1}
                </span>
                <span className="hidden sm:block">{label.split(". ")[1]}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ─── Scrollable content ─── */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 pt-4">

          {/* Error */}
          {error && (
            <div className="mb-4 flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3.5 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {/* ── STEP 1: Dates & Guests ── */}
          {step === "dates" && (
            <div>
              {loadingMeta && (
                <div className="flex items-center justify-center gap-2 text-xs text-stone-400 mb-3">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Loading availability…
                </div>
              )}

              <DateRangePicker
                checkIn={checkIn}
                checkOut={checkOut}
                onChange={(ci, co) => { setCheckIn(ci); setCheckOut(co); setError(null) }}
                disabledRanges={bookedDates}
              />

              {/* Guests */}
              <div className="mt-5 pt-5 border-t border-stone-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-stone-800">Guests</div>
                    <div className="text-xs text-stone-400 mt-0.5">Max {apartment.guests} {apartment.guests === 1 ? "guest" : "guests"}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setGuests((g) => Math.max(1, g - 1))}
                      className="w-9 h-9 rounded-full border border-stone-200 flex items-center justify-center hover:border-emerald-400 transition-colors bg-white shadow-sm"
                    >
                      <Minus className="w-3.5 h-3.5 text-stone-600" />
                    </button>
                    <span className="w-6 text-center font-bold text-stone-900">{guests}</span>
                    <button
                      type="button"
                      onClick={() => setGuests((g) => Math.min(apartment.guests, g + 1))}
                      className="w-9 h-9 rounded-full border border-stone-200 flex items-center justify-center hover:border-emerald-400 transition-colors bg-white shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5 text-stone-600" />
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDatesConfirm}
                disabled={!checkIn || !checkOut}
                className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-100 disabled:text-stone-400 text-white rounded-xl py-3.5 font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Continue
              </button>
            </div>
          )}

          {/* ── STEP 2 / PROCESSING: Details + Verification ── */}
          {(step === "details" || step === "processing") && (
            <div className="space-y-4">

              {/* Booking summary pill */}
              <div className="bg-stone-50 rounded-xl p-4 text-sm space-y-1.5">
                <div className="flex justify-between text-stone-500">
                  <span>Check-in</span>
                  <span className="font-medium text-stone-800">{checkIn ? format(checkIn, "EEE, MMM d") : "—"}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Check-out</span>
                  <span className="font-medium text-stone-800">{checkOut ? format(checkOut, "EEE, MMM d") : "—"}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Duration</span>
                  <span className="font-medium text-stone-800">{nights} night{nights !== 1 ? "s" : ""}</span>
                </div>
                <div className="border-t border-stone-200 mt-2 pt-2 flex justify-between font-bold">
                  <span className="text-stone-700">Total</span>
                  <span className="text-emerald-600">{apartment.currency}{totalAmount.toLocaleString("en-NG")}</span>
                </div>
              </div>

              {/* ─ Guest info ─ */}
              <div className="pt-1">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Your Details</p>

                {/* Name */}
                <div className="mb-3">
                  <label className="block text-xs font-semibold text-stone-600 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Chioma Adeyemi"
                      className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all bg-white"
                    />
                  </div>
                </div>

                {/* Email + Phone */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1.5">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-9 pr-3 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1.5">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+234 800 000 0000"
                        className="w-full pl-9 pr-3 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="mb-3">
                  <label className="block text-xs font-semibold text-stone-600 mb-1.5">Home Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Your current residential address"
                      rows={2}
                      className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all resize-none bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* ─ Identity verification ─ */}
              <div className="pt-1 border-t border-stone-100">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Identity Verification</p>

                {/* ID Type */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-stone-600 mb-1.5">Document Type</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                    <select
                      value={idType}
                      onChange={(e) => setIdType(e.target.value)}
                      className="w-full pl-10 pr-9 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all appearance-none bg-white text-stone-700"
                    >
                      <option value="">Select a document type</option>
                      {ID_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Check-in notice */}
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl p-3.5">
                  <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700 leading-relaxed">
                    A valid means of identification (National ID, International Passport, Driver&apos;s License, or Voter&apos;s Card) will be required upon check-in.
                  </p>
                </div>
              </div>

              {/* ─ Special requests ─ */}
              <div className="pt-1 border-t border-stone-100">
                <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                  Special Requests <span className="text-stone-300 font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                  <textarea
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Anything we should know before your arrival?"
                    rows={3}
                    className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all resize-none bg-white"
                  />
                </div>
              </div>

              {/* ─ Action buttons ─ */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setStep("dates"); setError(null) }}
                  disabled={step === "processing"}
                  className="px-5 py-3.5 border border-stone-200 text-stone-600 hover:bg-stone-50 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={loading || step === "processing"}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-xl py-3.5 font-bold text-sm transition-all flex items-center justify-center gap-2"
                >
                  {loading || step === "processing" ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
                  ) : (
                    <>Pay {apartment.currency}{totalAmount.toLocaleString("en-NG")}</>
                  )}
                </button>
              </div>

              <p className="text-center text-[11px] text-stone-400">
                🔒 Your information is encrypted and never shared with third parties
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
