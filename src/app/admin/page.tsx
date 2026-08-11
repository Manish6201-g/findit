'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, CheckCircle, XCircle, Clock, AlertTriangle, ExternalLink, QrCode, Search, Trash2, Filter, MessageSquare, Send, X, Eye } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

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
    location?: string;
    category?: string;
    owner?: { _id: string; name: string };
  };
  claimer: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
}

interface AdminItem {
  _id: string;
  name: string;
  type: 'lost' | 'found';
  category: string;
  color?: string;
  location: string;
  status: 'active' | 'claimed' | 'returned' | 'hidden';
  date: string;
  qrCode?: string;
  owner: {
    _id: string;
    name: string;
    email: string;
  };
}

interface ChatMessage {
  _id: string;
  sender: { _id: string; name: string };
  receiver: { _id: string; name: string };
  item: { _id: string; name: string };
  content: string;
  createdAt: string;
}

export default function AdminPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'claims' | 'items' | 'messages'>('claims');
  
  // Claims state
  const [claims, setClaims] = useState<AdminClaim[]>([]);
  const [claimsStatusFilter, setClaimsStatusFilter] = useState('');
  
  // Items state
  const [items, setItems] = useState<AdminItem[]>([]);
  const [itemCategoryFilter, setCategoryFilter] = useState('');
  const [itemColorFilter, setColorFilter] = useState('');
  const [itemLocationFilter, setLocationFilter] = useState('');
  const [itemStatusFilter, setStatusFilter] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  
  // QR Code Modal state
  const [activeQrModal, setActiveQrModal] = useState<AdminItem | null>(null);

  // Chat Room Modal state
  const [activeChatClaim, setActiveChatClaim] = useState<AdminClaim | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchClaims = useCallback(async () => {
    try {
      const { data } = await api.get('/claims', { params: { status: claimsStatusFilter } });
      setClaims(data);
    } catch {
      console.error('Failed to fetch admin claims');
    }
  }, [claimsStatusFilter]);

  const fetchItems = useCallback(async () => {
    try {
      const { data } = await api.get('/items', {
        params: {
          category: itemCategoryFilter,
          color: itemColorFilter,
          location: itemLocationFilter,
          status: itemStatusFilter,
          search: searchKeyword,
        },
      });
      setItems(data);
    } catch {
      console.error('Failed to fetch items');
    }
  }, [itemCategoryFilter, itemColorFilter, itemLocationFilter, itemStatusFilter, searchKeyword]);

  useEffect(() => {
    let active = true;
    if (!authLoading) {
      if (!user || user.role !== 'admin') {
        router.push('/login');
      } else {
        const loadAll = async () => {
          try {
            await Promise.all([fetchClaims(), fetchItems()]);
          } finally {
            if (active) setLoading(false);
          }
        };
        loadAll();
      }
    }
    return () => { active = false; };
  }, [user, authLoading, router, fetchClaims, fetchItems]);

  const handleUpdateClaimStatus = async (claimId: string, newStatus: 'approved' | 'rejected') => {
    setUpdatingId(claimId);
    try {
      await api.patch(`/claims/${claimId}/status`, { status: newStatus });
      await fetchClaims();
      await fetchItems();
    } catch {
      alert('Failed to update claim status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdateItemStatus = async (itemId: string, newStatus: string) => {
    setUpdatingId(itemId);
    try {
      await api.patch(`/items/${itemId}`, { status: newStatus });
      await fetchItems();
    } catch {
      alert('Failed to update item status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) return;
    setUpdatingId(itemId);
    try {
      await api.delete(`/items/${itemId}`);
      await fetchItems();
    } catch {
      alert('Failed to delete item');
    } finally {
      setUpdatingId(null);
    }
  };

  const openChatRoom = async (claim: AdminClaim) => {
    setActiveChatClaim(claim);
    try {
      const { data } = await api.get('/messages', {
        params: { itemId: claim.item._id },
      });
      setMessages(data);
    } catch {
      console.error('Failed to fetch messages');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChatClaim || !newMessageText.trim()) return;
    setSendingMsg(true);
    try {
      const { data } = await api.post('/messages', {
        receiver: activeChatClaim.claimer._id,
        item: activeChatClaim.item._id,
        content: newMessageText,
      });
      setMessages((prev) => [...prev, data]);
      setNewMessageText('');
    } catch {
      alert('Failed to send message');
    } finally {
      setSendingMsg(false);
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

  const pendingCount = claims.filter((c) => c.status === 'pending').length;
  const approvedCount = claims.filter((c) => c.status === 'approved').length;
  const rejectedCount = claims.filter((c) => c.status === 'rejected').length;

  const categories = ['Electronics', 'Documents', 'Clothing', 'Books', 'Jewelry & Accessories', 'Other'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 mb-10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <ShieldCheck className="text-blue-400" size={32} />
            <h1 className="text-3xl font-black tracking-tight">Admin Control Center</h1>
          </div>
          <p className="text-slate-400 text-sm">Review claims, manage items, inspect QR codes, and supervise claim messaging rooms.</p>
        </div>

        <div className="flex space-x-3">
          <div className="bg-slate-800/80 px-4 py-2.5 rounded-2xl border border-slate-700 text-center">
            <span className="block text-xl font-extrabold text-yellow-400">{pendingCount}</span>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Pending</span>
          </div>
          <div className="bg-slate-800/80 px-4 py-2.5 rounded-2xl border border-slate-700 text-center">
            <span className="block text-xl font-extrabold text-emerald-400">{approvedCount}</span>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Approved</span>
          </div>
          <div className="bg-slate-800/80 px-4 py-2.5 rounded-2xl border border-slate-700 text-center">
            <span className="block text-xl font-extrabold text-red-400">{rejectedCount}</span>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Rejected</span>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex space-x-3 mb-8 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-sm w-fit">
        <button
          onClick={() => setActiveTab('claims')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center space-x-2 ${
            activeTab === 'claims' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck size={16} />
          <span>Claims Review ({claims.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('items')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center space-x-2 ${
            activeTab === 'items' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Search size={16} />
          <span>Items Database ({items.length})</span>
        </button>
      </div>

      {/* TAB 1: CLAIMS REVIEW */}
      {activeTab === 'claims' && (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 flex items-center">
              <Clock className="mr-2 text-blue-600" size={20} />
              Ownership Proof Submissions
            </h2>

            {/* Claims Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-400">Filter Status:</span>
              <select
                className="px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
                value={claimsStatusFilter}
                onChange={(e) => setClaimsStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending Only</option>
                <option value="approved">Approved Only</option>
                <option value="rejected">Rejected Only</option>
              </select>
            </div>
          </div>

          {claims.length === 0 ? (
            <div className="text-center py-16 text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              No claims matching the selected status.
            </div>
          ) : (
            <div className="space-y-5">
              {claims.map((claim) => (
                <div
                  key={claim._id}
                  className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-white hover:shadow-lg transition-all"
                >
                  <div className="space-y-3 flex-grow">
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        claim.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                        claim.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {claim.status}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {new Date(claim.createdAt).toLocaleDateString()} at {new Date(claim.createdAt).toLocaleTimeString()}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900 flex items-center">
                        Claim for {claim.item?.name || 'Unknown Item'}
                        {claim.item?._id && (
                          <Link href={`/items/${claim.item._id}`} className="ml-2 text-blue-600 hover:text-blue-700">
                            <ExternalLink size={16} />
                          </Link>
                        )}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1">
                        <span className="font-bold text-slate-800">Claimer:</span> {claim.claimer?.name} ({claim.claimer?.email})
                        {claim.claimer?.phone && <span className="ml-2">📞 {claim.claimer.phone}</span>}
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs text-slate-700">
                      <span className="font-bold text-slate-900 block mb-1">Proof Description:</span>
                      {claim.description}
                    </div>
                  </div>

                  <div className="flex sm:flex-col gap-2.5 min-w-[150px]">
                    {claim.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleUpdateClaimStatus(claim._id, 'approved')}
                          disabled={updatingId === claim._id}
                          className="flex-1 bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-emerald-700 transition-all flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-500/20 disabled:opacity-50"
                        >
                          <CheckCircle size={15} />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleUpdateClaimStatus(claim._id, 'rejected')}
                          disabled={updatingId === claim._id}
                          className="flex-1 bg-red-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-red-700 transition-all flex items-center justify-center space-x-1.5 shadow-md shadow-red-500/20 disabled:opacity-50"
                        >
                          <XCircle size={15} />
                          <span>Reject</span>
                        </button>
                      </>
                    )}

                    {claim.status === 'approved' && (
                      <button
                        onClick={() => openChatRoom(claim)}
                        className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-indigo-700 transition-all flex items-center justify-center space-x-1.5 shadow-md shadow-indigo-500/20"
                      >
                        <MessageSquare size={15} />
                        <span>Chat Room</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ITEMS MULTI-FILTER DATABASE */}
      {activeTab === 'items' && (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
            <Filter className="mr-2 text-blue-600" size={20} />
            Multi-Filter Item Search
          </h2>

          {/* Multi-Filter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <input
              type="text"
              placeholder="Keyword (name, brand)..."
              className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <select
              className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
              value={itemCategoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Color (e.g. Blue)..."
              className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
              value={itemColorFilter}
              onChange={(e) => setColorFilter(e.target.value)}
            />
            <input
              type="text"
              placeholder="Location..."
              className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
              value={itemLocationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
            <select
              className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
              value={itemStatusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="claimed">Claimed</option>
              <option value="returned">Returned</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>

          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      item.type === 'lost' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {item.type}
                    </span>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">📍 {item.location}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{item.name}</h3>
                  <p className="text-xs text-slate-500">
                    Posted by: <span className="font-semibold text-slate-700">{item.owner?.name} ({item.owner?.email})</span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Status PATCH selector */}
                  <select
                    value={item.status}
                    onChange={(e) => handleUpdateItemStatus(item._id, e.target.value)}
                    disabled={updatingId === item._id}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
                  >
                    <option value="active">Status: Active</option>
                    <option value="claimed">Status: Claimed</option>
                    <option value="returned">Status: Returned</option>
                    <option value="hidden">Status: Hidden</option>
                  </select>

                  {/* View QR Code Button */}
                  {item.qrCode && (
                    <button
                      onClick={() => setActiveQrModal(item)}
                      className="p-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl transition-all"
                      title="View Item QR Code"
                    >
                      <QrCode size={16} />
                    </button>
                  )}

                  <Link href={`/items/${item._id}`} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition-all">
                    <Eye size={16} />
                  </Link>

                  <button
                    onClick={() => handleDeleteItem(item._id)}
                    disabled={updatingId === item._id}
                    className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-all"
                    title="Delete Item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QR CODE MODAL */}
      {activeQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl relative border border-slate-100">
            <button
              onClick={() => setActiveQrModal(null)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-800"
            >
              <X size={20} />
            </button>
            <QrCode size={36} className="mx-auto text-blue-600 mb-2" />
            <h3 className="font-bold text-lg text-slate-900 mb-1">Generated Item QR Code</h3>
            <p className="text-xs text-slate-500 mb-4">{activeQrModal.name}</p>

            {activeQrModal.qrCode && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 inline-block mb-4">
                <Image src={activeQrModal.qrCode} alt="Item QR Code" width={220} height={220} className="mx-auto" />
              </div>
            )}

            <a
              href={activeQrModal.qrCode}
              download={`QR_${activeQrModal.name.replace(/\s+/g, '_')}.png`}
              className="block w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-xs hover:bg-slate-800 transition-all"
            >
              Download QR Code PNG
            </a>
          </div>
        </div>
      )}

      {/* APPROVED CLAIM CHAT ROOM MODAL */}
      {activeChatClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col h-[520px]">
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-5 flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-bold text-base">Claim Chat Room: {activeChatClaim.item?.name}</h3>
                <p className="text-xs text-slate-400">Claimer: {activeChatClaim.claimer?.name} ({activeChatClaim.claimer?.email})</p>
              </div>
              <button onClick={() => setActiveChatClaim(null)} className="p-1 text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="flex-grow p-6 overflow-y-auto space-y-4 bg-slate-50">
              {messages.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-400">No messages sent in this room yet.</div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`p-3.5 rounded-2xl max-w-[80%] text-xs font-medium ${
                      msg.sender._id === user._id
                        ? 'bg-blue-600 text-white ml-auto rounded-br-none'
                        : 'bg-white text-slate-800 border border-slate-200 mr-auto rounded-bl-none shadow-sm'
                    }`}
                  >
                    <p className="font-bold text-[10px] opacity-80 mb-0.5">{msg.sender.name}</p>
                    <p className="leading-relaxed">{msg.content}</p>
                    <span className="text-[9px] opacity-60 mt-1 block text-right">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 flex items-center space-x-2 shrink-0">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-grow px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
              />
              <button
                type="submit"
                disabled={sendingMsg}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl transition-all disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
