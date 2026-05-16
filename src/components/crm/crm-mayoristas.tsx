"use client"

import { useState } from "react"
import {
  Users,
  Phone,
  Mail,
  MapPin,
  MoreHorizontal,
  Plus,
  GripVertical,
  Star,
  Building2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type ColumnType = "nuevos" | "contactados" | "negociacion" | "cerrada"

interface Lead {
  id: string
  name: string
  avatar: string
  company: string
  interest: string
  value: string
  urgency: "critical" | "high" | "medium" | "low"
  assignee: string
  phone: string
  email: string
  city: string
  lastContact: string
}

interface Column {
  id: ColumnType
  title: string
  color: string
  leads: Lead[]
}

const initialColumns: Column[] = [
  {
    id: "nuevos",
    title: "Nuevos Leads (IA)",
    color: "primary",
    leads: [
      {
        id: "1",
        name: "Roberto Mamani",
        avatar: "RM",
        company: "Distribuidora San Jorge",
        interest: "Pañales Premium + Toallitas",
        value: "$8,500",
        urgency: "critical",
        assignee: "JC",
        phone: "+591 70012345",
        email: "roberto@sanjorge.bo",
        city: "Santa Cruz",
        lastContact: "Hace 5 min",
      },
      {
        id: "2",
        name: "Lucía Mendoza",
        avatar: "LM",
        company: "Farmacorp SC",
        interest: "Línea completa bebé",
        value: "$12,000",
        urgency: "high",
        assignee: "MP",
        phone: "+591 76543210",
        email: "lucia@farmacorp.bo",
        city: "Santa Cruz",
        lastContact: "Hace 15 min",
      },
    ],
  },
  {
    id: "contactados",
    title: "Contactados",
    color: "warning",
    leads: [
      {
        id: "3",
        name: "Fernando Quispe",
        avatar: "FQ",
        company: "Bebé Feliz Importadora",
        interest: "Distribución exclusiva Cbba",
        value: "$25,000",
        urgency: "critical",
        assignee: "JC",
        phone: "+591 71234567",
        email: "fernando@bebefeliz.bo",
        city: "Cochabamba",
        lastContact: "Hace 1 hora",
      },
      {
        id: "4",
        name: "Ana Torres",
        avatar: "AT",
        company: "Supermercado Hipermaxi",
        interest: "Reposición 3 sucursales",
        value: "$15,000",
        urgency: "high",
        assignee: "MP",
        phone: "+591 72345678",
        email: "ana@hipermaxi.bo",
        city: "La Paz",
        lastContact: "Hace 2 horas",
      },
    ],
  },
  {
    id: "negociacion",
    title: "En Negociación",
    color: "chart-5",
    leads: [
      {
        id: "5",
        name: "Carlos Vargas",
        avatar: "CV",
        company: "Droguería Nacional",
        interest: "Contrato anual",
        value: "$45,000",
        urgency: "medium",
        assignee: "JC",
        phone: "+591 73456789",
        email: "carlos@droguerianacional.bo",
        city: "La Paz",
        lastContact: "Ayer",
      },
    ],
  },
  {
    id: "cerrada",
    title: "Venta Cerrada",
    color: "success",
    leads: [
      {
        id: "6",
        name: "María Flores",
        avatar: "MF",
        company: "Farmacia Central SC",
        interest: "Pedido mayorista",
        value: "$8,200",
        urgency: "low",
        assignee: "MP",
        phone: "+591 74567890",
        email: "maria@farmaciacentral.bo",
        city: "Santa Cruz",
        lastContact: "Hace 3 días",
      },
      {
        id: "7",
        name: "Pedro Gutiérrez",
        avatar: "PG",
        company: "Supermercado Ketal",
        interest: "Línea premium",
        value: "$18,500",
        urgency: "low",
        assignee: "JC",
        phone: "+591 75678901",
        email: "pedro@ketal.bo",
        city: "La Paz",
        lastContact: "Hace 5 días",
      },
    ],
  },
]

export function CRMMayoristas() {
  const [columns] = useState<Column[]>(initialColumns)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const getUrgencyStyles = (urgency: Lead["urgency"]) => {
    switch (urgency) {
      case "critical":
        return "bg-destructive/20 text-destructive border-destructive/30"
      case "high":
        return "bg-warning/20 text-warning border-warning/30"
      case "medium":
        return "bg-primary/20 text-primary border-primary/30"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const getColumnHeaderColor = (color: string) => {
    switch (color) {
      case "primary":
        return "bg-primary/20 text-primary"
      case "warning":
        return "bg-warning/20 text-warning"
      case "success":
        return "bg-success/20 text-success"
      case "chart-5":
        return "bg-chart-5/20 text-chart-5"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getTotalValue = (leads: Lead[]) => {
    return leads.reduce((sum, lead) => {
      const value = parseFloat(lead.value.replace(/[$,]/g, ""))
      return sum + value
    }, 0)
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            CRM Mayoristas
          </h1>
          <p className="text-sm text-muted-foreground">
            Pipeline de ventas B2B detectado por IA
          </p>
        </div>
        <Button className="glow-primary bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Lead
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="flex flex-1 gap-4 overflow-x-auto p-6">
        {columns.map((column) => (
          <div
            key={column.id}
            className="flex w-80 shrink-0 flex-col rounded-xl border border-border bg-card"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between border-b border-border p-4">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg",
                    getColumnHeaderColor(column.color)
                  )}
                >
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {column.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {column.leads.length} leads · $
                    {getTotalValue(column.leads).toLocaleString()}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            {/* Cards */}
            <div className="flex-1 space-y-3 overflow-y-auto p-3">
              {column.leads.map((lead) => (
                <div
                  key={lead.id}
                  onMouseEnter={() => setHoveredCard(lead.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={cn(
                    "group cursor-pointer rounded-lg border border-border bg-background p-4 transition-all duration-200",
                    hoveredCard === lead.id && "border-primary/50 glow-primary"
                  )}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold",
                          lead.urgency === "critical"
                            ? "bg-destructive/20 text-destructive"
                            : lead.urgency === "high"
                            ? "bg-warning/20 text-warning"
                            : "bg-primary/20 text-primary"
                        )}
                      >
                        {lead.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {lead.name}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Building2 className="h-3 w-3" />
                          {lead.company}
                        </div>
                      </div>
                    </div>
                    <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>

                  {/* Interest */}
                  <p className="mt-3 text-xs text-muted-foreground">
                    {lead.interest}
                  </p>

                  {/* Badges */}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge
                      className={cn(
                        "border text-[10px]",
                        getUrgencyStyles(lead.urgency)
                      )}
                    >
                      {lead.urgency === "critical"
                        ? "Urgente"
                        : lead.urgency === "high"
                        ? "Alta"
                        : lead.urgency === "medium"
                        ? "Media"
                        : "Baja"}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-success/30 bg-success/10 text-[10px] text-success"
                    >
                      {lead.value}
                    </Badge>
                  </div>

                  {/* Contact Info (on hover) */}
                  <div
                    className={cn(
                      "mt-3 space-y-1.5 overflow-hidden transition-all duration-200",
                      hoveredCard === lead.id
                        ? "max-h-24 opacity-100"
                        : "max-h-0 opacity-0"
                    )}
                  >
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {lead.phone}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {lead.email}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {lead.city}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-3">
                    <div className="flex items-center gap-1.5">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-[10px] font-semibold text-primary">
                        {lead.assignee}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {lead.lastContact}
                      </span>
                    </div>
                    {column.id === "cerrada" && (
                      <Star className="h-4 w-4 fill-warning text-warning" />
                    )}
                  </div>
                </div>
              ))}

              {/* Add Card Button */}
              <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border py-3 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                <Plus className="h-4 w-4" />
                Agregar lead
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
