'use client';

import React from 'react';
import Image from 'next/image';
import { ShoppingCart, Eye, Star } from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '@/lib/store';
import { formatCurrency } from '@/lib/config';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  product: Product;
  onViewDetails?: () => void;
}

export function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const { addItem, currency } = useCartStore();
  const router = useRouter();
  
  const isOutOfStock = product.stock_quantity === 0;
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 1);
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails();
    } else {
      router.push(`/products/${product.id}`);
    }
  };

  const displayPrice = product.currency === currency 
    ? product.price 
    : product.price;

  return (
    <div 
      onClick={handleViewDetails}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-300">
            <span className="text-6xl">📦</span>
          </div>
        )}
        
        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="bg-white text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              Sold Out
            </span>
          </div>
        )}

        {/* Quick Add Button (Desktop) */}
        <div className="absolute bottom-4 left-4 right-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hidden md:block z-20">
          <Button
            variant="primary"
            className="w-full h-12 text-[10px] uppercase font-black tracking-widest shadow-xl"
            icon={ShoppingCart}
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            Quick Add
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            {product.category?.name || 'Collection'}
          </p>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-primary-500 fill-primary-500" />
            <span className="text-[10px] font-bold text-gray-600">{product.average_rating?.toFixed(1) || '5.0'}</span>
          </div>
        </div>

        <h3 className="text-sm font-bold text-black mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors uppercase tracking-tight">
          {product.name}
        </h3>
        
        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="text-base font-black text-black tracking-tighter">
            {formatCurrency(displayPrice, product.currency)}
          </span>
          <div className="md:hidden">
             <button 
               onClick={handleAddToCart}
               disabled={isOutOfStock}
               className="w-8 h-8 rounded-full bg-black text-primary-500 flex items-center justify-center disabled:opacity-50"
             >
               <ShoppingCart className="w-4 h-4" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
