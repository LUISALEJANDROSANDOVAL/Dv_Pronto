"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { BellRing, ExternalLink } from "lucide-react";
import { toast } from "sonner"; // Usaremos sonner para notificaciones elegantes

export function AlertNotification() {
  useEffect(() => {
    // Suscribirse a nuevas alertas de handoff
    const channel = supabase
      .channel('handoff_alerts_realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'handoff_alerts' }, (payload) => {
        const alert = payload.new;
        
        // Sonido de alerta (opcional para el WOW factor)
        // const audio = new Audio('/alert.mp3');
        // audio.play();

        toast.custom((t) => (
          <div className="bg-slate-900 border-2 border-orange-500 rounded-xl p-4 shadow-2xl shadow-orange-500/20 max-w-sm w-full animate-in slide-in-from-right-full">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <BellRing className="w-6 h-6 text-orange-500 animate-bounce" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white leading-tight">🔥 ¡NUEVO LEAD MAYORISTA!</h4>
                <p className="text-sm text-slate-300 mt-1 font-semibold">{alert.customer_name}</p>
                <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {alert.summary || "Buscando cotización por volumen."}
                </p>
                <div className="mt-4 flex gap-2">
                  <button 
                    onClick={() => toast.dismiss(t)}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    Atender Ahora <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ), { duration: 10000 });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return null; // Este componente no renderiza nada fijo, solo lanza toasts
}
