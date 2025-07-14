// Disposal form
// app/hourly-disposal/page.js
'use client';

import { useRouter } from 'next/navigation';
import HourlyDisposalForm from '@/components/HourlyDisposalForm';

export default function Page() {
  const router = useRouter();

  const handleSubmit = (formData) => {
    console.log('Form data:', formData);
    // Here you would call your API
    router.push('/confirmation');
  };

  return <HourlyDisposalForm onSubmit={handleSubmit} />;
}