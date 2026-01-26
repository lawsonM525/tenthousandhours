import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { Providers } from "@/components/providers"
import { SimpleToastProvider } from "@/components/ui/simple-toast"
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
        <head>
          <script
            defer
            data-website-id="dfid_hMYrw2fT8ZNP0VAhdaiDj"
            data-domain="tenthousandhours.app"
            src="https://datafa.st/js/script.js">
          </script>
        </head>
        <body className={`${inter.variable} font-sans antialiased`}>
          <Providers>
            <SimpleToastProvider>
              {children}
            </SimpleToastProvider>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
