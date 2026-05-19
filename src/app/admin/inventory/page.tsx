'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Package, 
  Layers, 
  AlertTriangle, 
  ArrowLeftRight, 
  Printer, 
  Search, 
  Plus, 
  Store as StoreIcon,
  Check,
  X,
  ChevronRight,
  MoreVertical,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input, Select } from '@/components/ui/input';
import { inventoryApi, storesApi, productsApi, stockTransferApi } from '../../../lib/api';
import { formatCurrency, apiConfig } from '../../../lib/config';

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'transfers' | 'alerts'>('overview');
  const [inventory, setInventory] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [transfers, setTransfers] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState('all');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [invRes, storesRes, transfersRes, alertsRes] = await Promise.all([
        inventoryApi.get(selectedStore !== 'all' ? { store: selectedStore } : undefined),
        storesApi.get(),
        stockTransferApi.get(),
        inventoryApi.getLowStockAlerts()
      ]);
      
      setInventory(invRes.results || invRes);
      setStores(storesRes.results || storesRes);
      setTransfers(transfersRes.results || transfersRes);
      setAlerts(alertsRes);
    } catch (error) {
      console.error('Failed to fetch inventory data', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedStore]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleReceiveTransfer = async (id: string) => {
    try {
      await stockTransferApi.receive(id);
      fetchData();
    } catch (error) {
      alert('Failed to receive transfer');
    }
  };

  const filteredInventory = inventory.filter(item => 
    item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-500 mb-2">Global Operations</p>
          <h1 className="text-4xl font-black tracking-tighter uppercase text-black">Inventory <span className="text-gray-300">Management</span></h1>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="text-[10px] uppercase font-black tracking-widest h-12 px-6" icon={Download}>Export CSV</Button>
          <Button variant="black" className="text-[10px] uppercase font-black tracking-widest h-12 px-6" icon={Plus}>New Stock Entry</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`pb-4 px-2 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'overview' ? 'text-black' : 'text-gray-400 hover:text-black'}`}
        >
          Stock Overview
          {activeTab === 'overview' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary-500" />}
        </button>
        <button 
          onClick={() => setActiveTab('transfers')}
          className={`pb-4 px-2 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'transfers' ? 'text-black' : 'text-gray-400 hover:text-black'}`}
        >
          Internal Transfers
          {transfers.filter(t => t.status === 'Initiated').length > 0 && (
            <span className="ml-2 bg-primary-500 text-black px-1.5 py-0.5 rounded-full text-[8px]">{transfers.filter(t => t.status === 'Initiated').length}</span>
          )}
          {activeTab === 'transfers' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary-500" />}
        </button>
        <button 
          onClick={() => setActiveTab('alerts')}
          className={`pb-4 px-2 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'alerts' ? 'text-black' : 'text-gray-400 hover:text-black'}`}
        >
          Low Stock Alerts
          {alerts.length > 0 && (
             <span className="ml-2 bg-red-500 text-white px-1.5 py-0.5 rounded-full text-[8px]">{alerts.length}</span>
          )}
          {activeTab === 'alerts' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary-500" />}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Search by Product Name or SKU..." 
            className="pl-12 h-12 bg-gray-50 border-none rounded-xl text-[10px] font-bold uppercase tracking-widest"
            value={searchTerm}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-48">
          <Select 
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            className="h-12 bg-gray-50 border-none rounded-xl text-[10px] font-bold uppercase tracking-widest"
            options={[
              { value: 'all', label: 'All Locations' },
              ...stores.map(s => ({ value: s.id, label: s.name }))
            ]}
          />
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Product</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">SKU</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Location</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Stock Level</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="p-20 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">Loading inventory data...</td></tr>
              ) : filteredInventory.length === 0 ? (
                <tr><td colSpan={5} className="p-20 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">No inventory records found</td></tr>
              ) : filteredInventory.map((item, i) => (
                <tr key={i} className="group hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-primary-500 font-black">
                          <Package className="w-5 h-5" />
                       </div>
                       <p className="text-[11px] font-black uppercase tracking-tight">{item.product.name}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-bold text-gray-500">{item.product.sku}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       <StoreIcon className="w-4 h-4 text-gray-400" />
                       <span className="text-[10px] font-black uppercase">{item.store.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                       <div className={`h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden`}>
                          <div 
                            className={`h-full rounded-full ${item.quantity < 10 ? 'bg-red-500' : 'bg-primary-500'}`} 
                            style={{ width: `${Math.min(100, (item.quantity / 50) * 100)}%` }}
                          />
                       </div>
                       <span className={`text-[10px] font-black ${item.quantity < 10 ? 'text-red-600' : 'text-black'}`}>{item.quantity} UNITS</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                       <Button 
                         variant="ghost" 
                         size="sm" 
                         className="p-2 h-9 w-9 bg-gray-50 rounded-lg hover:bg-black hover:text-primary-500 transition-all"
                         onClick={() => window.open(`${apiConfig.baseUrl}/api/products/${item.product.id}/barcode_image/`, '_blank')}
                         title="Print Barcode"
                       >
                          <Printer className="w-4 h-4" />
                       </Button>
                       <Button 
                         variant="ghost" 
                         size="sm" 
                         className="p-2 h-9 w-9 bg-gray-50 rounded-lg hover:bg-black hover:text-primary-500 transition-all"
                         title="Internal Transfer"
                       >
                          <ArrowLeftRight className="w-4 h-4" />
                       </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'transfers' && (
        <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Transfer ID</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Product</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Route</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {transfers.length === 0 ? (
                <tr><td colSpan={5} className="p-20 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">No transfers found</td></tr>
              ) : transfers.map((transfer, i) => (
                <tr key={i} className="group hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-black uppercase tracking-tight">#{transfer.id.slice(0, 8)}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div>
                       <p className="text-[11px] font-black uppercase tracking-tight">{transfer.product.name}</p>
                       <p className="text-[9px] text-gray-400 font-bold uppercase">{transfer.quantity} UNITS</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                       <span className="text-[9px] font-bold text-gray-400 uppercase">{transfer.from_store.name}</span>
                       <ChevronRight className="w-3 h-3 text-gray-300" />
                       <span className="text-[9px] font-black text-black uppercase">{transfer.to_store.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      transfer.status === 'Received' ? 'bg-green-50 border-green-200 text-green-700' :
                      transfer.status === 'Initiated' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                      'bg-gray-50 border-gray-200 text-gray-700'
                    }`}>
                       {transfer.status}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    {transfer.status === 'Initiated' && (
                       <Button 
                         variant="primary" 
                         size="sm" 
                         className="text-[9px] font-black uppercase tracking-widest h-9 px-4"
                         onClick={() => handleReceiveTransfer(transfer.id)}
                       >
                         Mark Received
                       </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alerts.length === 0 ? (
             <div className="col-span-full py-20 text-center bg-white rounded-[40px] border border-gray-100 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">All stock levels are optimal</p>
             </div>
          ) : alerts.map((alert, i) => (
            <Card key={i} className="border-none shadow-sm rounded-[32px] overflow-hidden bg-white">
              <CardContent className="p-8">
                 <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                       <AlertTriangle className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black uppercase text-red-600 px-3 py-1 bg-red-50 rounded-full border border-red-100">Low Stock</span>
                 </div>
                 <h3 className="text-lg font-black uppercase tracking-tight mb-1">{alert.product.name}</h3>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">at {alert.store.name}</p>
                 
                 <div className="flex items-end justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div>
                       <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Current Balance</p>
                       <p className="text-2xl font-black text-red-600 leading-none">{alert.quantity}</p>
                    </div>
                    <Button variant="black" size="sm" className="text-[8px] font-black uppercase tracking-widest h-10 px-4">Initiate Restock</Button>
                 </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
