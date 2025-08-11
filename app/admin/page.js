'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminDashboard() {
  const [quotes, setQuotes] = useState([]);
const [pricing, setPricing] = useState([]);
 const [stats, setStats] = useState({
  totalQuotes: 0,
  totalVehicles: 0,
  todayQuotes: 0,
  revenue: 0
});

  const [loading, setLoading] = useState(true);
useEffect(() => {
  
  const fetchDashboardData = async () => {
    try {
      const quotesRes = await fetch('/api/quotes');
      if (!quotesRes.ok) throw new Error('Failed to fetch quotes');
      const quotesData = await quotesRes.json();

      const enrichedQuotes = quotesData
       .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map((quote, index) => {
          const form = JSON.parse(quote.formData || '{}');
          return {
            ...quote,
  
            route: `${form.pickup_location || '—'} to ${form.dropoff_location || '—'}`,
            status: quote.status || 'Pending',
          };
        })
        .slice(-3) // latest 3
        .reverse();

      const pricingRes = await fetch('/api/pricing');
      if (!pricingRes.ok) throw new Error('Failed to fetch pricing');
      const pricingData = await pricingRes.json();

      setStats(prev => ({
        ...prev,
        totalQuotes: quotesData.length || 0,
        todayQuotes: quotesData.filter(q => new Date(q.createdAt).toDateString() === new Date().toDateString()).length,
        revenue: quotesData.reduce((acc, q) => acc + (q.price || 0), 0)
      }));

      setQuotes(enrichedQuotes);
      setPricing(pricingData);
    } catch (err) {
      console.error('Dashboard API fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchDashboardData();
}, []);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await fetch('/api/vehicles');
        if (!res.ok) throw new Error('Failed to fetch vehicles');
        const vehicles = await res.json();
        setStats(prev => ({
          ...prev,
          totalVehicles: vehicles.length || 0
        }));
      } catch (err) {
        console.error('Vehicle fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const quickActions = [
    { name: 'Add Vehicle', href: '/admin/vehicles/add', icon: '/icons/vehicles.png', color: 'bg-blue-100' },
    { name: 'View Quotes', href: '/admin/quotes', icon: '/icons/quotes.png', color: 'bg-green-100' },
    { name: 'Update Pricing', href: '/admin/pricing', icon: '/icons/price.png', color: 'bg-yellow-100' },
    { name: 'Settings', href: '/admin/settings', icon: '/icons/settings.png', color: 'bg-purple-100' },
  ];

  const statIcons = [
    { icon: '/icons/quotes.png', bg: 'bg-blue-100', text: 'text-blue-600', label: 'Total Quotes', value: stats.totalQuotes },
    { icon: '/icons/vehicles.png', bg: 'bg-green-100', text: 'text-green-600', label: 'Total Vehicles', value: stats.totalVehicles },
    { icon: '/icons/calendar.png', bg: 'bg-yellow-100', text: 'text-yellow-600', label: "Today's Quotes", value: stats.todayQuotes },
    { icon: '/icons/price.png', bg: 'bg-purple-100', text: 'text-purple-600', label: 'Total Revenue', value: `₹${stats.revenue.toLocaleString()}` },
  ];

 
   {quotes.map((quote) => (
  <tr key={quote.id}>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
      {quote.id || 'Unknown'}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {quote.route || `${quote.pickup} to ${quote.dropoff}`}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
      ₹{quote.amount?.toLocaleString() || quote.price?.toLocaleString() || 0}
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
        quote.status === 'Completed' ? 'bg-green-100 text-green-800' :
        quote.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
        'bg-yellow-100 text-yellow-800'
      }`}>
        {quote.status || 'Pending'}
      </span>
    </td>
  </tr>
))}

 

  return (
      <div className="space-y-6">
        {/* Page Header */}
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome to the Transport Quotation Admin Panel</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statIcons.map((item, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 ${item.bg} rounded-md flex items-center justify-center`}>
                      <Image src={item.icon} alt={item.label} width={20} height={20} />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{item.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                  </div>
                </div>
              </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => (
                <Link
                    key={action.name}
                    href={action.href}
                    className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200"
                >
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                    <Image src={action.icon} alt={action.name} width={34} height={34} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{action.name}</span>
                </Link>
            ))}
          </div>
        </div>

        {/* Recent Quotes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Quotes</h2>
              <Link
                  href="/admin/quotes"
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View all →
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quote ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
              {quotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {quote.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {quote.route}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹₹{(quote.price ?? 0).toLocaleString()}

                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        quote.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            quote.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                    }`}>
                      {quote.status}
                    </span>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
}
