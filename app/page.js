'use client';

import FormRadio from '@/components/FormRadio';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-full w-full md:w-2/3 lg:w-1/2 bg-white rounded-lg shadow-md overflow-hidden">
        <FormRadio />
      </div>
    </main>
  );
}
