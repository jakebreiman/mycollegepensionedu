"use client"

import { useCallback, useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useGoogleReCaptcha } from "react-google-recaptcha-v3"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faUser,
  faEnvelope,
  faPhone,
  faBuilding,
  faMapPin,
  faCalendarDays,
  faClock,
} from "@fortawesome/free-solid-svg-icons"
import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { appointmentSchema, type AppointmentFormData } from "@/lib/appointmentSchema"
import {
  US_STATES,
  MEETING_TIMES,
} from "@/lib/formOptions"
import { DatePicker } from "./DatePicker"

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p role="alert" className="text-[#c0392b] text-xs mt-1">
      {message}
    </p>
  )
}

function FieldLabel({
  htmlFor,
  icon,
  required,
  children,
}: {
  htmlFor: string
  icon: IconDefinition
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label htmlFor={htmlFor} className="flex items-center gap-1.5 text-base font-bold text-[#222] mb-1">
      <FontAwesomeIcon icon={icon} className="text-[#205493] w-4 h-4 flex-shrink-0" />
      {children}
      {required && <span className="text-[#c0392b]">*</span>}
    </label>
  )
}

const inputClass =
  "w-full border border-[#a0b8cc] bg-white px-3 h-11 text-base focus:outline-none focus:border-[#205493]"

const selectClass =
  "w-full border border-[#a0b8cc] bg-white px-3 h-11 text-base focus:outline-none focus:border-[#205493] cursor-pointer"

interface AppointmentFormProps {
  onSuccess: () => void
}

export function AppointmentForm({ onSuccess }: AppointmentFormProps) {
  const [formError, setFormError] = useState<string | null>(null)
  const [formStarted, setFormStarted] = useState(false)
  const [detectedTimezone, setDetectedTimezone] = useState("America/New_York")
  const { executeRecaptcha } = useGoogleReCaptcha()

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
      if (tz) setDetectedTimezone(tz)
    } catch { /* fallback to Eastern */ }
  }, [])

  const handleFormFocus = useCallback(() => {
    if (!formStarted) {
      setFormStarted(true)
      const umami = (window as any).umami
      if (umami) umami.track("form_start", { product_type: "college" })
    }
  }, [formStarted])

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
  })

  async function onSubmit(data: AppointmentFormData) {
    setFormError(null)

    const umami = (window as any).umami
    if (umami) umami.track("form_submit", { product_type: "college" })

    if (!executeRecaptcha) {
      setFormError("reCAPTCHA not ready. Please try again.")
      return
    }

    const captchaToken = await executeRecaptcha("appointment_submit")

    try {
      const utmParams: Record<string, string> = {}
      UTM_KEYS.forEach((key) => {
        const value = sessionStorage.getItem(key)
        if (value) utmParams[key] = value
      })

      const payload = {
        ...data,
        ...utmParams,
        captchaToken,
        timezone: detectedTimezone,
      }

      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = await res.json()

      if (!res.ok || !result.success) {
        setFormError(
          result.error || "There was a problem submitting your request. Please try again."
        )
        return
      }

      onSuccess()
    } catch {
      setFormError(
        "There was a problem submitting your request. Please try again."
      )
    }
  }

  return (
    <div className="px-5 py-5 pb-8">
      <div className="border border-[#c8d8ea] bg-[#f8fbfe] p-5 rounded-lg">
        <h2 className="text-[#205493] font-bold text-lg uppercase tracking-widest mb-1 text-center">
          Schedule Your Appointment
        </h2>
        <p className="text-gray-500 text-sm text-center mb-4 pb-2 border-b border-[#c8d8ea]">
          Book your free, no-obligation pension consultation in under a minute.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} onFocusCapture={handleFormFocus} noValidate className="space-y-4">
          {/* Full Name */}
          <div>
            <FieldLabel htmlFor="fullName" icon={faUser} required>Full Name</FieldLabel>
            <input
              id="fullName"
              type="text"
              placeholder="Your Full Name"
              {...register("fullName")}
              className={inputClass}
            />
            <FieldError message={errors.fullName?.message} />
          </div>

          {/* Work Email */}
          <div>
            <FieldLabel htmlFor="workEmail" icon={faEnvelope} required>Work Email</FieldLabel>
            <input
              id="workEmail"
              type="email"
              placeholder="Your Work Email"
              {...register("workEmail")}
              className={inputClass}
            />
            <FieldError message={errors.workEmail?.message} />
          </div>

          {/* Mobile Number */}
          <div>
            <FieldLabel htmlFor="mobileNumber" icon={faPhone} required>Phone Number</FieldLabel>
            <input
              id="mobileNumber"
              type="tel"
              placeholder="555-555-5555"
              {...register("mobileNumber")}
              className={inputClass}
            />
            <FieldError message={errors.mobileNumber?.message} />
          </div>

          {/* Employer + State */}
          <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-3">
            <div>
              <FieldLabel htmlFor="agencyEmployer" icon={faBuilding} required>Employer / District</FieldLabel>
              <input
                id="agencyEmployer"
                type="text"
                placeholder="Your Employer or School District"
                {...register("agencyEmployer")}
                className={inputClass}
              />
              <FieldError message={errors.agencyEmployer?.message} />
            </div>
            <div>
              <FieldLabel htmlFor="state" icon={faMapPin} required>State</FieldLabel>
              <select id="state" {...register("state")} className={selectClass}>
                <option value="">Select</option>
                {US_STATES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <FieldError message={errors.state?.message} />
            </div>
          </div>

          {/* Meeting Date + Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <FieldLabel htmlFor="meetingDate" icon={faCalendarDays} required>Preferred Date</FieldLabel>
              <Controller
                name="meetingDate"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <DatePicker value={field.value} onChange={field.onChange} />
                )}
              />
              <FieldError message={errors.meetingDate?.message} />
            </div>
            <div>
              <FieldLabel htmlFor="meetingTime" icon={faClock} required>Preferred Time</FieldLabel>
              <select id="meetingTime" {...register("meetingTime")} className={selectClass}>
                <option value="">Select</option>
                {MEETING_TIMES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <FieldError message={errors.meetingTime?.message} />
            </div>
          </div>

          {/* Form-level error */}
          {formError && (
            <div
              role="alert"
              className="bg-red-50 border border-red-200 px-4 py-3 text-xs text-[#c0392b]"
            >
              {formError}
            </div>
          )}

          {/* Agree text */}
          <p className="text-xs text-[#555] text-center">
            By clicking Submit below you agree to our{" "}
            <a href="/privacy" className="text-[#205493] underline">Privacy Policy</a>{" "}
            and{" "}
            <a href="/terms" className="text-[#205493] underline">Terms of Use</a>.
          </p>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#2e7d32] text-white text-sm font-bold uppercase tracking-widest py-4 rounded-md disabled:opacity-60 cursor-pointer hover:bg-[#1b5e20] transition-colors"
          >
            {isSubmitting ? "Submitting..." : "Book My Free Consultation"}
          </button>
        </form>
      </div>
    </div>
  )
}
