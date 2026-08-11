'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, UploadCloud, X, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function ReportPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string>('');
  const [submitError, setSubmitError] = useState<string>('');
  const [formData, setFormData] = useState({
    type: 'lost',
    name: '',
    category: 'Electronics',
    description: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    reward: '',
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError('');
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    if (images.length + fileArray.length > 5) {
      setImageError('You can upload a maximum of 5 images per item.');
      return;
    }

    for (const file of fileArray) {
      if (file.size > 5 * 1024 * 1024) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        setImageError(`The photo "${file.name}" is ${sizeMB} MB. Maximum allowed size is 5 MB. Please select an image under 5 MB.`);
        return;
      }
    }

    fileArray.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = document.createElement('img');
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setImages(prev => [...prev, compressedDataUrl]);
        };
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError('');
    try {
      await api.post('/items', { ...formData, images });
      router.push('/items');
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      setSubmitError(
        errorObj.response?.data?.message ||
        errorObj.message ||
        'Failed to post report. Please check your inputs or image sizes.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const categories = ['Electronics', 'Documents', 'Clothing', 'Books', 'Jewelry & Accessories', 'Other'];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-8 py-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles size={14} className="text-yellow-300" />
              <span>Smart Community Matching</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-2">Report an Item</h1>
            <p className="text-blue-100 text-sm max-w-lg">Provide key details and photos to help reconnect lost belongings quickly.</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl flex items-center space-x-3 text-sm font-semibold">
              <AlertTriangle className="shrink-0 text-red-500" size={20} />
              <span>{submitError}</span>
            </div>
          )}

          {/* Lost vs Found Switcher */}
          <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/50">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'lost' })}
              className={`py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center space-x-2 ${
                formData.type === 'lost' 
                  ? 'bg-white text-blue-600 shadow-md shadow-blue-500/10 scale-[1.02]' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Lost Something</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'found' })}
              className={`py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center space-x-2 ${
                formData.type === 'found' 
                  ? 'bg-white text-emerald-600 shadow-md shadow-emerald-500/10 scale-[1.02]' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Found Something</span>
            </button>
          </div>

          {/* Form Controls */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Item Title</label>
              <input
                name="name"
                type="text"
                required
                placeholder="e.g. Blue Backpack, Apple AirPods, Student ID Card"
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800"
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                <select
                  name="category"
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800"
                  onChange={handleChange}
                  value={formData.category}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Date</label>
                <input
                  name="date"
                  type="date"
                  required
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800"
                  onChange={handleChange}
                  value={formData.date}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Campus Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  name="location"
                  type="text"
                  required
                  placeholder="e.g. Science Library 2nd Floor, Main Cafeteria, Student Center"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Detailed Description</label>
              <textarea
                name="description"
                required
                rows={4}
                placeholder="Mention distinctive marks, color, brand, or unique features..."
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800"
                onChange={handleChange}
              ></textarea>
            </div>

            {/* Photo Upload Dropzone */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Item Photos (Recommended)</label>
              <div className={`border-2 border-dashed rounded-2xl p-6 transition-all text-center relative cursor-pointer ${
                imageError ? 'border-amber-400 bg-amber-50/30' : 'border-slate-200 hover:border-blue-500 bg-slate-50/50 hover:bg-blue-50/20'
              }`}>
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  onChange={handleImageChange} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-3">
                    <UploadCloud size={24} />
                  </div>
                  <p className="text-sm font-bold text-slate-800 mb-1">Click or drag photos to upload</p>
                  <p className="text-xs text-slate-400 font-medium">PNG, JPG, WEBP — <span className="font-bold text-blue-600">Max 5 MB per photo</span> (Up to 5 photos)</p>
                </div>
              </div>

              {/* High-Quality 5MB Warning Box */}
              {imageError && (
                <div className="mt-3 p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl flex items-start space-x-3 text-amber-900 shadow-sm">
                  <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={20} />
                  <div>
                    <h4 className="text-sm font-bold text-amber-900">Photo Exceeds 5 MB Limit</h4>
                    <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">{imageError}</p>
                  </div>
                </div>
              )}

              {/* Uploaded Thumbnails Preview */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                      <Image 
                        src={img} 
                        alt={`Upload preview ${index + 1}`} 
                        fill 
                        className="object-cover" 
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-black/60 hover:bg-red-600 text-white p-1 rounded-full backdrop-blur-sm transition-all"
                        aria-label="Remove photo"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {formData.type === 'lost' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Reward Offered (Optional)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input
                    name="reward"
                    type="number"
                    placeholder="e.g. 500"
                    className="w-full pl-9 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800"
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-xl shadow-blue-500/25 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : (
              <>
                <CheckCircle2 size={20} />
                <span>Submit Report</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
