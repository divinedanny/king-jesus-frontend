'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  ShoppingCart, 
  Globe, 
  Store as StoreIcon, 
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/input';
import { analyticsApi, storesApi } from '@/lib/api';
import { formatCurrency } from '@/lib/config';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [stores, setStores] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState('all');
  const [dateRange, setDateRange] = useState('7d');

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    try {
      const [analyticsRes, storesRes] = await Promise.all([
        analyticsApi.getSales(selectedStore !== 'all' ? { store_id: selectedStore } : undefined),
        storesApi.get()
      ]);
      setAnalytics(analyticsRes);
      setStores(storesRes.results || storesRes);
    } catch (error) {
      console.error('Failed to fetch analytics', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedStore]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const webTotal = analytics?.web_sales_count || 0;
  const posTotal = analytics?.pos_sales_count || 0;
  const grandTotal = webTotal + posTotal;
  const webPercent = grandTotal > 0 ? Math.round((webTotal / grandTotal) * 100) : 0;
  const posPercent = grandTotal > 0 ? Math.round((posTotal / grandTotal) * 100) : 0;

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-500 mb-2">Business Intelligence</p>
          <h1 className="text-4xl font-black tracking-tighter uppercase text-black">Performance <span className="text-gray-300">Analytics</span></h1>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="text-[10px] uppercase font-black tracking-widest h-12 px-6" icon={Download}>Generate Report</Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-48">
             <Select 
               value={selectedStore}
               onChange={(e) => setSelectedStore(e.target.value)}
               className="h-12 bg-gray-50 border-none rounded-xl text-[10px] font-bold uppercase tracking-widest"
               options={[
                 { value: 'all', label: 'Global View' },
                 ...stores.map(s => ({ value: s.id, label: s.name }))
               ]}
             />
          </div>
          <div className="w-48">
             <Select 
               value={dateRange}
               onChange={(e) => setDateRange(e.target.value)}
               className="h-12 bg-gray-50 border-none rounded-xl text-[10px] font-bold uppercase tracking-widest"
               options={[
                 { value: '24h', label: 'Last 24 Hours' },
                 { value: '7d', label: 'Last 7 Days' },
                 { value: '30d', label: 'Last 30 Days' },
                 { value: '12m', label: 'Last 12 Months' }
               ]}
             />
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400">
           <Calendar className="w-4 h-4" />
           Updated: Just Now
        </div>
      </div>

      {isLoading ? (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-40 bg-white animate-pulse rounded-[32px] border border-gray-100" />
            ))}
         </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-none shadow-sm rounded-[32px] bg-white overflow-hidden">
               <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                     <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-primary-500">
                        <TrendingUp className="w-6 h-6" />
                     </div>
                     <div className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black bg-green-100 text-green-700">
                        <ArrowUpRight className="w-3 h-3" />
                        +12%
                     </div>
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Revenue</p>
                  <h3 className="text-3xl font-black text-black tracking-tighter">{formatCurrency(analytics?.total_revenue || 0, 'NGN')}</h3>
               </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-[32px] bg-white overflow-hidden">
               <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                     <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-primary-500">
                        <ShoppingCart className="w-6 h-6" />
                     </div>
                     <div className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black bg-green-100 text-green-700">
                        <ArrowUpRight className="w-3 h-3" />
                        +5%
                     </div>
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Order Count</p>
                  <h3 className="text-3xl font-black text-black tracking-tighter">{analytics?.total_orders || 0}</h3>
               </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-[32px] bg-white overflow-hidden">
               <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                     <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-primary-500">
                        <Globe className="w-6 h-6" />
                     </div>
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Web Sales</p>
                  <h3 className="text-3xl font-black text-black tracking-tighter">{analytics?.web_sales_count || 0}</h3>
               </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-[32px] bg-white overflow-hidden">
               <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                     <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-primary-500">
                        <StoreIcon className="w-6 h-6" />
                     </div>
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">POS Sales</p>
                  <h3 className="text-3xl font-black text-black tracking-tighter">{analytics?.pos_sales_count || 0}</h3>
               </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
             <Card className="border-none shadow-sm rounded-[40px] bg-black text-white p-10 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full -mr-32 -mt-32" />
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 relative z-10">Top Performing <br /><span className="text-primary-500">Products</span></h3>
                <div className="space-y-6 relative z-10">
                   {(analytics?.top_products || []).map((product: any, i: number) => (
                      <div key={i} className="flex items-center justify-between group">
                         <div className="flex items-center gap-4">
                            <span className="text-lg font-black text-white/20 italic">0{i+1}</span>
                            <div>
                               <p className="text-[11px] font-black uppercase tracking-tight">{product.product__name}</p>
                               <p className="text-[9px] text-gray-500 font-bold uppercase">{product.total_sold} UNITS SOLD</p>
                            </div>
                         </div>
                         <p className="text-sm font-black text-primary-500">{formatCurrency(product.total_revenue, 'NGN')}</p>
                      </div>
                   ))}
                </div>
             </Card>

             <Card className="border-none shadow-sm rounded-[40px] bg-white p-10 border border-gray-100">
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 text-black">Sales Channel <br /><span className="text-gray-300">Distribution</span></h3>
                <div className="flex flex-col items-center justify-center h-64 relative">
                   <div className="flex items-end gap-12 w-full h-full pt-10">
                      <div className="flex-1 flex flex-col items-center gap-4">
                         <div className="w-full bg-black rounded-2xl relative transition-all duration-1000" style={{ height: `${webPercent}%` }}>
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-black">{webPercent}%</div>
                         </div>
                         <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Web Store</span>
                      </div>
                      <div className="flex-1 flex flex-col items-center gap-4">
                         <div className="w-full bg-primary-500 rounded-2xl relative transition-all duration-1000" style={{ height: `${posPercent}%` }}>
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-black">{posPercent}%</div>
                         </div>
                         <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">POS Retail</span>
                      </div>
                   </div>
                </div>
             </Card>
          </div>
        </>
      )}
    </div>
  );
}
