// app/day-excursion/page.js
'use client';

import { useRouter } from 'next/navigation';
import DayExcursionForm from '@/components/DayExcursionForm';

// Define vehicleTypeMap here to ensure it’s available
const vehicleTypeMap = {
  'Standard Sedan': 'sedan',
  'Premium Sedan (Mercedes E-Class/BMW/Audi)': 'sedan',
  'Standard Minivan (8-seater)': 'minivan',
  'Premium Minivan (8-seater Mercedes)': 'minivan',
  'Standard Minivan (9-seater)': 'minivan',
  'Mercedes Minivan (9-seater)': 'minivan',
  'Mercedes Sprinter (9-Seater)': 'van',
  'Mercedes Sprinter (12-Seater)': 'van',
  'Mercedes Sprinter (16-Seater)': 'van',
  'Mercedes Sprinter (19-Seater)': 'van',
  '30-Seater Bus': 'bus',
  '50-Seater Bus': 'bus',
  '54-Seater Bus': 'bus',
  '57-Seater Bus': 'bus',
  '60-Seater Bus': 'bus',
  '77-Seater (Double-Decker)': 'bus',
};

export default function Page() {
  const router = useRouter();

  const handleSubmit = async (formData) => {
    console.log('Received formData in handleSubmit:', formData);
    if (!formData.vehicleType || !formData.distance || !formData.hours) {
      alert('Please fill all required fields (vehicle, distance, hours)');
      return;
    }

    try {
      // Fetch price from /api/pricing
      const priceResponse = await fetch('/api/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'calculate',
          useCase: 'day-excursion',
          distance: parseFloat(formData.distance) || 0,
          bookingDays: formData.date ? Math.ceil((new Date(formData.date) - new Date()) / (1000 * 60 * 60 * 24)) : 0,
          hours: parseInt(formData.hours) || 0,
          vehicleType: vehicleTypeMap[formData.vehicleType] || 'sedan',
        }),
      });

      const priceResult = await priceResponse.json();
      console.log('API Response:', priceResult);

      if (!priceResponse.ok) throw new Error('Failed to calculate price');

      // Save quote with parsed numeric fields
      const saveResponse = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          use_case_type: 'day-excursion',
          form_data: formData,
          calculation_result: priceResult,
          price: parseFloat(priceResult.totalPrice.totalPrice), // Ensure Float
          vehicleType: formData.vehicleType,
          distance: parseFloat(formData.distance), // Ensure Float
          hours: parseInt(formData.hours), // Ensure Int
          bookingDays: formData.date ? Math.ceil((new Date(formData.date) - new Date()) / (1000 * 60 * 60 * 24)) : 0, // Ensure Int
        }),
      });

      const savedQuote = await saveResponse.json();
      if (!saveResponse.ok) throw new Error('Failed to save quote');

      // app/day-excursion/page.js (partial update)
      router.push(
        `/quote-confirmation?vehicle=${encodeURIComponent(formData.vehicleType)}&price=${priceResult.totalPrice}&calculation_type=day-excursion&distance_km=${formData.distance}&quoteId=${savedQuote.id}`
      );
    } catch (error) {
      console.error('Submission error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handlePriceCalculated = (price) => {
    // No action needed unless UI update is required
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <DayExcursionForm onSubmit={handleSubmit} onPriceCalculated={handlePriceCalculated} />
    </div>
  );
}