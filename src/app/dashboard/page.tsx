"use client";

import { DashboardHeader } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { ConversationsList } from "@/components/dashboard/conversations-list";
import { ChatView } from "@/components/dashboard/chat-view";
import { AlertNotification } from "@/components/dashboard/alert-notification";
import { useState } from "react";

export default function DashboardPage() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      {/* Sidebar de navegación principal */}
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header con métricas rápidas */}
        <DashboardHeader />

        <main className="flex-1 flex overflow-hidden p-4 gap-4">
          {/* Lista de Chats activos */}
          <div className="w-80 flex-shrink-0 bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-800">
              <h2 className="font-semibold text-lg">Chats Activos</h2>
              <p className="text-xs text-slate-400">Atendiendo 100+ mensajes hoy</p>
            </div>
            <ConversationsList 
              selectedId={selectedChatId || undefined} 
              onSelect={(id) => setSelectedChatId(id)} 
            />
          </div>

          {/* Área Principal de Chat / Contexto */}
          {selectedChatId ? (
            <div className="flex-1 bg-slate-900/50 rounded-xl border border-slate-800 flex flex-col overflow-hidden">
              <ChatView conversationId={selectedChatId} />
            </div>
          ) : (
            <div className="flex-1 bg-slate-900/50 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-slate-500 italic p-8 text-center">
              <div>
                <p className="mb-4">Selecciona un chat para ver la conversación y el análisis de la IA</p>
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 not-italic inline-block">
                  <h3 className="text-white font-bold mb-2">🚀 Modo Demo Activo</h3>
                  <p className="text-sm text-slate-400 mb-4 max-w-xs">
                    Si no tienes acceso a la API de Meta, usa nuestro simulador de WhatsApp para la presentación.
                  </p>
                  <a 
                    href="/demo-client" 
                    target="_blank" 
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all inline-flex items-center gap-2"
                  >
                    Abrir Simulador de WhatsApp
                  </a>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Notificaciones Realtime (Componente Invisible que lanza Toasts o Modals) */}
      <AlertNotification />
    </div>
  );
}
