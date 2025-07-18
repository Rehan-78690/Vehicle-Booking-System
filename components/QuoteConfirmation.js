// components/QuoteConfirmation.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { jsPDF } from 'jspdf';
import Link from 'next/link';
import FormLayout from './FormLayout';

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

    // Add logo
    doc.addImage('/Logo.png', 'PNG', 15, 10, 30, 30);

    // Title
    doc.setFontSize(20);
    doc.setTextColor(39, 54, 140); // #27368c
    doc.text('TRANSPORT QUOTATION', 105, 20, { align: 'center' });

    // Quote Reference
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black
    doc.text(`Reference #QT-${quote.id.toString().padStart(5, '0')}`, 15, 30);

    // Core Quote Details
    let yPosition = 40;
    const coreDetails = [
      { label: 'Service Type', value: quote.useCase },
      { label: 'Vehicle', value: quote.vehicleType },
      { label: 'Total Price', value: `€${typeof quote.price === 'number' ? quote.price.toFixed(2) : 'N/A'}` },
      { label: 'Quote ID', value: quote.id },
      { label: 'Date Created', value: new Date(quote.createdAt).toLocaleDateString() },
    ];
    coreDetails.forEach(({ label, value }) => {
      doc.setFont(undefined, 'bold');
      doc.text(`${label}:`, 15, yPosition);
      doc.setFont(undefined, 'normal');
      doc.text(value.toString(), 50, yPosition);
      yPosition += 10;
    });

    // Form Data
    let formData = {};
    try {
      formData = typeof quote.formData === 'string' ? JSON.parse(quote.formData) : quote.formData || {};
    } catch (err) {
      console.error('Invalid formData in quote:', quote.formData);
      formData = {};
    }

    if (Object.keys(formData).length > 0) {
      doc.setFont(undefined, 'bold');
      doc.text('Additional Details:', 15, yPosition);
      yPosition += 10;
      doc.setFont(undefined, 'normal');
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          const displayValue = Array.isArray(value) ? value.filter(v => v).join(', ') : value.toString();
          doc.text(`${key}: ${displayValue}`, 20, yPosition);
          yPosition += 10;
        }
      });
    }

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Thank you for choosing our services!', 105, 280, { align: 'center' });

    doc.save(`quote_QT-${quote.id.toString().padStart(5, '0')}.pdf`);
  };

  if (loading) {
    return (
      <FormLayout>
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
      </FormLayout>
    );
  }

  if (!quote) {
    return (
      <FormLayout>
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-xl font-bold text-[#b82025] mb-4">No Quote Found</h2>
          <p className="mb-4">We couldn’t find your quote details.</p>
          <Link href="/quotation" className="text-[#27368c] hover:underline">
            Return to quotation form
          </Link>
        </div>
      </FormLayout>
    );
  }

  let formData = {};
  try {
    formData = typeof quote.formData === 'string' ? JSON.parse(quote.formData) : quote.formData || {};
  } catch (err) {
    console.error('Invalid formData in quote:', quote.formData);
    formData = {};
  }

  return (
    <FormLayout>
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Confirmation Header */}
        <div className="bg-[#27368c] p-6 text-white">
          <h1 className="text-2xl font-bold text-center">Your Transport Quote</h1>
          <p className="text-center opacity-90 mt-1">
            Reference #QT-{quote.id.toString().padStart(5, '0')}
          </p>
        </div>

        {/* Quote Details */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-[#27368c] mb-4">Core Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Service Type:</span>
                  <span>{quote.useCase}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Vehicle:</span>
                  <span>{quote.vehicleType}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Distance:</span>
                  <span>{quote.distance} KM</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Quote ID:</span>
                  <span>{quote.id}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Date Created:</span>
                  <span>{new Date(quote.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form-specific details */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-[#27368c] mb-4">Additional Details</h3>
            <div className="space-y-3">
              {Object.entries(formData).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b pb-2">
                  <span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span>
                  <span>
                    {Array.isArray(value) ? value.filter(v => v).join(', ') : value?.toString() || '-'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-lg">Total Price</h4>
                <p className="text-sm text-gray-600">Inclusive of all taxes</p>
              </div>
              <div className="text-2xl font-bold text-[#b82025]">
                €{typeof quote.price === 'number' ? quote.price.toFixed(2) : 'N/A'}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
            <button
              onClick={generatePDF}
              className="bg-[#27368c] text-white px-6 py-2 rounded-md hover:bg-[#1a2a6b] flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Download PDF
            </button>
            <Link
              href="/quotation"
              className="bg-[#b82025] text-white px-6 py-2 rounded-md hover:bg-[#9a1a1f] text-center"
            >
              New Quotation
            </Link>
          </div>
        </div>
      </div>
    </FormLayout>
  );
}