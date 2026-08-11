import React from 'react';
import Link from 'next/link';
import { Search, ShieldCheck, RefreshCw, ArrowRight } from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      icon: Search,
      title: "1. Report or Search",
      description: "Post details about an item you lost or found on campus, or search existing posts using filters."
    },
    {
      icon: ShieldCheck,
      title: "2. Verify Ownership",
      description: "Submit proof of ownership with specific descriptions or photos for admin and finder verification."
    },
    {
      icon: RefreshCw,
      title: "3. Reconnect & Return",
      description: "Once verified, connect safely with the poster to retrieve your item."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">How CampusFound Works</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          A simple, secure, and community-driven process to return lost belongings to their rightful owners.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {steps.map((step, idx) => (
          <div key={idx} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <step.icon size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
            <p className="text-gray-600 leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-blue-600 text-white rounded-3xl p-10 text-center shadow-xl">
        <h2 className="text-3xl font-extrabold mb-4">Ready to find your item?</h2>
        <p className="text-blue-100 mb-8 max-w-xl mx-auto">Report a lost or found item today and let our smart matching system help you.</p>
        <div className="flex justify-center gap-4">
          <Link href="/report" className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all inline-flex items-center">
            Report Item <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}
