"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { ShoppingBag, Search, Filter, Plus, Package, Tag, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AddProductDialog } from "@/components/products/add-product-dialog";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data || []);
      } else {
        console.error('Error fetching products from API');
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />

        <main className="flex-1 flex flex-col p-8 overflow-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                <ShoppingBag className="w-7 h-7 text-orange-500" />
                Catálogo de Productos
              </h1>
              <p className="text-[13px] text-slate-400 mt-1.5 max-w-xl">
                Gestiona tu inventario centralizado. La IA sincroniza automáticamente los precios y stock para generar respuestas precisas en WhatsApp.
              </p>
            </div>
            <AddProductDialog onSuccess={fetchProducts} />
          </div>

          {/* Barra de Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-orange-500 transition-colors" />
              <input 
                type="text"
                placeholder="Buscar por nombre, categoría o código..."
                className="w-full bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl py-2.5 pl-11 pr-4 text-[13px] focus:outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 transition-all text-slate-200 placeholder:text-slate-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button 
              onClick={() => {
                import("sonner").then(({ toast }) => toast.info("Filtros avanzados disponibles en la versión completa."));
              }}
              className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 px-5 py-2.5 rounded-xl text-[13px] font-medium flex items-center gap-2 hover:bg-slate-800 hover:border-slate-700 transition-colors text-slate-300"
            >
              <Filter className="w-4 h-4 text-slate-400" /> Categoría
            </button>
          </div>

          {/* Tabla de Productos */}
          <div className="flex-1 overflow-y-auto rounded-2xl border border-slate-800/60 bg-slate-900/20 shadow-xl backdrop-blur-sm">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60 z-10">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Producto</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Categoría</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap text-right">P. Minorista</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap text-right">P. Mayorista</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Stock</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Estado IA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/30">
                {filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-white/[0.02] transition-colors group cursor-default">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 flex items-center justify-center shadow-inner group-hover:border-orange-500/30 transition-colors">
                          <Package className="w-4 h-4 text-slate-400 group-hover:text-orange-400 transition-colors" />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-slate-200 group-hover:text-white transition-colors">{product.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono tracking-widest mt-0.5">ID: {product.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="bg-slate-900/50 border-slate-700/50 text-slate-400 text-[10px] capitalize tracking-wide font-medium">
                        {product.category}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-mono text-[13px] text-slate-300 text-right">Bs.{product.price_retail}</td>
                    <td className="px-6 py-4 font-mono text-[13px] text-orange-400 font-bold text-right bg-orange-500/[0.02]">Bs.{product.price_wholesale}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="relative flex h-2 w-2">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-20 ${product.stock_quantity > 10 ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                          <span className={`relative inline-flex rounded-full h-2 w-2 shadow-[0_0_8px_currentColor] ${product.stock_quantity > 10 ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-red-500 shadow-red-500/50'}`}></span>
                        </div>
                        <span className="text-[12px] text-slate-300 font-medium">{product.stock_quantity} un.</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-[9px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full w-fit tracking-widest uppercase">
                        <Tag className="w-3 h-3" /> Indexado
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredProducts.length === 0 && !loading && (
              <div className="p-20 text-center">
                <p className="text-slate-500 italic">No se encontraron productos en el catálogo.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
