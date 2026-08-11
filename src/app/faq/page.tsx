import React from 'react';

export default function FAQPage() {
  const faqs = [
    {
      q: "What should I do if I find a lost item on campus?",
      a: "Click 'Report Item' in the navbar, select 'Found Item', fill out the location and details, and upload clear pictures if possible."
    },
    {
      q: "How does the claim process work?",
      a: "When you locate your item, click 'Claim Item' and describe unique attributes (e.g., serial numbers, wallpaper, contents) that prove it belongs to you."
    },
    {
      q: "Is CampusFound free to use for students?",
      a: "Yes! CampusFound is 100% free for all students, faculty, and campus staff."
    },
    {
      q: "What if someone tries to false-claim my item?",
      a: "Claims must be verified through specific proof and descriptions before contact information or physical handover is approved."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Frequently Asked Questions</h1>
        <p className="text-gray-600">Find answers to common questions about reporting, claiming, and safety.</p>
      </div>

      <div className="space-y-6">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.q}</h3>
            <p className="text-gray-600 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
