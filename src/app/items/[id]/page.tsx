'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Calendar, Tag, User, MessageCircle, ShieldCheck, ArrowLeft } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function ItemDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claimDescription, setClaimDescription] = useState('');
  const [submittingClaim, setSubmittingClaim] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data } = await api.get(`/items/${id}`);
        setItem(data);
      } catch (error) {
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
      alert('Claim submitted successfully!');
      setShowClaimForm(false);
    } catch (error) {
      alert('Failed to submit claim');
    }
    setSubmittingClaim(false);
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  if (!item) return <div className="text-center py-20 text-xl font-bold">Item not found</div>;

  const isOwner = user?._id === item.owner._id;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Link href="/items" className="inline-flex items-center text-blue-600 font-bold mb-8 hover:underline">
        <ArrowLeft size={20} className="mr-2" />
        Back to Items
      </Link>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Image */}
          <div className="bg-gray-100 h-[400px] md:h-auto relative">
            {item.images?.[0] ? (
              <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <Tag size={100} />
              </div>
            )}
            <div className={`absolute top-6 left-6 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider shadow-md ${
              item.type === 'lost' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
            }`}>
              {item.type}
            </div>
          </div>

          {/* Right: Details */}
          <div className="p-8 md:p-12">
            <div className="flex items-center space-x-2 mb-4">
              <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold uppercase">
                {item.category}
              </span>
              <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${
                item.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'
              }`}>
                {item.status}
              </span>
            </div>

            <h1 className="text-4xl font-extrabold text-gray-900 mb-6">{item.name}</h1>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start text-gray-600">
                <MapPin className="mr-3 mt-1 text-blue-600" size={20} />
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Location</p>
                  <p className="font-medium">{item.location}</p>
                </div>
              </div>
              <div className="flex items-start text-gray-600">
                <Calendar className="mr-3 mt-1 text-blue-600" size={20} />
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Date</p>
                  <p className="font-medium">{new Date(item.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-start text-gray-600">
                <User className="mr-3 mt-1 text-blue-600" size={20} />
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Posted By</p>
                  <p className="font-medium">{item.owner.name}</p>
                </div>
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-lg font-bold text-gray-900 mb-2 border-b pb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </div>

            {item.reward && (
              <div className="bg-orange-50 p-6 rounded-2xl mb-10 border border-orange-100">
                <p className="text-orange-600 font-bold text-sm uppercase mb-1">Reward Offered</p>
                <p className="text-3xl font-extrabold text-orange-700">₹{item.reward}</p>
              </div>
            )}

            {!isOwner && item.status === 'active' && (
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowClaimForm(true)}
                  className="flex-grow bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center space-x-2"
                >
                  <ShieldCheck size={20} />
                  <span>Claim Item</span>
                </button>
                <button className="flex-grow bg-white text-gray-900 border-2 border-gray-200 px-8 py-4 rounded-2xl font-bold hover:border-blue-600 hover:text-blue-600 transition-all flex items-center justify-center space-x-2">
                  <MessageCircle size={20} />
                  <span>Chat with Owner</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Claim Modal/Form */}
      {showClaimForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="bg-blue-600 p-6 text-white">
              <h2 className="text-2xl font-bold">File a Claim</h2>
              <p className="text-blue-100 text-sm">Provide proof that you are the rightful owner.</p>
            </div>
            <form onSubmit={handleClaim} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Proof of Ownership</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Describe unique features, specific contents, or upload images if possible..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={claimDescription}
                  onChange={(e) => setClaimDescription(e.target.value)}
                ></textarea>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowClaimForm(false)}
                  className="flex-grow py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingClaim}
                  className="flex-grow bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
                >
                  {submittingClaim ? 'Submitting...' : 'Submit Claim'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
