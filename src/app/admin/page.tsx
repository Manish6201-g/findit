'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, CheckCircle, XCircle, Clock, AlertTriangle, ExternalLink } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface AdminClaim {
  _id: string;
  status: 'pending' | 'approved' | 'rejected';
  description: string;
  createdAt: string;
  item: {
    _id: string;
    name: string;
    type: 'lost' | 'found';
    status: string;
  };
  claimer: {
    _id: string;
    name: string;
    email: string;
  };
}

export default function AdminPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [claims, setClaims] = useState<AdminClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchClaims = useCallback(async () => {
    try {
      const { data } = await api.get('/claims');
      setClaims(data);
    } catch {
      console.error('Failed to fetch admin claims');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    if (!authLoading) {
      if (!user || user.role !== 'admin') {
        router.push('/login');
      } else {
        const loadData = async () => {
          try {
            const { data } = await api.get('/claims');
            if (active) {
              setClaims(data);
              setLoading(false);
            }
          } catch {
            if (active) {
              setLoading(false);
            }
          }
        };
        loadData();
      }
    }
    return () => { active = false; };
  }, [user, authLoading, router]);

  const handleUpdateStatus = async (claimId: string, newStatus: 'approved' | 'rejected') => {
    setUpdatingId(claimId);
    try {
      await api.put(`/claims/${claimId}/status`, { status: newStatus });
      fetchClaims();
    } catch {
      alert('Failed to update claim status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-6">You must be logged in as an Admin to view this page.</p>
        <Link href="/login" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold">
          Log in as Admin
        </Link>
      </div>
    );
  }

  const pendingCount = claims.filter(c => c.status === 'pending').length;
  const approvedCount = claims.filter(c => c.status === 'approved').length;
  const rejectedCount = claims.filter(c => c.status === 'rejected').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 mb-10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <ShieldCheck className="text-blue-400" size={32} />
            <h1 className="text-3xl font-extrabold">Admin Control Panel</h1>
          </div>
          <p className="text-slate-400">Review and verify item ownership claims submitted by students across campus.</p>
        </div>

        <div className="flex space-x-4">
          <div className="bg-slate-800 px-5 py-3 rounded-2xl border border-slate-700 text-center">
            <span className="block text-2xl font-bold text-yellow-400">{pendingCount}</span>
            <span className="text-xs text-slate-400 uppercase font-bold">Pending</span>
          </div>
          <div className="bg-slate-800 px-5 py-3 rounded-2xl border border-slate-700 text-center">
            <span className="block text-2xl font-bold text-green-400">{approvedCount}</span>
            <span className="text-xs text-slate-400 uppercase font-bold">Approved</span>
          </div>
          <div className="bg-slate-800 px-5 py-3 rounded-2xl border border-slate-700 text-center">
            <span className="block text-2xl font-bold text-red-400">{rejectedCount}</span>
            <span className="text-xs text-slate-400 uppercase font-bold">Rejected</span>
          </div>
        </div>
      </div>

      {/* Claims List */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Clock className="mr-3 text-blue-600" size={24} />
          Submitted Claims ({claims.length})
        </h2>

        {claims.length === 0 ? (
          <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            No claims have been submitted yet.
          </div>
        ) : (
          <div className="space-y-6">
            {claims.map((claim) => (
              <div
                key={claim._id}
                className="bg-gray-50 border border-gray-100 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-blue-200 transition-all"
              >
                <div className="space-y-3 flex-grow">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      claim.status === 'approved' ? 'bg-green-100 text-green-700' :
                      claim.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {claim.status}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                      {new Date(claim.createdAt).toLocaleDateString()} at {new Date(claim.createdAt).toLocaleTimeString()}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                      Claim for {claim.item?.name || 'Unknown Item'}
                      {claim.item?._id && (
                        <Link href={`/items/${claim.item._id}`} className="ml-2 text-blue-600 hover:text-blue-700">
                          <ExternalLink size={16} />
                        </Link>
                      )}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-bold text-gray-700">Claimer:</span> {claim.claimer?.name} ({claim.claimer?.email})
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-gray-200 text-sm text-gray-700">
                    <span className="font-bold text-gray-900 block mb-1">Proof Description:</span>
                    {claim.description}
                  </div>
                </div>

                {claim.status === 'pending' && (
                  <div className="flex sm:flex-col gap-3 min-w-[140px]">
                    <button
                      onClick={() => handleUpdateStatus(claim._id, 'approved')}
                      disabled={updatingId === claim._id}
                      className="flex-1 bg-green-600 text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-green-700 transition-all flex items-center justify-center space-x-1 shadow-md shadow-green-100 disabled:opacity-50"
                    >
                      <CheckCircle size={16} />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(claim._id, 'rejected')}
                      disabled={updatingId === claim._id}
                      className="flex-1 bg-red-600 text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-red-700 transition-all flex items-center justify-center space-x-1 shadow-md shadow-red-100 disabled:opacity-50"
                    >
                      <XCircle size={16} />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
