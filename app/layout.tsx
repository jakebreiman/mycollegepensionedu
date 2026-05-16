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
  openGraph: {
    title: "My College Pension Edu — Free Pension Consultation",
    description: "Schedule a one-on-one pension consultation. Educational information for current and former college and university employees.",
    url: "https://mycollegepensionedu.com",
    siteName: "MyCollegePensionEdu",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "My College Pension Edu — Free Pension Consultation",
    description: "Schedule a one-on-one pension consultation for college and university employees.",
  },
  other: {
    "og:image:width": "1200",
    "og:image:height": "630",
  },
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
        <Script id="umami-analytics" strategy="afterInteractive" src="https://cloud.umami.is/script.js" data-website-id="COLLEGE_UMAMI_ID" />
        {/* ProfessionalService Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            "name": "MyCollegePensionEdu",
            "description": "Free educational pension consultations for college and university employees",
            "url": "https://mycollegepensionedu.com",
            "serviceType": "Higher Education Pension Consultation",
            "areaServed": { "@type": "Country", "name": "United States" },
            "priceRange": "Free",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "30 N Gould St",
              "addressLocality": "Sheridan",
              "addressRegion": "WY",
              "postalCode": "82801",
              "addressCountry": "US"
            },
            "offers": {
              "@type": "Offer",
              "name": "Free College Pension Consultation",
              "price": "0",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            }
          })}}
        />
      </body>
    </html>
  )
}
