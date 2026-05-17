import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendWhatsAppMessage } from '@/lib/whatsapp';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { conversationId, text } = body;

    if (!conversationId || !text) {
      return NextResponse.json({ error: 'Conversation ID and text are required' }, { status: 400 });
    }

    // 1. Get the conversation to find the wa_id
    const { data: conversation, error: convError } = await supabaseAdmin
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .single();

    if (convError || !conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // 2. Send message via WhatsApp Meta API
    await sendWhatsAppMessage(conversation.wa_id, text);

    // 3. Save message in the database as 'agent'
    const { data: message, error: msgError } = await supabaseAdmin
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender: 'agent',
        content: text
      })
      .select()
      .single();

    if (msgError) {
      console.error('Supabase Error (Save Agent Message):', msgError);
      return NextResponse.json({ error: msgError.message }, { status: 500 });
    }

    // 4. Update the conversation to show the agent has replied
    await supabaseAdmin
      .from('conversations')
      .update({
        status: 'active', // Can set to 'active' or keep 'handoff' but mark as replied
        updated_at: new Date().toISOString()
      })
      .eq('id', conversationId);

    return NextResponse.json({ success: true, message });
  } catch (err: any) {
    console.error('API Error (Agent Reply):', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
