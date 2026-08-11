'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Tag, ShieldCheck, Bell, ExternalLink, Clock, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface DashboardItem {
  _id: string;
  name: string;
  type: 'lost' | 'found';
  status: string;
  createdAt: string;
  owner: { _id: string };
}

interface DashboardClaim {
  _id: string;
  status: string;
  item: { _id: string; name: string };
}

interface DashboardNotification {
  _id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('items');
  const [items, setItems] = useState<DashboardItem[]>([]);
  const [claims, setClaims] = useState<DashboardClaim[]>([]);
  const [notifications, setNotifications] = useState<DashboardNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) return;
    try {
      const [itemsRes, claimsRes, notificationsRes] = await Promise.all([
        api.get('/items', { params: { owner: user._id } }),
        api.get('/claims'),
        api.get('/notifications'),
      ]);
      setItems(itemsRes.data.filter((item: DashboardItem) => item.owner._id === user._id));
      setClaims(claimsRes.data);
      setNotifications(notificationsRes.data);
    } catch {
      console.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    let active = true;
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      const loadData = async () => {
        try {
          const [itemsRes, claimsRes, notificationsRes] = await Promise.all([
            api.get('/items', { params: { owner: user._id } }),
            api.get('/claims'),
            api.get('/notifications'),
          ]);
          if (active) {
            setItems(itemsRes.data.filter((item: DashboardItem) => item.owner._id === user._id));
            setClaims(claimsRes.data);
            setNotifications(notificationsRes.data);
            setLoading(false);
          }
        } catch {
          if (active) {
            console.error('Failed to fetch dashboard data');
            setLoading(false);
          }
        }
      };
      loadData();
    }
    return () => { active = false; };
  }, [user, authLoading, router]);

  if (authLoading || loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  const tabs = [
    { id: 'items', name: 'My Reported Items', icon: Tag, count: items.length },
    { id: 'claims', name: 'My Claims', icon: ShieldCheck, count: claims.length },
    { id: 'notifications', name: 'Campus Alerts', icon: Bell, count: notifications.filter(n => !n.read).length },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      {/* Profile Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 lg:p-12 mb-10 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8 border border-slate-800">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex items-center space-x-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-1 shadow-lg shadow-blue-500/30">
            <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center text-3xl font-black text-white">
              {user?.name?.[0]}
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-3 mb-1">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{user?.name}</h1>
              <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider">
                {user?.role}
              </span>
            </div>
            <p className="text-slate-400 text-sm">{user?.email}</p>
            {user?.rollNumber && (
              <p className="text-xs text-slate-500 mt-1">Roll No: <span className="text-slate-300 font-semibold">{user.rollNumber}</span></p>
            )}
          </div>
        </div>

        <div className="relative z-10">
          <Link
            href="/report"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-7 py-3.5 rounded-2xl font-bold text-sm hover:from-blue-700 hover:to-indigo-700 transition-all shadow-xl shadow-blue-500/25 flex items-center justify-center space-x-2"
          >
            <PlusCircle size={18} />
            <span>Report New Item</span>
          </Link>
        </div>
      </div>

      {/* Tabs Container */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="flex border-b border-slate-100 px-6 sm:px-8 bg-slate-50/50">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center space-x-2.5 py-5 px-6 font-bold text-sm transition-colors ${
                  isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <tab.icon size={18} />
                <span>{tab.name}</span>
                {tab.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'items' && (
              <motion.div 
                key="items"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {items.length === 0 ? (
                  <div className="text-center py-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-6">
                    <Tag size={40} className="mx-auto text-slate-300 mb-3" />
                    <p className="text-slate-600 font-bold text-base mb-1">No items reported yet</p>
                    <p className="text-slate-400 text-xs mb-4">Post a lost or found report to reconnect items on campus.</p>
                    <Link href="/report" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs">
                      Report Now
                    </Link>
                  </div>
                ) : (
                  items.map((item: DashboardItem) => (
                    <div 
                      key={item._id} 
                      className="flex items-center justify-between p-5 bg-slate-50/80 rounded-2xl border border-slate-200/60 hover:bg-white hover:shadow-lg transition-all"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                          item.type === 'lost' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
                        }`}>
                          <Tag size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-base">{item.name}</h4>
                          <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                            <span className="flex items-center">
                              <Clock size={13} className="mr-1 text-slate-400" />
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                            <span className={`px-2 py-0.5 rounded-md font-bold uppercase text-[10px] ${
                              item.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Link 
                        href={`/items/${item._id}`} 
                        className="p-2.5 bg-white border border-slate-200 hover:border-blue-500 text-blue-600 rounded-xl transition-all shadow-sm"
                      >
                        <ExternalLink size={18} />
                      </Link>
                    </div>
                  ))
                )}
              </motion.div>
            )}

            {activeTab === 'claims' && (
              <motion.div 
                key="claims"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {claims.length === 0 ? (
                  <div className="text-center py-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-6">
                    <ShieldCheck size={40} className="mx-auto text-slate-300 mb-3" />
                    <p className="text-slate-600 font-bold text-base mb-1">No claims submitted</p>
                    <p className="text-slate-400 text-xs">When you claim a found item, your submission status will show up here.</p>
                  </div>
                ) : (
                  claims.map((claim: DashboardClaim) => (
                    <div 
                      key={claim._id} 
                      className="flex items-center justify-between p-5 bg-slate-50/80 rounded-2xl border border-slate-200/60 hover:bg-white hover:shadow-lg transition-all"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                          <ShieldCheck size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-base">Claim for {claim.item.name}</h4>
                          <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full mt-1 inline-block ${
                            claim.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                            claim.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {claim.status}
                          </span>
                        </div>
                      </div>

                      <Link 
                        href={`/items/${claim.item._id}`} 
                        className="p-2.5 bg-white border border-slate-200 hover:border-blue-500 text-blue-600 rounded-xl transition-all shadow-sm"
                      >
                        <ExternalLink size={18} />
                      </Link>
                    </div>
                  ))
                )}
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div 
                key="notifications"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {notifications.length === 0 ? (
                  <div className="text-center py-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-6">
                    <Bell size={40} className="mx-auto text-slate-300 mb-3" />
                    <p className="text-slate-600 font-bold text-base mb-1">No notifications yet</p>
                    <p className="text-slate-400 text-xs">You will receive alerts here when claims or item status updates occur.</p>
                  </div>
                ) : (
                  notifications.map((notif: DashboardNotification) => (
                    <div 
                      key={notif._id} 
                      className={`p-5 rounded-2xl border flex items-start space-x-4 transition-all ${
                        notif.read ? 'bg-white border-slate-200/60' : 'bg-blue-50/60 border-blue-200/80 shadow-sm'
                      }`}
                    >
                      <div className={`mt-0.5 p-2.5 rounded-xl shrink-0 ${
                        notif.type === 'claim' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        <Bell size={18} />
                      </div>

                      <div className="flex-grow">
                        <h4 className="font-bold text-slate-900 text-sm">{notif.title}</h4>
                        <p className="text-slate-600 text-xs mt-1 leading-relaxed">{notif.message}</p>
                        <p className="text-[10px] text-slate-400 mt-2 font-semibold uppercase tracking-wider">
                          {new Date(notif.createdAt).toLocaleString()}
                        </p>
                      </div>

                      {!notif.read && (
                        <button 
                          onClick={async () => {
                            await api.put(`/notifications/${notif._id}/read`);
                            fetchData();
                          }}
                          className="text-[11px] font-bold text-blue-600 hover:underline shrink-0"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
