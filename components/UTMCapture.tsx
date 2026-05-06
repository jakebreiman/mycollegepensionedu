"use client"

import { useEffect } from "react"

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const

export function UTMCapture() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    UTM_KEYS.forEach((key) => {
      const value = params.get(key)
      if (value) {
        sessionStorage.setItem(key, value)
      }
    })
  }, [])

  return null
}
