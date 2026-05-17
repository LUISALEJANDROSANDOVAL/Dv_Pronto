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
  ShoppingBag,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: LayoutDashboard, label: "Panel Principal", href: "/" },
  { icon: Inbox, label: "Chats Activos", href: "/inbox" },
  { icon: Users, label: "Clientes Mayoristas", href: "/crm" },
  { icon: ShoppingBag, label: "Catálogo Productos", href: "/products" },
  { icon: Settings, label: "Configuración", href: "/config" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-800/60 bg-slate-950/40 backdrop-blur-xl">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-slate-800/60 px-6 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-500/5 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.15)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-orange-500/10 to-transparent" />
          <Zap className="h-5 w-5 text-orange-500 relative z-10" />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold tracking-tight text-white">
            Pronto Bolivia
          </span>
          <span className="text-[10px] font-semibold tracking-widest text-orange-500 uppercase">AI Platform</span>
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
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 ease-out",
                isActive
                  ? "bg-slate-800/60 text-white shadow-sm border border-slate-700/50"
                  : "text-slate-400 hover:bg-slate-800/30 hover:text-slate-200"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-orange-500 rounded-r-full shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
              )}
              <item.icon
                className={cn(
                  "h-4 w-4 transition-transform duration-300 group-hover:scale-110",
                  isActive ? "text-orange-500" : "text-slate-500 group-hover:text-slate-300"
                )}
              />
              <span className="tracking-wide">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto border-t border-slate-800/60 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-slate-900/50 border border-slate-800/50 px-4 py-3 hover:bg-slate-800/50 transition-colors cursor-default">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-20"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Sistema Operativo</span>
            <span className="text-[9px] text-slate-500">v1.2.4 (Estable)</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
