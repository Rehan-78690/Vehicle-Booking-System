'use client';

import OneWayForm from '@/components/OneWayForm';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OneWayPage() {
  const router = useRouter();

  const [quoteResult, setQuoteResult] = useState(null);

  const handleFormSubmit = async (formData) => {
  try {
    // ✅ Read routeType from formData
    const mapped = {
      ...formData,
      
      pickup_location:
        formData.routeType === 'predefined'
          ? formData.pickupPoint
          : formData.customPickup,
      dropoff_location:
        formData.routeType === 'predefined'
          ? formData.dropoffPoint
          : formData.customDropoff,
      distance: 10
    };

    const res = await fetch('/api/quotes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        use_case_type: 'one_way',
        form_data: mapped
      })
    });

    const data = await res.json();

  if (!res.ok) {
        console.error('Error getting quote:', data.error);
        alert(data.error || 'Something went wrong');
        return;
      }

      // Redirect to quote-result page with query parameters
     router.push(
  `/quote-confirmation?vehicle=${encodeURIComponent(data.vehicle)}&price=${data.price.total_price}&calculation_type=${encodeURIComponent(data.price.calculation_type)}&distance_km=${data.price.distance_km || 0}`
);
    } catch (err) {
      console.error('API error:', err);
      alert('Failed to get quote');
    }
  };




  return (
    <div>
      <OneWayForm onSubmit={handleFormSubmit} />

      {/* {quoteResult && quoteResult.price && (
  <div className="max-w-xl mx-auto mt-6 bg-green-100 border border-green-300 rounded p-4">
    <h2 className="text-lg font-bold text-green-800">Quote Summary</h2>
    <p className="mt-2 text-green-700">
      Estimated Price: <strong>${quoteResult.price.total_price?.toFixed(2) || 'N/A'}</strong>
    </p>
    <p className="text-green-700">Vehicle: {quoteResult.vehicle || 'N/A'}</p>
  </div>
)} */}
    </div>
  );
}
