import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Terms of Service</h1>
      <div className="bg-white p-8 rounded-3xl border border-gray-100 space-y-6 text-gray-600 leading-relaxed">
        <p>By accessing or using CampusFound, you agree to comply with our campus code of conduct.</p>
        <h2 className="text-xl font-bold text-gray-900">User Conduct</h2>
        <p>Users must submit accurate information regarding lost and found items and refrain from fraudulent claims.</p>
        <h2 className="text-xl font-bold text-gray-900">Liability</h2>
        <p>CampusFound acts as a matching facilitator and is not liable for items unrecovered or lost in transit.</p>
      </div>
    </div>
  );
}
