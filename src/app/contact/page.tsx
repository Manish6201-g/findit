import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-gray-600">Have questions, feedback, or need help with a claim?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center">
          <Mail className="mx-auto text-blue-600 mb-4" size={32} />
          <h3 className="font-bold text-gray-900 mb-1">Email Support</h3>
          <p className="text-sm text-gray-500">support@campusfound.com</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center">
          <MapPin className="mx-auto text-blue-600 mb-4" size={32} />
          <h3 className="font-bold text-gray-900 mb-1">Office Location</h3>
          <p className="text-sm text-gray-500">Student Center, Room 204</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center">
          <Phone className="mx-auto text-blue-600 mb-4" size={32} />
          <h3 className="font-bold text-gray-900 mb-1">Helpline</h3>
          <p className="text-sm text-gray-500">+1 (800) 555-0199</p>
        </div>
      </div>
    </div>
  );
}
