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
    // Solo traemos conversaciones con intención mayorista
    const { data } = await supabase
      .from('conversations')
      .select('*')
      .eq('intent', 'wholesale')
      .order('updated_at', { ascending: false });
    
    setLeads(data || []);
    setLoading(false);
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
              <button className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-slate-800 transition-colors">
                <Filter className="w-4 h-4" /> Filtrar
              </button>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-transform hover:scale-105">
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
                    <div className={`w-2 h-2 rounded-full ${column.color}`} />
                    <h3 className="font-bold text-sm uppercase tracking-wider text-slate-300">{column.label}</h3>
                  </div>
                  <Badge variant="outline" className="bg-slate-900 border-slate-800 text-slate-500 text-[10px]">
                    {leads.filter(l => (l.crm_status || 'new') === column.id).length}
                  </Badge>
                </div>

                <div className="flex-1 bg-slate-900/30 rounded-2xl border border-slate-800/50 p-3 space-y-4 overflow-y-auto">
                  {leads.filter(l => (l.crm_status || 'new') === column.id).map(lead => (
                    <div 
                      key={lead.id}
                      className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-sm hover:border-orange-500/50 transition-all cursor-grab active:cursor-grabbing group"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs">
                          {lead.customer_name?.[0]}
                        </div>
                        <button className="text-slate-600 hover:text-white">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>

                      <h4 className="font-bold text-white text-sm mb-1 group-hover:text-orange-500 transition-colors">
                        {lead.customer_name}
                      </h4>
                      <p className="text-[11px] text-slate-500 mb-3">{lead.wa_id}</p>

                      <div className="bg-slate-950/50 p-2 rounded-lg mb-4 border border-slate-800/50">
                        <p className="text-[10px] text-slate-400 italic line-clamp-2">
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
