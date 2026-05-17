"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Definimos el esquema de validación
const productSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  category: z.string().min(2, "La categoría es obligatoria"),
  description: z.string().optional(),
  price_retail: z.string().regex(/^\d+(\.\d{1,2})?$/, "Debe ser un precio válido").optional(),
  price_wholesale: z.string().regex(/^\d+(\.\d{1,2})?$/, "Debe ser un precio válido").optional(),
  stock_quantity: z.string().regex(/^\d+$/, "Debe ser un número entero").optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export function AddProductDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      price_retail: "0",
      price_wholesale: "0",
      stock_quantity: "0",
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al guardar el producto');
      }

      toast.success("Producto guardado y vectorizado con IA exitosamente");
      setOpen(false);
      reset();
      onSuccess(); // Refresca la tabla en la página principal
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-transform hover:scale-105">
          <Plus className="w-4 h-4" /> Añadir Producto
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-slate-950 border-slate-800 text-slate-200">
        <DialogHeader>
          <DialogTitle className="text-white">Añadir Nuevo Producto</DialogTitle>
          <DialogDescription className="text-slate-400">
            Completa los datos del producto. La IA procesará la descripción para incluirla en sus recomendaciones.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-300">Nombre</Label>
              <Input
                id="name"
                {...register("name")}
                className="bg-slate-900 border-slate-800 focus-visible:ring-orange-500"
                placeholder="Ej. Crema Nivea Q10"
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="text-slate-300">Categoría</Label>
              <Input
                id="category"
                {...register("category")}
                className="bg-slate-900 border-slate-800 focus-visible:ring-orange-500"
                placeholder="Ej. Belleza"
              />
              {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-300">Descripción (Para la IA)</Label>
            <Textarea
              id="description"
              {...register("description")}
              className="bg-slate-900 border-slate-800 focus-visible:ring-orange-500 min-h-[80px]"
              placeholder="Describe el producto para que la IA sepa cuándo recomendarlo..."
            />
            {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price_retail" className="text-slate-300">P. Minorista</Label>
              <Input
                id="price_retail"
                type="number"
                step="0.01"
                {...register("price_retail")}
                className="bg-slate-900 border-slate-800 focus-visible:ring-orange-500"
              />
              {errors.price_retail && <p className="text-xs text-red-500">{errors.price_retail.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="price_wholesale" className="text-slate-300">P. Mayorista</Label>
              <Input
                id="price_wholesale"
                type="number"
                step="0.01"
                {...register("price_wholesale")}
                className="bg-slate-900 border-slate-800 focus-visible:ring-orange-500"
              />
              {errors.price_wholesale && <p className="text-xs text-red-500">{errors.price_wholesale.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock_quantity" className="text-slate-300">Stock</Label>
              <Input
                id="stock_quantity"
                type="number"
                {...register("stock_quantity")}
                className="bg-slate-900 border-slate-800 focus-visible:ring-orange-500"
              />
              {errors.stock_quantity && <p className="text-xs text-red-500">{errors.stock_quantity.message}</p>}
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Vectorizando...
                </>
              ) : (
                "Guardar y Entrenar IA"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
