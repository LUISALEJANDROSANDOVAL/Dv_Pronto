"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Bot, User, ShieldCheck, Zap } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function ChatView({ conversationId }: { conversationId: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [conversation, setConversation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!conversationId) return;
    
    fetchData();

    const channel = supabase
      .channel(`chat_${conversationId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}` 
      }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'conversations',
        filter: `id=eq.${conversationId}`
      }, (payload) => {
        setConversation(payload.new);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  async function fetchData() {
    setLoading(true);
    const { data: conv } = await supabase.from('conversations').select('*').eq('id', conversationId).single();
    const { data: msgs } = await supabase.from('messages').select('*').eq('conversation_id', conversationId).order('created_at', { ascending: true });
    
    setConversation(conv);
    setMessages(msgs || []);
    setLoading(false);
  }

  if (!conversationId) return null;
  if (loading) return <div className="flex-1 flex items-center justify-center">Cargando conversación...</div>;

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
      {/* Header del Chat */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold">
            {conversation.customer_name?.[0] || "C"}
          </div>
          <div>
            <h3 className="font-bold text-sm">{conversation.customer_name}</h3>
            <p className="text-[10px] text-slate-500">{conversation.wa_id}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          {conversation.intent === 'wholesale' && (
            <div className="bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full flex items-center gap-2">
              <Zap className="w-3 h-3 text-orange-500" />
              <span className="text-[10px] font-bold text-orange-500 uppercase tracking-tighter">Mayorista</span>
            </div>
          )}
          <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-2">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">IA Verificada</span>
          </div>
        </div>
      </div>

      {/* Cuerpo del Chat */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950/20">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
            <div className={`flex gap-3 max-w-[80%] ${msg.sender === 'user' ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
                msg.sender === 'user' ? 'bg-slate-800' : 'bg-orange-500/20'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4 text-slate-400" /> : <Bot className="w-4 h-4 text-orange-500" />}
              </div>
              <div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user' ? 'bg-slate-900 border border-slate-800' : 'bg-orange-500 text-white font-medium'
                }`}>
                  {msg.content}
                </div>
                <p className={`text-[10px] text-slate-500 mt-1 ${msg.sender === 'user' ? 'text-left' : 'text-right'}`}>
                  {format(new Date(msg.created_at), "HH:mm '·' d 'de' MMM", { locale: es })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Resumen de IA en la parte inferior (Solo si es mayorista) */}
      {conversation.summary && (
        <div className="p-4 bg-orange-500/5 border-t border-orange-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-3 h-3 text-orange-500" />
            <span className="text-[10px] font-bold text-orange-500 uppercase">Resumen de Intención (IA)</span>
          </div>
          <p className="text-xs text-slate-300 italic">"{conversation.summary}"</p>
        </div>
      )}

      {/* Input de Respuesta del Agente */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 flex gap-3">
        <input 
          type="text"
          placeholder="Escribe tu respuesta como asesor humano..."
          className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-orange-500"
          onKeyDown={async (e) => {
            if (e.key === 'Enter') {
              const content = (e.target as HTMLInputElement).value;
              if (!content) return;
              
              await supabase.from('messages').insert({
                conversation_id: conversationId,
                sender: 'bot', // El humano habla a través del bot
                content: content
              });
              
              (e.target as HTMLInputElement).value = '';
            }
          }}
        />
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
          Enviar
        </button>
      </div>
    </div>
  );
}
