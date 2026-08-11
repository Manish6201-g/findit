'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Globe, Share2, Sparkles, Send, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800/80 relative overflow-hidden mt-20">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-6 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-md shadow-blue-500/25">
                <Sparkles size={20} className="text-yellow-300" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Campus<span className="gradient-text">Found</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Empowering students to quickly reconnect with lost belongings through smart photo matching and admin-verified claims.
            </p>
            <div className="flex space-x-3">
              <a href="#" aria-label="Website" className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-500 transition-all">
                <Globe size={18} />
              </a>
              <a href="#" aria-label="Share" className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-500 transition-all">
                <Share2 size={18} />
              </a>
              <a href="#" aria-label="Email" className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-500 transition-all">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-widest mb-6">Explore</h3>
            <ul className="space-y-3.5 text-sm">
              <li><Link href="/items?type=lost" className="text-slate-400 hover:text-blue-400 transition-colors">Lost Item Directory</Link></li>
              <li><Link href="/items?type=found" className="text-slate-400 hover:text-blue-400 transition-colors">Found Item Postings</Link></li>
              <li><Link href="/report" className="text-slate-400 hover:text-blue-400 transition-colors">Post New Report</Link></li>
              <li><Link href="/how-it-works" className="text-slate-400 hover:text-blue-400 transition-colors">Platform Guide</Link></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-widest mb-6">Support & Legal</h3>
            <ul className="space-y-3.5 text-sm">
              <li><Link href="/faq" className="text-slate-400 hover:text-blue-400 transition-colors">Frequently Asked Questions</Link></li>
              <li><Link href="/contact" className="text-slate-400 hover:text-blue-400 transition-colors">Contact Campus Support</Link></li>
              <li><Link href="/privacy" className="text-slate-400 hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-slate-400 hover:text-blue-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Campus Newsletter */}
          <div>
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-widest mb-6">Campus Alerts</h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">Get notified when new items matching your category are reported.</p>
            <form onSubmit={(e) => e.preventDefault()} className="relative">
              <input
                type="email"
                placeholder="Enter your student email..."
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all pr-12"
              />
              <button 
                type="submit" 
                className="absolute right-1.5 top-1.5 p-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all"
                aria-label="Subscribe"
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Campus Lost & Found. Built with security & privacy for students.</p>
          <div className="flex items-center space-x-1 text-slate-400">
            <span>Crafted with</span>
            <Heart size={14} className="text-red-500 fill-red-500 inline mx-0.5" />
            <span>for Campus Communities</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
