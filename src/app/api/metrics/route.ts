import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    // Total de chats (mensajes) - Ajustamos para que cuente conversaciones totales si se prefiere,
    // o mensajes totales. Según kpi-grid era: count: messages
    const { count: msgCount, error: err1 } = await supabaseAdmin
      .from('messages')
      .select('*', { count: 'exact', head: true });

    // Leads B2B (intent = wholesale)
    const { count: leadCount, error: err2 } = await supabaseAdmin
      .from('conversations')
      .select('*', { count: 'exact', head: true })
      .eq('intent', 'wholesale');

    // Chats Activos (status = handoff)
    const { count: activeCount, error: err3 } = await supabaseAdmin
      .from('conversations')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'handoff');

    if (err1) throw err1;
    if (err2) throw err2;
    if (err3) throw err3;

    return NextResponse.json({
      msgCount: msgCount || 0,
      leadCount: leadCount || 0,
      activeCount: activeCount || 0
    });
  } catch (error: any) {
    console.error("Error fetching metrics:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
