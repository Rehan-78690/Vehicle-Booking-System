'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: '/icons/dashboard.png' },
  { name: 'Vehicles', href: '/admin/vehicles', icon: '/icons/vehicles.png' },
  { name: 'Pricing', href: '/admin/pricing', icon: '/icons/price.png' },
  { name: 'Quotes', href: '/admin/quotes', icon: '/icons/quotes.png' },
  { name: 'Settings', href: '/admin/settings', icon: '/icons/settings.png' },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
      <div className="min-h-screen flex">
        {/* Sidebar (Desktop) */}
        <div className="hidden lg:flex lg:flex-col lg:w-64 bg-white shadow-lg z-10">
          <div className="flex items-center justify-center h-16 px-4 bg-[#27368c]">
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          </div>
          <nav className="mt-8 flex-1 overflow-y-auto">
            <div className="px-4 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                            isActive
                                ? 'bg-[#27368c] text-white'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                    >
                      <Image
                          src={item.icon}
                          alt={item.name}
                          width={20}
                          height={20}
                          className="mr-3"
                      />
                      {item.name}
                    </Link>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
            <div
                className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
                onClick={() => setSidebarOpen(false)}
            />
        )}

        {/* Sidebar (Mobile) */}
        <div
            className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
          <div className="flex items-center justify-between h-16 px-4 bg-[#27368c]">
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            <button onClick={() => setSidebarOpen(false)} className="text-white text-2xl">
              ×
            </button>
          </div>
          <nav className="mt-8">
            <div className="px-4 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                            isActive
                                ? 'bg-[#27368c] text-white'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                    >
                      <Image
                          src={item.icon}
                          alt={item.name}
                          width={20}
                          height={20}
                          className="mr-3"
                      />
                      {item.name}
                    </Link>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Main Content Area with Gradient */}
        <div className="flex-1 flex flex-col min-w-0 bg-gradient-to-br from-[#27368c] to-[#b82025] text-white">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200 text-gray-800">
            <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              {/* Mobile Toggle */}
              <button
                  type="button"
                  className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                  onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Header Content */}
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">Transport Quotation Admin</div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-[#27368c] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">A</span>
                  </div>
                  <span className="text-sm font-medium text-gray-800">Admin</span>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="bg-white text-gray-900 rounded-xl shadow-xl p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
  );
}