import type React from "react"
import type { Metadata } from "next"
import { Inter, Lilita_One, Barriecito, Permanent_Marker } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

const lilitaOne = Lilita_One({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-lilita-one",
})

const barriecito = Barriecito({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-barriecito",
})

const permanentMarker = Permanent_Marker({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-permanent-marker",
})

export const metadata: Metadata = {
  title: "NutriLens - Discover Food Insights",
  description: "Scan food products to get detailed nutritional information and health insights",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${lilitaOne.variable} ${barriecito.variable} ${permanentMarker.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'