'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

export default function QuoteConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Extract query parameters
  const vehicle = searchParams.get('vehicle');
  const totalPrice = parseFloat(searchParams.get('price'));
  const calculationType = searchParams.get('calculation_type');
  const distanceKm = parseFloat(searchParams.get('distance_km'));

  return (
    <Suspense fallback={<div className="text-center text-gray-600">Loading...</div>}>
      <div className="max-w-xl mx-auto mt-6 p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Quote Confirmation</h2>
        <div className="bg-green-100 border border-green-300 rounded p-4">
          <p className="text-green-700 mb-2">
            <strong>Vehicle:</strong> {vehicle || 'N/A'}
          </p>
          <p className="text-green-700 mb-2">
            <strong>Estimated Price:</strong> €{totalPrice ? totalPrice.toFixed(2) : 'N/A'}
          </p>
          <p className="text-green-700 mb-2">
            <strong>Calculation Type:</strong> {calculationType || 'N/A'}
          </p>
          {distanceKm > 0 && (
            <p className="text-green-700 mb-2">
              <strong>Distance:</strong> {distanceKm} km
            </p>
          )}
        </div>
        <button
          onClick={() => router.push('/one-way')}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Back to Form
        </button>
      </div>
    </Suspense>
  );
}