"use client"

import { Search, Bell, Bot } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card/50 px-6 backdrop-blur-sm">
      {/* Search */}
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar conversaciones, clientes..."
          className="h-10 w-full rounded-lg border-border bg-muted/50 pl-10 text-sm placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* AI Mode Badge */}
        <Badge
          variant="outline"
          className="flex items-center gap-2 border-primary/50 bg-primary/10 px-3 py-1.5 text-primary glow-primary"
        >
          <Bot className="h-3.5 w-3.5 animate-subtle-pulse" />
          <span className="text-xs font-medium">Modo IA Activo</span>
        </Badge>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-lg hover:bg-muted"
        >
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
            3
          </span>
        </Button>

        {/* User Avatar */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">Agente Demo</p>
            <p className="text-xs text-muted-foreground">En línea</p>
          </div>
          <Avatar className="h-9 w-9 border-2 border-primary/30">
            <AvatarFallback className="bg-primary/20 text-sm font-medium text-primary">
              AD
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
