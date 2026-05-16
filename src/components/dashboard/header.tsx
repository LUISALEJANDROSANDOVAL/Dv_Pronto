import { Search, Bell, TrendingUp, Users, Zap } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="h-20 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-10">
      <div className="flex items-center gap-8">
        <div className="relative group hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-orange-500 transition-colors" />
          <input
            type="text"
            placeholder="Buscar cliente o producto..."
            className="bg-slate-900 border border-slate-800 rounded-full py-2 pl-10 pr-4 text-sm w-64 focus:outline-none focus:border-orange-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-6 border-l border-slate-800 pl-8">
          <MetricItem icon={Zap} label="Ahorro Tiempo" value="84%" color="text-yellow-500" />
          <MetricItem icon={TrendingUp} label="Leads B2B" value="12" color="text-emerald-500" />
          <MetricItem icon={Users} label="Total Chats" value="1,204" color="text-blue-500" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-950"></span>
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold">Luis Fernando</p>
            <p className="text-xs text-slate-500">Admin Pronto</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300">
            LF
          </div>
        </div>
      </div>
    </header>
  );
}

function MetricItem({ icon: Icon, label, value, color }: { icon: any, label: string, value: string, color: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`p-1.5 rounded-lg bg-slate-900 border border-slate-800 ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold leading-none">{label}</p>
        <p className="text-sm font-bold mt-1 leading-none">{value}</p>
      </div>
    </div>
  );
}
