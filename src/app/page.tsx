'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, ShieldCheck, Zap, Camera, Search, ArrowRight, Sparkles, CheckCircle, Users } from 'lucide-react';

export default function Home() {
  const stats = [
    { label: 'Items Reconnected', value: '1,250+', icon: CheckCircle, color: 'text-emerald-500 bg-emerald-50 border-emerald-100' },
    { label: 'Campus Community', value: '5,000+', icon: Users, color: 'text-blue-500 bg-blue-50 border-blue-100' },
    { label: 'Verified Recovery', value: '98.6%', icon: ShieldCheck, color: 'text-indigo-500 bg-indigo-50 border-indigo-100' },
    { label: 'Campus Locations', value: '25+', icon: MapPin, color: 'text-purple-500 bg-purple-50 border-purple-100' },
  ];

  const features = [
    {
      icon: Zap,
      title: 'Smart Instant Matching',
      description: 'Advanced keyword and location matching helps pair lost item listings with found reports in real-time.',
      badge: 'Real-time',
      color: 'bg-amber-50 text-amber-600 border-amber-100'
    },
    {
      icon: Camera,
      title: 'Photo Verification',
      description: 'Upload high-resolution item photos to ensure exact visual matching and prevent false claims.',
      badge: 'Visual AI',
      color: 'bg-blue-50 text-blue-600 border-blue-100'
    },
    {
      icon: ShieldCheck,
      title: 'Admin Verified Claims',
      description: 'Rigorous ownership proof checking ensures lost belongings return exclusively to their rightful owners.',
      badge: 'Secure',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100'
    },
    {
      icon: MapPin,
      title: 'Location Pinpointing',
      description: 'Filter items by specific campus libraries, cafeterias, labs, and student centers to locate items fast.',
      badge: 'Campus Map',
      color: 'bg-purple-50 text-purple-600 border-purple-100'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' as const },
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Animated Background Mesh Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none -z-10">
          <motion.div 
            animate={{ 
              scale: [1, 1.15, 1],
              x: [0, 20, 0],
              y: [0, -20, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-12 left-1/4 w-96 h-96 bg-blue-400/25 rounded-full blur-3xl"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, -25, 0],
              y: [0, 25, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-24 right-1/4 w-96 h-96 bg-indigo-400/25 rounded-full blur-3xl"
          />
          <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-purple-400/15 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Pill Badge with Floating Motion */}
            <motion.div 
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-blue-200/60 shadow-md shadow-blue-500/5 mb-8"
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles size={16} className="text-blue-600" />
              </motion.div>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">The Official Campus Lost & Found Platform</span>
            </motion.div>

            {/* Animated Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6"
            >
              Lost Something on Campus? <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                We&apos;ll Help You Find It.
              </span>
            </motion.h1>

            {/* Animated Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal"
            >
              A smart, community-driven network where students and faculty report lost or found items with photo verification and admin security.
            </motion.p>

            {/* Interactive CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto"
            >
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link
                  href="/report?type=lost"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 flex items-center justify-center space-x-2 group cursor-pointer"
                >
                  <span>Report Lost Item</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link
                  href="/items"
                  className="bg-white/90 backdrop-blur-md text-slate-900 border-2 border-slate-200 px-8 py-4 rounded-2xl font-bold text-lg hover:border-blue-600 hover:text-blue-600 transition-all flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
                >
                  <Search size={18} />
                  <span>Browse Items</span>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section with Staggered Entrance */}
      <section className="py-12 bg-white border-y border-slate-200/60 shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8"
          >
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx} 
                variants={itemVariants}
                whileHover={{ y: -4, scale: 1.02 }}
                className="flex items-center space-x-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-100 shadow-sm hover:shadow-md transition-all"
              >
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${stat.color}`}>
                  <stat.icon size={22} />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</h4>
                  <p className="text-xs font-semibold text-slate-500">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Grid with Hover Elevation */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Designed for Campus Life</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Why Students Trust CampusFound</p>
            <p className="text-slate-600">Built from the ground up to solve campus lost-and-found issues with speed, transparency, and safety.</p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="bg-white p-8 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center ${feature.color}`}>
                      <feature.icon size={26} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                      {feature.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">{feature.description}</p>
                </div>

                <Link href="/items" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1 group">
                  <span>Explore items</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-10 lg:p-16 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-800"
        >
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 max-w-xl text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">Found something lying around?</h2>
            <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
              Be a helpful student! Post a quick found report with a photo to help the owner reclaim their item.
            </p>
          </div>
          <div className="relative z-10 shrink-0">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/report?type=found"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-base transition-all shadow-lg shadow-emerald-500/25 inline-flex items-center space-x-2 cursor-pointer"
              >
                <span>Post Found Item</span>
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
