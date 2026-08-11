'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, Calendar, Tag, SlidersHorizontal, Sparkles } from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';

interface Item {
  _id: string;
  name: string;
  description: string;
  type: 'lost' | 'found';
  category: string;
  location: string;
  date: string;
  images?: string[];
  reward?: number;
}

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/items', {
        params: { search, type, category }
      });
      setItems(data);
    } catch {
      console.error('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  }, [search, type, category]);

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      try {
        const { data } = await api.get('/items', {
          params: { search, type, category }
        });
        if (active) {
          setItems(data);
          setLoading(false);
        }
      } catch {
        if (active) {
          console.error('Failed to fetch items');
          setLoading(false);
        }
      }
    };
    loadData();
    return () => { active = false; };
  }, [search, type, category]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchItems();
  };

  const categories = ['Electronics', 'Documents', 'Clothing', 'Books', 'Jewelry & Accessories', 'Other'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      {/* Search Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 lg:p-12 mb-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-blue-300 mb-4">
            <Sparkles size={14} />
            <span>Search Campus Database</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-6">Browse Lost & Found Items</h1>
          
          <form onSubmit={handleSearch} className="relative flex items-center">
            <Search className="absolute left-4 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search items by keyword, location, or description..."
              className="w-full pl-12 pr-28 py-4 bg-white/95 backdrop-blur-md text-slate-900 placeholder-slate-400 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 font-medium text-base shadow-lg transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button 
              type="submit"
              className="absolute right-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 text-slate-500 text-sm font-bold pr-2 border-r border-slate-200">
            <SlidersHorizontal size={18} />
            <span>Filters:</span>
          </div>

          {/* Type Filter */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setType('')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${type === '' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              All Types
            </button>
            <button
              onClick={() => setType('lost')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${type === 'lost' ? 'bg-red-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Lost Only
            </button>
            <button
              onClick={() => setType('found')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${type === 'found' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Found Only
            </button>
          </div>

          {/* Category Dropdown */}
          <select 
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {(type || category || search) && (
          <button
            onClick={() => { setType(''); setCategory(''); setSearch(''); }}
            className="text-xs font-bold text-blue-600 hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-sm font-semibold text-slate-500">Searching campus listings...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 p-8 max-w-lg mx-auto">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Tag size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No matching items found</h3>
          <p className="text-slate-500 text-sm mb-6">Try adjusting your filters, searching for a broader keyword, or report a new item.</p>
          <Link href="/report" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all inline-block shadow-md">
            Report New Item
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {items.map((item: Item) => (
            <Link 
              key={item._id} 
              href={`/items/${item._id}`}
              className="group bg-white rounded-3xl border border-slate-200/80 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Card Image */}
              <div className="relative h-56 w-full bg-slate-100 overflow-hidden">
                {item.images?.[0] ? (
                  <Image 
                    src={item.images[0]} 
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-50">
                    <Tag size={44} />
                    <span className="text-[11px] font-semibold mt-2 text-slate-400">No Photo Attached</span>
                  </div>
                )}

                {/* Type Tag Pill */}
                <div className={`absolute top-4 left-4 px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-md backdrop-blur-md ${
                  item.type === 'lost' 
                    ? 'bg-red-500/90 text-white' 
                    : 'bg-emerald-500/90 text-white'
                }`}>
                  {item.type}
                </div>
              </div>
              
              {/* Card Body */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                      {item.category}
                    </span>
                    {item.reward && (
                      <span className="text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60">
                        ₹{item.reward} Reward
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                
                {/* Meta details */}
                <div className="space-y-2 pt-4 border-t border-slate-100 text-xs font-medium text-slate-500">
                  <div className="flex items-center">
                    <MapPin size={14} className="mr-2 text-slate-400 shrink-0" />
                    <span className="line-clamp-1">{item.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-2 text-slate-400 shrink-0" />
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
