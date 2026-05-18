'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Grid, List, SlidersHorizontal, ChevronRight } from 'lucide-react';
import { ProductGrid } from '@/components/product/product-grid';
import { productsApi } from '@/lib/api';
import { Product, Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { useProductStore } from '@/lib/product-store';

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { products, pagination, isLoading, error, fetchProducts } = useProductStore();
  
  const [localSearch, setLocalSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [gridCols, setGridCols] = useState<3 | 4>(4);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await productsApi.getCategories();
        setCategories(response.results);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    const params = {
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
    };
    fetchProducts(params);
  }, [searchParams, fetchProducts]);

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (localSearch) params.set('search', localSearch);
    else params.delete('search');
    params.set('page', '1');
    router.push(`/products?${params.toString()}`);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    setSelectedCategory(category);
    const params = new URLSearchParams(searchParams.toString());
    if (category !== 'all') params.set('category', category);
    else params.delete('category');
    params.set('page', '1');
    router.push(`/products?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/products?${params.toString()}`);
  };

  const categoryOptions = [
    { value: 'all', label: 'All Collections' },
    ...categories.map(c => ({ value: c.id, label: c.name }))
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="bg-black text-white py-16 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">
              <span onClick={() => router.push('/')} className="hover:text-primary-500 cursor-pointer transition-colors">Home</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white">Catalog</span>
           </div>
           <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">The <span className="text-primary-500">Collection</span></h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters & Tools */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12 pb-8 border-b border-gray-100">
           <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
              <div className="relative flex-1 min-w-[280px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="SEARCH THE CATALOG..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-12 h-12 bg-gray-50 border-none rounded-xl uppercase text-[10px] font-bold tracking-widest"
                />
              </div>
              <div className="w-full sm:w-48">
                <Select
                  options={categoryOptions}
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className="h-12 bg-gray-50 border-none rounded-xl uppercase text-[10px] font-bold tracking-widest"
                />
              </div>
              <Button onClick={handleSearch} className="h-12 px-8 text-[10px] uppercase font-black tracking-widest">Search</Button>
           </div>

           <div className="flex items-center gap-6 self-end lg:self-center">
              <div className="flex items-center gap-2 text-gray-400">
                 <button onClick={() => setGridCols(3)} className={`p-2 transition-colors ${gridCols === 3 ? 'text-black' : 'hover:text-black'}`}>
                    <Grid className="w-5 h-5" />
                 </button>
                 <button onClick={() => setGridCols(4)} className={`p-2 transition-colors ${gridCols === 4 ? 'text-black' : 'hover:text-black'}`}>
                    <List className="w-5 h-5 rotate-90" />
                 </button>
              </div>
              <div className="h-6 w-px bg-gray-200" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                 {pagination?.count || 0} ITEMS
              </p>
           </div>
        </div>

        {error && (
          <div className="text-center py-12 bg-red-50 rounded-2xl mb-12">
            <p className="text-red-600 font-bold mb-4 uppercase tracking-widest text-xs">{error}</p>
            <Button variant="outline" onClick={() => fetchProducts()} className="text-[10px] font-black uppercase">
              Retry Load
            </Button>
          </div>
        )}

        {/* Product Grid */}
        <ProductGrid
          products={products}
          columns={gridCols}
          loading={isLoading}
        />

        {/* Pagination */}
        {pagination && pagination.total_pages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-16 pt-8 border-t border-gray-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange((pagination.page || 1) - 1)}
              disabled={!pagination.previous}
              className="uppercase text-[10px] font-black tracking-widest h-10 px-6"
            >
              Prev
            </Button>
            <div className="flex items-center gap-2">
               {Array.from({length: pagination.total_pages}).map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-10 h-10 rounded-full text-[10px] font-black transition-all ${
                      (pagination.page || 1) === i + 1 
                        ? 'bg-black text-primary-500' 
                        : 'hover:bg-gray-100 text-gray-400'
                    }`}
                  >
                    {i + 1}
                  </button>
               ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange((pagination.page || 1) + 1)}
              disabled={!pagination.next}
              className="uppercase text-[10px] font-black tracking-widest h-10 px-6"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
