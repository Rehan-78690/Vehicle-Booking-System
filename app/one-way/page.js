// app/one-way/page.js
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
      const mapped = {
        ...formData,
        pickup_location: formData.routeType === 'predefined' ? formData.pickupPoint : formData.customPickup,
        dropoff_location: formData.routeType === 'predefined' ? formData.dropoffPoint : formData.customDropoff,
        distance: parseFloat(formData.distance) || 0,
      };

      if (!mapped.vehicleType || !mapped.distance) {
        alert('Please select a vehicle and enter a distance');
        return;
      }

      const priceResponse = await fetch('/api/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'calculate',
          useCase: 'one-way',
          distance: mapped.distance,
          bookingDays: mapped.pickupDate ? Math.ceil((new Date(mapped.pickupDate) - new Date()) / (1000 * 60 * 60 * 24)) : 0,
          hours: null,
          vehicleType: mapped.vehicleType,
        }),
      });

      const priceResult = await priceResponse.json();

      if (!priceResponse.ok) {
        console.error('Error getting quote:', priceResult.error);
        alert(priceResult.error || 'Something went wrong');
        return;
      }

      const saveResponse = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          use_case_type: 'one-way',
          form_data: mapped,
          calculation_result: priceResult,
          price: parseFloat(priceResult.totalPrice.totalPrice),
          vehicleType: mapped.vehicleType,
          distance: mapped.distance,
          hours: null,
          bookingDays: mapped.pickupDate ? Math.ceil((new Date(mapped.pickupDate) - new Date()) / (1000 * 60 * 60 * 24)) : 0,
        }),
      });

      const savedQuote = await saveResponse.json();
      if (!saveResponse.ok) throw new Error('Failed to save quote');

      router.push(
        `/quote-confirmation?vehicle=${encodeURIComponent(mapped.vehicleType)}&price=${priceResult.totalPrice}&calculation_type=one-way&distance_km=${mapped.distance}&quoteId=${savedQuote.id}`
      );
    } catch (err) {
      console.error('API error:', err);
      alert('Failed to get or save quote');
    }
  };

  const handlePriceCalculated = (price) => {
    setQuoteResult(price);
  };

  return (
    <FormLayout>
      <div>
        <OneWayForm
          onSubmit={handleFormSubmit}
          onPriceCalculated={handlePriceCalculated}
        />
        {quoteResult && <p className="text-center mt-4 text-lg font-medium">Preview Price: €{quoteResult.toFixed(2)}</p>}
      </div>
    </FormLayout>
  );
}