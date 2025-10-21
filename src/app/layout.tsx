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
  icons: {
    icon: "/favicon.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
      >
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.26-.27-2.5-1-3.5.28-1.15.28-2.35 0-3-1.06 0-2.87.75-4 1.5-2.05-.4-4.19-.4-6 0C7.87 2.75 6.06 2 5 2c-.28.65-.28 1.85 0 3-.73 1-1.08 2.24-1 3.5 0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      </svg>
    )
  }
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
        {/* GitHub repo link - bottom right */}
        <div className="fixed bottom-4 right-4 z-50">
          <a
            href="https://github.com/Artenlaclase/qr-generator"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Ver repositorio en GitHub"
            className="group"
          >
            <span className="inline-flex items-center justify-center rounded-full bg-white/90 border shadow-md p-2 hover:bg-white transition">
              <GitHubIcon className="h-6 w-6 text-gray-900 group-hover:scale-110 transition-transform" />
            </span>
          </a>
        </div>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
