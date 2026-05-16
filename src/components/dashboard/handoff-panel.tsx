"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import {
  AlertTriangle,
  ShoppingCart,
  Heart,
  Package,
  Hand,
  Bot,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

export function HandoffPanel({ chatId }: { chatId: string }) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!chatId) return
    fetchHandoffData()

    const channel = supabase
      .channel(`handoff_sync_${chatId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'conversations', filter: `id=eq.${chatId}` }, (payload) => {
        setData(prev => ({ ...prev, ...payload.new }))
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [chatId])

  async function fetchHandoffData() {
    setLoading(true)
    const { data: conv } = await supabase.from('conversations').select('*').eq('id', chatId).single()
    const { data: msgs } = await supabase.from('messages').select('*').eq('conversation_id', chatId).order('created_at', { ascending: false }).limit(5)
    
    if (conv) {
      setData({
        customerName: conv.customer_name,
        intent: conv.intent === 'wholesale' ? 'Compra al por mayor' : 'Consulta Minorista',
        sentiment: conv.status === 'handoff' ? 'Urgente' : 'Normal',
        sentimentLevel: conv.status === 'handoff' ? 'urgent' : 'neutral',
        detectedProducts: [], // Esto se podría sacar de una tabla de detecciones si existiera
        summary: conv.summary || "Analizando conversación...",
        messages: msgs?.map(m => ({
          id: m.id,
          content: m.content,
          sender: m.sender === 'user' ? 'customer' : 'ai',
          timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })) || []
      })
    }
    setLoading(false)
  }

  if (!chatId) return (
    <div className="flex h-full items-center justify-center text-muted-foreground italic p-8 text-center border-2 border-dashed border-border rounded-xl">
      Selecciona una conversación para ver el análisis de la IA
    </div>
  )
  if (loading || !data) return <div className="p-8 text-center animate-pulse">Cargando análisis de IA...</div>

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card">
      {/* Critical Alert Header */}
      <div className="border-b border-destructive/30 bg-destructive/5 p-4">
        <Alert className="border-destructive/50 bg-destructive/10 glow-destructive">
          <AlertTriangle className="h-5 w-5 text-destructive animate-subtle-pulse" />
          <AlertTitle className="text-base font-bold text-destructive">
            Lead Mayorista Detectado
          </AlertTitle>
          <AlertDescription className="mt-1 text-sm text-destructive/80">
            {data.summary}
          </AlertDescription>
        </Alert>
      </div>

      {/* Main Content */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Información del Cliente
            </h3>
            <p className="mb-4 text-lg font-semibold text-foreground">
              {data.customerName}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ShoppingCart className="h-3.5 w-3.5" />
                  Intención
                </span>
                <p className="text-sm font-medium text-foreground">
                  {data.intent}
                </p>
              </div>
              <div className="space-y-1">
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Heart className="h-3.5 w-3.5" />
                  Sentimiento
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs",
                    data.sentimentLevel === "urgent" &&
                      "border-destructive/50 bg-destructive/10 text-destructive animate-pulse-glow"
                  )}
                >
                  {data.sentiment}
                </Badge>
              </div>
            </div>
          </div>

          {/* Detected Products */}
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Package className="h-3.5 w-3.5" />
              Productos Detectados
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.detectedProducts.map((product) => (
                <Badge
                  key={product}
                  variant="outline"
                  className="border-primary/30 bg-primary/5 text-xs text-foreground"
                >
                  {product}
                </Badge>
              ))}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Últimos Mensajes
            </h3>
            <div className="space-y-3">
              {data.messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "max-w-[85%] rounded-lg p-3",
                    message.sender === "customer"
                      ? "mr-auto bg-muted"
                      : "ml-auto bg-primary/20"
                  )}
                >
                  <div className="mb-1 flex items-center gap-2">
                    {message.sender === "ai" && (
                      <Bot className="h-3 w-3 text-primary" />
                    )}
                    <span className="text-[10px] font-medium text-muted-foreground">
                      {message.sender === "customer" ? "Cliente" : "IA Pronto"}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {message.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{message.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Action Footer */}
      <div className="border-t border-border bg-card/50 p-4">
        <Button
          size="lg"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-primary transition-all duration-300 hover:scale-[1.02]"
        >
          <Hand className="mr-2 h-5 w-5" />
          Tomar Control del Chat
        </Button>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Al tomar control, la IA entrará en modo de solo lectura para este chat.
        </p>
      </div>
    </div>
  )
}
