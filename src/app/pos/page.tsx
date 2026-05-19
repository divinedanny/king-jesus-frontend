'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingCart, 
  Scan, 
  CreditCard, 
  Banknote, 
  Send,
  User,
  Package,
  X,
  Check,
  ChevronRight,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { productsApi, inventoryApi, checkoutApi } from '@/lib/api';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/config';

interface POSCartItem {
  product: Product;
  quantity: number;
  negotiatedPrice: number;
}

export default function POSPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<POSCartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'cart'>('products');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'pos' | 'transfer' | null>(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState('');
  const scannerTimeout = useRef<NodeJS.Timeout | null>(null);

  // Barcode Scanner Listener (capturing HID input)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Barcode scanners usually end with 'Enter'
      if (e.key === 'Enter') {
        if (barcodeInput.length > 3) {
          handleBarcodeScan(barcodeInput);
          setBarcodeInput('');
        }
      } else {
        // Collect characters
        if (e.key.length === 1) {
           setBarcodeInput(prev => prev + e.key);
        }
        
        // Reset if no input for 50ms (human typing is slower than scanner)
        if (scannerTimeout.current) clearTimeout(scannerTimeout.current);
        scannerTimeout.current = setTimeout(() => {
          setBarcodeInput('');
        }, 50);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [barcodeInput]);

  const handleBarcodeScan = async (barcode: string) => {
    try {
      const response = await productsApi.getAll({ search: barcode });
      const product = response.results.find((p: any) => p.barcode_data === barcode || p.sku === barcode);
      if (product) {
        addToCart(product);
      }
    } catch (err) {
      console.error('Barcode lookup failed', err);
    }
  };

  const fetchProducts = useCallback(async (query: string = '') => {
    setIsLoading(true);
    try {
      const response = await productsApi.getAll({ search: query });
      setProducts(response.results);
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, negotiatedPrice: product.price }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const updatePrice = (productId: string, newPrice: number) => {
    setCart(prev => prev.map(item => 
      item.product.id === productId ? { ...item, negotiatedPrice: newPrice } : item
    ));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.negotiatedPrice * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsCheckoutModalOpen(true);
  };

  const completeOrder = async () => {
    if (!paymentMethod) return;
    setIsLoading(true);

    try {
      const baseTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      const negotiatedTotal = subtotal;
      const totalDiscount = baseTotal - negotiatedTotal;

      const methodMap: Record<string, 'Cash' | 'POS-Terminal' | 'Transfer'> = {
        'cash': 'Cash',
        'pos': 'POS-Terminal',
        'transfer': 'Transfer'
      };

      await checkoutApi.createOrder({
        items: cart.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.negotiatedPrice,
        })),
        shipping_address: {
          first_name: 'POS',
          last_name: 'Customer',
          address_line1: 'Physical Store',
          city: 'Store',
          state: 'Store',
          country: 'Nigeria',
          phone_number: '0000000000',
        },
        payment_method: methodMap[paymentMethod],
        total_amount: negotiatedTotal,
        currency: 'NGN',
        order_source: 'POS',
        negotiated_discount: totalDiscount,
      });

      alert(`Order completed successfully via ${paymentMethod.toUpperCase()}`);
      setCart([]);
      setIsCheckoutModalOpen(false);
      setPaymentMethod(null);
    } catch (error: any) {
      console.error('POS Checkout Error:', error);
      alert(error.message || 'Failed to complete order');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full overflow-hidden bg-black text-white">
      {/* Left Panel: Product Catalog */}
      <div className={`flex-1 flex flex-col border-r border-white/5 transition-all ${activeTab === 'cart' ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-white/5 flex items-center gap-4 bg-black/50 backdrop-blur-md sticky top-0 z-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text"
              placeholder="SCAN BARCODE OR SEARCH PRODUCT..."
              className="w-full bg-white/5 border-none rounded-xl py-3 pl-10 pr-4 text-xs font-bold uppercase tracking-widest focus:ring-1 focus:ring-primary-500 transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchProducts(searchQuery)}
            />
          </div>
          <Button variant="primary" size="sm" className="h-11 px-6 text-[10px] uppercase font-black tracking-widest" onClick={() => fetchProducts(searchQuery)}>
            Search
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 lg:p-6 scrollbar-hide">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
               {[1,2,3,4,5,6,7,8,9,10].map(i => (
                 <div key={i} className="aspect-square bg-white/5 animate-pulse rounded-2xl" />
               ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {products.map(product => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="group bg-white/5 hover:bg-primary-500 transition-all duration-300 p-4 rounded-3xl text-left flex flex-col items-start gap-3 border border-white/5 hover:border-primary-500 hover:shadow-2xl hover:shadow-primary-500/20"
                >
                  <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-primary-500 group-hover:bg-white group-hover:text-black transition-colors">
                     <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-tight line-clamp-2 group-hover:text-black">{product.name}</h3>
                    <p className="text-[10px] font-bold text-gray-500 mt-1 group-hover:text-black/70">
                      {formatCurrency(product.price, product.currency)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Shopping Cart */}
      <div className={`w-full md:w-[400px] lg:w-[450px] flex flex-col bg-gray-950/50 backdrop-blur-xl transition-all ${activeTab === 'products' ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <ShoppingCart className="w-5 h-5 text-primary-500" />
              <h2 className="text-sm font-black uppercase tracking-[0.2em]">Current Cart</h2>
           </div>
           <div className="bg-primary-500/10 text-primary-500 px-3 py-1 rounded-full text-[10px] font-bold">
              {totalItems} ITEMS
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-20">
               <Scan className="w-16 h-16 mb-4" />
               <p className="text-[10px] font-black uppercase tracking-[0.3em]">Ready to scan</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.product.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="text-[10px] font-black uppercase tracking-tight leading-tight">{item.product.name}</h4>
                    <p className="text-[9px] text-gray-500 mt-1 uppercase font-bold tracking-widest">{(item.product as any).sku}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="flex items-center bg-black rounded-lg p-1">
                    <button 
                      onClick={() => updateQuantity(item.product.id, -1)}
                      className="p-1.5 hover:text-primary-500 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-[10px] font-black">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.product.id, 1)}
                      className="p-1.5 hover:text-primary-500 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex flex-col items-end">
                    <input 
                      type="number"
                      className="w-24 bg-transparent border-none text-right font-black text-xs p-0 focus:ring-0 outline-none text-primary-500"
                      value={item.negotiatedPrice}
                      onChange={(e) => updatePrice(item.product.id, parseFloat(e.target.value))}
                    />
                    <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Unit Price</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer: Summary & Checkout */}
        <div className="p-6 bg-black border-t border-white/10 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Grand Total</span>
            <span className="text-2xl font-black text-white tracking-tighter">
              {formatCurrency(subtotal, 'NGN')}
            </span>
          </div>

          <Button 
            variant="primary" 
            className="w-full h-16 text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary-500/20"
            disabled={cart.length === 0}
            onClick={handleCheckout}
          >
            Confirm & Pay
          </Button>
        </div>
      </div>

      {/* Mobile Nav Toggle */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex md:hidden bg-white/10 backdrop-blur-xl border border-white/10 rounded-full p-2 z-50">
        <button 
          onClick={() => setActiveTab('products')}
          className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'products' ? 'bg-primary-500 text-black shadow-lg shadow-primary-500/30' : 'text-gray-400'}`}
        >
          Catalog
        </button>
        <button 
          onClick={() => setActiveTab('cart')}
          className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'cart' ? 'bg-primary-500 text-black shadow-lg shadow-primary-500/30' : 'text-gray-400'}`}
        >
          Cart ({totalItems})
        </button>
      </div>

      {/* Checkout Modal */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-lg" onClick={() => setIsCheckoutModalOpen(false)} />
          <div className="relative bg-black border border-white/10 w-full max-w-md rounded-[40px] overflow-hidden shadow-2xl">
             <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div>
                   <h3 className="text-xl font-black uppercase tracking-tighter">Checkout</h3>
                   <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Select Payment Method</p>
                </div>
                <button onClick={() => setIsCheckoutModalOpen(false)} className="p-3 bg-white/5 rounded-full hover:bg-white/10">
                   <X className="w-5 h-5" />
                </button>
             </div>

             <div className="p-8 grid grid-cols-1 gap-4">
                <button 
                  onClick={() => setPaymentMethod('cash')}
                  className={`flex items-center justify-between p-6 rounded-3xl border transition-all ${paymentMethod === 'cash' ? 'bg-primary-500 border-primary-500 text-black' : 'bg-white/5 border-white/5 text-white hover:border-white/20'}`}
                >
                   <div className="flex items-center gap-4">
                      <Banknote className="w-6 h-6" />
                      <span className="font-black uppercase tracking-widest text-xs">Cash Payment</span>
                   </div>
                   {paymentMethod === 'cash' && <Check className="w-5 h-5" />}
                </button>
                <button 
                  onClick={() => setPaymentMethod('pos')}
                  className={`flex items-center justify-between p-6 rounded-3xl border transition-all ${paymentMethod === 'pos' ? 'bg-primary-500 border-primary-500 text-black' : 'bg-white/5 border-white/5 text-white hover:border-white/20'}`}
                >
                   <div className="flex items-center gap-4">
                      <CreditCard className="w-6 h-6" />
                      <span className="font-black uppercase tracking-widest text-xs">POS Terminal</span>
                   </div>
                   {paymentMethod === 'pos' && <Check className="w-5 h-5" />}
                </button>
                <button 
                  onClick={() => setPaymentMethod('transfer')}
                  className={`flex items-center justify-between p-6 rounded-3xl border transition-all ${paymentMethod === 'transfer' ? 'bg-primary-500 border-primary-500 text-black' : 'bg-white/5 border-white/5 text-white hover:border-white/20'}`}
                >
                   <div className="flex items-center gap-4">
                      <Send className="w-6 h-6" />
                      <span className="font-black uppercase tracking-widest text-xs">Bank Transfer</span>
                   </div>
                   {paymentMethod === 'transfer' && <Check className="w-5 h-5" />}
                </button>
             </div>

             <div className="p-8 bg-white/5 flex flex-col gap-4">
                <div className="flex items-center justify-between px-2">
                   <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Payable Amount</span>
                   <span className="text-xl font-black">{formatCurrency(subtotal, 'NGN')}</span>
                </div>
                <Button 
                  variant="primary" 
                  className="h-16 rounded-2xl font-black uppercase tracking-widest text-xs" 
                  disabled={!paymentMethod}
                  onClick={completeOrder}
                >
                  Finalize Order
                </Button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
