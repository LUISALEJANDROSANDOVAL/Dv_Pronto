"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { Users, Filter, Plus, MoreHorizontal, MessageSquare, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const COLUMNS = [
  { id: 'new', label: 'Nuevos Leads IA', color: 'bg-blue-500' },
  { id: 'quoting', label: 'En Cotización', color: 'bg-orange-500' },
  { id: 'closing', label: 'Cierre de Venta', color: 'bg-purple-500' },
  { id: 'won', label: 'Ganado / Socio B2B', color: 'bg-emerald-500' },
];

export default function CRMPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();

    const channel = supabase
      .channel('crm_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations', filter: "intent=eq.wholesale" }, () => {
        fetchLeads();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchLeads() {
    setLoading(true);
    try {
      const response = await fetch('/api/conversations?intent=wholesale');
      if (response.ok) {
        const data = await response.json();
        setLeads(data || []);
      } else {
        console.error("Error al traer leads desde la API");
      }
    } catch (error) {
      console.error("Error en la solicitud de leads:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />

        <main className="flex-1 flex flex-col p-8 overflow-hidden">
          {/* Header del CRM */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <Users className="w-7 h-7 text-orange-500" />
                Embudo de Ventas Mayoristas
              </h1>
              <p className="text-sm text-slate-400 mt-1">Gestiona tus prospectos de alto valor filtrados por IA.</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => import("sonner").then(({ toast }) => toast.info("Filtros avanzados en desarrollo."))}
                className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-slate-800 transition-colors"
              >
                <Filter className="w-4 h-4" /> Filtrar
              </button>
              <button 
                onClick={() => import("sonner").then(({ toast }) => toast.info("Para añadir un lead manualmente, usa la API o espera la v2."))}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-transform hover:scale-105"
              >
                <Plus className="w-4 h-4" /> Nuevo Socio
              </button>
            </div>
          </div>

          {/* Tablero Kanban */}
          <div className="flex-1 flex gap-6 overflow-x-auto pb-4 no-scrollbar">
            {COLUMNS.map(column => (
              <div key={column.id} className="min-w-[300px] w-full flex flex-col">
                <div className="flex items-center justify-between mb-4 px-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] opacity-80 ${column.color}`} />
                    <h3 className="font-bold text-[11px] uppercase tracking-widest text-slate-300">{column.label}</h3>
                  </div>
                  <Badge variant="outline" className="bg-slate-900/50 border-slate-700/50 text-slate-400 text-[10px] backdrop-blur-md">
                    {leads.filter(l => (l.crm_status || 'new') === column.id).length}
                  </Badge>
                </div>

                <div className="flex-1 bg-slate-900/10 backdrop-blur-sm rounded-3xl border border-slate-800/30 p-3 space-y-4 overflow-y-auto">
                  {leads.filter(l => (l.crm_status || 'new') === column.id).map(lead => (
                    <div 
                      key={lead.id}
                      className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 p-5 rounded-2xl shadow-lg hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:-translate-y-1 transition-all duration-300 cursor-grab active:cursor-grabbing group relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600/50 flex items-center justify-center font-bold text-xs text-white shadow-inner">
                          {lead.customer_name?.[0]}
                        </div>
                        <button 
                          onClick={() => import("sonner").then(({ toast }) => toast.info("Edición de columnas bloqueada en modo Demo."))}
                          className="text-slate-500 hover:text-white transition-colors"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>

                      <h4 className="font-bold text-white text-[13px] mb-0.5 tracking-tight group-hover:text-orange-400 transition-colors">
                        {lead.customer_name}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-mono tracking-widest mb-4">{lead.wa_id}</p>

                      <div className="bg-slate-950/80 p-3 rounded-xl mb-4 border border-slate-800/60 shadow-inner">
                        <p className="text-[11px] text-slate-300 italic line-clamp-2 leading-relaxed">
                          "{lead.summary || "Sin resumen de IA"}"
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-slate-500">
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            <span className="text-[10px]">3</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            <span className="text-[10px]">Alto</span>
                          </div>
                        </div>
                        <Badge className="bg-orange-500/10 text-orange-500 border-none text-[9px]">MAYORISTA</Badge>
                      </div>
                    </div>
                  ))}

                  {leads.filter(l => (l.crm_status || 'new') === column.id).length === 0 && (
                    <div className="h-24 border-2 border-dashed border-slate-800 rounded-xl flex items-center justify-center text-slate-700 text-xs italic">
                      Vacio
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
