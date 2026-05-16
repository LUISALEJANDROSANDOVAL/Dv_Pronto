import { LayoutDashboard, Users, ShoppingBag, MessageSquare, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", active: true },
  { icon: MessageSquare, label: "Mensajes", badge: "12" },
  { icon: Users, label: "Clientes B2B" },
  { icon: ShoppingBag, label: "Inventario" },
  { icon: Settings, label: "Configuración" },
];

export function DashboardSidebar() {
  return (
    <aside className="w-20 lg:w-64 flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col p-4">
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center font-bold text-xl">P</div>
        <span className="font-bold text-xl hidden lg:block tracking-tight">Pronto<span className="text-orange-500 italic">.ai</span></span>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item, i) => (
          <button
            key={i}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group",
              item.active ? "bg-orange-500/10 text-orange-500" : "text-slate-400 hover:bg-slate-800 hover:text-white"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium hidden lg:block">{item.label}</span>
            {item.badge && (
              <span className="ml-auto hidden lg:flex bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-slate-800">
        <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-red-400 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium hidden lg:block">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
