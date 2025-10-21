import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Image from "next/image"
import { Analytics } from "@vercel/analytics/react"
import "./globals.css"

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Generador de Códigos QR - Crea QR personalizados",
  description: "Genera códigos QR personalizados de forma rápida y sencilla para URLs, textos, emails y teléfonos",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}>
        {/* Fixed logo in the top-right corner */}
  <div className="fixed top-4 left-4 z-50">
          <a
            href="https://www.artenlaclase.cl"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Ir a www.artenlaclase.cl"
          >
            <Image
              src="/logo1.png"
              alt="Logo Artenlaclase"
              width={160}
              height={60}
              className="opacity-90 hover:opacity-100 transition drop-shadow"
              priority
            />
          </a>
        </div>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
