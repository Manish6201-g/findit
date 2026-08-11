'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, Calendar, Tag } from 'lucide-react';
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
    setLoading(true);
    fetchItems();
  };

  const categories = ['Electronics', 'Documents', 'Clothing', 'Books', 'Other'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-4xl font-extrabold text-gray-900">Browse Items</h1>
        
        <form onSubmit={handleSearch} className="relative flex-grow max-w-xl">
          <input
            type="text"
            placeholder="Search by name, description or location..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <button 
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      <div className="flex flex-wrap gap-4 mb-10">
        <select 
          className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>

        <select 
          className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <Tag className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-600">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {items.map((item: Item) => (
            <Link 
              key={item._id} 
              href={`/items/${item._id}`}
              className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
            >
              <div className="relative h-56 w-full bg-gray-100 overflow-hidden">
                {item.images?.[0] ? (
                  <Image 
                    src={item.images[0]} 
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Tag size={48} />
                  </div>
                )}
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
                  item.type === 'lost' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                }`}>
                  {item.type}
                </div>
              </div>
              
              <div className="p-6 flex-grow">
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {item.name}
                </h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                  {item.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center text-gray-500 text-sm">
                    <MapPin size={14} className="mr-2" />
                    <span className="line-clamp-1">{item.location}</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar size={14} className="mr-2" />
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6 pt-0 mt-auto border-t border-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                    {item.category}
                  </span>
                  {item.reward && (
                    <span className="text-sm font-bold text-orange-600">
                      ₹{item.reward}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
