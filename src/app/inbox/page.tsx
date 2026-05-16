"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { ConversationsList } from "@/components/dashboard/conversations-list";
import { ChatView } from "@/components/dashboard/chat-view";
import { Zap, MessageSquare, ShieldCheck } from "lucide-react";

export default function InboxPage() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [activeConversation, setActiveConversation] = useState<any>(null);

  // Cargar datos de la conversación seleccionada
  const handleSelectChat = async (id: string) => {
    setSelectedChatId(id);
    const { data } = await supabase.from('conversations').select('*').eq('id', id).single();
    setActiveConversation(data);
  };

  useEffect(() => {
    if (!selectedChatId) return;

    const channel = supabase
      .channel('inbox_conversation_sync')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'conversations',
        filter: `id=eq.${selectedChatId}` 
      }, (payload) => {
        setActiveConversation(payload.new);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedChatId]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />

        <main className="flex-1 flex overflow-hidden">
          {/* Columna Izquierda: Lista de Chats */}
          <div className="w-96 border-r border-slate-800 flex flex-col bg-slate-900/20">
            <div className="p-6 border-b border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-orange-500" />
                  Bandeja de Entrada
                </h2>
              </div>
              <p className="text-xs text-slate-400">Mensajes de WhatsApp en tiempo real.</p>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <ConversationsList 
                selectedId={selectedChatId || undefined} 
                onSelect={handleSelectChat} 
              />
            </div>
          </div>

          {/* Columna Derecha: Vista del Chat e Inteligencia */}
          <div className="flex-1 flex flex-col bg-slate-950/40 relative">
            {selectedChatId ? (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Banner de Inteligencia (Contexto de IA) */}
                <div className="bg-gradient-to-r from-orange-600/10 to-transparent p-4 border-b border-orange-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-orange-500 animate-pulse" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Resumen de Intención (IA)</p>
                      <p className="text-sm text-slate-200 italic font-medium">
                        {activeConversation?.summary || "Analizando primer mensaje..."}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-bold text-emerald-500">TRIAGE COMPLETADO</span>
                  </div>
                </div>

                <ChatView conversationId={selectedChatId} />
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center mb-6 border border-slate-800">
                  <MessageSquare className="w-10 h-10 text-slate-700" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Bandeja de Entrada</h3>
                <p className="text-slate-500 max-w-sm">
                  Selecciona una conversación a la izquierda para ver el historial y el análisis predictivo de la IA.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
