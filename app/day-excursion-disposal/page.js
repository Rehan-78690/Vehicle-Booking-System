// app/intercity-transfer/page.js
'use client';

import { useRouter } from 'next/navigation';
import IntercityTransferForm from '@/components/IntercityTransferForm';
import FormLayout from '@/components/FormLayout';

export default function Page() {
  const router = useRouter();

  const handleSubmit = (formData) => {
    console.log('Form data:', formData);
    // Here you would call your API
    // Example:
    // await fetch('/api/intercity-transfer', {
    //   method: 'POST',
    //   body: JSON.stringify(formData)
    // });
    router.push('/quote-confirmation');
  };

  return(
  <IntercityTransferForm onSubmit={handleSubmit} />);
 
}