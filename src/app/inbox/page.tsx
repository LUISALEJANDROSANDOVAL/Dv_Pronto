import { Sidebar } from "@/components/dashboard/sidebar"
import { Topbar } from "@/components/dashboard/topbar"
import { InboxOmnicanal } from "@/components/inbox/inbox-omnicanal"

export default function InboxPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-hidden">
          <InboxOmnicanal />
        </main>
      </div>
    </div>
  )
}
