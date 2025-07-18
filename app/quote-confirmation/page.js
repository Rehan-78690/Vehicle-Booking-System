'use client';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import QuoteConfirmation from '@/components/QuoteConfirmation';

export default function QuoteConfirmationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuoteConfirmation />
    </Suspense>
  );
}
