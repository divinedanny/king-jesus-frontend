'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Shield, Truck, Headphones, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/product/product-grid';
import { useProductStore } from '@/lib/product-store';

export default function HomePage() {
  const { products, fetchProducts, isLoading } = useProductStore();

  useEffect(() => {
    fetchProducts({ page: 1 });
  }, [fetchProducts]);

  const featuredProducts = products.slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fadeIn">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Express Your Faith with{' '}
                <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  Premium Products
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-xl">
                Discover our curated collection of faith-based merchandise. 
                From apparel to home decor, find products that inspire and uplift.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products">
                  <Button size="lg" icon={ArrowRight} iconPosition="right">
                    Shop Now
                  </Button>
                </Link>
                <Link href="/tracking">
                  <Button variant="outline" size="lg">
                    Track Your Order
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary-100 to-secondary-100 rounded-3xl flex items-center justify-center overflow-hidden shadow-2xl">
                <div className="text-9xl">✝️</div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 animate-fadeIn">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">4.9/5 Rating</span>
                </div>
                <p className="text-sm text-gray-500">from 2,000+ customers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 bg-primary-50 rounded-full">
                <Shield className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Secure Payment</h3>
              <p className="text-sm text-gray-500">100% secure transactions</p>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 bg-secondary-50 rounded-full">
                <Truck className="h-6 w-6 text-secondary-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Fast Shipping</h3>
              <p className="text-sm text-gray-500">Via Terminal Africa</p>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 bg-gold-50 rounded-full">
                <Headphones className="h-6 w-6 text-gold-600" />
              </div>
              <h3 className="font-semibold text-gray-900">24/7 Support</h3>
              <p className="text-sm text-gray-500">WhatsApp or Email</p>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 bg-primary-50 rounded-full">
                <Star className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Quality Products</h3>
              <p className="text-sm text-gray-500">Premium materials</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Products</h2>
              <p className="text-gray-600 mt-1">Our most popular items</p>
            </div>
            <Link href="/products">
              <Button variant="outline" icon={ArrowRight} iconPosition="right">
                View All
              </Button>
            </Link>
          </div>
          <ProductGrid products={featuredProducts} loading={isLoading} columns={3} />
        </div>
      </section>

      {/* Local vs International CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Local CTA */}
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8">
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="text-2xl">🇳🇬</span>
                <span className="text-sm font-semibold text-primary-700">Nigerian Customers</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Pay with Paystack</h3>
              <p className="text-gray-600 mb-6">
                Pay securely with your Nigerian bank account, card, or USSD. 
                Or order directly via WhatsApp for personalized service.
              </p>
              <Link href="/products">
                <Button variant="primary">Shop Now</Button>
              </Link>
            </div>

            {/* International CTA */}
            <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-2xl p-8">
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="text-2xl">🌍</span>
                <span className="text-sm font-semibold text-secondary-700">International Customers</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Pay with Stripe</h3>
              <p className="text-gray-600 mb-6">
                International checkout with your credit card via Stripe. 
                We ship worldwide via Terminal Africa.
              </p>
              <Link href="/products">
                <Button variant="secondary">Shop Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Subscribe to get exclusive offers, new product announcements, and faith-based content.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </section>
    </div>
  );
}
