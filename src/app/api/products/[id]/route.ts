import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { embed } from 'ai';
import { google } from '@ai-sdk/google';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const body = await req.json();
    const { name, category, description, price_retail, price_wholesale, stock_quantity } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // 1. Prepare data for update
    const productData: any = {};
    if (name) productData.name = name;
    if (category) productData.category = category;
    if (description !== undefined) productData.description = description;
    if (price_retail !== undefined) productData.price_retail = parseFloat(price_retail) || 0;
    if (price_wholesale !== undefined) productData.price_wholesale = parseFloat(price_wholesale) || 0;
    if (stock_quantity !== undefined) productData.stock_quantity = parseInt(stock_quantity) || 0;

    // 2. Generate new text for embedding if textual fields changed
    if (name || category || description !== undefined) {
      // First, we need to know the existing data to form a complete text in case not all fields were sent
      const { data: existingProduct } = await supabaseAdmin.from('products').select('*').eq('id', id).single();
      
      const finalName = name || existingProduct?.name || '';
      const finalCategory = category || existingProduct?.category || '';
      const finalDescription = description !== undefined ? description : (existingProduct?.description || 'Sin descripción');

      const textToEmbed = `Producto: ${finalName}. Categoría: ${finalCategory}. Descripción: ${finalDescription}`;

      // Call Gemini for embedding
      let embeddingVector: number[] | null = null;
      try {
        const { embedding } = await embed({
          model: google.textEmbeddingModel('text-embedding-004'),
          value: textToEmbed,
        });
        embeddingVector = embedding;
      } catch (e) {
        console.warn("Embedding generation failed during PUT, keeping old embedding:", e);
      }

      if (embeddingVector) {
        productData.embedding = `[${embeddingVector.join(',')}]`;
      }
    }

    // 3. Update in Supabase
    const { data, error } = await supabaseAdmin
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase Error (PUT):', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, product: data });
  } catch (err: any) {
    console.error('API Error (PUT):', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase Error (DELETE):', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('API Error (DELETE):', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
