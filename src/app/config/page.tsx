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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <Settings className="w-7 h-7 text-orange-500" />
                Configuración del Cerebro IA
              </h1>
              <p className="text-sm text-slate-400 mt-1">Entrena a tu bot y define las reglas de negocio sin escribir código.</p>
            </div>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {saving ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Columna Izquierda: Reglas y Conocimiento */}
            <div className="col-span-8 space-y-8">
              <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="w-5 h-5 text-purple-500" />
                  <h3 className="font-bold text-white">Base de Conocimiento Directa</h3>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Cualquier texto que escribas aquí será prioridad absoluta para la IA. Úsalo para promociones del día o reglas temporales.
                </p>
                <textarea 
                  className="w-full h-64 bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-300 focus:outline-none focus:border-orange-500 transition-colors placeholder:text-slate-700"
                  placeholder="Ejemplo: Hoy sábado tenemos 20% de descuento en todos los pañales Pampers si el cliente paga en efectivo. No tenemos stock de leche Enfamil etapa 1 hasta el lunes."
                  value={knowledgeBase}
                  onChange={(e) => setKnowledgeBase(e.target.value)}
                />
              </section>

              <div className="grid grid-cols-2 gap-6">
                <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <h3 className="font-bold text-white">Tono del Bot</h3>
                  </div>
                  <div className="space-y-3">
                    {['amable', 'profesional', 'vendedor'].map((tone) => (
                      <label key={tone} className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${botTone === tone ? 'bg-orange-500/10 border-orange-500' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}>
                        <span className="text-sm capitalize text-slate-300">{tone}</span>
                        <input 
                          type="radio" 
                          name="tone" 
                          className="hidden" 
                          checked={botTone === tone}
                          onChange={() => setBotTone(tone)}
                        />
                        <div className={`w-4 h-4 rounded-full border-2 ${botTone === tone ? 'border-orange-500 bg-orange-500' : 'border-slate-700'}`} />
                      </label>
                    ))}
                  </div>
                </section>

                <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Bell className="w-5 h-5 text-blue-500" />
                    <h3 className="font-bold text-white">Notificaciones</h3>
                  </div>
                  <div className="space-y-4">
                    <ToggleItem label="Alertas Mayoristas" description="Notificar al desktop cuando entre un lead VIP" defaultChecked />
                    <ToggleItem label="Resúmenes Diarios" description="Enviar reporte de ventas por email" />
                  </div>
                </section>
              </div>
            </div>

            {/* Columna Derecha: Estado de Conexión */}
            <div className="col-span-4 space-y-6">
              <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  Estado de Servicios
                </h3>
                <div className="space-y-4">
                  <StatusItem label="Motor OpenAI (GPT-4o)" status="online" />
                  <StatusItem label="WhatsApp API (Meta)" status="warning" />
                  <StatusItem label="Base de Datos (Supabase)" status="online" />
                  <StatusItem label="IA Clasificadora" status="online" />
                </div>
              </section>

              <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-orange-500 mb-1">Hackathon Tip</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
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
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-200">{label}</p>
        <p className="text-[10px] text-slate-500">{description}</p>
      </div>
      <div className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${defaultChecked ? 'bg-emerald-500' : 'bg-slate-800'}`}>
        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${defaultChecked ? 'right-1' : 'left-1'}`} />
      </div>
    </div>
  );
}

function StatusItem({ label, status }: { label: string, status: 'online' | 'offline' | 'warning' }) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800/50">
      <span className="text-xs text-slate-400">{label}</span>
      <Badge className={
        status === 'online' ? 'bg-emerald-500/10 text-emerald-500 border-none' : 
        status === 'warning' ? 'bg-yellow-500/10 text-yellow-500 border-none' : 
        'bg-red-500/10 text-red-500 border-none'
      }>
        {status.toUpperCase()}
      </Badge>
    </div>
  );
}
