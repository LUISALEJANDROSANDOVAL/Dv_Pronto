"use client"

import { useState } from "react"
import { Search, Bot, Send, Phone, Video, MoreVertical, CheckCheck } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

type TabType = "todos" | "ia" | "humano"

interface Conversation {
  id: string
  name: string
  avatar: string
  lastMessage: string
  time: string
  unread: number
  status: "ai" | "human" | "resolved"
  priority: "critical" | "high" | "medium" | "low"
}

interface ChatMessage {
  id: string
  content: string
  sender: "customer" | "ai" | "agent"
  timestamp: string
  read?: boolean
}

const conversations: Conversation[] = [
  {
    id: "1",
    name: "Farmacia Central SC",
    avatar: "FC",
    lastMessage: "Necesito cotización para 500 unidades de pañales",
    time: "2 min",
    unread: 3,
    status: "human",
    priority: "critical",
  },
  {
    id: "2",
    name: "Distribuidora San Jorge",
    avatar: "DS",
    lastMessage: "El pedido anterior llegó incompleto",
    time: "5 min",
    unread: 2,
    status: "human",
    priority: "high",
  },
  {
    id: "3",
    name: "María Fernanda López",
    avatar: "MF",
    lastMessage: "¿Tienen disponible el shampoo hipoalergénico?",
    time: "8 min",
    unread: 0,
    status: "ai",
    priority: "medium",
  },
  {
    id: "4",
    name: "Bebé Feliz Importadora",
    avatar: "BF",
    lastMessage: "Queremos ser distribuidores en Cochabamba",
    time: "12 min",
    unread: 5,
    status: "human",
    priority: "critical",
  },
  {
    id: "5",
    name: "Droguería La Paz",
    avatar: "DL",
    lastMessage: "Confirmado, paso mañana a las 10am",
    time: "15 min",
    unread: 0,
    status: "ai",
    priority: "low",
  },
  {
    id: "6",
    name: "Carlos Mendoza",
    avatar: "CM",
    lastMessage: "¿Cuál es el precio de las toallitas x100?",
    time: "18 min",
    unread: 0,
    status: "ai",
    priority: "medium",
  },
  {
    id: "7",
    name: "Supermercado Hipermaxi",
    avatar: "SH",
    lastMessage: "Urgente: reposición para 3 sucursales",
    time: "22 min",
    unread: 4,
    status: "human",
    priority: "high",
  },
]

const chatMessages: ChatMessage[] = [
  {
    id: "1",
    content: "Hola, buenos días. Soy de Farmacia Central de Santa Cruz.",
    sender: "customer",
    timestamp: "10:32",
  },
  {
    id: "2",
    content: "¡Hola! Bienvenido a Pronto Bolivia. Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?",
    sender: "ai",
    timestamp: "10:32",
    read: true,
  },
  {
    id: "3",
    content: "Necesitamos cotización para compra mayorista. Queremos 500 unidades de pañales premium, 200 packs de toallitas y 100 shampoos familiares.",
    sender: "customer",
    timestamp: "10:33",
  },
  {
    id: "4",
    content: "Entiendo que necesita una cotización mayorista. Permítame conectarle con un ejecutivo especializado que podrá ofrecerle los mejores precios.",
    sender: "ai",
    timestamp: "10:33",
    read: true,
  },
  {
    id: "5",
    content: "Es urgente, necesitamos la mercadería para el viernes sin falta.",
    sender: "customer",
    timestamp: "10:34",
  },
  {
    id: "6",
    content: "Hola, soy Juan del equipo comercial. Entiendo la urgencia. Déjeme preparar una cotización especial para ustedes.",
    sender: "agent",
    timestamp: "10:35",
    read: true,
  },
]

export function InboxOmnicanal() {
  const [activeTab, setActiveTab] = useState<TabType>("todos")
  const [selectedChat, setSelectedChat] = useState<string>("1")
  const [aiAutoResponder, setAiAutoResponder] = useState(true)
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const filteredConversations = conversations.filter((conv) => {
    if (activeTab === "todos") return true
    if (activeTab === "ia") return conv.status === "ai"
    if (activeTab === "humano") return conv.status === "human"
    return true
  })

  const selectedConversation = conversations.find((c) => c.id === selectedChat)

  const handleSend = () => {
    if (!message.trim()) return
    setMessage("")
    setIsTyping(true)
    setTimeout(() => setIsTyping(false), 2000)
  }

  return (
    <div className="flex h-full">
      {/* Left Panel - Conversation List */}
      <div className="flex w-[360px] flex-col border-r border-border bg-card">
        {/* Search */}
        <div className="border-b border-border p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar conversaciones..."
              className="bg-input pl-9"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border p-2">
          {[
            { id: "todos", label: "Todos" },
            { id: "ia", label: "Atendiendo IA" },
            { id: "humano", label: "Requiere Humano" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={cn(
                "flex-1 rounded-md px-3 py-2 text-xs font-medium transition-all",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedChat(conv.id)}
              className={cn(
                "flex w-full items-start gap-3 border-b border-border/50 p-4 text-left transition-all hover:bg-muted/50",
                selectedChat === conv.id && "bg-muted"
              )}
            >
              {/* Avatar */}
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  conv.priority === "critical"
                    ? "bg-destructive/20 text-destructive"
                    : conv.priority === "high"
                    ? "bg-warning/20 text-warning"
                    : "bg-primary/20 text-primary"
                )}
              >
                {conv.avatar}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium text-foreground">
                    {conv.name}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {conv.time}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {conv.lastMessage}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge
                    variant={conv.status === "human" ? "destructive" : "secondary"}
                    className="text-[10px]"
                  >
                    {conv.status === "human" ? "Requiere Humano" : "IA Manejando"}
                  </Badge>
                  {conv.unread > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                      {conv.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Panel - Chat */}
      <div className="flex flex-1 flex-col">
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold",
                selectedConversation?.priority === "critical"
                  ? "bg-destructive/20 text-destructive"
                  : "bg-primary/20 text-primary"
              )}
            >
              {selectedConversation?.avatar}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {selectedConversation?.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {selectedConversation?.status === "human"
                  ? "Atendido por agente"
                  : "Atendido por IA"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* AI Auto-Responder Toggle */}
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2">
              <Bot className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-foreground">
                IA Auto-Responder
              </span>
              <Switch
                checked={aiAutoResponder}
                onCheckedChange={setAiAutoResponder}
                className="data-[state=checked]:bg-primary"
              />
            </div>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-background/50 p-6">
          <div className="mx-auto max-w-3xl space-y-4">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex",
                  msg.sender === "customer" ? "justify-start" : "justify-end"
                )}
              >
                <div
                  className={cn(
                    "max-w-[70%] rounded-2xl px-4 py-2.5",
                    msg.sender === "customer"
                      ? "rounded-tl-sm bg-muted text-foreground"
                      : msg.sender === "ai"
                      ? "rounded-tr-sm bg-primary/20 text-foreground"
                      : "rounded-tr-sm bg-primary text-primary-foreground"
                  )}
                >
                  {msg.sender !== "customer" && (
                    <div className="mb-1 flex items-center gap-1.5">
                      {msg.sender === "ai" && (
                        <Bot className="h-3 w-3 text-primary" />
                      )}
                      <span className="text-[10px] font-medium opacity-70">
                        {msg.sender === "ai" ? "Asistente IA" : "Juan - Comercial"}
                      </span>
                    </div>
                  )}
                  <p className="text-sm">{msg.content}</p>
                  <div className="mt-1 flex items-center justify-end gap-1">
                    <span className="text-[10px] opacity-50">{msg.timestamp}</span>
                    {msg.sender !== "customer" && msg.read && (
                      <CheckCheck className="h-3 w-3 text-primary" />
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-end">
                <div className="rounded-2xl rounded-tr-sm bg-primary/20 px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <Bot className="h-3 w-3 text-primary" />
                    <span className="text-[10px] font-medium text-muted-foreground">
                      Asistente IA está escribiendo
                    </span>
                    <span className="flex gap-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-border bg-card p-4">
          <div className="mx-auto flex max-w-3xl items-center gap-3">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Escribe un mensaje..."
              className="flex-1 bg-input"
            />
            <Button
              onClick={handleSend}
              className="glow-primary bg-primary px-6 hover:bg-primary/90"
            >
              <Send className="mr-2 h-4 w-4" />
              Enviar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
