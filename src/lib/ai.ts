import { openai } from '@ai-sdk/openai';
import { generateText, generateObject, embed } from 'ai';
import { z } from 'zod';

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

// Generar respuesta del bot usando RAG (Esquema simplificado)
export async function generateBotResponse(message: string, contextProducts: any[]) {
  const productInfo = contextProducts
    .map(p => `- ${p.name}: Q${p.price_retail} (Unit), Q${p.price_wholesale} (Mayor). ${p.description}`)
    .join('\n');

  const { text } = await generateText({
    model: openai('gpt-4o-mini'),
    system: `Eres el asistente inteligente de Pronto Bolivia. Tu objetivo es ser amable, eficiente y profesional.
    Si el cliente pregunta por productos, usa la siguiente información:
    ${productInfo}
    
    Reglas:
    1. Si es MINORISTA: Responde con el precio y beneficios. Sé empático.
    2. Si es MAYORISTA: Sé más formal, dile que un asesor especializado lo atenderá en breve y que hemos priorizado su solicitud.
    3. Nunca inventes productos que no están en la lista.`,
    prompt: message,
  });

  return text;
}
