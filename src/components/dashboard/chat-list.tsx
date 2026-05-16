"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Search, MessageCircle } from "lucide-react"
import { ChatCard } from "./chat-card"
import { mockChats } from "@/lib/mock-data"

interface ChatListProps {
  onSelectChat?: (chatId: string) => void
  selectedChatId?: string
}

export function ChatList({ onSelectChat, selectedChatId }: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredChats = mockChats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const waitingCount = mockChats.filter(
    (c) => c.status === "waiting_human"
  ).length
  const leadsCount = mockChats.filter(
    (c) => c.status === "wholesale_lead"
  ).length

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">
              Chats Activos
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-destructive/20 px-2 py-0.5 text-[10px] font-medium text-destructive">
              {waitingCount} esperando
            </span>
            <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-medium text-primary">
              {leadsCount} leads
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Filtrar conversaciones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 border-border bg-muted/50 pl-9 text-xs placeholder:text-muted-foreground focus:border-primary"
          />
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {filteredChats.map((chat) => (
            <ChatCard
              key={chat.id}
              chat={chat}
              isSelected={selectedChatId === chat.id}
              onClick={() => onSelectChat?.(chat.id)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
