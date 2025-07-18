import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const QuoteConfirmation = dynamic(() => import('@/components/QuoteConfirmation'), {
  ssr: false, // disables SSR to prevent crash
});

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuoteConfirmation />
    </Suspense>
  );
}
