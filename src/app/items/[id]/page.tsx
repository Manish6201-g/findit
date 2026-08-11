'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Calendar, Tag, User, ShieldCheck, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

interface ItemDetail {
  _id: string;
  name: string;
  description: string;
  type: 'lost' | 'found';
  category: string;
  status: string;
  location: string;
  date: string;
  images?: string[];
  reward?: number;
  owner: {
    _id: string;
    name: string;
    email: string;
  };
}

export default function ItemDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [item, setItem] = useState<ItemDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claimDescription, setClaimDescription] = useState('');
  const [submittingClaim, setSubmittingClaim] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data } = await api.get(`/items/${id}`);
        setItem(data);
      } catch {
        console.error('Failed to fetch item');
      }
      setLoading(false);
    };
    fetchItem();
  }, [id]);

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return router.push('/login');
    setSubmittingClaim(true);
    try {
      await api.post('/claims', {
        item: id,
        description: claimDescription,
      });
      setClaimSuccess(true);
      setTimeout(() => {
        setShowClaimForm(false);
        setClaimSuccess(false);
        setClaimDescription('');
      }, 2000);
    } catch {
      alert('Failed to submit claim. Please try again.');
    }
    setSubmittingClaim(false);
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!item) return (
    <div className="max-w-md mx-auto py-20 text-center">
      <AlertCircle size={48} className="mx-auto text-slate-400 mb-4" />
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Item Not Found</h2>
      <p className="text-slate-500 mb-6">The item listing you are looking for does not exist or has been removed.</p>
      <Link href="/items" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm">
        Back to Items
      </Link>
    </div>
  );

  const isOwner = user?._id === item.owner._id;
  const itemImages = item.images && item.images.length > 0 ? item.images : [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Link href="/items" className="inline-flex items-center text-sm font-bold text-slate-600 hover:text-blue-600 mb-8 transition-colors">
        <ArrowLeft size={18} className="mr-2" />
        Back to All Listings
      </Link>

      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Image Gallery */}
          <div className="bg-slate-100 p-6 flex flex-col justify-between">
            <div className="relative h-[360px] md:h-[420px] w-full rounded-2xl overflow-hidden bg-slate-200 shadow-inner">
              {itemImages[selectedImageIndex] ? (
                <Image 
                  src={itemImages[selectedImageIndex]} 
                  alt={item.name} 
                  fill 
                  className="object-cover" 
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                  <Tag size={80} />
                  <span className="text-sm font-semibold mt-3 text-slate-400">No Photo Uploaded</span>
                </div>
              )}

              {/* Status Badge */}
              <div className={`absolute top-4 left-4 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg backdrop-blur-md ${
                item.type === 'lost' ? 'bg-red-500/90 text-white' : 'bg-emerald-500/90 text-white'
              }`}>
                {item.type}
              </div>
            </div>

            {/* Thumbnails Row */}
            {itemImages.length > 1 && (
              <div className="flex space-x-3 mt-4 overflow-x-auto pb-2">
                {itemImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImageIndex === idx ? 'border-blue-600 scale-105 shadow-md' : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="p-8 md:p-12 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                  {item.category}
                </span>
                <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                  item.status === 'active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-600'
                }`}>
                  {item.status}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-6">{item.name}</h1>
              
              <div className="space-y-4 mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="flex items-start text-slate-700">
                  <MapPin className="mr-3 mt-0.5 text-blue-600 shrink-0" size={20} />
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Campus Location</p>
                    <p className="font-semibold text-slate-800 text-sm">{item.location}</p>
                  </div>
                </div>

                <div className="flex items-start text-slate-700">
                  <Calendar className="mr-3 mt-0.5 text-blue-600 shrink-0" size={20} />
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Date Posted</p>
                    <p className="font-semibold text-slate-800 text-sm">{new Date(item.date).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-start text-slate-700">
                  <User className="mr-3 mt-0.5 text-blue-600 shrink-0" size={20} />
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Reported By</p>
                    <p className="font-semibold text-slate-800 text-sm">{item.owner.name}</p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Item Description</h3>
                <p className="text-slate-600 leading-relaxed text-sm bg-white p-4 rounded-xl border border-slate-100">{item.description}</p>
              </div>

              {item.reward && (
                <div className="bg-amber-50/80 p-5 rounded-2xl mb-8 border border-amber-200/80 flex items-center justify-between">
                  <div>
                    <p className="text-amber-800 font-bold text-xs uppercase tracking-wider">Reward Offered</p>
                    <p className="text-2xl font-black text-amber-700 mt-0.5">₹{item.reward}</p>
                  </div>
                  <Tag className="text-amber-500" size={28} />
                </div>
              )}
            </div>

            {!isOwner && item.status === 'active' && (
              <button
                onClick={() => setShowClaimForm(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-xl shadow-blue-500/25 flex items-center justify-center space-x-2"
              >
                <ShieldCheck size={20} />
                <span>Claim This Item</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Claim Modal */}
      {showClaimForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
              <h2 className="text-2xl font-bold tracking-tight">Submit Ownership Claim</h2>
              <p className="text-blue-100 text-xs mt-1">Provide specific details to prove you are the rightful owner.</p>
            </div>

            {claimSuccess ? (
              <div className="p-8 text-center">
                <CheckCircle2 size={56} className="mx-auto text-emerald-500 mb-3 animate-bounce" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Claim Submitted!</h3>
                <p className="text-slate-600 text-sm">Campus admins will review your proof and notify you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleClaim} className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Proof of Ownership</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Describe unique marks, serial numbers, wallpapers, or contents inside..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    value={claimDescription}
                    onChange={(e) => setClaimDescription(e.target.value)}
                  ></textarea>
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowClaimForm(false)}
                    className="flex-1 py-3.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-all text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingClaim}
                    className="flex-1 bg-blue-600 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50"
                  >
                    {submittingClaim ? 'Submitting...' : 'Submit Claim'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
