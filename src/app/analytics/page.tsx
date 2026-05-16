import { Sidebar } from "@/components/dashboard/sidebar"
import { Topbar } from "@/components/dashboard/topbar"
import { Analytics } from "@/components/analytics/analytics"

export default function AnalyticsPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-hidden">
          <Analytics />
        </main>
      </div>
    </div>
  )
}
