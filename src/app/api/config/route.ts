import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    // Obtenemos la configuración global (asumimos id = 1 para el tenant único/admin)
    const { data, error } = await supabaseAdmin
      .from('config')
      .select('*')
      .eq('id', 1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows found"
      throw error;
    }

    // Si no existe, retornamos valores por defecto
    if (!data) {
      return NextResponse.json({
        id: 1,
        knowledge_base: "",
        bot_tone: "amable",
      });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching config:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { knowledge_base, bot_tone } = await req.json();

    // Validaciones de seguridad en el backend
    if (typeof knowledge_base !== 'string') {
      return NextResponse.json({ error: "El conocimiento debe ser texto" }, { status: 400 });
    }

    const allowedTones = ['amable', 'profesional', 'vendedor'];
    if (!allowedTones.includes(bot_tone)) {
      return NextResponse.json({ error: "Tono no válido" }, { status: 400 });
    }

    // Guardado seguro usando la llave maestra
    const { data, error } = await supabaseAdmin
      .from('config')
      .upsert({
        id: 1, // ID fijo para configuración global
        knowledge_base,
        bot_tone,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error saving config:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
