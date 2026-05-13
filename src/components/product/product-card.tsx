'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { ShoppingCart, Eye } from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '@/lib/store';
import { formatCurrency } from '@/lib/config';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/card';

interface ProductCardProps {
  product: Product;
  onViewDetails?: () => void;
}

export function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const { addItem, currency } = useCartStore();
  const isOutOfStock = product.stock_quantity === 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOutOfStock) {
      addItem(product, 1);
    }
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    if (onViewDetails) {
      onViewDetails();
    }
  };

  // Filter items by current currency for display
  const displayPrice = product.currency === currency 
    ? product.price 
    : product.price; // In real app, would convert currency

  return (
    <div
      className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={handleViewDetails}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <span className="text-4xl">📦</span>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-2">
          {product.currency === 'NGN' && (
            <Badge variant="success">🇳🇬 NGN</Badge>
          )}
          {product.currency === 'USD' && (
            <Badge variant="info">🌍 USD</Badge>
          )}
          {isOutOfStock && (
            <Badge variant="error">Out of Stock</Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-gray-500 mb-1">{product.category?.name}</p>
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>
        
        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-primary-600">
            {formatCurrency(displayPrice, product.currency)}
          </span>
          <span className="text-sm text-gray-500">
            {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={Eye}
            onClick={handleViewDetails}
            className="flex-1"
          >
            Details
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={ShoppingCart}
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="flex-1"
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}

interface ProductGridProps {
  products: Product[];
  columns?: 1 | 2 | 3 | 4;
  loading?: boolean;
  onProductClick?: (product: Product) => void;
}

export function ProductGrid({ 
  products, 
  columns = 3, 
  loading = false,
  onProductClick,
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
        <ProductCard 
          key={product.id} 
          product={product}
          onViewDetails={onProductClick ? () => onProductClick(product) : undefined}
        />
      ))}
    </div>
  );
}