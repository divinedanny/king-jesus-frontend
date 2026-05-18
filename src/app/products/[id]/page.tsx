'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, ShoppingCart, Minus, Plus, Check, Heart, Star, Share2 } from 'lucide-react';
import { useProductStore } from '@/lib/product-store';
import { useCartStore } from '@/lib/store';
import { useAuthStore } from '@/lib/auth-store';
import { formatCurrency } from '@/lib/config';
import { reviewsApi, wishlistApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Review } from '@/types';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { selectedProduct, isLoading, error, fetchProductById, clearError } = useProductStore();
  const { addItem, currency } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  const productId = params.id as string;

  const fetchReviews = useCallback(async () => {
    try {
      const data = await reviewsApi.getByProduct(productId);
      setReviews(data);
    } catch (err) {
      console.error('Failed to fetch reviews', err);
    }
  }, [productId]);

  const checkWishlist = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const wishlists = await wishlistApi.get();
      const found = wishlists.some(w => w.products.some(p => p.id === productId));
      setIsInWishlist(found);
    } catch (err) {
      console.error('Failed to check wishlist', err);
    }
  }, [productId, isAuthenticated]);

  useEffect(() => {
    if (productId) {
      fetchProductById(productId);
      fetchReviews();
      checkWishlist();
      clearError();
    }
  }, [productId, isAuthenticated, fetchProductById, fetchReviews, checkWishlist, clearError]);

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }
    
    setIsWishlistLoading(true);
    try {
      if (isInWishlist) {
        await wishlistApi.removeProduct(productId);
        setIsInWishlist(false);
      } else {
        await wishlistApi.addProduct(productId);
        setIsInWishlist(true);
      }
    } catch (err) {
      console.error('Failed to toggle wishlist', err);
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      addItem(selectedProduct, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse flex flex-col md:flex-row gap-12">
            <div className="flex-1 aspect-[4/5] bg-gray-100 rounded-3xl" />
            <div className="flex-1 space-y-6 py-8">
              <div className="h-4 bg-gray-100 rounded w-1/4" />
              <div className="h-12 bg-gray-100 rounded w-3/4" />
              <div className="h-6 bg-gray-100 rounded w-1/2" />
              <div className="h-32 bg-gray-100 rounded w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !selectedProduct) {
    return (
      <div className="min-h-screen bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">Product Not Found</h2>
           <p className="text-gray-500 mb-8">{error || 'The item you are looking for does not exist.'}</p>
           <Button onClick={() => router.push('/products')}>Back to Catalog</Button>
        </div>
      </div>
    );
  }

  const isOutOfStock = selectedProduct.stock_quantity === 0;
  const displayPrice = selectedProduct.currency === currency ? selectedProduct.price : selectedProduct.price;

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Breadcrumbs / Back */}
      <div className="border-b border-gray-100 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
           <button 
             onClick={() => router.back()}
             className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
           >
             <ArrowLeft className="w-4 h-4" />
             Back
           </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Gallery */}
          <div className="space-y-6">
            <div className="relative aspect-[4/5] bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 group">
              {selectedProduct.images && selectedProduct.images.length > 0 ? (
                <Image
                  src={selectedProduct.images[selectedImage]}
                  alt={selectedProduct.name}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-300 text-8xl">📦</div>
              )}
              {isOutOfStock && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                   <span className="bg-white text-black px-8 py-2 rounded-full font-black uppercase tracking-widest text-sm">Sold Out</span>
                </div>
              )}
            </div>
            
            {selectedProduct.images && selectedProduct.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {selectedProduct.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-24 aspect-[4/5] rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImage === index ? 'border-black' : 'border-transparent'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="py-4 flex flex-col">
            <div className="flex items-center justify-between mb-6">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-500">
                  {selectedProduct.category?.name || 'Exclusive Collection'}
               </span>
               <div className="flex gap-2">
                  <button onClick={toggleWishlist} className={`p-2 rounded-full border transition-colors ${isInWishlist ? 'bg-black border-black text-primary-500' : 'border-gray-200 text-gray-400 hover:border-black hover:text-black'}`}>
                     <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-primary-500' : ''}`} />
                  </button>
                  <button className="p-2 rounded-full border border-gray-200 text-gray-400 hover:border-black hover:text-black transition-colors">
                     <Share2 className="w-4 h-4" />
                  </button>
               </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6 leading-tight">
               {selectedProduct.name}
            </h1>

            <div className="flex items-center gap-4 mb-8">
               <span className="text-3xl font-black tracking-tighter text-black">
                  {formatCurrency(displayPrice, selectedProduct.currency)}
               </span>
               <div className="h-6 w-px bg-gray-200" />
               <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-primary-500 text-primary-500" />
                  <span className="text-sm font-bold">{selectedProduct.average_rating?.toFixed(1) || '5.0'}</span>
               </div>
            </div>

            <p className="text-gray-500 leading-relaxed mb-10 text-lg">
               {selectedProduct.description}
            </p>

            {/* Config & Buy */}
            {!isOutOfStock && (
              <div className="space-y-8 mb-10">
                 <div className="flex items-center gap-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Quantity</span>
                    <div className="flex items-center bg-gray-50 rounded-xl px-2">
                       <button 
                         onClick={() => setQuantity(Math.max(1, quantity - 1))}
                         className="p-3 text-gray-400 hover:text-black transition-colors"
                         disabled={quantity <= 1}
                       >
                         <Minus className="w-4 h-4" />
                       </button>
                       <span className="w-10 text-center font-black text-sm">{quantity}</span>
                       <button 
                         onClick={() => setQuantity(Math.min(selectedProduct.stock_quantity, quantity + 1))}
                         className="p-3 text-gray-400 hover:text-black transition-colors"
                         disabled={quantity >= selectedProduct.stock_quantity}
                       >
                         <Plus className="w-4 h-4" />
                       </button>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                       {selectedProduct.stock_quantity} available
                    </span>
                 </div>

                 <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      size="lg" 
                      onClick={handleAddToCart}
                      className="h-16 flex-1 text-sm font-black uppercase tracking-widest shadow-2xl shadow-primary-500/20"
                    >
                      {addedToCart ? 'Product Added' : 'Add to Cart'}
                    </Button>
                    <Button 
                      variant="black" 
                      size="lg" 
                      onClick={() => {
                        addItem(selectedProduct, quantity);
                        router.push('/cart');
                      }}
                      className="h-16 flex-1 text-sm font-black uppercase tracking-widest"
                    >
                      Buy Now
                    </Button>
                 </div>
              </div>
            )}

            {/* Features Info */}
            <div className="grid grid-cols-2 gap-4 mt-auto">
               <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <Truck className="w-5 h-5 text-primary-500 mb-2" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-black mb-1">Fast Delivery</p>
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Nigeria & Global</p>
               </div>
               <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <Check className="w-5 h-5 text-primary-500 mb-2" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-black mb-1">Authentic</p>
                  <p className="text-[10px] text-gray-400 uppercase font-bold">100% Premium</p>
               </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-32 pt-24 border-t border-gray-100">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div>
                 <h2 className="text-4xl font-black tracking-tighter uppercase mb-4">Customer <span className="text-primary-500">Reviews</span></h2>
                 <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">What the community is saying about this piece.</p>
              </div>
              <div className="flex items-center gap-4 bg-black text-white px-6 py-3 rounded-full">
                 <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-primary-500 text-primary-500" />
                    <span className="text-lg font-black">{selectedProduct.average_rating?.toFixed(1) || '5.0'}</span>
                 </div>
                 <div className="w-px h-4 bg-white/20" />
                 <span className="text-[10px] font-black uppercase tracking-widest">{reviews.length} Feedbacks</span>
              </div>
           </div>

           {reviews.length > 0 ? (
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
               {reviews.map((review) => (
                 <div key={review.id} className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-primary-500 font-black text-xs">
                             {review.user.full_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                             <p className="text-xs font-black uppercase tracking-tight">{review.user.full_name}</p>
                             <p className="text-[10px] text-gray-400 font-bold uppercase">{new Date(review.created_at).toLocaleDateString()}</p>
                          </div>
                       </div>
                       <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(s => (
                             <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'fill-primary-500 text-primary-500' : 'text-gray-200'}`} />
                          ))}
                       </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                 </div>
               ))}
             </div>
           ) : (
             <div className="text-center py-20 bg-gray-50 rounded-3xl">
                <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Be the first to share your experience</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
