import { Search, Bell, TrendingUp, Users, Zap } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="h-20 border-b border-slate-800/60 flex items-center justify-between px-8 bg-slate-950/40 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <div className="relative group hidden md:block w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-orange-500 transition-colors" />
          <input
            type="text"
            placeholder="Buscar cliente o producto..."
            className="bg-slate-900/50 border border-slate-800 rounded-lg py-2 pl-10 pr-12 text-sm w-full focus:outline-none focus:border-orange-500/50 focus:bg-slate-900 focus:ring-4 focus:ring-orange-500/10 transition-all text-slate-200 placeholder:text-slate-500"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-slate-700 bg-slate-800 px-1.5 font-mono text-[10px] font-medium text-slate-400">
              <span className="text-xs">⌘</span>F
            </kbd>
          </div>
        </div>

        <div className="flex items-center gap-6 border-l border-slate-800/60 pl-8">
          <MetricItem icon={Zap} label="Ahorro Tiempo" value="84%" color="text-yellow-500" bgGlow="shadow-[0_0_15px_rgba(234,179,8,0.15)]" />
          <MetricItem icon={TrendingUp} label="Leads B2B" value="12" color="text-emerald-500" bgGlow="shadow-[0_0_15px_rgba(16,185,129,0.15)]" />
          <MetricItem icon={Users} label="Total Chats" value="1,204" color="text-blue-500" bgGlow="shadow-[0_0_15px_rgba(59,130,246,0.15)]" />
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-800 bg-slate-900 hover:bg-slate-800 hover:border-slate-700 transition-colors text-slate-400 hover:text-white">
          <Bell className="w-4 h-4" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[9px] font-bold text-white shadow-[0_0_8px_rgba(249,115,22,0.6)]">
            2
          </span>
        </button>
        <div className="flex items-center gap-3 pl-5 border-l border-slate-800/60">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-white leading-none">Luis Fernando</p>
            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Admin Pronto</p>
          </div>
          <div className="h-9 w-9 rounded-full border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center font-bold text-xs text-slate-300 shadow-inner">
            LF
          </div>
        </div>
      </div>
    </header>
  );
}

function MetricItem({ icon: Icon, label, value, color, bgGlow }: { icon: any, label: string, value: string, color: string, bgGlow?: string }) {
  return (
    <div className="group flex items-center gap-3 cursor-default">
      <div className={`p-2 rounded-xl bg-slate-900 border border-slate-800 ${color} ${bgGlow} transition-transform duration-300 group-hover:scale-105 group-hover:bg-slate-800/80`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex flex-col justify-center">
        <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-0.5">{label}</p>
        <p className="text-sm font-bold text-white tracking-tight leading-none">{value}</p>
      </div>
    </div>
  );
}
