// components/FormLayout.js
'use client';

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

export default function FormLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Head>
        <title>Transport Quotation System</title>
        <meta name="description" content="Professional transport services" />
      </Head>

      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 overflow-hidden opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#27368c] to-[#b82025]"></div>
        <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-repeat opacity-20"></div>
      </div>

      {/* Header with Logo */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto  flex items-center">
          <Link href="/" className="flex items-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 relative">

              <Image 
                src="/Logo.png" 
                alt="Company Logo" 
                fill 
                className="object-contain"
                priority
              />
            </div>
            <span className="ml-3 text-xl font-bold text-[#27368c]">TRANSPORT SERVICES</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#27368c] text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm">© {new Date().getFullYear()} Transport Services. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <Link href="/terms" className="text-sm hover:text-[#b82025] transition">Terms of Service</Link>
              <Link href="/privacy" className="text-sm hover:text-[#b82025] transition">Privacy Policy</Link>
              <Link href="/contact" className="text-sm hover:text-[#b82025] transition">Contact Us</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}