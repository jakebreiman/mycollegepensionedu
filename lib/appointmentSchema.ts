import { z } from "zod"
import { US_STATES, MEETING_TIMES } from "./formOptions"

const stateValues = US_STATES.map((s) => s.value)
const timeValues = [...MEETING_TIMES] as [string, ...string[]]

const phoneRegex = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/

export const appointmentSchema = z.object({
  fullName: z
    .string()
    .min(2, "Please enter your full name"),

  workEmail: z
    .string()
    .min(1, "Work email is required")
    .email("Please enter a valid email address"),

  mobileNumber: z
    .string()
    .min(1, "Mobile number is required")
    .regex(phoneRegex, "Please enter a valid US phone number (e.g. 555-555-5555)"),

  agencyEmployer: z
    .string()
    .min(2, "Please enter your agency or employer"),

  state: z
    .string()
    .refine((val) => stateValues.includes(val), { message: "Please select your state" }),

  meetingDate: z
    .string()
    .min(1, "Please select a meeting date")
    .refine((val) => {
      const [y, m, d] = val.split("-").map(Number)
      const selected = new Date(y, m - 1, d)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return selected >= today
    }, "Please select today or a future date"),

  meetingTime: z
    .string()
    .refine((val) => timeValues.includes(val), { message: "Please select a meeting time" }),
})

export type AppointmentFormData = z.infer<typeof appointmentSchema>
