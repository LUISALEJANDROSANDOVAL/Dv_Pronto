import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const dummyProducts = [
  { name: "Pañales Huggies Recién Nacido", category: "bebé", price_retail: 45, price_wholesale: 38, description: "Pañales ultra suaves para piel sensible." },
  { name: "Leche Enfamil Premium 400g", category: "bebé", price_retail: 120, price_wholesale: 105, description: "Fórmula infantil con DHA." },
  { name: "Serum Vitamina C La Roche-Posay", category: "belleza", price_retail: 350, price_wholesale: 290, description: "Serum antioxidante iluminador." },
  { name: "Toallitas Húmedas Johnson's", category: "bebé", price_retail: 25, price_wholesale: 18, description: "Pack de 80 unidades, sin alcohol." },
  { name: "Champú Pantene Restauración", category: "cuidado personal", price_retail: 35, price_wholesale: 28, description: "Repara el daño del cabello desde el primer uso." },
  { name: "Protector Solar Eucerin Oil Control", category: "belleza", price_retail: 180, price_wholesale: 155, description: "Efecto mate de larga duración." },
  { name: "Biberón Avent Anti-cólicos 260ml", category: "bebé", price_retail: 85, price_wholesale: 72, description: "Reduce los cólicos y el malestar." },
  { name: "Crema Hidratante CeraVe 454g", category: "cuidado personal", price_retail: 160, price_wholesale: 135, description: "Para piel seca a muy seca." }
];

export async function GET() {
  try {
    const { error } = await supabaseAdmin.from('products').insert(dummyProducts);
    if (error) throw error;
    
    return NextResponse.json({ 
      status: 'success', 
      message: 'Catálogo cargado exitosamente. Ya puedes probar el RAG.',
      count: dummyProducts.length 
    });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
