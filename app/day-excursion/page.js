// app/day-excursion/page.js
'use client';

import { useRouter } from 'next/navigation';
import DayExcursionForm from '@/components/DayExcursionForm';

export default function Page() {
  const router = useRouter();

  const handleSubmit = (formData) => {
    console.log('Form data:', formData);
    // Here you would call your API to submit the form data
    // For example:
    // await fetch('/api/day-excursion', {
    //   method: 'POST',
    //   body: JSON.stringify(formData)
    // });
    
    // Then navigate to confirmation page
    router.push('/confirmation');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <DayExcursionForm onSubmit={handleSubmit} />
    </div>
  );
}