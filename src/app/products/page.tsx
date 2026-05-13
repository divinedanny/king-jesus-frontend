'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Grid, List } from 'lucide-react';
import { useProductStore } from '@/lib/product-store';
import { ProductGrid } from '@/components/product/product-card';
import { Input, Select } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ProductsPage() {
  const router = useRouter();
  const {
    products,
    categories,
    isLoading,
    error,
    pagination,
    searchQuery,
    selectedCategory,
    fetchProducts,
    fetchCategories,
    setSearchQuery,
    setSelectedCategory,
  } = useProductStore();

  const [gridCols, setGridCols] = useState<1 | 2 | 3 | 4>(3);
  const [localSearch, setLocalSearch] = useState('');

  // Initial data fetch
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // Build category options
  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...categories.map((cat) => ({ value: cat.id.toString(), label: cat.name })),
  ];

  const handleSearch = () => {
    setSearchQuery(localSearch);
    fetchProducts({ search: localSearch });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedCategory(value);
    fetchProducts({ category: value === 'all' ? undefined : value });
  };

  const handleProductClick = (product: any) => {
    router.push(`/products/${product.id}`);
  };

  const handlePageChange = (newPage: number) => {
    fetchProducts({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate total pages for display
  const itemsPerPage = 12;
  const totalPages = pagination ? Math.ceil(pagination.count / itemsPerPage) : 1;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Products</h1>
          <p className="text-gray-600">Browse our collection of faith-based merchandise</p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-700">{error}</p>
            <Button variant="ghost" onClick={() => fetchProducts()} className="mt-2">
              Try Again
            </Button>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category */}
            <div className="w-full lg:w-48">
              <Select
                options={categoryOptions}
                value={selectedCategory}
                onChange={handleCategoryChange}
              />
            </div>

            {/* Search Button */}
            <Button onClick={handleSearch}>Search</Button>

            {/* Grid Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={gridCols === 2 ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setGridCols(2)}
                className="p-2"
              >
                <List className="h-5 w-5" />
              </Button>
              <Button
                variant={gridCols === 3 ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setGridCols(3)}
                className="p-2"
              >
                <Grid className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            {isLoading
              ? 'Loading products...'
              : `Showing ${products.length} of ${pagination?.count || 0} products`}
          </p>
        </div>

        {/* Product Grid */}
        <ProductGrid
          products={products}
          columns={gridCols}
          loading={isLoading}
          onProductClick={handleProductClick}
        />

        {/* Pagination */}
        {pagination && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.next ? (pagination.page || 1) - 1 : 1)}
              disabled={!pagination.previous}
            >
              Previous
            </Button>
            <span className="px-4 py-2 text-gray-600">
              Page {pagination.page || 1} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => handlePageChange((pagination.page || 1) + 1)}
              disabled={!pagination.next}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}