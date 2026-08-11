'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bell, User, Menu, X, PlusCircle, LogOut, ShieldCheck, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Lost Items', href: '/items?type=lost' },
    { name: 'Found Items', href: '/items?type=found' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/75 backdrop-blur-xl border-b border-slate-200/60 shadow-lg shadow-slate-900/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
                <Sparkles size={20} className="text-yellow-300" />
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-900">
                Campus<span className="gradient-text">Found</span>
              </span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-1 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/60">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-5 py-2 rounded-full text-xs font-bold text-slate-600 hover:text-blue-600 hover:bg-white transition-all shadow-none hover:shadow-sm"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Icons/CTA */}
          <div className="hidden md:flex items-center space-x-3">
            {user?.role === 'admin' && (
              <Link
                href="/admin"
                className="bg-slate-900 text-white px-4 py-2 rounded-full font-bold text-xs hover:bg-slate-800 transition-all flex items-center space-x-1.5 border border-slate-700 shadow-md"
              >
                <ShieldCheck size={16} className="text-blue-400" />
                <span>Admin Portal</span>
              </Link>
            )}

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/report"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-full font-bold text-xs hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md shadow-blue-500/20 flex items-center space-x-2"
              >
                <PlusCircle size={16} />
                <span>Report Item</span>
              </Link>
            </motion.div>
            
            {user ? (
              <div className="flex items-center space-x-2 border-l border-slate-200 pl-3 ml-1">
                <button className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-colors relative">
                  <Bell size={18} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                </button>

                <Link
                  href="/dashboard"
                  className="p-2 bg-slate-100 hover:bg-blue-50 border border-slate-200 rounded-full hover:border-blue-500 transition-all"
                  title="Dashboard"
                >
                  <User size={18} className="text-slate-700 hover:text-blue-600" />
                </Link>

                <button 
                  onClick={logout}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 border-l border-slate-200 pl-3">
                <Link
                  href="/login"
                  className="text-slate-700 hover:text-blue-600 font-bold text-xs px-4 py-2 rounded-full hover:bg-slate-100 transition-all"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="bg-slate-900 text-white px-5 py-2 rounded-full font-bold text-xs hover:bg-slate-800 transition-all shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 text-slate-700 hover:bg-slate-100 rounded-2xl transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white/95 backdrop-blur-2xl border-b border-slate-200/80 shadow-2xl overflow-hidden"
          >
            <div className="px-6 pt-4 pb-8 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-base font-bold text-slate-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-2xl transition-all"
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-slate-100 flex flex-col space-y-3">
                <Link
                  href="/report"
                  onClick={() => setIsOpen(false)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3.5 rounded-2xl font-bold text-center text-sm shadow-md"
                >
                  Report Item
                </Link>

                {user ? (
                  <>
                    {user?.role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setIsOpen(false)}
                        className="bg-slate-900 text-white px-4 py-3.5 rounded-2xl font-bold text-center text-sm flex items-center justify-center space-x-2 border border-slate-800"
                      >
                        <ShieldCheck size={18} className="text-blue-400" />
                        <span>Admin Portal</span>
                      </Link>
                    )}
                    <Link
                      href="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="border border-slate-200 text-slate-700 px-4 py-3.5 rounded-2xl font-bold text-center text-sm"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="text-red-600 font-bold py-2 text-center text-sm"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="border border-slate-200 text-slate-700 font-bold py-3.5 rounded-2xl text-center text-sm"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsOpen(false)}
                      className="bg-slate-900 text-white font-bold py-3.5 rounded-2xl text-center text-sm shadow-md"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
