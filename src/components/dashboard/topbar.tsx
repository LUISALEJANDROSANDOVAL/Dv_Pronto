"use client"

import { Search, Bell, Bot } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-800/60 bg-slate-950/40 px-6 backdrop-blur-md sticky top-0 z-50">
      {/* Search */}
      <div className="relative w-96 group">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 group-focus-within:text-orange-500 transition-colors" />
        <input
          placeholder="Buscar conversaciones, clientes..."
          className="h-9 w-full rounded-lg border border-slate-800 bg-slate-900/50 pl-10 pr-12 text-sm text-slate-200 placeholder:text-slate-500 focus:border-orange-500/50 focus:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-orange-500/10 transition-all"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-slate-700 bg-slate-800 px-1.5 font-mono text-[10px] font-medium text-slate-400">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-5">
        {/* AI Mode Badge */}
        <div className="flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1.5 text-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.1)]">
          <Bot className="h-3.5 w-3.5 animate-pulse" />
          <span className="text-xs font-semibold tracking-wide">AI Core Activo</span>
        </div>

        <div className="h-4 w-[1px] bg-slate-800" />

        {/* Notifications */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-800 bg-slate-900 hover:bg-slate-800 hover:border-slate-700 transition-colors text-slate-400 hover:text-white">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[9px] font-bold text-white shadow-[0_0_8px_rgba(249,115,22,0.6)]">
            3
          </span>
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-white leading-none">Agente Demo</p>
            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Operador</p>
          </div>
          <div className="h-9 w-9 rounded-full border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-xs font-bold text-slate-300 shadow-inner">
            AD
          </div>
        </div>
      </div>
    </header>
  )
}
