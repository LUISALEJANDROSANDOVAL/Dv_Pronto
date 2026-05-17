import { useState, useEffect } from "react"
import { MessageSquare, Target, Timer, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

const iconMap = {
  "1": MessageSquare,
  "2": Target,
  "3": TrendingUp,
  "4": Timer,
}

export function KPIGrid() {
  const [stats, setStats] = useState<any[]>([])

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const res = await fetch('/api/metrics')
      const data = await res.json()
      
      setStats([
        { id: '1', title: 'Mensajes Totales', value: data.msgCount?.toLocaleString() || '0', change: '+100%', status: 'positive' },
        { id: '2', title: 'Tasa Contención IA', value: '94%', change: 'Óptimo', status: 'positive' },
        { id: '3', title: 'Leads Mayoristas', value: data.leadCount?.toString() || '0', change: 'Urgente', status: 'urgent' },
        { id: '4', title: 'Atención Requerida', value: data.activeCount?.toString() || '0', change: 'En vivo', status: 'neutral' },
      ])
    } catch (error) {
      console.error("Error fetching metrics:", error)
    }
  }
  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((kpi) => {
        const Icon = iconMap[kpi.id as keyof typeof iconMap] || MessageSquare
        return (
          <div
            key={kpi.id}
            className={cn(
              "group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-lg",
              kpi.status === "urgent" && "border-destructive/30 glow-destructive"
            )}
          >
            {/* Background gradient */}
            <div
              className={cn(
                "absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                kpi.status === "positive" && "bg-gradient-to-br from-success/5 to-transparent",
                kpi.status === "urgent" && "bg-gradient-to-br from-destructive/10 to-transparent",
                kpi.status === "neutral" && "bg-gradient-to-br from-primary/5 to-transparent"
              )}
            />

            <div className="relative flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{kpi.title}</p>
                <p className="text-3xl font-bold text-foreground">{kpi.value}</p>
                <p
                  className={cn(
                    "text-xs font-medium",
                    kpi.status === "positive" && "text-success",
                    kpi.status === "urgent" && "text-destructive animate-subtle-pulse",
                    kpi.status === "neutral" && "text-muted-foreground"
                  )}
                >
                  {kpi.change}
                </p>
              </div>
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg",
                  kpi.status === "positive" && "bg-success/10",
                  kpi.status === "urgent" && "bg-destructive/10",
                  kpi.status === "neutral" && "bg-primary/10"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5",
                    kpi.status === "positive" && "text-success",
                    kpi.status === "urgent" && "text-destructive",
                    kpi.status === "neutral" && "text-primary"
                  )}
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
