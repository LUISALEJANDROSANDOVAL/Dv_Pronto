import Link from "next/link";
import { ArrowRight, Bot, Zap, Shield, BarChart3 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-orange-500/30">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-orange-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-blue-500/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center font-bold text-lg">P</div>
          <span className="font-bold text-xl tracking-tight">Pronto<span className="text-orange-500 italic">.ai</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#" className="hover:text-white transition-colors">Producto</a>
          <a href="#" className="hover:text-white transition-colors">Precios</a>
          <a href="#" className="hover:text-white transition-colors">Empresa</a>
        </div>
        <Link 
          href="/dashboard"
          className="bg-white text-slate-950 px-5 py-2 rounded-full text-sm font-bold hover:bg-orange-500 hover:text-white transition-all shadow-lg shadow-white/5"
        >
          Ir al Dashboard
        </Link>
      </nav>

      {/* Hero */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-bold text-orange-500 mb-6">
            <Zap className="w-3 h-3" /> MVP HACKATHON 2026
          </div>
          <h1 className="text-6xl md:text-7xl font-bold tracking-tighter leading-[1.1] mb-8">
            Automatiza tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Atención B2B</span> con Inteligencia Artificial.
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed mb-10 max-w-2xl">
            Clasifica leads, responde consultas de stock y transfiere mayoristas a humanos en tiempo real. Todo desde WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/dashboard"
              className="group bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-xl shadow-orange-500/20"
            >
              Probar Demo en Vivo <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all">
              Ver Video de Presentación
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-32">
          <FeatureCard 
            icon={Bot} 
            title="NLP Ultra-Rápido" 
            description="Entiende el contexto de tus 3,000 productos y responde como un humano en milisegundos."
          />
          <FeatureCard 
            icon={BarChart3} 
            title="Detección de Intención" 
            description="Separa automáticamente a los curiosos de los grandes compradores mayoristas."
          />
          <FeatureCard 
            icon={Shield} 
            title="Handoff Inteligente" 
            description="Notifica a tu equipo de ventas en tiempo real con un resumen completo del chat."
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-orange-500/50 transition-colors group">
      <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-6 group-hover:bg-orange-500/10 transition-colors">
        <Icon className="w-6 h-6 text-slate-400 group-hover:text-orange-500 transition-colors" />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}
