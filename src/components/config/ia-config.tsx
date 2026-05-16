"use client"

import { useState } from "react"
import {
  Bot,
  Database,
  Sliders,
  RefreshCw,
  Check,
  Sparkles,
  FileText,
  Zap,
  Shield,
  Clock,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const defaultSystemPrompt = `Eres un asistente virtual de atención al cliente para Pronto Bolivia, una empresa líder en productos para bebés y cuidado personal.

Tu rol principal es:
1. Atender consultas sobre productos, precios y disponibilidad
2. Identificar oportunidades de venta mayorista (pedidos > 100 unidades)
3. Resolver dudas frecuentes sobre envíos y métodos de pago
4. Escalar a un agente humano cuando detectes: reclamos complejos, negociaciones B2B, o clientes frustrados

Mantén un tono profesional pero cálido. Usa español boliviano natural. Si detectas un lead mayorista potencial, prioriza la atención y notifica al equipo comercial.

Productos principales: Pañales Premium, Toallitas Húmedas, Shampoo Familiar, Cremas para Bebé, Artículos de Higiene.`

export function IAConfig() {
  const [temperature, setTemperature] = useState([0.7])
  const [maxTokens, setMaxTokens] = useState([2048])
  const [systemPrompt, setSystemPrompt] = useState(defaultSystemPrompt)
  const [selectedModel, setSelectedModel] = useState("gpt-4-turbo")
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSync, setLastSync] = useState("Hace 2 minutos")

  // Feature toggles
  const [features, setFeatures] = useState({
    autoResponder: true,
    leadDetection: true,
    sentimentAnalysis: true,
    productRecommendation: true,
    escalationRules: true,
    multiLanguage: false,
  })

  const handleSync = () => {
    setIsSyncing(true)
    setTimeout(() => {
      setIsSyncing(false)
      setLastSync("Ahora mismo")
    }, 2000)
  }

  const toggleFeature = (key: keyof typeof features) => {
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              Configuración IA
            </h1>
            <p className="text-sm text-muted-foreground">
              Ajusta el comportamiento del asistente virtual
            </p>
          </div>
          <Button className="glow-primary bg-primary hover:bg-primary/90">
            <Check className="mr-2 h-4 w-4" />
            Guardar Cambios
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-6 p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* System Prompt */}
          <Card className="border-border bg-card lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4 text-primary" />
                System Prompt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="min-h-[200px] resize-none bg-input font-mono text-sm"
                placeholder="Ingresa las instrucciones del sistema..."
              />
              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {systemPrompt.length} caracteres
                </p>
                <Button variant="outline" size="sm">
                  <Sparkles className="mr-2 h-3 w-3" />
                  Optimizar con IA
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Model Settings */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Sliders className="h-4 w-4 text-primary" />
                Ajustes del Modelo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Model Selection */}
              <div className="space-y-2">
                <Label className="text-sm text-foreground">Modelo IA</Label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="bg-input">
                    <SelectValue placeholder="Selecciona un modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4-turbo">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4 text-primary" />
                        GPT-4 Turbo
                        <Badge variant="secondary" className="text-[10px]">
                          Recomendado
                        </Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="gpt-4">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4" />
                        GPT-4
                      </div>
                    </SelectItem>
                    <SelectItem value="gpt-3.5-turbo">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-warning" />
                        GPT-3.5 Turbo
                        <Badge variant="outline" className="text-[10px]">
                          Económico
                        </Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="claude-3-opus">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-chart-5" />
                        Claude 3 Opus
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Temperature Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-foreground">Temperatura</Label>
                  <span className="text-sm font-medium text-primary">
                    {temperature[0]}
                  </span>
                </div>
                <Slider
                  value={temperature}
                  onValueChange={setTemperature}
                  max={1}
                  step={0.1}
                  className="[&_[role=slider]]:bg-primary"
                />
                <p className="text-xs text-muted-foreground">
                  Controla la creatividad de las respuestas. Valores bajos =
                  respuestas más consistentes.
                </p>
              </div>

              {/* Max Tokens */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-foreground">
                    Max Tokens de Respuesta
                  </Label>
                  <span className="text-sm font-medium text-primary">
                    {maxTokens[0]}
                  </span>
                </div>
                <Slider
                  value={maxTokens}
                  onValueChange={setMaxTokens}
                  min={256}
                  max={4096}
                  step={256}
                  className="[&_[role=slider]]:bg-primary"
                />
                <p className="text-xs text-muted-foreground">
                  Límite máximo de tokens por respuesta generada.
                </p>
              </div>

              {/* Response Time */}
              <div className="space-y-2">
                <Label className="text-sm text-foreground">
                  Timeout de Respuesta
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    defaultValue={30}
                    className="w-24 bg-input"
                  />
                  <span className="text-sm text-muted-foreground">segundos</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* RAG & Knowledge Base */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Database className="h-4 w-4 text-primary" />
                RAG & Knowledge Base
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Sync Status Card */}
              <div
                className={cn(
                  "rounded-lg border border-border bg-background p-4",
                  !isSyncing && "border-success/30 bg-success/5"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg",
                        isSyncing
                          ? "bg-primary/20"
                          : "bg-success/20 glow-success"
                      )}
                    >
                      {isSyncing ? (
                        <RefreshCw className="h-5 w-5 animate-spin text-primary" />
                      ) : (
                        <Check className="h-5 w-5 text-success" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {isSyncing
                          ? "Sincronizando..."
                          : "Base de datos sincronizada"}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        Última sincronización: {lastSync}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSync}
                    disabled={isSyncing}
                  >
                    <RefreshCw
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSyncing && "animate-spin"
                      )}
                    />
                    Sincronizar
                  </Button>
                </div>
              </div>

              {/* Knowledge Sources */}
              <div className="space-y-3">
                <Label className="text-sm text-foreground">
                  Fuentes de Conocimiento
                </Label>
                <div className="space-y-2">
                  {[
                    { name: "Catálogo de Productos", docs: 245, active: true },
                    { name: "FAQ & Políticas", docs: 38, active: true },
                    { name: "Historial de Ventas", docs: 1250, active: true },
                    { name: "Manual de Agentes", docs: 15, active: false },
                  ].map((source, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-border bg-input px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "h-2 w-2 rounded-full",
                            source.active
                              ? "bg-success animate-subtle-pulse"
                              : "bg-muted-foreground"
                          )}
                        />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {source.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {source.docs} documentos
                          </p>
                        </div>
                      </div>
                      <Switch checked={source.active} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Embedding Model */}
              <div className="space-y-2">
                <Label className="text-sm text-foreground">
                  Modelo de Embeddings
                </Label>
                <Select defaultValue="text-embedding-3-small">
                  <SelectTrigger className="bg-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text-embedding-3-small">
                      text-embedding-3-small
                    </SelectItem>
                    <SelectItem value="text-embedding-3-large">
                      text-embedding-3-large
                    </SelectItem>
                    <SelectItem value="text-embedding-ada-002">
                      text-embedding-ada-002
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Feature Toggles */}
          <Card className="border-border bg-card lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="h-4 w-4 text-primary" />
                Funcionalidades Activas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    key: "autoResponder" as const,
                    title: "Auto-Responder IA",
                    description: "Respuestas automáticas a consultas frecuentes",
                    icon: Bot,
                  },
                  {
                    key: "leadDetection" as const,
                    title: "Detección de Leads",
                    description: "Identifica oportunidades mayoristas",
                    icon: Sparkles,
                  },
                  {
                    key: "sentimentAnalysis" as const,
                    title: "Análisis de Sentimiento",
                    description: "Detecta frustración o urgencia",
                    icon: Shield,
                  },
                  {
                    key: "productRecommendation" as const,
                    title: "Recomendación de Productos",
                    description: "Sugiere productos relacionados",
                    icon: Zap,
                  },
                  {
                    key: "escalationRules" as const,
                    title: "Reglas de Escalamiento",
                    description: "Escala automáticamente casos complejos",
                    icon: RefreshCw,
                  },
                  {
                    key: "multiLanguage" as const,
                    title: "Soporte Multi-idioma",
                    description: "Responde en el idioma del cliente",
                    icon: FileText,
                  },
                ].map((feature) => (
                  <div
                    key={feature.key}
                    className={cn(
                      "flex items-start gap-4 rounded-lg border border-border p-4 transition-all",
                      features[feature.key]
                        ? "border-primary/30 bg-primary/5"
                        : "bg-background"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                        features[feature.key]
                          ? "bg-primary/20"
                          : "bg-muted"
                      )}
                    >
                      <feature.icon
                        className={cn(
                          "h-5 w-5",
                          features[feature.key]
                            ? "text-primary"
                            : "text-muted-foreground"
                        )}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">
                          {feature.title}
                        </p>
                        <Switch
                          checked={features[feature.key]}
                          onCheckedChange={() => toggleFeature(feature.key)}
                        />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
