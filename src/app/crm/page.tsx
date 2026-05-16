import { Sidebar } from "@/components/dashboard/sidebar"
import { Topbar } from "@/components/dashboard/topbar"
import { CRMMayoristas } from "@/components/crm/crm-mayoristas"

export default function CRMPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-hidden">
          <CRMMayoristas />
        </main>
      </div>
    </div>
  )
}
