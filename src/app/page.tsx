'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ShoppingCart, Truck, Star, Headphones, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/product/product-grid';
import { productsApi } from '@/lib/api';
import { Product } from '@/types';
import { siteConfig } from '@/lib/config';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await productsApi.getAll();
        // Take first 3-4 products as featured
        setFeaturedProducts(response.results.slice(0, 4));
      } catch (error) {
        console.error('Failed to load products', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[85vh] bg-black overflow-hidden flex items-center">
        {/* Abstract Background pattern */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-900/40 via-black to-black"></div>
          <div className="grid grid-cols-8 h-full w-full">
             {Array.from({length: 64}).map((_, i) => (
               <div key={i} className="border-[0.5px] border-white/5"></div>
             ))}
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
              New Arrival 2024
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-8">
              WEAR YOUR <br />
              <span className="text-primary-500">FAITH</span> LOUD.
            </h1>
            <p className="text-lg text-gray-400 mb-10 max-w-xl leading-relaxed uppercase tracking-wide">
              {siteConfig.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button size="lg" className="w-full sm:w-auto h-14 px-10 text-sm uppercase tracking-widest font-bold">
                  Explore Catalog
                </Button>
              </Link>
              <Link href="/tracking">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-10 text-sm uppercase tracking-widest font-bold border-white/20 text-white hover:bg-white hover:text-black hover:border-white">
                  Track Order
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="py-12 border-b border-gray-100 bg-white relative z-20 -mt-8 mx-4 sm:mx-8 rounded-xl shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex items-center gap-6 group">
              <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-black text-primary-500 transition-transform group-hover:scale-110">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-black uppercase tracking-widest text-xs mb-1">Global Shipping</h3>
                <p className="text-sm text-gray-500">Fast delivery via Terminal Africa</p>
              </div>
            </div>
            <div className="flex items-center gap-6 group border-y md:border-y-0 md:border-x border-gray-100 py-8 md:py-0 md:px-12">
              <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-black text-primary-500 transition-transform group-hover:scale-110">
                <Headphones className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-black uppercase tracking-widest text-xs mb-1">Expert Support</h3>
                <p className="text-sm text-gray-500">Dedicated assistance via WhatsApp</p>
              </div>
            </div>
            <div className="flex items-center gap-6 group">
              <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-black text-primary-500 transition-transform group-hover:scale-110">
                <Star className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-black uppercase tracking-widest text-xs mb-1">Premium Quality</h3>
                <p className="text-sm text-gray-500">Curated materials & design</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-black text-black tracking-tighter uppercase mb-4">Essentials</h2>
              <div className="h-1 w-20 bg-primary-500"></div>
            </div>
            <Link href="/products" className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest">
              View Entire Catalog
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1,2,3,4].map(i => (
                <div key={i} className="aspect-[4/5] bg-gray-100 animate-pulse rounded-2xl"></div>
              ))}
            </div>
          ) : (
            <ProductGrid products={featuredProducts} columns={4} />
          )}
        </div>
      </section>

      {/* Collection CTA */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-black overflow-hidden p-12 md:p-24 flex items-center justify-center text-center">
            <div className="absolute inset-0 opacity-30">
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
               <div className="absolute inset-0 bg-black/60"></div>
            </div>
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase mb-8">
                Ready to make a <br />
                <span className="text-primary-500">Statement?</span>
              </h2>
              <Link href="/products">
                <Button size="lg" className="h-16 px-12 text-sm uppercase tracking-widest font-black">
                  Shop the collection
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-black tracking-tighter uppercase mb-6">Stay in the Loop</h2>
          <p className="text-gray-500 mb-10 uppercase tracking-widest text-xs font-bold leading-relaxed">
            Join the community for exclusive drops, <br />
            special offers and faith-based content.
          </p>
          <form className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="YOUR EMAIL ADDRESS"
              className="flex-1 px-6 py-4 rounded-xl bg-gray-50 border border-gray-200 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all uppercase text-[10px] font-bold tracking-widest"
            />
            <Button variant="black" type="submit" className="h-14 px-8 text-[10px] uppercase tracking-widest font-black">
              Sign Me Up
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
