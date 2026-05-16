"use client"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { Chat } from "@/lib/mock-data"

interface ChatCardProps {
  chat: Chat
  isSelected?: boolean
  onClick?: () => void
}

export function ChatCard({ chat, isSelected, onClick }: ChatCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-3 rounded-lg border border-transparent p-3 text-left transition-all duration-200",
        isSelected
          ? "border-primary/30 bg-primary/5"
          : "hover:bg-muted/50",
        chat.priority === "critical" && !isSelected && "border-destructive/20 bg-destructive/5"
      )}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <Avatar className="h-10 w-10 border border-border">
          <AvatarFallback
            className={cn(
              "text-xs font-medium",
              chat.status === "wholesale_lead" && "bg-primary/20 text-primary",
              chat.status === "waiting_human" && "bg-destructive/20 text-destructive",
              chat.status === "ai_handled" && "bg-muted text-muted-foreground"
            )}
          >
            {chat.avatar}
          </AvatarFallback>
        </Avatar>
        {chat.unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
            {chat.unread}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between gap-2">
          <span className="truncate text-sm font-medium text-foreground">
            {chat.name}
          </span>
          <span className="flex-shrink-0 text-xs text-muted-foreground">
            {chat.time}
          </span>
        </div>
        <p className="mb-2 line-clamp-1 text-xs text-muted-foreground">
          {chat.lastMessage}
        </p>

        {/* Status Badge */}
        <Badge
          variant="outline"
          className={cn(
            "text-[10px] font-medium",
            chat.status === "waiting_human" &&
              "border-destructive/30 bg-destructive/10 text-destructive",
            chat.status === "ai_handled" &&
              "border-muted-foreground/30 bg-muted text-muted-foreground",
            chat.status === "wholesale_lead" &&
              "border-primary/30 bg-primary/10 text-primary"
          )}
        >
          {chat.status === "waiting_human" && "Esperando Humano 🚨"}
          {chat.status === "ai_handled" && "IA Manejando 🤖"}
          {chat.status === "wholesale_lead" && "Lead Mayorista"}
        </Badge>
      </div>
    </button>
  )
}
