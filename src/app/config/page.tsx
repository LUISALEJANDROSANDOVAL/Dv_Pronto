import { Sidebar } from "@/components/dashboard/sidebar"
import { Topbar } from "@/components/dashboard/topbar"
import { IAConfig } from "@/components/config/ia-config"

export default function ConfigPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-hidden">
          <IAConfig />
        </main>
      </div>
    </div>
  )
}
