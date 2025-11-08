"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Clock, 
  Calendar, 
  BarChart3, 
  FileText, 
  FolderOpen, 
  Settings 
} from "lucide-react";

const navigation = [
  { name: "Now", href: "/app/now", icon: Clock },
  { name: "Timeline", href: "/app/timeline", icon: Calendar },
  { name: "Insights", href: "/app/insights", icon: BarChart3 },
  { name: "Notes", href: "/app/notes", icon: FileText },
  { name: "Categories", href: "/app/categories", icon: FolderOpen },
  { name: "Settings", href: "/app/settings", icon: Settings },
];

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      {/* Desktop Sidebar */}
      <aside 
        className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col"
        style={{ background: 'var(--bg-surface)', borderRight: '1px solid var(--border-subtle)' }}
      >
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-4 mb-8">
            <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              10,000hours
            </h1>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname?.startsWith(item.href);
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors"
                  style={{
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    background: isActive ? 'var(--bg-elevated)' : 'transparent',
                  }}
                >
                  <Icon 
                    className="mr-3 h-5 w-5 flex-shrink-0" 
                    style={{ 
                      color: isActive ? 'var(--cta-pink)' : 'inherit',
                    }}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          {/* User Button */}
          <div className="flex-shrink-0 px-4 py-4">
            {typeof window !== 'undefined' && <UserButton afterSignOutUrl="/" />}
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="md:pl-64">
        <main className="flex-1">
          {children}
        </main>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center h-16 border-t"
        style={{ 
          background: 'var(--bg-surface)', 
          borderColor: 'var(--border-subtle)' 
        }}
      >
        {navigation.slice(0, 5).map((item) => {
          const isActive = pathname?.startsWith(item.href);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center justify-center flex-1 h-full"
              style={{
                color: isActive ? 'var(--cta-pink)' : 'var(--text-muted)',
              }}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
