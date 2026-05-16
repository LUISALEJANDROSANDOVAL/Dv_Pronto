"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export function ConversationsList({ 
  selectedId, 
  onSelect 
}: { 
  selectedId?: string; 
  onSelect: (id: string) => void 
}) {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();

    // Suscripción Realtime para actualizaciones de mensajes/conversaciones
    const channel = supabase
      .channel('conversations_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, (payload) => {
        fetchConversations();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchConversations() {
    const { data } = await supabase
      .from('conversations')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (data) setConversations(data);
    setLoading(false);
  }

  if (loading) return <div className="p-4 text-slate-500 text-center">Cargando chats...</div>;

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      {conversations.length === 0 ? (
        <div className="p-8 text-center text-slate-500 text-sm">No hay mensajes recientes</div>
      ) : (
        conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={cn(
              "p-4 border-b border-slate-800/50 cursor-pointer hover:bg-slate-800/50 transition-colors relative group",
              conv.status === 'handoff' ? "bg-orange-500/5" : "",
              selectedId === conv.id ? "bg-slate-800" : ""
            )}
          >
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-semibold text-sm truncate pr-4">{conv.customer_name}</h3>
              <span className="text-[10px] text-slate-500 whitespace-nowrap">
                {formatDistanceToNow(new Date(conv.updated_at), { addSuffix: true, locale: es })}
              </span>
            </div>
            
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {conv.last_message}
            </p>

            <div className="flex items-center gap-2 mt-2">
              {conv.intent === 'wholesale' && (
                <span className="text-[9px] bg-orange-500/20 text-orange-500 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Mayorista
                </span>
              )}
              {conv.status === 'handoff' && (
                <span className="text-[9px] bg-red-500/20 text-red-500 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider animate-pulse">
                  Requiere Humano
                </span>
              )}
            </div>

            {/* Punto de notificación si es nuevo o crítico */}
            {conv.status === 'handoff' && (
              <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-orange-500 rounded-full group-hover:h-12 transition-all"></div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
