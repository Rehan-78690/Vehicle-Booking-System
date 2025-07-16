// app/one-way/page.js
'use client';

import { useRouter } from 'next/navigation';
import OneWayForm from '@/components/OneWayForm';
import FormLayout from '@/components/FormLayout';
export default function Page() {
  const router = useRouter();

  const handleSubmit = (formData) => {
    console.log('Form data:', formData);
    // Here you would call your API
    router.push('/confirmation');
  };

  return (
<FormLayout>
    {/* <div className="min-h-screen bg-gray-50 py-8 px-4"> */}
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* <div className="bg-[#27368c] p-6 text-white">
          <h1 className="text-2xl font-bold">One-Way Transfer</h1>
        </div> */}
        <OneWayForm onSubmit={handleSubmit} />
      </div>
    {/* </div> */}
  </FormLayout>);
}