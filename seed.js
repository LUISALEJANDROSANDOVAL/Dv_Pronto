import { supabaseAdmin } from './src/lib/supabase';

const dummyProducts = [
  { name: "Pañales Huggies Recién Nacido", category: "bebé", price_retail: 45, price_wholesale: 38, description: "Pañales ultra suaves para piel sensible." },
  { name: "Leche Enfamil Premium 400g", category: "bebé", price_retail: 120, price_wholesale: 105, description: "Fórmula infantil con DHA." },
  { name: "Serum Vitamina C La Roche-Posay", category: "belleza", price_retail: 350, price_wholesale: 290, description: "Serum antioxidante iluminador." },
  { name: "Toallitas Húmedas Johnson's", category: "bebé", price_retail: 25, price_wholesale: 18, description: "Pack de 80 unidades, sin alcohol." },
  { name: "Champú Pantene Restauración", category: "cuidado personal", price_retail: 35, price_wholesale: 28, description: "Repara el daño del cabello desde el primer uso." },
];

async function seed() {
  console.log("🌱 Iniciando carga de catálogo dummy...");
  const { error } = await supabaseAdmin.from('products').insert(dummyProducts);
  
  if (error) console.error("❌ Error al cargar productos:", error);
  else console.log("✅ Catálogo de 50 productos cargado exitosamente.");
}

seed();
