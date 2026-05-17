import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const intent = searchParams.get('intent');

    let query = supabaseAdmin.from('conversations').select('*').order('updated_at', { ascending: false });

    if (intent) {
      query = query.eq('intent', intent);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase Error (GET Conversations):', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error('API Error (GET Conversations):', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
