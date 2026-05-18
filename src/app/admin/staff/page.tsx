'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Shield, 
  MoreVertical, 
  Search, 
  Edit2, 
  Trash2, 
  Check,
  X,
  User as UserIcon,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input, Select } from '@/components/ui/input';
import { staffApi } from '@/lib/api';

export default function StaffPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchQuery] = useState('');

  const fetchStaff = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await staffApi.get();
      setStaff(response.results || response);
    } catch (error) {
      console.error('Failed to fetch staff', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const filteredStaff = staff.filter(person => 
    person.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-500 mb-2">Access Control</p>
          <h1 className="text-4xl font-black tracking-tighter uppercase text-black">Team <span className="text-gray-300">Management</span></h1>
        </div>
        <Button variant="black" className="text-[10px] uppercase font-black tracking-widest h-12 px-6" icon={UserPlus}>Add Team Member</Button>
      </div>

      <div className="flex flex-wrap items-center gap-4 bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Search team members by name or email..." 
            className="pl-12 h-12 bg-gray-50 border-none rounded-xl text-[10px] font-bold uppercase tracking-widest"
            value={searchTerm}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-50 bg-gray-50/50">
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Team Member</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Role</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
               <tr><td colSpan={4} className="p-20 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">Loading team data...</td></tr>
            ) : filteredStaff.length === 0 ? (
               <tr><td colSpan={4} className="p-20 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">No team members found</td></tr>
            ) : filteredStaff.map((person, i) => (
              <tr key={i} className="group hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-primary-500 font-black text-xs">
                      {person.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-tight text-black">{person.full_name}</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {person.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <Shield className={`w-4 h-4 ${person.is_staff ? 'text-primary-500' : 'text-gray-300'}`} />
                    <span className="text-[10px] font-black uppercase">{person.is_staff ? 'Administrator' : 'Staff'}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-green-50 border border-green-200 text-green-700">
                    <div className="w-1 h-1 rounded-full bg-green-500" />
                    Active
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                   <div className="flex justify-end gap-2">
                      <button className="p-2 bg-gray-50 rounded-lg hover:bg-black hover:text-primary-500 transition-all">
                         <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-gray-50 rounded-lg hover:bg-red-500 hover:text-white transition-all">
                         <Trash2 className="w-4 h-4" />
                      </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
