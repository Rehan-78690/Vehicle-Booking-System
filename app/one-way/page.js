'use client';

import OneWayForm from '@/components/OneWayForm';
import FormLayout from '@/components/FormLayout';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
export default function Page() {
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
    <FormLayout>
      <div>
        <OneWayForm onSubmit={handleFormSubmit} />
      </div>
    </FormLayout>
  );
}
