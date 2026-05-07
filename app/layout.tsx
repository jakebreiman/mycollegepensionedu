import type { Metadata } from "next"
import "./globals.css"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { UTMCapture } from "@/components/UTMCapture"
import { RecaptchaProvider } from "@/components/RecaptchaProvider"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Script from "next/script"

export const metadata: Metadata = {
  title: "My College Pension Edu",
  description:
    "Schedule a one-on-one pension consultation. Educational information for current and former college and university employees.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="bg-white text-[#1a1a1a] antialiased min-h-screen flex flex-col">
        <RecaptchaProvider>
          <UTMCapture />
          <Header />
          <div className="flex-1 bg-[#c9d6cc] py-6 px-4">
            <div className="max-w-[1020px] mx-auto bg-white rounded-xl shadow-sm">
              {children}
            </div>
          </div>
          <Footer />
        </RecaptchaProvider>
        <Analytics />
        <SpeedInsights />
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "wnde2x8ypr");`}
        </Script>
      </body>
    </html>
  )
}
