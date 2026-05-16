import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { classifyIntent, generateBotResponse } from '@/lib/ai';

import { sendWhatsAppMessage } from '@/lib/whatsapp';

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

// Verificación del Webhook (Meta pide esto)
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      return new NextResponse(challenge, { status: 200 });
    }
  }
  return new NextResponse('Forbidden', { status: 403 });
}

// Procesamiento de mensajes de WhatsApp
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validar que sea un mensaje de WhatsApp
    if (!body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
      return NextResponse.json({ status: 'ignored' });
    }

    const messageObj = body.entry[0].changes[0].value.messages[0];
    const from = messageObj.from; // WhatsApp ID del usuario
    const text = messageObj.text?.body || "";
    const customerName = body.entry[0].changes[0].value.contacts?.[0]?.profile?.name || "Cliente";

    if (!text) return NextResponse.json({ status: 'no text' });

    // 1. Obtener o crear conversación
    let { data: conversation } = await supabaseAdmin
      .from('conversations')
      .select('*')
      .eq('wa_id', from)
      .maybeSingle();

    if (!conversation) {
      const { data: newConv } = await supabaseAdmin
        .from('conversations')
        .insert({ wa_id: from, customer_name: customerName, last_message: text })
        .select()
        .single();
      conversation = newConv;
    }

    // 2. Clasificar intención con IA
    const analysis = await classifyIntent(text);

    // 3. Lógica de Handoff (WOW Factor)
    if (analysis.intent === 'wholesale' && conversation.status !== 'handoff') {
      await supabaseAdmin.from('conversations').update({
        intent: 'wholesale',
        status: 'handoff',
        summary: analysis.summary
      }).eq('id', conversation.id);

      // Insertar alerta para el Dashboard (Realtime)
      await supabaseAdmin.from('handoff_alerts').insert({
        conversation_id: conversation.id,
        customer_name: customerName,
        reason: 'Intención Mayorista Detectada',
        summary: analysis.summary
      });
      
      await sendWhatsAppMessage(from, "¡Gracias! He detectado que buscas compras por mayor. Un asesor especializado de Pronto se unirá a este chat en breve para darte atención personalizada. 😊");
    }

    // 4. Generar respuesta (Si no está en handoff)
    if (conversation.status !== 'handoff') {
      // Obtener catálogo de productos para el contexto (RAG simplificado)
      const { data: products } = await supabaseAdmin
        .from('products')
        .select('name, price_retail, price_wholesale, description');

      const responseText = await generateBotResponse(text, products || []);
      await sendWhatsAppMessage(from, responseText);
      
      // Guardar mensaje del bot
      await supabaseAdmin.from('messages').insert({
        conversation_id: conversation.id,
        sender: 'bot',
        content: responseText
      });
    }

    // Guardar mensaje en el log
    await supabaseAdmin.from('messages').insert({
      conversation_id: conversation.id,
      sender: 'user',
      content: text
    });

    return NextResponse.json({ status: 'success' });
  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
