'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, ShoppingCart, Minus, Plus, Check } from 'lucide-react';
import { useProductStore } from '@/lib/product-store';
import { useCartStore } from '@/lib/store';
import { formatCurrency } from '@/lib/config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, Badge } from '@/components/ui/card';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { selectedProduct, isLoading, error, fetchProductById, clearError } = useProductStore();
  const { addItem, currency } = useCartStore();
  
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const productId = params.id as string;

  useEffect(() => {
    if (productId) {
      fetchProductById(productId);
      clearError();
    }
  }, [productId]);

  const handleAddToCart = () => {
    if (selectedProduct) {
      addItem(selectedProduct, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded-xl" />
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-32 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !selectedProduct) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-500 mb-4">{error || 'Product not found'}</p>
              <Button onClick={() => router.push('/products')}>
                Back to Products
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isOutOfStock = selectedProduct.stock_quantity === 0;
  const displayPrice = selectedProduct.currency === currency
    ? selectedProduct.price
    : selectedProduct.price;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          icon={ArrowLeft}
          className="mb-6"
        >
          Back to Products
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-xl overflow-hidden border border-gray-100">
              {selectedProduct.images && selectedProduct.images.length > 0 ? (
                <Image
                  src={selectedProduct.images[selectedImage]}
                  alt={selectedProduct.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <span className="text-8xl">📦</span>
                </div>
              )}
            </div>
            
            {/* Thumbnails */}
            {selectedProduct.images && selectedProduct.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {selectedProduct.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                      selectedImage === index
                        ? 'border-primary-600'
                        : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${selectedProduct.name} - ${index + 1}`}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {selectedProduct.category && (
                  <Badge variant="default">{selectedProduct.category.name}</Badge>
                )}
                {selectedProduct.currency === 'NGN' ? (
                  <Badge variant="success">🇳🇬 NGN</Badge>
                ) : (
                  <Badge variant="info">🌍 USD</Badge>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {selectedProduct.name}
              </h1>
              
              <p className="text-2xl font-bold text-primary-600">
                {formatCurrency(displayPrice, selectedProduct.currency)}
              </p>
            </div>

            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600">{selectedProduct.description}</p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {isOutOfStock ? (
                <Badge variant="error">Out of Stock</Badge>
              ) : (
                <Badge variant="success">
                  {selectedProduct.stock_quantity} in stock
                </Badge>
              )}
            </div>

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div className="flex items-center gap-4">
                <span className="text-gray-600">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(selectedProduct.stock_quantity, quantity + 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                    disabled={quantity >= selectedProduct.stock_quantity}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <div className="flex gap-4">
              <Button
                size="lg"
                icon={addedToCart ? Check : ShoppingCart}
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={addedToCart ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                {addedToCart ? 'Added to Cart' : 'Add to Cart'}
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push('/cart')}
              >
                View Cart
              </Button>
            </div>

            {/* Additional Info */}
            <Card className="bg-gray-50">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">SKU</span>
                  <span className="font-medium">{selectedProduct.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Category</span>
                  <span className="font-medium">
                    {selectedProduct.category?.name || 'Uncategorized'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Currency</span>
                  <span className="font-medium">{selectedProduct.currency}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}