// app/multi-day/page.js
'use client';

import MultiDayForm from '@/components/MultiDayForm';
import FormLayout from '@/components/FormLayout';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Page() {
  const router = useRouter();
  const [quoteResult, setQuoteResult] = useState(null);

  const handleFormSubmit = async (formData) => {
    try {
      if (!formData.vehicleType || !formData.startDate || formData.itinerary.length < 2 || !formData.pickupLocation || !formData.dropoffLocation) {
        alert('Please fill all required fields including vehicle type, start date, itinerary (at least 2 days), pickup, and drop-off locations');
        return;
      }

      const totalDays = formData.itinerary.length;
      const priceResponse = await fetch('/api/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'calculate',
          useCase: 'multi-day',
          bookingDays: totalDays,
          vehicleType: formData.vehicleType,
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
          use_case_type: 'multi-day',
          form_data: formData,
          calculation_result: priceResult,
          price: parseFloat(priceResult.totalPrice.totalPrice),
          vehicleType: formData.vehicleType,
          totalDays: totalDays,
          pickupLocation: formData.pickupLocation,
          dropoffLocation: formData.dropoffLocation,
        }),
      });

      const savedQuote = await saveResponse.json();
      if (!saveResponse.ok) throw new Error('Failed to save quote');

      router.push(
        `/quote-confirmation?vehicle=${encodeURIComponent(formData.vehicleType)}&price=${priceResult.totalPrice}&calculation_type=multi-day&totalDays=${totalDays}&pickupLocation=${encodeURIComponent(formData.pickupLocation)}&dropoffLocation=${encodeURIComponent(formData.dropoffLocation)}&quoteId=${savedQuote.id}`
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
        <MultiDayForm
          onSubmit={handleFormSubmit}
          onPriceCalculated={handlePriceCalculated}
        />
        {quoteResult && <p className="text-center mt-4 text-lg font-medium">Preview Price: €{quoteResult.toFixed(2)}</p>}
      </div>
    </FormLayout>
  );
}