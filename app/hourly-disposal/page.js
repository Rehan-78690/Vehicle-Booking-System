// Disposal form
// app/hourly-disposal/page.js
'use client';

import { useRouter } from 'next/navigation';
import HourlyDisposalForm from '@/components/HourlyDisposalForm';
import FormLayout from '@/components/FormLayout';
export default function Page() {
  const router = useRouter();

  const handleSubmit = (formData) => {
    console.log('Form data:', formData);
    // Here you would call your API
    router.push('/confirmation');
  };

  //  <HourlyDisposalForm onSubmit={handleSubmit} />
     
     return(
     <FormLayout>
       <HourlyDisposalForm onSubmit={handleSubmit} />
     </FormLayout>

  );
}