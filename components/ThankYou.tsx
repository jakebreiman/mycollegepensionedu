"use client"

import { useEffect } from "react"

export function ThankYou() {
  useEffect(() => {
    const umami = (window as any).umami
    if (umami) {
      const utmSource = sessionStorage.getItem("utm_source") || undefined
      const utmCampaign = sessionStorage.getItem("utm_campaign") || undefined
      umami.track("booking_confirmed", {
        product_type: "college",
        utm_source: utmSource,
        utm_campaign: utmCampaign,
      })
    }
  }, [])

  return (
    <div className="max-w-[620px] mx-auto px-5 py-8">
      <div className="border border-[#c8d8ea] bg-[#f8fbfe] p-10 text-center">
        <h2 className="text-[#112e51] font-bold text-lg mb-4">
          Your request has been received.
        </h2>
        <p className="text-[#333] text-sm leading-relaxed">
          A representative will contact you to confirm your appointment.
          <br />
          Please check your email for further information.
        </p>
      </div>
    </div>
  )
}
