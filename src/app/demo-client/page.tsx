"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Send, CheckCheck, User, Bot, ArrowLeft, MoreVertical, Phone, Video } from "lucide-react";
import { cn } from "@/lib/utils";

export default function WhatsAppSimulator() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ sender: 'user' | 'bot', text: string, time: string }[]>([
    { sender: 'bot', text: "¡Hola! Bienvenido a Pronto Bolivia. ¿En qué puedo ayudarte hoy? 👶✨", time: "10:00" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const conversationIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Escuchar mensajes nuevos en Supabase para mostrarlos en el simulador
    const channel = supabase
      .channel('simulator_messages')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages' 
      }, (payload) => {
        const msg = payload.new;
        if (msg.sender === 'bot') {
          const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          setChat(prev => [...prev, { sender: 'bot', text: msg.content, time: now }]);
          setIsTyping(false);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMsg = message;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setChat(prev => [...prev, { sender: 'user', text: userMsg, time: now }]);
    setMessage("");
    setIsTyping(true);

    try {
      // Simular el Webhook de Meta llamando a nuestra API interna
      const response = await fetch('/api/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entry: [{
            changes: [{
              value: {
                contacts: [{ profile: { name: "Jurado Hackathon" } }],
                messages: [{
                  from: "59170000000",
                  text: { body: userMsg },
                  type: "text"
                }]
              }
            }]
          }]
        })
      });

      // En un hackathon, para que la demo sea rápida, si la API tarda, 
      // podemos mockear la respuesta aquí o esperar a que la IA responda
      // Pero como ya configuramos OpenAI, debería responder de verdad.
      
      // Nota: En una demo real, el bot respondería por WhatsApp. 
      // Aquí vamos a simular que el bot responde en la burbuja de chat.
      setTimeout(() => {
        setIsTyping(false);
        // Aquí podrías hacer un fetch a Supabase para ver qué respondió el bot
      }, 2000);

    } catch (error) {
      console.error(error);
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b141a] flex items-center justify-center p-4 font-sans">
      {/* Contenedor del Teléfono */}
      <div className="w-full max-w-[400px] h-[750px] bg-[#0b141a] rounded-[40px] border-[8px] border-slate-800 overflow-hidden flex flex-col shadow-2xl relative">
        
        {/* Notch / Cámara */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-20"></div>

        {/* WhatsApp Header */}
        <div className="bg-[#202c33] p-4 pt-8 flex items-center gap-3 text-white">
          <ArrowLeft className="w-5 h-5 text-slate-400" />
          <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center">
            <User className="w-6 h-6 text-slate-300" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-sm">Pronto Bolivia</h2>
            <p className="text-[10px] text-emerald-500">en línea</p>
          </div>
          <div className="flex gap-4 text-slate-400">
            <Video className="w-5 h-5" />
            <Phone className="w-5 h-5" />
            <MoreVertical className="w-5 h-5" />
          </div>
        </div>

        {/* Chat Body */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-3 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat bg-contain"
        >
          {chat.map((msg, i) => (
            <div key={i} className={cn(
              "max-w-[80%] p-2 rounded-lg text-sm relative shadow-sm animate-in zoom-in-95 duration-300",
              msg.sender === 'user' 
                ? "ml-auto bg-[#005c4b] text-white rounded-tr-none" 
                : "bg-[#202c33] text-slate-200 rounded-tl-none"
            )}>
              {msg.text}
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="text-[9px] text-slate-400">{msg.time}</span>
                {msg.sender === 'user' && <CheckCheck className="w-3 h-3 text-sky-400" />}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="bg-[#202c33] text-slate-400 text-[10px] p-2 rounded-lg w-fit animate-pulse">
              Pronto Bot está escribiendo...
            </div>
          )}
        </div>

        {/* Quick Suggestions (Demo Hacks) */}
        <div className="bg-[#0b141a]/80 backdrop-blur px-2 py-2 flex gap-2 overflow-x-auto no-scrollbar border-t border-slate-800">
          <button 
            onClick={() => setMessage("¿Tienen pañales Huggies G?")}
            className="whitespace-nowrap bg-slate-800 text-[10px] text-slate-300 px-3 py-1 rounded-full border border-slate-700"
          >
            🛒 Consulta Minorista
          </button>
          <button 
            onClick={() => setMessage("Me interesa comprar por mayor 50 cajas de leche")}
            className="whitespace-nowrap bg-orange-500/10 text-[10px] text-orange-500 px-3 py-1 rounded-full border border-orange-500/20 font-bold"
          >
            🔥 Lead Mayorista
          </button>
        </div>

        {/* Input Area */}
        <div className="bg-[#202c33] p-3 flex items-center gap-2">
          <div className="flex-1 bg-[#2a3942] rounded-full px-4 py-2 flex items-center">
            <input 
              type="text" 
              placeholder="Escribe un mensaje"
              className="bg-transparent border-none focus:ring-0 text-white text-sm w-full outline-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
          </div>
          <button 
            onClick={handleSend}
            className="w-11 h-11 bg-[#00a884] rounded-full flex items-center justify-center text-white hover:bg-[#008f72] transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Instrucción Flotante para el Jurado */}
      <div className="fixed bottom-10 right-10 max-w-xs bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl hidden lg:block">
        <h4 className="text-orange-500 font-bold mb-2 flex items-center gap-2">
          <Bot className="w-4 h-4" /> Demo Tip
        </h4>
        <p className="text-xs text-slate-400 leading-relaxed">
          Usa este simulador para mostrar cómo la IA clasifica los mensajes. Intenta escribir: 
          <span className="block mt-2 font-mono text-emerald-400 italic">"Necesito 50 docenas de pañales para mi tienda"</span>
        </p>
      </div>
    </div>
  );
}
