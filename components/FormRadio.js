// components/FormRadio.js
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import FormLayout from './FormLayout';
export default function FormRadio() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedOption) return;
    
    // Navigation based on selection
    const routes = {
      'one-way': '/one-way',
      'city-disposal': '/hourly-disposal',
      'multi-day': '/multi-day',
      'day-excursions': '/day-excursion',
      'day-excursions-disposal': '/day-excursion-disposal'
    };
    
    router.push(routes[selectedOption]);
  };

return (
  <FormLayout>
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-[#27368c] p-6 text-white">
          <h1 className="text-2xl font-bold uppercase tracking-wider">TRANSPORT</h1>
          <h2 className="text-xl font-semibold mt-1">QUOTATION FORM</h2>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Select Service Type</h3>
              <div className="space-y-4">
                {[
                  { id: 'one-way', label: 'One-Way Transfer' },
                  { id: 'city-disposal', label: 'Disposal within the City' },
                  { id: 'multi-day', label: 'Multi-Day Tours' },
                  { id: 'day-excursions', label: 'Day Excursions' },
                  { id: 'day-excursions-disposal', label: 'Day Excursions + Disposal' }
                ].map((option) => (
                  <div key={option.id} className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id={option.id}
                        name="service-type"
                        type="radio"
                        value={option.id}
                        checked={selectedOption === option.id}
                        onChange={handleOptionChange}
                        className="focus:ring-[#b82025] h-4 w-4 text-[#b82025] border-gray-300"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor={option.id} className="font-medium text-gray-700">
                        {option.label}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                disabled={!selectedOption}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${selectedOption ? 'bg-[#b82025] hover:bg-[#9a1a1f]' : 'bg-gray-400 cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#b82025]`}
              >
                Continue
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </FormLayout>);
}