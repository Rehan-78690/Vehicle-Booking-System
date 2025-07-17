// app/day-excursion/page.js
'use client';

import { useRouter } from 'next/navigation';
import DayExcursionForm from '@/components/DayExcursionForm';

export default function Page() {
  const router = useRouter();

  const handleSubmit = async (formData) => {
    try {
      // Send to API route
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          use_case_type: 'day-excursion',
          form_data: formData
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        router.push(`/quote-confirmation`);
      } else {
        console.error('Quote creation failed:', result.error);
        alert('Failed to create quote. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <DayExcursionForm onSubmit={handleSubmit} />
    </div>
  );
}