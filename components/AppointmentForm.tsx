"use client"

import { useCallback, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useGoogleReCaptcha } from "react-google-recaptcha-v3"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faUser,
  faEnvelope,
  faPhone,
  faBuilding,
  faSitemap,
  faBriefcase,
  faMapPin,
  faCalendarDays,
  faClock,
  faGlobe,
  faMessage,
  faClipboardList,
} from "@fortawesome/free-solid-svg-icons"
import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { appointmentSchema, type AppointmentFormData } from "@/lib/appointmentSchema"
import {
  US_STATES,
  APPOINTMENT_TYPES,
  MEETING_TIMES,
  TIMEZONES,
} from "@/lib/formOptions"

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
  const { executeRecaptcha } = useGoogleReCaptcha()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
  })

  async function onSubmit(data: AppointmentFormData) {
    setFormError(null)

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

      const payload = { ...data, ...utmParams, captchaToken }

      // TODO: Meta Pixel — add fbq('track', 'Lead') on successful form submission
      // TODO: CRM sync — POST payload to GoHighLevel or HubSpot webhook
      // TODO: Confirmation email — trigger via CRM or transactional email provider
      // TODO: Confirmation SMS — trigger via CRM or Twilio
      // TODO: Calendar booking — replace Meeting Date/Time/Timezone fields with Calendly or GHL embed

      console.log("Appointment form submission payload:", payload)
      await new Promise((r) => setTimeout(r, 500))

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
          Complete the form below to book your appointment.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
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

          {/* Work Email + Personal Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
            <div>
              <FieldLabel htmlFor="personalEmail" icon={faEnvelope}>Personal Email</FieldLabel>
              <input
                id="personalEmail"
                type="email"
                placeholder="Your Personal Email"
                {...register("personalEmail")}
                className={inputClass}
              />
              <FieldError message={errors.personalEmail?.message} />
            </div>
          </div>

          {/* Mobile Number */}
          <div>
            <FieldLabel htmlFor="mobileNumber" icon={faPhone} required>Mobile Number</FieldLabel>
            <input
              id="mobileNumber"
              type="tel"
              placeholder="Your Mobile Number (e.g. 555-555-5555)"
              {...register("mobileNumber")}
              className={inputClass}
            />
            <FieldError message={errors.mobileNumber?.message} />
          </div>

          {/* Agency / Employer */}
          <div>
            <FieldLabel htmlFor="agencyEmployer" icon={faBuilding} required>Agency / Employer</FieldLabel>
            <input
              id="agencyEmployer"
              type="text"
              placeholder="Your Agency or Employer"
              {...register("agencyEmployer")}
              className={inputClass}
            />
            <FieldError message={errors.agencyEmployer?.message} />
          </div>

          {/* Department / Office + Job Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <FieldLabel htmlFor="departmentOffice" icon={faSitemap} required>Department / Office</FieldLabel>
              <input
                id="departmentOffice"
                type="text"
                placeholder="Your Department or Office"
                {...register("departmentOffice")}
                className={inputClass}
              />
              <FieldError message={errors.departmentOffice?.message} />
            </div>
            <div>
              <FieldLabel htmlFor="jobTitle" icon={faBriefcase}>Job Title</FieldLabel>
              <input
                id="jobTitle"
                type="text"
                placeholder="Your Job Title"
                {...register("jobTitle")}
                className={inputClass}
              />
            </div>
          </div>

          {/* State + Appointment Type */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-3">
            <div>
              <FieldLabel htmlFor="state" icon={faMapPin} required>State</FieldLabel>
              <select id="state" {...register("state")} className={selectClass}>
                <option value="">Select State</option>
                {US_STATES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <FieldError message={errors.state?.message} />
            </div>
            <div>
              <FieldLabel htmlFor="appointmentType" icon={faClipboardList} required>Appointment Type</FieldLabel>
              <select
                id="appointmentType"
                {...register("appointmentType")}
                className={selectClass}
              >
                <option value="">Select Type</option>
                {APPOINTMENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <FieldError message={errors.appointmentType?.message} />
            </div>
          </div>

          {/* Scheduling separator */}
          <p className="text-xs text-gray-500 border-t border-[#c8d8ea] pt-4 text-center">
            Please select an appointment time from the available options below.
          </p>

          {/* Meeting Date + Time + Timezone */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <FieldLabel htmlFor="meetingDate" icon={faCalendarDays} required>Meeting Date</FieldLabel>
              <input
                id="meetingDate"
                type="date"
                {...register("meetingDate")}
                className={inputClass}
              />
              <FieldError message={errors.meetingDate?.message} />
            </div>
            <div>
              <FieldLabel htmlFor="meetingTime" icon={faClock} required>Time</FieldLabel>
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
            <div>
              <FieldLabel htmlFor="timezone" icon={faGlobe} required>Timezone</FieldLabel>
              <select id="timezone" {...register("timezone")} className={selectClass}>
                <option value="">Select</option>
                {TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
              <FieldError message={errors.timezone?.message} />
            </div>
          </div>

          {/* Message */}
          <div>
            <FieldLabel htmlFor="message" icon={faMessage}>
              Message <span className="font-normal text-gray-500 text-sm">(optional)</span>
            </FieldLabel>
            <textarea
              id="message"
              rows={4}
              placeholder="Please describe what you'd like to discuss. Include any concerns, goals, or questions you may have."
              {...register("message")}
              className="w-full border border-[#a0b8cc] bg-white px-3 py-2 text-base focus:outline-none focus:border-[#205493] resize-none"
            />
            <FieldError message={errors.message?.message} />
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
            className="w-full bg-[#2e7d32] text-white text-xs font-bold uppercase tracking-widest py-3.5 rounded-md disabled:opacity-60 cursor-pointer hover:bg-[#1b5e20] transition-colors"
          >
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </div>
    </div>
  )
}
