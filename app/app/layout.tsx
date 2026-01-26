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
  MessageSquare 
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Focus", href: "/app/now", icon: Clock, color: "mango-red" },
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
    <div className="h-screen flex flex-col lg:flex-row mango-pattern">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 bg-white border-r-4 border-mango-dark">
        <div className="p-6 border-b-4 border-mango-dark">
          <Link href="/app" className="flex items-center gap-3">
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
  )
}
