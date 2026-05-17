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
    try {
      const [convRes, msgsRes] = await Promise.all([
        fetch(`/api/conversations/${conversationId}`),
        fetch(`/api/messages?conversationId=${conversationId}`)
      ]);
      
      if (convRes.ok && msgsRes.ok) {
        setConversation(await convRes.json());
        setMessages(await msgsRes.json());
      }
    } catch (error) {
      console.error("Error fetching chat data:", error);
    } finally {
      setLoading(false);
    }
  }

  if (!conversationId) return null;
  if (loading) return <div className="flex-1 flex items-center justify-center">Cargando conversación...</div>;

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
      {/* Header del Chat */}
      <div className="p-5 border-b border-slate-800/60 bg-slate-950/40 backdrop-blur-md flex items-center justify-between z-10 shadow-sm shadow-black/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 flex items-center justify-center font-bold text-lg text-slate-200 shadow-inner">
            {conversation.customer_name?.[0] || "C"}
          </div>
          <div>
            <h3 className="font-bold text-base text-white tracking-tight">{conversation.customer_name}</h3>
            <p className="text-[11px] text-slate-400 font-mono tracking-widest mt-0.5">{conversation.wa_id}</p>
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
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950/20 scroll-smooth">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
            <div className={`flex gap-3 max-w-[75%] ${msg.sender === 'user' ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border shadow-sm ${
                msg.sender === 'user' ? 'bg-slate-800 border-slate-700' : 'bg-gradient-to-br from-orange-500 to-orange-600 border-orange-400/50'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4 text-slate-300" /> : <Bot className="w-4 h-4 text-white" />}
              </div>
              <div className="flex flex-col gap-1">
                <div className={`p-4 text-[13px] leading-relaxed shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-slate-900 border border-slate-800 text-slate-200 rounded-2xl rounded-tl-sm' 
                    : 'bg-gradient-to-b from-orange-500 to-orange-600 text-white font-medium rounded-2xl rounded-tr-sm shadow-[0_4px_15px_rgba(249,115,22,0.15)] border border-orange-400/20'
                }`}>
                  {msg.content}
                </div>
                <p className={`text-[9px] text-slate-500 font-medium tracking-wide uppercase ${msg.sender === 'user' ? 'text-left ml-1' : 'text-right mr-1'}`}>
                  {format(new Date(msg.created_at), "HH:mm", { locale: es })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Resumen de IA en la parte inferior (Solo si es mayorista) */}
      {conversation.summary && (
        <div className="p-4 bg-gradient-to-r from-orange-500/10 to-transparent border-t border-orange-500/20 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-3 h-3 text-orange-500 animate-pulse" />
              <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Análisis predictivo IA</span>
            </div>
            <p className="text-[13px] text-slate-300 italic font-medium leading-relaxed">"{conversation.summary}"</p>
          </div>
        </div>
      )}

      {/* Input de Respuesta del Agente */}
      <div className="p-5 bg-slate-950/80 border-t border-slate-800/60 flex gap-3 backdrop-blur-xl">
        <input 
          type="text"
          placeholder="Escribe tu respuesta humana aquí..."
          className="flex-1 bg-slate-900 border border-slate-700/50 rounded-xl px-5 py-3 text-sm focus:outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 transition-all text-slate-200 placeholder:text-slate-500 shadow-inner"
          onKeyDown={async (e) => {
            if (e.key === 'Enter') {
              const content = (e.target as HTMLInputElement).value;
              if (!content) return;
              
              await fetch('/api/agent/reply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ conversationId, text: content })
              });
              
              (e.target as HTMLInputElement).value = '';
            }
          }}
        />
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
          Enviar
        </button>
      </div>
    </div>
  );
}
