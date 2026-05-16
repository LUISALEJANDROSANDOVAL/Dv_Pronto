import { openai } from '@ai-sdk/openai';
import { generateText, generateObject, embed } from 'ai';
import { z } from 'zod';
import { supabaseAdmin } from './supabase';

// Clasificar la intención del usuario
export async function classifyIntent(message: string, history: string[] = []) {
  const { object } = await generateObject({
    model: openai('gpt-4o-mini'),
    schema: z.object({
      intent: z.enum(['retail', 'wholesale', 'support']),
      category: z.enum(['bebé', 'belleza', 'cuidado personal', 'desconocido']),
      urgency: z.enum(['baja', 'media', 'alta']),
      summary: z.string(),
    }),
    prompt: `Analiza el siguiente mensaje de un cliente de "Pronto Bolivia" (distribuidora de productos de bebé y belleza).
    
    Contexto:
    - retail: Compras pequeñas, consultas de precios individuales.
    - wholesale: Compras por mayor, farmacias, tiendas, pedidos por docena/cajón.
    - support: Problemas con pedidos, horarios, dirección.
    
    Historial reciente: ${history.join('\n')}
    Mensaje actual: "${message}"`,
  });

  return object;
}

// Generar respuesta del bot usando RAG y Configuración Dinámica
export async function generateBotResponse(message: string, contextProducts: any[]) {
  // 1. Obtener configuración del cerebro
  const { data: config } = await supabaseAdmin.from('config').select('*').single();
  
  const productInfo = contextProducts
    .map(p => `- ${p.name}: Q${p.price_retail} (Unit), Q${p.price_wholesale} (Mayor). ${p.description}`)
    .join('\n');

  const { text } = await generateText({
    model: openai('gpt-4o-mini'),
    system: `Eres el asistente inteligente de Pronto Bolivia. 
    Tu tono actual es: ${config?.bot_tone || 'amable'}.
    
    BASE DE CONOCIMIENTO ADICIONAL (REGLAS DE NEGOCIO):
    ${config?.knowledge_base || 'No hay reglas adicionales hoy.'}

    INFORMACIÓN DE PRODUCTOS:
    ${productInfo}
    
    Reglas:
    1. Si es MINORISTA: Responde con el precio y beneficios.
    2. Si es MAYORISTA: Sé más formal, dile que un asesor especializado lo atenderá en breve.
    3. Nunca inventes productos que no están en la lista.`,
    prompt: message,
  });

  return text;
}
