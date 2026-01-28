"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  Clock,
  Calendar,
  BarChart3,
  FileText,
  Settings,
  MessageSquare,
  LogIn
} from "lucide-react"
import { cn } from "@/lib/utils"
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs"

const navigation = [
  { name: "Track", href: "/app/now", icon: Clock, color: "mango-red" },
  { name: "Timeline", href: "/app/timeline", icon: Calendar, color: "mango-orange" },
  { name: "Insights", href: "/app/insights", icon: BarChart3, color: "mango-yellow" },
  { name: "Notes", href: "/app/notes", icon: FileText, color: "mango-green" },
  { name: "Settings", href: "/app/settings", icon: Settings, color: "mango-orange" },
]

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <>
      {/* Auth Required Overlay for Signed Out Users */}
      <SignedOut>
        <div className="h-screen flex flex-col items-center justify-center mango-pattern p-4">
          <div className="bg-white border-4 border-mango-dark shadow-[8px_8px_0px_#1a1a1a] p-8 max-w-md w-full text-center">
            <Link href="/" className="flex items-center justify-center gap-3 mb-6">
              <Image
                src="/logo.svg"
                alt="10,000 Hours"
                width={48}
                height={48}
              />
              <h1 className="text-2xl font-black uppercase italic text-mango-dark">
                10,000hours
              </h1>
            </Link>

            <div className="mb-6">
              <LogIn className="w-12 h-12 mx-auto mb-4 text-mango-orange" />
              <h2 className="text-xl font-bold uppercase text-mango-dark mb-2">
                Sign in to continue
              </h2>
              <p className="text-mango-dark/70 text-sm">
                You need to be signed in to access the dashboard and start tracking your 10,000 hours.
              </p>
            </div>

            <div className="space-y-3">
              <SignInButton mode="modal">
                <button className="w-full bg-mango-orange hover:bg-mango-yellow text-mango-dark px-6 py-3 border-2 border-mango-dark font-bold text-lg uppercase shadow-[4px_4px_0px_#000] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none">
                  Sign In
                </button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button className="w-full bg-white hover:bg-mango-cream text-mango-dark px-6 py-3 border-2 border-mango-dark font-bold text-lg uppercase shadow-[4px_4px_0px_#000] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none">
                  Create Account
                </button>
              </SignUpButton>
            </div>

            <Link
              href="/"
              className="inline-block mt-6 text-xs font-bold uppercase tracking-widest text-mango-dark/60 hover:text-mango-red transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </SignedOut>

      {/* Dashboard for Signed In Users */}
      <SignedIn>
        <div className="h-screen flex flex-col lg:flex-row mango-pattern">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:flex lg:flex-col lg:w-72 bg-white border-r-4 border-mango-dark">
            <div className="p-6 border-b-4 border-mango-dark">
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/logo.svg"
                  alt="10,000 Hours"
                  width={40}
                  height={40}
                />
                <h1 className="text-2xl font-black uppercase italic text-mango-dark">
                  10,000hours
                </h1>
              </Link>
            </div>

            <nav className="flex-1 p-4 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
                const Icon = item.icon

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 font-bold uppercase text-sm transition-all duration-150 border-2",
                      isActive
                        ? `bg-${item.color} text-white border-mango-dark shadow-[3px_3px_0px_#1a1a1a] -translate-y-0.5`
                        : "bg-white text-mango-dark border-transparent hover:border-mango-dark hover:shadow-[2px_2px_0px_#1a1a1a] hover:-translate-y-0.5"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t-2 border-mango-dark/20 space-y-3">
              <a
                href="https://lwsnlabs.featurebase.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest text-mango-dark hover:text-mango-red transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Feedback
              </a>
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400 text-center">
                Chase Mastery
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>

          {/* Mobile Bottom Navigation */}
          <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t-4 border-mango-dark">
            <div className="flex justify-around items-center h-16">
              {navigation.slice(0, 5).map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-0 flex-1 font-bold uppercase text-xs",
                      isActive ? `text-${item.color}` : "text-mango-dark/60"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="truncate">{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </nav>
        </div>
      </SignedIn>
    </>
  )
}
