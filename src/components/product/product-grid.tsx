'use client';

import React from 'react';
import { ProductCard } from '@/components/product/product-card';
import { Product } from '@/types';

// Mock products for placeholder - in real app these will come from API
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'King Jesus T-Shirt - Premium White',
    description: 'Premium cotton t-shirt with "King Jesus" inscription. Comfortable and stylish for everyday wear.',
    price: 8500,
    currency: 'NGN',
    stock_quantity: 25,
    images: [],
    category: { id: '1', name: 'Apparel', slug: 'apparel', description: 'Clothing items' },
    category_id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Faith Over Fear Hoodie - Black',
    description: 'Warm and cozy hoodie with "Faith Over Fear" print. Perfect for cold days.',
    price: 15000,
    currency: 'NGN',
    stock_quantity: 15,
    images: [],
    category: { id: '1', name: 'Apparel', slug: 'apparel', description: 'Clothing items' },
    category_id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Christian Wall Art - Psalm 23',
    description: 'Beautiful wall art featuring Psalm 23. Adds a touch of faith to your home.',
    price: 45.00,
    currency: 'USD',
    stock_quantity: 30,
    images: [],
    category: { id: '2', name: 'Home Decor', slug: 'home-decor', description: 'Home decoration items' },
    category_id: '2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Christian Journal - Leather Bound',
    description: 'Premium leather-bound journal for daily devotionals and prayer notes.',
    price: 35.00,
    currency: 'USD',
    stock_quantity: 50,
    images: [],
    category: { id: '3', name: 'Accessories', slug: 'accessories', description: 'Accessories and more' },
    category_id: '3',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Jesus Is Lord Cap',
    description: 'Stylish cap with "Jesus Is Lord" embroidery. One size fits all.',
    price: 4500,
    currency: 'NGN',
    stock_quantity: 40,
    images: [],
    category: { id: '1', name: 'Apparel', slug: 'apparel', description: 'Clothing items' },
    category_id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Faith Planner 2024',
    description: 'Annual faith planner with devotional sections, goal tracking, and prayer lists.',
    price: 25.00,
    currency: 'USD',
    stock_quantity: 100,
    images: [],
    category: { id: '3', name: 'Accessories', slug: 'accessories', description: 'Accessories and more' },
    category_id: '3',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

interface ProductGridProps {
  products?: Product[];
  columns?: 1 | 2 | 3 | 4;
  loading?: boolean;
}

export function ProductGrid({ 
  products = mockProducts, 
  columns = 3, 
  loading = false 
}: ProductGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  if (loading) {
    return (
      <div className={`grid ${gridCols[columns]} gap-6`}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-t-xl" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-5 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found</p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}