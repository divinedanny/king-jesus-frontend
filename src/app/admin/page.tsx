'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  MoreHorizontal,
  Globe,
  Store as StoreIcon,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { analyticsApi, inventoryApi } from '@/lib/api';
import { formatCurrency } from '@/lib/config';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [analyticsRes, lowStockRes] = await Promise.all([
        analyticsApi.getSales({}),
        inventoryApi.getLowStockAlerts()
      ]);
      setAnalytics(analyticsRes);
      setLowStock(lowStockRes);
    } catch (error) {
      console.error('Dashboard data fetch failed', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const stats = [
    { label: '30D Revenue', value: formatCurrency(analytics?.total_revenue || 0, 'NGN'), change: '+12.5%', icon: TrendingUp, positive: true, href: '/admin/analytics' },
    { label: '30D Orders', value: analytics?.total_orders || 0, change: '+8.2%', icon: ShoppingCart, positive: true, href: '/admin/orders' },
    { label: 'Web Sales', value: analytics?.web_sales_count || 0, icon: Globe, positive: true, href: '/admin/analytics' },
    { label: 'POS Sales', value: analytics?.pos_sales_count || 0, icon: StoreIcon, positive: true, href: '/admin/analytics' },
  ];

  const recentOrders = [
    { id: '#ORD-7234', customer: 'Babatunde O.', date: '2 mins ago', amount: '₦45,000', status: 'Paid' },
    { id: '#ORD-7233', customer: 'Chiamaka E.', date: '15 mins ago', amount: '₦22,500', status: 'Pending' },
    { id: '#ORD-7232', customer: 'Daniel K.', date: '1 hour ago', amount: '₦128,000', status: 'Shipped' },
    { id: '#ORD-7231', customer: 'Faith A.', date: '3 hours ago', amount: '₦8,500', status: 'Delivered' },
    { id: '#ORD-7230', customer: 'Grace O.', date: '5 hours ago', amount: '₦55,000', status: 'Paid' },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-500 mb-2">Operations Command</p>
           <h1 className="text-4xl font-black tracking-tighter uppercase text-black">Control <span className="text-gray-300">Center</span></h1>
        </div>
        <div className="flex gap-3">
           <Link href="/admin/analytics">
              <Button variant="secondary" className="text-[10px] uppercase font-black tracking-widest h-12 px-6">View Reports</Button>
           </Link>
           <Link href="/pos">
              <Button variant="black" className="text-[10px] uppercase font-black tracking-widest h-12 px-6">Launch POS</Button>
           </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Link key={i} href={stat.href}>
            <Card className="border-none shadow-sm overflow-hidden bg-white group hover:shadow-xl transition-all duration-500 rounded-[32px] cursor-pointer h-full">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-primary-500 group-hover:bg-primary-500 group-hover:text-black transition-colors">
                      <stat.icon className="w-6 h-6" />
                    </div>
                    {stat.change && (
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black ${stat.positive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {stat.change}
                      </div>
                    )}
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-2xl font-black text-black tracking-tighter">{isLoading ? '...' : stat.value}</h3>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
         {/* Recent Orders */}
         <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
               <h2 className="text-sm font-black uppercase tracking-[0.2em]">Live Order Stream</h2>
               <Link href="/admin/orders" className="text-[10px] font-bold text-primary-500 uppercase tracking-widest hover:underline">View All Orders</Link>
            </div>
            <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="border-b border-gray-50 bg-gray-50/50">
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Order ID</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Customer</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Amount</th>
                     </tr>
                  </thead>
                  <tbody>
                     {recentOrders.map((order, i) => (
                        <tr key={i} className="group hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-0">
                           <td className="px-8 py-6">
                              <span className="text-[10px] font-black uppercase tracking-tight">{order.id}</span>
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-primary-500 font-black text-[10px]">
                                    {order.customer.charAt(0)}
                                 </div>
                                 <div>
                                    <p className="text-[11px] font-black uppercase tracking-tight">{order.customer}</p>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase">{order.date}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                 order.status === 'Paid' ? 'bg-green-50 border-green-200 text-green-700' :
                                 order.status === 'Pending' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                                 'bg-blue-50 border-blue-200 text-blue-700'
                              }`}>
                                 <div className={`w-1 h-1 rounded-full ${
                                    order.status === 'Paid' ? 'bg-green-500' :
                                    order.status === 'Pending' ? 'bg-amber-500' :
                                    'bg-blue-500'
                                 }`} />
                                 {order.status}
                              </div>
                           </td>
                           <td className="px-8 py-6 text-right">
                              <span className="text-[11px] font-black uppercase tracking-tight">{order.amount}</span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Quick Actions / Activity */}
         <div className="space-y-6">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] px-2">Inventory Monitor</h2>
            <Card className="border-none shadow-sm rounded-[40px] bg-black text-white p-8 overflow-hidden relative group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
               <div className="relative z-10 space-y-6">
                  <h3 className="text-xl font-black uppercase tracking-tighter leading-tight">Stock <br />Status</h3>
                  <div className="space-y-4">
                     {lowStock.length === 0 ? (
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">All levels optimal</p>
                     ) : lowStock.slice(0, 3).map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                          <div className="flex items-center gap-3">
                             <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                             <span className="text-[10px] font-black uppercase tracking-widest truncate max-w-[120px]">{item.product.name}</span>
                          </div>
                          <span className="text-[10px] font-bold text-red-500 uppercase shrink-0">{item.quantity} LEFT</span>
                        </div>
                     ))}
                  </div>
                  <Link href="/admin/inventory" className="block">
                     <Button variant="primary" className="w-full h-14 text-[10px] uppercase font-black tracking-[0.2em]">Manage Inventory</Button>
                  </Link>
               </div>
            </Card>

            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <h3 className="text-[10px] font-black uppercase tracking-widest">Global Activity</h3>
                  </div>
                  <MoreHorizontal className="w-4 h-4 text-gray-300" />
               </div>
               <div className="space-y-6">
                  <div className="flex gap-4">
                     <div className="w-1 h-auto bg-primary-500 rounded-full shrink-0" />
                     <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-tight text-black">New store location added</p>
                        <p className="text-[9px] text-gray-400 font-medium uppercase tracking-widest">34 mins ago by System</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <div className="w-1 h-auto bg-gray-100 rounded-full shrink-0" />
                     <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-tight text-black">Stock transfer initiated</p>
                        <p className="text-[9px] text-gray-400 font-medium uppercase tracking-widest">1 hour ago by Admin</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <div className="w-1 h-auto bg-gray-100 rounded-full shrink-0" />
                     <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-tight text-black">Daily sales report ready</p>
                        <p className="text-[9px] text-gray-400 font-medium uppercase tracking-widest">4 hours ago by System</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
