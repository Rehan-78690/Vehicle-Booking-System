'use client';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import QuoteConfirmation from '@/components/QuoteConfirmation';
import FormLayout from '@/components/FormLayout';
export default function QuoteConfirmationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FormLayout>
      <QuoteConfirmation />
      </FormLayout>
    </Suspense>
  );
}
