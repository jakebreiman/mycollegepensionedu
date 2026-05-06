"use client"

import { useState } from "react"
import { IntroCopy } from "@/components/IntroCopy"
import { AppointmentForm } from "@/components/AppointmentForm"
import { ThankYou } from "@/components/ThankYou"

export default function Home() {
  const [submitted, setSubmitted] = useState(false)

  return (
      <main className="max-w-[980px] mx-auto">
        {submitted ? (
          <ThankYou />
        ) : (
          <div className="md:grid md:grid-cols-[2fr_3fr] md:items-start">
              <IntroCopy />
              <AppointmentForm onSuccess={() => setSubmitted(true)} />
            </div>
        )}
      </main>
  )
}
