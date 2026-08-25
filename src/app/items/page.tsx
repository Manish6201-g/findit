'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, Calendar, Tag, Sparkles, X, Filter, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  color?: string;
  brand?: string;
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchItems();
  };

  const categories = ['Electronics', 'Documents', 'Clothing', 'Books', 'Jewelry & Accessories', 'Other'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      {/* Search Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 lg:p-12 mb-10 shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-blue-300 mb-4 border border-white/10">
            <Sparkles size={14} className="text-yellow-400" aria-hidden="true" />
            <span>Search Campus Directory</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-white">Browse Campus Belongings</h1>
          <p className="text-slate-300 text-sm sm:text-base mb-8 max-w-xl leading-relaxed">
            Quickly locate lost keys, backpacks, electronics, and documents reported by students across campus.
          </p>
          
          {/* Search Bar with Instant Clear Button */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="absolute left-4 text-slate-400 pointer-events-none" size={20} aria-hidden="true" />
            <input
              type="text"
              placeholder="Search items by keyword, brand, color, or location..."
              className="w-full pl-12 pr-32 py-4 bg-white/95 backdrop-blur-xl text-slate-900 placeholder-slate-400 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/40 font-medium text-base shadow-xl transition-all cursor-text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search items"
            />
            
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-28 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 transition-colors"
                aria-label="Clear search query"
              >
                <X size={18} />
              </button>
            )}

            <button 
              type="submit"
              className="absolute right-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md shadow-blue-500/30 cursor-pointer focus-visible:ring-2 focus-visible:ring-white"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Filter Bar with Framer Motion Layout switching */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white/90 backdrop-blur-xl p-4 rounded-2xl border border-slate-200/80 shadow-md">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 text-slate-700 text-xs font-extrabold uppercase tracking-wider pr-3 border-r border-slate-200">
            <Filter size={16} className="text-blue-600" aria-hidden="true" />
            <span>Filters:</span>
          </div>

          {/* Type Filter Pills with Motion Indicator */}
          <div className="flex bg-slate-100/90 p-1 rounded-xl relative">
            {[
              { id: '', label: 'All Items' },
              { id: 'lost', label: 'Lost Only' },
              { id: 'found', label: 'Found Only' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setType(tab.id)}
                className={`relative px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  type === tab.id ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {type === tab.id && (
                  <motion.div
                    layoutId="typeFilterPill"
                    className={`absolute inset-0 rounded-lg shadow-sm ${
                      tab.id === 'lost' ? 'bg-rose-500 text-white' : tab.id === 'found' ? 'bg-emerald-500 text-white' : 'bg-white'
                    }`}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 ${type === tab.id && tab.id !== '' ? 'text-white' : ''}`}>
                  {tab.label}
                </span>
              </button>
            ))}
          </div>

          {/* Category Selector */}
          <select 
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer shadow-none hover:border-slate-300 transition-colors"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {(type || category || search) && (
          <button
            onClick={() => { setType(''); setCategory(''); setSearch(''); }}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer flex items-center space-x-1"
          >
            <X size={14} />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>

      {/* Items Grid with Glassmorphic Elevation Cards */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20" aria-live="polite">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-sm font-bold text-slate-500">Searching campus listings...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-white/90 backdrop-blur-xl rounded-3xl border-2 border-dashed border-slate-200 p-8 max-w-lg mx-auto shadow-sm" role="alert">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 mb-2">No matching items found</h3>
          <p className="text-slate-500 text-xs sm:text-sm mb-6 leading-relaxed">
            We couldn&apos;t find any items matching your active search filters. Try broadening your keywords or report a missing item.
          </p>
          <Link 
            href="/report" 
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-xs hover:bg-blue-700 transition-all inline-block shadow-lg shadow-blue-500/25 cursor-pointer"
          >
            Post New Report
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence>
            {items.map((item: Item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <Link 
                  href={`/items/${item._id}`}
                  className="group bg-white rounded-3xl border border-slate-200/80 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col h-full cursor-pointer"
                >
                  {/* Card Image Thumbnail */}
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
                        <Tag size={40} className="text-slate-300" aria-hidden="true" />
                        <span className="text-[11px] font-semibold mt-2 text-slate-400">No Photo Attached</span>
                      </div>
                    )}

                    {/* Type Badge Pill */}
                    <div className={`absolute top-4 left-4 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md backdrop-blur-md ${
                      item.type === 'lost' 
                        ? 'bg-rose-500/90 text-white' 
                        : 'bg-emerald-500/90 text-white'
                    }`}>
                      {item.type}
                    </div>
                  </div>
                  
                  {/* Card Content Body */}
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                          {item.category}
                        </span>
                        {item.reward && (
                          <span className="text-[11px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                            ₹{item.reward} Reward
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-slate-500 text-xs mb-4 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    
                    {/* Item Metadata */}
                    <div className="space-y-2 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-500">
                      <div className="flex items-center">
                        <MapPin size={14} className="mr-2 text-slate-400 shrink-0" aria-hidden="true" />
                        <span className="line-clamp-1">{item.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-2 text-slate-400 shrink-0" aria-hidden="true" />
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
