import React from 'react';
import Link from 'next/link';
import { GitHub, Twitter, Instagram, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="text-2xl font-bold text-blue-600 mb-6 block">
              Campus<span className="text-gray-900">Found</span>
            </Link>
            <p className="text-gray-600 leading-relaxed">
              Making it easier for students to reconnect with their lost belongings through a smart, community-driven platform.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-gray-900 mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link href="/items?type=lost" className="text-gray-600 hover:text-blue-600 transition-colors">Lost Items</Link></li>
              <li><Link href="/items?type=found" className="text-gray-600 hover:text-blue-600 transition-colors">Found Items</Link></li>
              <li><Link href="/report" className="text-gray-600 hover:text-blue-600 transition-colors">Report an Item</Link></li>
              <li><Link href="/how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">How It Works</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-gray-900 mb-6">Support</h3>
            <ul className="space-y-4">
              <li><Link href="/faq" className="text-gray-600 hover:text-blue-600 transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact Us</Link></li>
              <li><Link href="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-600 hover:text-blue-600 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-gray-900 mb-6">Connect With Us</h3>
            <div className="flex space-x-5 mb-6">
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors"><Github size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors"><Twitter size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors"><Mail size={20} /></a>
            </div>
            <p className="text-sm text-gray-500">
              Email: support@campusfound.com
            </p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Campus Lost & Found. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span>Built with ❤️ for Students</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
