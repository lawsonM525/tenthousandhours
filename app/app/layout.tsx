"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Clock, 
  Calendar, 
  BarChart3, 
  FileText, 
  FolderKanban, 
  Settings 
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "now", href: "/app/now", icon: Clock },
  { name: "timeline", href: "/app/timeline", icon: Calendar },
  { name: "insights", href: "/app/insights", icon: BarChart3 },
  { name: "notes", href: "/app/notes", icon: FileText },
  { name: "categories", href: "/app/categories", icon: FolderKanban },
  { name: "settings", href: "/app/settings", icon: Settings },
]

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="h-screen flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 border-r border-border-subtle bg-bg-surface">
        <div className="p-6">
          <Link href="/app" className="block">
            <h1 className="text-h2 font-semibold text-text-primary">
              10,000hours
            </h1>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
            const Icon = item.icon
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-component text-label font-medium transition-colors duration-150",
                  isActive
                    ? "bg-bg-elevated text-text-primary"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated/50"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-bg-surface border-t border-border-subtle">
        <div className="flex justify-around items-center h-16">
          {navigation.slice(0, 5).map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-0 flex-1",
                  isActive ? "text-cta-pink" : "text-text-secondary"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-small truncate">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
