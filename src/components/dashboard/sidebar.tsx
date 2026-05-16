"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Zap,
  LayoutDashboard,
  Inbox,
  Users,
  BarChart3,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Inbox, label: "Inbox Omnicanal", href: "/inbox" },
  { icon: Users, label: "CRM Mayoristas", href: "/crm" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: Settings, label: "IA Config", href: "/config" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-border px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 glow-primary">
          <Zap className="h-5 w-5 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-semibold text-foreground">
            Pronto Bolivia
          </span>
          <span className="text-xs text-primary">AI</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border px-4 py-4">
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2">
          <div className="h-2 w-2 rounded-full bg-success animate-subtle-pulse" />
          <span className="text-xs text-muted-foreground">
            Sistema Operativo
          </span>
        </div>
      </div>
    </aside>
  )
}
