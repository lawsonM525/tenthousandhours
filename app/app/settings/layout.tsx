"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  Settings as SettingsIcon,
  Volume2,
  Calendar,
  FolderKanban,
  Monitor,
  User,
  LifeBuoy,
} from "lucide-react"

const settingsNav = [
  { name: "general", href: "/app/settings/general", icon: SettingsIcon },
  { name: "sound", href: "/app/settings/sound", icon: Volume2 },
  { name: "calendar", href: "/app/settings/calendar", icon: Calendar },
  { name: "category", href: "/app/settings/categories", icon: FolderKanban },
  { name: "display", href: "/app/settings/display", icon: Monitor },
  { name: "account", href: "/app/settings/account", icon: User },
  { name: "support", href: "/app/settings/support", icon: LifeBuoy },
]

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="h-full flex flex-col">
      <nav className="shrink-0 border-b-4 border-mango-dark bg-white overflow-x-auto">
        <div className="flex items-center gap-1 p-2">
          {settingsNav.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 font-bold uppercase text-xs whitespace-nowrap transition-all",
                  isActive
                    ? "bg-mango-dark text-white shadow-[2px_2px_0px_#FFB31A]"
                    : "text-mango-dark hover:bg-mango-yellow/20"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="capitalize">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
    </div>
  )
}
