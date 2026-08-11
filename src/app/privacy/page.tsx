import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Privacy Policy</h1>
      <div className="bg-white p-8 rounded-3xl border border-gray-100 space-y-6 text-gray-600 leading-relaxed">
        <p>At CampusFound, we prioritize the privacy and security of our users.</p>
        <h2 className="text-xl font-bold text-gray-900">Information We Collect</h2>
        <p>We collect basic profile details (name, campus email, roll number) and item reports you voluntarily submit.</p>
        <h2 className="text-xl font-bold text-gray-900">How We Use Information</h2>
        <p>Your details are strictly used to facilitate lost & found item matching, claims, and campus notifications.</p>
      </div>
    </div>
  );
}
