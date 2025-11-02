import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Rudda Coffee Club - Menú Digital",
  description: "Carta digital de Rudda Coffee Club - Specialty coffee, desayunos y brunch",
  generator: 'v0.app',
  icons: {
    icon: '/logo-rudda.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>{children}<Footer /></body>
    </html>
  )
}
