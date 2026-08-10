'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tag, ShieldCheck, Bell, User, ExternalLink, Clock } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('items');
  const [items, setItems] = useState([]);
  const [claims, setClaims] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchData();
    }
  }, [user, authLoading]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [itemsRes, claimsRes, notificationsRes] = await Promise.all([
        api.get('/items', { params: { owner: user._id } }),
        api.get('/claims'),
        api.get('/notifications'),
      ]);
      // Filter items manually because the backend getItems might return all if owner param isn't handled yet
      setItems(itemsRes.data.filter((item: any) => item.owner._id === user._id));
      setClaims(claimsRes.data);
      setNotifications(notificationsRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data');
    }
    setLoading(false);
  };

  if (authLoading || loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  const tabs = [
    { id: 'items', name: 'My Items', icon: Tag },
    { id: 'claims', name: 'My Claims', icon: ShieldCheck },
    { id: 'notifications', name: 'Notifications', icon: Bell },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-10">
        <div className="bg-blue-600 px-8 py-12 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-white/20 rounded-3xl backdrop-blur-md flex items-center justify-center text-4xl font-bold">
              {user?.name?.[0]}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold">{user?.name}</h1>
              <p className="text-blue-100">{user?.email}</p>
              <div className="flex space-x-4 mt-2">
                <span className="text-xs bg-white/20 px-2 py-1 rounded-lg uppercase font-bold tracking-wider">{user?.role}</span>
                {user?.rollNumber && <span className="text-xs bg-white/20 px-2 py-1 rounded-lg uppercase font-bold tracking-wider">{user.rollNumber}</span>}
              </div>
            </div>
          </div>
          <Link href="/report" className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all shadow-lg text-center">
            Report New Item
          </Link>
        </div>

        <div className="flex border-b border-gray-100 px-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-6 px-6 font-bold text-sm transition-all border-b-2 ${
                activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <tab.icon size={18} />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        <div className="p-8">
          {activeTab === 'items' && (
            <div className="space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-10 text-gray-500">You haven't reported any items yet.</div>
              ) : (
                items.map((item: any) => (
                  <div key={item._id} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-200 transition-all">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        item.type === 'lost' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                      }`}>
                        <Tag size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{item.name}</h4>
                        <p className="text-xs text-gray-500 flex items-center">
                          <Clock size={12} className="mr-1" />
                          {new Date(item.createdAt).toLocaleDateString()} • {item.status}
                        </p>
                      </div>
                    </div>
                    <Link href={`/items/${item._id}`} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-all">
                      <ExternalLink size={20} />
                    </Link>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'claims' && (
            <div className="space-y-4">
              {claims.length === 0 ? (
                <div className="text-center py-10 text-gray-500">You haven't made any claims yet.</div>
              ) : (
                claims.map((claim: any) => (
                  <div key={claim._id} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                        <ShieldCheck size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">Claim for {claim.item.name}</h4>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          claim.status === 'approved' ? 'bg-green-100 text-green-600' : 
                          claim.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                        }`}>
                          {claim.status}
                        </span>
                      </div>
                    </div>
                    <Link href={`/items/${claim.item._id}`} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-all">
                      <ExternalLink size={20} />
                    </Link>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <div className="text-center py-10 text-gray-500">No new notifications.</div>
              ) : (
                notifications.map((notif: any) => (
                  <div key={notif._id} className={`p-6 rounded-2xl border flex items-start space-x-4 ${notif.read ? 'bg-white border-gray-100' : 'bg-blue-50 border-blue-100'}`}>
                    <div className={`mt-1 p-2 rounded-lg ${notif.type === 'claim' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                      <Bell size={16} />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-gray-900 text-sm">{notif.title}</h4>
                      <p className="text-gray-600 text-sm mt-1">{notif.message}</p>
                      <p className="text-[10px] text-gray-400 mt-2 font-medium uppercase tracking-wider">{new Date(notif.createdAt).toLocaleString()}</p>
                    </div>
                    {!notif.read && (
                      <button 
                        onClick={async () => {
                          await api.put(`/notifications/${notif._id}/read`);
                          fetchData();
                        }}
                        className="text-[10px] font-bold text-blue-600 hover:underline"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
