"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { ShoppingBag, Search, Filter, Plus, Package, Tag, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').order('name');
    setProducts(data || []);
    setLoading(false);
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <ShoppingBag className="w-7 h-7 text-orange-500" />
                Catálogo de Productos
              </h1>
              <p className="text-sm text-slate-400 mt-1">Gestiona los precios y stock que la IA utiliza para responder.</p>
            </div>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-transform hover:scale-105">
              <Plus className="w-4 h-4" /> Añadir Producto
            </button>
          </div>

          {/* Barra de Filtros */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text"
                placeholder="Buscar por nombre, categoría o código..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-orange-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-slate-800">
              <Filter className="w-4 h-4 text-slate-500" /> Categoría
            </button>
          </div>

          {/* Tabla de Productos */}
          <div className="flex-1 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900/20">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-slate-900 border-b border-slate-800 z-10">
                <tr>
                  <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Producto</th>
                  <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Categoría</th>
                  <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">P. Minorista</th>
                  <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">P. Mayorista</th>
                  <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Stock</th>
                  <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Estado IA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
                          <Package className="w-5 h-5 text-slate-500 group-hover:text-orange-500 transition-colors" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{product.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">ID: {product.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-400">
                      <Badge variant="outline" className="bg-slate-950/50 border-slate-800 capitalize">
                        {product.category}
                      </Badge>
                    </td>
                    <td className="p-4 font-mono text-sm text-white">Q{product.price_retail}</td>
                    <td className="p-4 font-mono text-sm text-orange-500 font-bold">Q{product.price_wholesale}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${product.stock_quantity > 10 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        <span className="text-sm text-slate-400 font-mono">{product.stock_quantity} un.</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-[10px] text-emerald-500 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-md w-fit">
                        <Tag className="w-3 h-3" /> INDEXADO
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
