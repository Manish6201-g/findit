'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Sparkles, ArrowRight, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetData, setResetData] = useState<{ message: string; resetUrl?: string; resetToken?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setResetData(data);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      setError(
        errorObj.response?.data?.message ||
        errorObj.message ||
        'Failed to request password reset. Please check your email address.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-full pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white/90 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-200/80"
      >
        {/* Back link */}
        <Link href="/login" className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-blue-600 mb-6 transition-colors">
          <ArrowLeft size={16} className="mr-1.5" />
          Back to Sign in
        </Link>

        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 group mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-md shadow-blue-500/25">
              <Sparkles size={20} className="text-yellow-300" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              Campus<span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Found</span>
            </span>
          </div>

          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Forgot Password?
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
            Enter your student email and we&apos;ll generate a password reset link for you.
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-semibold flex items-start space-x-3"
            role="alert"
          >
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Success Banner */}
        {resetData ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4"
          >
            <CheckCircle2 size={48} className="mx-auto text-emerald-500 animate-bounce" />
            <div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Reset Link Generated!</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                A password reset token has been issued for <span className="font-bold text-slate-800">{email}</span>.
              </p>
            </div>

            {resetData.resetToken && (
              <div className="pt-2">
                <Link
                  href={`/reset-password?token=${resetData.resetToken}`}
                  className="block w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-md"
                >
                  Proceed to Reset Password Now
                </Link>
              </div>
            )}
          </motion.div>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Student Email Address</label>
              <div className="relative flex items-center">
                <Mail size={18} className="absolute left-4 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:bg-white focus:border-blue-500 transition-all"
                  placeholder="student@campus.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-2xl shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
