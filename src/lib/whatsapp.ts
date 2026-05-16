const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

export async function sendWhatsAppMessage(to: string, text: string) {
  if (!PHONE_NUMBER_ID || !ACCESS_TOKEN || ACCESS_TOKEN === 'mock_token') {
    console.log(`[SIMULACIÓN WHATSAPP] Enviando a ${to}: ${text}`);
    return { status: 'simulated' };
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: to,
          type: 'text',
          text: { preview_url: false, body: text },
        }),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
  }
}

export async function sendWhatsAppAction(to: string, action: 'typing_on' | 'mark_read') {
  // Nota: Cloud API maneja esto diferente, pero para la demo 
  // enviar un mensaje de "Escribiendo..." es un toque humano pro.
  // Por ahora lo dejamos como placeholder para no complicar el MVP.
}
