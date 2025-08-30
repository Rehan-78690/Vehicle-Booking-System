// app/intercity-transfer/page.js
'use client';

import IntercityTransferForm from '@/components/IntercityTransferForm';
import FormLayout from '@/components/FormLayout';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Page() {
  const router = useRouter();
  const [quoteResult, setQuoteResult] = useState(null);

  const handleFormSubmit = async (formData) => {
    try {
      if (!formData.vehicleType || !formData.distance || !formData.hours) {
        alert('Please select a vehicle, enter a distance, and specify the number of hours');
        return;
      }

      const priceResponse = await fetch('/api/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'calculate',
          useCase: 'day-excursion-disposal',
          distance: parseFloat(formData.distance),
          bookingDays: formData.date ? Math.ceil((new Date(formData.date) - new Date()) / (1000 * 60 * 60 * 24)) : 0,
          hours: parseInt(formData.hours),
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
          use_case_type: 'day-excursion-disposal',
          form_data: formData,
          calculation_result: priceResult,
          price: parseFloat(priceResult.totalPrice.totalPrice),
          vehicleType: formData.vehicleType,
          distance: parseFloat(formData.distance),
          hours: parseInt(formData.hours),
          bookingDays: formData.date ? Math.ceil((new Date(formData.date) - new Date()) / (1000 * 60 * 60 * 24)) : 0,
        }),
      });

      const savedQuote = await saveResponse.json();
      if (!saveResponse.ok) throw new Error('Failed to save quote');

      router.push(
        `/quote-confirmation?vehicle=${encodeURIComponent(formData.vehicleType)}&price=${priceResult.totalPrice}&calculation_type=day-excursion-disposal&distance_km=${formData.distance}&hours=${formData.hours}&quoteId=${savedQuote.id}`
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
        <IntercityTransferForm
          onSubmit={handleFormSubmit}
          onPriceCalculated={handlePriceCalculated}
        />
        {quoteResult && <p className="text-center mt-4 text-lg font-medium">Preview Price: €{quoteResult.toFixed(2)}</p>}
      </div>
    </FormLayout>
  );
}