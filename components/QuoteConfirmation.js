'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { jsPDF } from 'jspdf';
import Link from 'next/link';

export default function QuoteConfirmation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const quoteId = searchParams.get('quoteId');
    if (!quoteId) {
      setLoading(false);
      return;
    }

    const fetchQuote = async () => {
      try {
        const response = await fetch(`/api/quotes/${quoteId}`);
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        setQuote(data);
      } catch (error) {
        console.error('Error fetching quote:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, [searchParams]);

  const generatePDF = () => {
  if (!quote) return;

  const doc = new jsPDF();
  const paddingLeft = 20;
  let y = 20;

  // Logo
  doc.addImage('/Logo.png', 'PNG', paddingLeft, y, 35, 20);

  // Title
  doc.setFontSize(18);
  doc.setTextColor(39, 54, 140); // #27368c
  //doc.text('TRANSPORT QUOTATION', 200 - paddingLeft, y + 12, { align: 'right' });
  doc.text('TRANSPORT QUOTATION', 60, y + 12, { align: 'left' });

  y += 30;
  doc.setDrawColor(200);
  doc.line(paddingLeft, y, 190, y); // divider
  y += 10;

  // Core Info
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  const coreDetails = [
    { label: 'Reference', value: `#QT-${quote.id.toString().padStart(5, '0')}` },
    { label: 'Service Type', value: quote.useCase },
    { label: 'Vehicle', value: quote.vehicleType },
    { label: 'Total Price', value: `€${typeof quote.price === 'number' ? quote.price.toFixed(2) : 'N/A'}` },
    { label: 'Quote ID', value: quote.id },
    { label: 'Date Created', value: new Date(quote.createdAt).toLocaleDateString() },
  ];

  coreDetails.forEach(({ label, value }) => {
    doc.setFont(undefined, 'bold');
    doc.text(`${label}:`, paddingLeft, y);
    doc.setFont(undefined, 'normal');
    doc.text(value.toString(), paddingLeft + 45, y);
    y += 8;
  });

  // Additional Details
  y += 10;
  let formData = {};
  try {
    formData = typeof quote.formData === 'string' ? JSON.parse(quote.formData) : quote.formData || {};
  } catch (err) {
    formData = {};
  }

  if (Object.keys(formData).length > 0) {
    doc.setFont(undefined, 'bold');
    doc.text('Additional Details:', paddingLeft, y);
    y += 8;
    doc.setFont(undefined, 'normal');
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        const displayValue = Array.isArray(value) ? value.filter(v => v).join(', ') : value.toString();
        const label = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        doc.text(`• ${label}: ${displayValue}`, paddingLeft + 5, y);
        y += 7;
      }
    });
  }

  // Footer
  y = Math.max(y, 270);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text('Thank you for choosing Tour Passion.', 105, y, { align: 'center' });

  doc.save(`quote_QT-${quote.id.toString().padStart(5, '0')}.pdf`);
};


  if (loading) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 text-center">
        <h2 className="text-xl font-bold text-[#b82025] mb-4">No Quote Found</h2>
        <p className="mb-4">We couldn’t find your quote details.</p>
        <Link href="/quotation" className="text-[#27368c] hover:underline">
          Return to quotation form
        </Link>
      </div>
    );
  }

  let formData = {};
  try {
    formData = typeof quote.formData === 'string' ? JSON.parse(quote.formData) : quote.formData || {};
  } catch (err) {
    formData = {};
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden mt-10">
      <div className="bg-[#27368c] p-6 text-white text-center">
        <h1 className="text-3xl font-bold">Transport Quotation</h1>
        <p className="mt-2 text-sm opacity-80">Reference #QT-{quote.id.toString().padStart(5, '0')}</p>
      </div>

      <div className="p-8">
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div>
            <h2 className="text-xl font-semibold text-[#27368c] mb-4">Core Details</h2>
            <ul className="space-y-3">
              <li className="flex justify-between border-b pb-2">
                <span className="font-medium">Service Type:</span>
                <span>{quote.useCase}</span>
              </li>
              <li className="flex justify-between border-b pb-2">
                <span className="font-medium">Vehicle:</span>
                <span>{quote.vehicleType}</span>
              </li>
              <li className="flex justify-between border-b pb-2">
                <span className="font-medium">Distance:</span>
                <span>{quote.distance} KM</span>
              </li>
              <li className="flex justify-between border-b pb-2">
                <span className="font-medium">Quote ID:</span>
                <span>{quote.id}</span>
              </li>
              <li className="flex justify-between border-b pb-2">
                <span className="font-medium">Date:</span>
                <span>{new Date(quote.createdAt).toLocaleDateString()}</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#27368c] mb-4">Additional Info</h2>
            <ul className="space-y-3">
              {Object.entries(formData).map(([key, value]) => (
                <li key={key} className="flex justify-between border-b pb-2">
                  <span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span>
                  <span>{Array.isArray(value) ? value.filter(v => v).join(', ') : value?.toString() || '-'}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg p-6 flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Total Price</h3>
            <p className="text-sm text-gray-500">Includes all taxes & charges</p>
          </div>
          <div className="text-3xl font-bold text-[#b82025]">
            €{typeof quote.price === 'number' ? quote.price.toFixed(2) : 'N/A'}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-4">
          <button
            onClick={generatePDF}
            className="bg-[#27368c] text-white px-6 py-2 rounded-lg hover:bg-[#1a2a6b] flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Download PDF
          </button>

          <Link
            href="/quotation"
            className="bg-[#b82025] text-white px-6 py-2 rounded-lg hover:bg-[#9a1a1f] text-center"
          >
            New Quotation
          </Link>
        </div>
      </div>
    </div>
  );
}
