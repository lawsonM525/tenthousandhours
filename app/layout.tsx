import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "10,000hours.com – know where your time goes. master what matters.",
  description: "Log your whole day, see the truth, and pace your path to 10,000 hours.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={`${inter.variable} font-sans antialiased`}>
          <script
            defer
            data-website-id="dfid_hMYrw2fT8ZNP0VAhdaiDj"
            data-domain="tenthousandhours.app"
            src="https://datafa.st/js/script.js">
          </script>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
