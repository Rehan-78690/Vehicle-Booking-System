// app/quotation/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormLayout from '@/components/FormLayout';
export default function QuotationPage() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedOption) return;
    router.push(`/${selectedOption}`);
  };

  return (
  <FormLayout>
    <div className=" bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-[#27368c] p-6 text-white">
          <h1 className="text-2xl font-bold uppercase tracking-wider">TRANSPORT</h1>
          <h2 className="text-xl font-semibold mt-1">QUOTATION FORM</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Select Service Type</h3>
            <div className="space-y-4">
              {[
                { value: 'one-way', label: 'One-Way Transfer' },
                { value: 'hourly-disposal', label: 'Disposal within the City' },
                { value: 'multi-day', label: 'Multi-Day Tours' },
                { value: 'day-excursion', label: 'Day Excursions' },
                { value: 'day-excursion-disposal', label: 'Day Excursions + Disposal' }
              ].map((option) => (
                <div key={option.value} className="flex items-start">
                  <input
                    id={option.value}
                    name="service-type"
                    type="radio"
                    value={option.value}
                    checked={selectedOption === option.value}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    className="mt-1 focus:ring-[#b82025] h-4 w-4 text-[#b82025] border-gray-300"
                  />
                  <label htmlFor={option.value} className="ml-3 block text-sm font-medium text-gray-700">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <button
            type="submit"
            disabled={!selectedOption}
            className={`w-full py-2 px-4 rounded-md text-white ${selectedOption ? 'bg-[#b82025] hover:bg-[#9a1a1f]' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
    </FormLayout>);
}