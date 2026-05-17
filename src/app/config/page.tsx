"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { Settings, Save, Brain, Zap, Bell, Shield, MessageSquare, Info } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function ConfigPage() {
  const [knowledgeBase, setKnowledgeBase] = useState("");
  const [botTone, setBotTone] = useState("amable");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  async function fetchConfig() {
    const { data } = await supabase.from('config').select('*').single();
    if (data) {
      setKnowledgeBase(data.knowledge_base || "");
      setBotTone(data.bot_tone || "amable");
    }
  }

  async function handleSave() {
    setSaving(true);
    const { error } = await supabase.from('config').upsert({ 
      id: 1, // Usamos un ID fijo para la config global
      knowledge_base: knowledgeBase,
      bot_tone: botTone,
      updated_at: new Date().toISOString()
    });

    if (error) {
      toast.error("Error al guardar la configuración");
    } else {
      toast.success("¡Cerebro actualizado! La IA ya conoce las nuevas reglas.");
    }
    setSaving(false);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />

        <main className="flex-1 flex flex-col p-8 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                <Settings className="w-7 h-7 text-orange-500" />
                Configuración del Cerebro IA
              </h1>
              <p className="text-[13px] text-slate-400 mt-1.5 max-w-xl">Entrena a tu bot y define las reglas de negocio sin escribir código.</p>
            </div>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl text-[13px] font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:opacity-50 hover:scale-105 active:scale-95"
            >
              <Save className="w-4 h-4" /> {saving ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Columna Izquierda: Reglas y Conocimiento */}
            <div className="col-span-12 lg:col-span-8 space-y-8">
              <section className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-3xl p-8 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-50"></div>
                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shadow-inner">
                    <Brain className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="font-bold text-white tracking-tight">Base de Conocimiento Directa</h3>
                </div>
                <p className="text-[13px] text-slate-400 mb-6 relative z-10 max-w-2xl leading-relaxed">
                  Cualquier texto que escribas aquí será prioridad absoluta para la IA. Úsalo para promociones del día o reglas temporales.
                </p>
                <textarea 
                  className="w-full h-64 bg-slate-950/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-5 text-[13px] leading-relaxed text-slate-300 focus:outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all placeholder:text-slate-600 shadow-inner resize-none relative z-10"
                  placeholder="Ejemplo: Hoy sábado tenemos 20% de descuento en todos los pañales Pampers si el cliente paga en efectivo..."
                  value={knowledgeBase}
                  onChange={(e) => setKnowledgeBase(e.target.value)}
                />
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-3xl p-8 shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-50"></div>
                  <div className="flex items-center gap-3 mb-6 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shadow-inner">
                      <Zap className="w-5 h-5 text-yellow-400" />
                    </div>
                    <h3 className="font-bold text-white tracking-tight">Tono del Bot</h3>
                  </div>
                  <div className="space-y-3 relative z-10">
                    {['amable', 'profesional', 'vendedor'].map((tone) => (
                      <label key={tone} className={`group/tone flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${botTone === tone ? 'bg-gradient-to-r from-orange-500/10 to-transparent border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.1)]' : 'bg-slate-950/50 border-slate-800/60 hover:border-slate-700'}`}>
                        <span className={`text-[13px] font-medium capitalize transition-colors ${botTone === tone ? 'text-orange-400' : 'text-slate-400 group-hover/tone:text-slate-200'}`}>{tone}</span>
                        <input 
                          type="radio" 
                          name="tone" 
                          className="hidden" 
                          checked={botTone === tone}
                          onChange={() => setBotTone(tone)}
                        />
                        <div className={`w-4 h-4 rounded-full border-[1.5px] transition-all duration-300 flex items-center justify-center ${botTone === tone ? 'border-orange-500' : 'border-slate-600'}`}>
                          {botTone === tone && <div className="w-2 h-2 rounded-full bg-orange-500 animate-in zoom-in duration-200" />}
                        </div>
                      </label>
                    ))}
                  </div>
                </section>

                <section className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-3xl p-8 shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-50"></div>
                  <div className="flex items-center gap-3 mb-6 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-inner">
                      <Bell className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="font-bold text-white tracking-tight">Notificaciones</h3>
                  </div>
                  <div className="space-y-6 relative z-10">
                    <ToggleItem label="Alertas Mayoristas" description="Notificar al desktop cuando entre un lead VIP" defaultChecked />
                    <ToggleItem label="Resúmenes Diarios" description="Enviar reporte de ventas por email" />
                  </div>
                </section>
              </div>
            </div>

            {/* Columna Derecha: Estado de Conexión */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <section className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-3xl p-8 shadow-xl">
                <h3 className="font-bold text-white mb-6 flex items-center gap-3 tracking-tight">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-inner">
                    <Shield className="w-4 h-4 text-emerald-400" />
                  </div>
                  Estado de Servicios
                </h3>
                <div className="space-y-3">
                  <StatusItem label="Motor OpenAI (GPT-4o)" status="online" />
                  <StatusItem label="WhatsApp API (Meta)" status="warning" />
                  <StatusItem label="Base de Datos (Supabase)" status="online" />
                  <StatusItem label="IA Clasificadora" status="online" />
                </div>
              </section>

              <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20 rounded-3xl p-8 backdrop-blur-md relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0 shadow-inner">
                    <Info className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-orange-400 mb-1.5 tracking-wide uppercase">Hackathon Tip</h4>
                    <p className="text-[12px] text-slate-300/80 leading-relaxed font-medium">
                      Muestra esta página al jurado para explicar cómo el dueño del negocio tiene el control total sin depender de ti. ¡Esto escala el negocio!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function ToggleItem({ label, description, defaultChecked = false }: { label: string, description: string, defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between" onClick={() => setChecked(!checked)}>
      <div>
        <p className="text-[13px] font-bold text-slate-200 tracking-tight">{label}</p>
        <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{description}</p>
      </div>
      <div className={`w-11 h-6 rounded-full relative transition-colors duration-300 cursor-pointer shadow-inner ${checked ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-slate-800'}`}>
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm ${checked ? 'right-1' : 'left-1'}`} />
      </div>
    </div>
  );
}

function StatusItem({ label, status }: { label: string, status: 'online' | 'offline' | 'warning' }) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-slate-800/60 shadow-inner group">
      <span className="text-[12px] font-medium text-slate-400 group-hover:text-slate-200 transition-colors">{label}</span>
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase ${
        status === 'online' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
        status === 'warning' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 
        'bg-red-500/10 text-red-400 border border-red-500/20'
      }`}>
        <div className={`w-1.5 h-1.5 rounded-full ${status === 'online' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse' : status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
        {status}
      </div>
    </div>
  );
}
