import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { embed } from 'ai';
import { google } from '@ai-sdk/google';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, category, description, price_retail, price_wholesale, stock_quantity } = body;

    // Validate
    if (!name || !category) {
      return NextResponse.json({ error: 'Name and Category are required' }, { status: 400 });
    }

    // 1. Generate text for embedding
    const textToEmbed = `Producto: ${name}. Categoría: ${category}. Descripción: ${description || 'Sin descripción'}`;

    // 2. Call Gemini for embedding
    // In a Hackathon, API keys might have restrictions. We try to generate it, 
    // but if it fails, we still save the product without the embedding so the UI works.
    let embeddingVector: number[] | null = null;
    try {
      const { embedding } = await embed({
        model: google.textEmbeddingModel('text-embedding-004'),
        value: textToEmbed,
      });
      embeddingVector = embedding;
    } catch (e) {
      console.warn("Embedding generation failed, proceeding without embedding:", e);
    }

    // 3. Insert into Supabase
    const productData: any = {
      name,
      category,
      description,
      price_retail: parseFloat(price_retail) || 0,
      price_wholesale: parseFloat(price_wholesale) || 0,
      stock_quantity: parseInt(stock_quantity) || 0,
    };

    // If we successfully generated the vector, add it to the insert
    if (embeddingVector) {
      productData.embedding = `[${embeddingVector.join(',')}]`;
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert(productData)
      .select()
      .single();

    if (error) {
      console.error('Supabase Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, product: data });
  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');

    let query = supabaseAdmin.from('products').select('*').order('name');

    // Opcionalmente podemos aplicar filtros si vienen en la URL
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }
    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase Error (GET):', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error('API Error (GET):', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
