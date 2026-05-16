"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Topbar } from "@/components/dashboard/topbar"
import { KPIGrid } from "@/components/dashboard/kpi-grid"
import { ChatList } from "@/components/dashboard/chat-list"
import { HandoffPanel } from "@/components/dashboard/handoff-panel"
import { AnalyticsChart } from "@/components/dashboard/analytics-chart"

export default function DashboardPage() {
  const [selectedChatId, setSelectedChatId] = useState("1")

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar />

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-[1600px] space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  Centro de operaciones en tiempo real
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-success animate-subtle-pulse" />
                Última actualización: hace 5 segundos
              </div>
            </div>

            {/* KPI Grid */}
            <KPIGrid />

            {/* Main Panel - Split View */}
            <div className="grid h-[calc(100vh-380px)] min-h-[500px] grid-cols-12 gap-6">
              {/* Chat List - 35% */}
              <div className="col-span-4">
                <ChatList
                  selectedChatId={selectedChatId}
                  onSelectChat={setSelectedChatId}
                />
              </div>

              {/* Handoff Panel - 65% */}
              <div className="col-span-8">
                <HandoffPanel />
              </div>
            </div>

            {/* Analytics Chart */}
            <AnalyticsChart />
          </div>
        </main>
      </div>
    </div>
  )
}
