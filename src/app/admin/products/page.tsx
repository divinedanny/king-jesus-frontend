'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  MoreVertical,
  Printer,
  QrCode
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { productsApi } from '@/lib/api';
import { formatCurrency, apiConfig } from '@/lib/config';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchQuery] = useState('');

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await productsApi.getAll();
      setProducts(response.results || response);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-500 mb-2">Catalog Management</p>
          <h1 className="text-4xl font-black tracking-tighter uppercase text-black">Product <span className="text-gray-300">Inventory</span></h1>
        </div>
        <Button variant="black" className="text-[10px] uppercase font-black tracking-widest h-12 px-6" icon={Plus}>Add New Product</Button>
      </div>

      <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Search by name, SKU or barcode..." 
            className="pl-12 h-12 bg-gray-50 border-none rounded-xl text-[10px] font-bold uppercase tracking-widest"
            value={searchTerm}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-50 bg-gray-50/50">
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Product</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">SKU</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Price</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
               <tr><td colSpan={4} className="p-20 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">Loading products...</td></tr>
            ) : filteredProducts.length === 0 ? (
               <tr><td colSpan={4} className="p-20 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">No products found</td></tr>
            ) : filteredProducts.map((product, i) => (
              <tr key={i} className="group hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-primary-500">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-tight text-black">{product.name}</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase">{product.category?.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">{product.sku || 'N/A'}</span>
                </td>
                <td className="px-8 py-6">
                  <span className="text-[11px] font-black text-black">{formatCurrency(product.price, product.currency)}</span>
                </td>
                <td className="px-8 py-6 text-right">
                   <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => window.open(`${apiConfig.baseUrl}/api/products/${product.id}/barcode_image/`, '_blank')}
                        className="p-2 bg-gray-50 rounded-lg hover:bg-black hover:text-primary-500 transition-all"
                        title="Print Barcode"
                      >
                         <Printer className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => window.open(`${apiConfig.baseUrl}/api/products/${product.id}/qrcode_image/`, '_blank')}
                        className="p-2 bg-gray-50 rounded-lg hover:bg-black hover:text-primary-500 transition-all"
                        title="Print QR Code"
                      >
                         <QrCode className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-gray-50 rounded-lg hover:bg-black hover:text-primary-500 transition-all">
                         <Edit2 className="w-4 h-4" />
                      </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
