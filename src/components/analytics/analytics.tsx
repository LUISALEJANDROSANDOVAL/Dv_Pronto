"use client"

import {
  Clock,
  TrendingUp,
  Brain,
  Users,
  MessageSquare,
  Target,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { cn } from "@/lib/utils"

interface KPIData {
  id: string
  title: string
  value: string
  subtitle: string
  change: string
  trend: "up" | "down"
  icon: typeof Clock
  color: "primary" | "success" | "warning" | "destructive"
}

const kpiData: KPIData[] = [
  {
    id: "1",
    title: "Horas Humanas Ahorradas",
    value: "847",
    subtitle: "Este mes",
    change: "+23%",
    trend: "up",
    icon: Clock,
    color: "primary",
  },
  {
    id: "2",
    title: "Conversiones Mayoristas",
    value: "34",
    subtitle: "Leads cerrados",
    change: "+18%",
    trend: "up",
    icon: Target,
    color: "success",
  },
  {
    id: "3",
    title: "Precisión IA",
    value: "94.7%",
    subtitle: "Respuestas correctas",
    change: "+2.1%",
    trend: "up",
    icon: Brain,
    color: "warning",
  },
  {
    id: "4",
    title: "Tasa de Escalamiento",
    value: "15.3%",
    subtitle: "A agentes humanos",
    change: "-4.2%",
    trend: "down",
    icon: Users,
    color: "destructive",
  },
]

const weeklyData = [
  { day: "Lun", mensajes: 1245, aiResueltos: 1058, escalados: 187 },
  { day: "Mar", mensajes: 1389, aiResueltos: 1181, escalados: 208 },
  { day: "Mié", mensajes: 1567, aiResueltos: 1332, escalados: 235 },
  { day: "Jue", mensajes: 1423, aiResueltos: 1209, escalados: 214 },
  { day: "Vie", mensajes: 1678, aiResueltos: 1426, escalados: 252 },
  { day: "Sáb", mensajes: 892, aiResueltos: 758, escalados: 134 },
  { day: "Dom", mensajes: 567, aiResueltos: 482, escalados: 85 },
]

const distributionData = [
  { name: "Consultas Producto", value: 45, color: "var(--primary)" },
  { name: "Pedidos", value: 25, color: "var(--success)" },
  { name: "Reclamos", value: 15, color: "var(--destructive)" },
  { name: "Leads Mayoristas", value: 10, color: "var(--warning)" },
  { name: "Otros", value: 5, color: "var(--muted-foreground)" },
]

const hourlyTrend = [
  { hour: "08:00", value: 45 },
  { hour: "09:00", value: 89 },
  { hour: "10:00", value: 156 },
  { hour: "11:00", value: 203 },
  { hour: "12:00", value: 178 },
  { hour: "13:00", value: 124 },
  { hour: "14:00", value: 189 },
  { hour: "15:00", value: 234 },
  { hour: "16:00", value: 267 },
  { hour: "17:00", value: 198 },
  { hour: "18:00", value: 145 },
]

const getColorClasses = (color: KPIData["color"]) => {
  switch (color) {
    case "primary":
      return {
        bg: "bg-primary/20",
        text: "text-primary",
        glow: "glow-primary",
      }
    case "success":
      return {
        bg: "bg-success/20",
        text: "text-success",
        glow: "glow-success",
      }
    case "warning":
      return {
        bg: "bg-warning/20",
        text: "text-warning",
        glow: "",
      }
    case "destructive":
      return {
        bg: "bg-destructive/20",
        text: "text-destructive",
        glow: "glow-destructive",
      }
    default:
      return {
        bg: "bg-muted",
        text: "text-muted-foreground",
        glow: "",
      }
  }
}

export function Analytics() {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Analytics</h1>
            <p className="text-sm text-muted-foreground">
              Métricas de rendimiento del sistema IA
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Última actualización: Hace 2 min
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-6 p-6">
        {/* Top KPIs */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpiData.map((kpi) => {
            const colors = getColorClasses(kpi.color)
            return (
              <Card
                key={kpi.id}
                className={cn(
                  "border-border bg-card transition-all duration-200 hover:border-primary/50",
                  kpi.color === "primary" && "hover:glow-primary"
                )}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-xl",
                        colors.bg
                      )}
                    >
                      <kpi.icon className={cn("h-5 w-5", colors.text)} />
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px]",
                        kpi.trend === "up"
                          ? "border-success/30 text-success"
                          : "border-destructive/30 text-destructive"
                      )}
                    >
                      {kpi.trend === "up" ? (
                        <ArrowUpRight className="mr-1 h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="mr-1 h-3 w-3" />
                      )}
                      {kpi.change}
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl font-bold text-foreground">
                      {kpi.value}
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {kpi.title}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {kpi.subtitle}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Weekly Performance Bar Chart */}
          <Card className="border-border bg-card lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageSquare className="h-4 w-4 text-primary" />
                Volumen Semanal de Mensajes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="day"
                      stroke="var(--muted-foreground)"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="var(--muted-foreground)"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Bar
                      dataKey="aiResueltos"
                      name="Resueltos por IA"
                      fill="var(--primary)"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="escalados"
                      name="Escalados"
                      fill="var(--destructive)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Distribution Pie Chart */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4 text-primary" />
                Distribución por Tipo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                      formatter={(value: number) => [`${value}%`, "Porcentaje"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Legend */}
              <div className="mt-2 space-y-2">
                {distributionData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-medium text-foreground">
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hourly Trend */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4 text-primary" />
              Tendencia Horaria - Hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyTrend}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--primary)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--primary)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="hour"
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    name="Mensajes"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
