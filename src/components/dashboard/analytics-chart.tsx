"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Activity } from "lucide-react"
import { mockChartData } from "@/lib/mock-data"

export function AnalyticsChart() {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            Volumen de Mensajes - Hoy
          </h3>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Total Mensajes
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-success" />
            IA Resueltos
          </span>
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={mockChartData}
            margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorMensajes" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="oklch(0.65 0.25 285)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="oklch(0.65 0.25 285)"
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="colorAI" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="oklch(0.65 0.18 145)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="oklch(0.65 0.18 145)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="oklch(0.22 0.01 285)"
              vertical={false}
            />
            <XAxis
              dataKey="hour"
              tick={{ fill: "oklch(0.60 0 0)", fontSize: 10 }}
              axisLine={{ stroke: "oklch(0.22 0.01 285)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "oklch(0.60 0 0)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.10 0.005 285)",
                border: "1px solid oklch(0.22 0.01 285)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              labelStyle={{ color: "oklch(0.95 0 0)" }}
            />
            <Area
              type="monotone"
              dataKey="mensajes"
              stroke="oklch(0.65 0.25 285)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorMensajes)"
              name="Total Mensajes"
            />
            <Area
              type="monotone"
              dataKey="aiResueltos"
              stroke="oklch(0.65 0.18 145)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorAI)"
              name="IA Resueltos"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
