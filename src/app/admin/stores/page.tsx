'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Store as StoreIcon, 
  MapPin, 
  Plus, 
  MoreVertical, 
  Search, 
  Edit2, 
  Trash2, 
  ChevronRight,
  Warehouse,
  ShoppingBag,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input, Select } from '@/components/ui/input';
import { storesApi } from '@/lib/api';

export default function StoresPage() {
  const [stores, setStores] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchQuery] = useState('');

  const fetchStores = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await storesApi.get();
      setStores(response.results || response);
    } catch (error) {
      console.error('Failed to fetch stores', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-500 mb-2">Network Management</p>
          <h1 className="text-4xl font-black tracking-tighter uppercase text-black">Store <span className="text-gray-300">Locations</span></h1>
        </div>
        <Button variant="black" className="text-[10px] uppercase font-black tracking-widest h-12 px-6" icon={Plus}>Add New Store</Button>
      </div>

      <div className="flex flex-wrap items-center gap-4 bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Search stores by name or city..." 
            className="pl-12 h-12 bg-gray-50 border-none rounded-xl text-[10px] font-bold uppercase tracking-widest"
            value={searchTerm}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {[1,2,3].map(i => (
             <div key={i} className="h-64 bg-white animate-pulse rounded-[32px] border border-gray-100" />
           ))}
        </div>
      ) : filteredStores.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-[40px] border border-gray-100 shadow-sm">
           <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">No stores found matching your search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((store, i) => (
            <Card key={i} className="border-none shadow-sm rounded-[32px] overflow-hidden bg-white group hover:shadow-xl transition-all duration-500">
              <CardContent className="p-8 space-y-6">
                 <div className="flex items-start justify-between">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                      store.location_type === 'Warehouse' ? 'bg-black text-primary-500' : 
                      store.location_type === 'Retail' ? 'bg-primary-500 text-black' : 'bg-gray-100 text-gray-600'
                    }`}>
                       {store.location_type === 'Warehouse' ? <Warehouse className="w-6 h-6" /> : 
                        store.location_type === 'Retail' ? <ShoppingBag className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
                    </div>
                    <div className="flex gap-2">
                       <button className="p-2 bg-gray-50 rounded-lg hover:bg-black hover:text-primary-500 transition-all opacity-0 group-hover:opacity-100">
                          <Edit2 className="w-4 h-4" />
                       </button>
                    </div>
                 </div>

                 <div>
                    <div className="flex items-center gap-2 mb-1">
                       <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                         store.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                       }`}>
                          {store.is_active ? 'Active' : 'Inactive'}
                       </span>
                       <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{store.location_type}</span>
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-black">{store.name}</h3>
                 </div>

                 <div className="pt-4 border-t border-gray-50 space-y-3">
                    <div className="flex items-start gap-3">
                       <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                       <p className="text-[11px] font-bold text-gray-500 leading-relaxed uppercase">
                          {store.address}<br />
                          {store.city}, {store.state}
                       </p>
                    </div>
                 </div>

                 <div className="pt-4 flex items-center justify-between">
                    <div className="space-y-1">
                       <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Inventory</p>
                       <p className="text-sm font-black text-black">VIEW STOCK</p>
                    </div>
                    <Button variant="ghost" size="sm" className="p-2 h-10 w-10 bg-gray-50 rounded-full hover:bg-black hover:text-primary-500 transition-all">
                       <ChevronRight className="w-5 h-5" />
                    </Button>
                 </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
