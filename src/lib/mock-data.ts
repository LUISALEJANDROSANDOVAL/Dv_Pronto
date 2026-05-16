// Mock data for Pronto Bolivia AI Dashboard
// Realistic data from Bolivia and Latin America

export interface Chat {
  id: string
  name: string
  lastMessage: string
  time: string
  avatar: string
  status: 'waiting_human' | 'ai_handled' | 'wholesale_lead'
  unread: number
  priority: 'critical' | 'high' | 'medium' | 'low'
}

export interface KPI {
  id: string
  title: string
  value: string
  change: string
  trend: 'up' | 'down' | 'stable'
  status: 'positive' | 'negative' | 'neutral' | 'urgent'
}

export interface Message {
  id: string
  content: string
  sender: 'customer' | 'ai' | 'agent'
  timestamp: string
}

export interface HandoffData {
  chatId: string
  customerName: string
  intent: string
  sentiment: string
  sentimentLevel: 'urgent' | 'positive' | 'neutral' | 'negative'
  detectedProducts: string[]
  messages: Message[]
  summary: string
}

export const mockChats: Chat[] = [
  {
    id: '1',
    name: 'Farmacia Central SC',
    lastMessage: 'Necesito cotización para 500 unidades de pañales premium',
    time: '2 min',
    avatar: 'FC',
    status: 'wholesale_lead',
    unread: 3,
    priority: 'critical',
  },
  {
    id: '2',
    name: 'Distribuidora San Jorge',
    lastMessage: 'El pedido anterior llegó incompleto, faltaron 20 cajas',
    time: '5 min',
    avatar: 'DS',
    status: 'waiting_human',
    unread: 2,
    priority: 'high',
  },
  {
    id: '3',
    name: 'María Fernanda López',
    lastMessage: '¿Tienen disponible el shampoo para bebé hipoalergénico?',
    time: '8 min',
    avatar: 'MF',
    status: 'ai_handled',
    unread: 0,
    priority: 'medium',
  },
  {
    id: '4',
    name: 'Bebé Feliz Importadora',
    lastMessage: 'Queremos ser distribuidores exclusivos en Cochabamba',
    time: '12 min',
    avatar: 'BF',
    status: 'wholesale_lead',
    unread: 5,
    priority: 'critical',
  },
  {
    id: '5',
    name: 'Droguería La Paz',
    lastMessage: 'Confirmado, paso a recoger mañana a las 10am',
    time: '15 min',
    avatar: 'DL',
    status: 'ai_handled',
    unread: 0,
    priority: 'low',
  },
  {
    id: '6',
    name: 'Carlos Mendoza',
    lastMessage: '¿Cuál es el precio de las toallitas húmedas pack x100?',
    time: '18 min',
    avatar: 'CM',
    status: 'ai_handled',
    unread: 0,
    priority: 'medium',
  },
  {
    id: '7',
    name: 'Supermercado Hipermaxi',
    lastMessage: 'Urgente: necesitamos reposición para 3 sucursales',
    time: '22 min',
    avatar: 'SH',
    status: 'waiting_human',
    unread: 4,
    priority: 'high',
  },
  {
    id: '8',
    name: 'Ana Quispe Mamani',
    lastMessage: 'Gracias por la información, voy a pensarlo',
    time: '25 min',
    avatar: 'AQ',
    status: 'ai_handled',
    unread: 0,
    priority: 'low',
  },
]

export const mockKPIs: KPI[] = [
  {
    id: '1',
    title: 'Mensajes Procesados Hoy',
    value: '1,245',
    change: '+12%',
    trend: 'up',
    status: 'positive',
  },
  {
    id: '2',
    title: 'Tasa de Contención IA',
    value: '85%',
    change: 'Estable',
    trend: 'stable',
    status: 'positive',
  },
  {
    id: '3',
    title: 'Leads Mayoristas Detectados',
    value: '12',
    change: 'Urgente',
    trend: 'up',
    status: 'urgent',
  },
  {
    id: '4',
    title: 'Tiempo Promedio de Respuesta',
    value: '4.2s',
    change: 'Óptimo',
    trend: 'down',
    status: 'positive',
  },
]

export const mockHandoffData: HandoffData = {
  chatId: '1',
  customerName: 'Farmacia Central SC',
  intent: 'Compra al por mayor',
  sentiment: 'Urgente',
  sentimentLevel: 'urgent',
  detectedProducts: [
    'Toallitas Húmedas x100',
    'Pañales Premium Talla M',
    'Shampoo Familiar 1L',
    'Cremas para Bebé',
  ],
  summary:
    'El cliente solicita una cotización de volumen crítico para múltiples productos. Representa una oportunidad de venta B2B significativa. Requiere atención inmediata.',
  messages: [
    {
      id: '1',
      content: 'Hola, buenos días. Soy de Farmacia Central de Santa Cruz.',
      sender: 'customer',
      timestamp: '10:32',
    },
    {
      id: '2',
      content:
        '¡Hola! Bienvenido a Pronto Bolivia. Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?',
      sender: 'ai',
      timestamp: '10:32',
    },
    {
      id: '3',
      content:
        'Necesitamos cotización para compra mayorista. Queremos 500 unidades de pañales premium, 200 packs de toallitas y 100 shampoos familiares.',
      sender: 'customer',
      timestamp: '10:33',
    },
    {
      id: '4',
      content:
        'Entiendo que necesita una cotización mayorista. Permítame conectarle con un ejecutivo especializado que podrá ofrecerle los mejores precios y condiciones.',
      sender: 'ai',
      timestamp: '10:33',
    },
    {
      id: '5',
      content: 'Es urgente, necesitamos la mercadería para el viernes sin falta.',
      sender: 'customer',
      timestamp: '10:34',
    },
  ],
}

export const mockChartData = [
  { hour: '08:00', mensajes: 45, aiResueltos: 38 },
  { hour: '09:00', mensajes: 89, aiResueltos: 76 },
  { hour: '10:00', mensajes: 156, aiResueltos: 132 },
  { hour: '11:00', mensajes: 203, aiResueltos: 175 },
  { hour: '12:00', mensajes: 178, aiResueltos: 151 },
  { hour: '13:00', mensajes: 124, aiResueltos: 108 },
  { hour: '14:00', mensajes: 189, aiResueltos: 162 },
  { hour: '15:00', mensajes: 234, aiResueltos: 198 },
  { hour: '16:00', mensajes: 267, aiResueltos: 228 },
]
