// components/QuoteConfirmation.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jsPDF } from 'jspdf';
import Link from 'next/link';
import FormLayout from './FormLayout';

export default function QuoteConfirmation() {
  const router = useRouter();
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the latest quote from your API
    const fetchQuote = async () => {
      try {
        const response = await fetch('/api/quotes');
        const data = await response.json();
        setQuote(data);
      } catch (error) {
        console.error('Error fetching quote:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, []);

  const generatePDF = () => {
    if (!quote) return;

    const doc = new jsPDF();
    
    // Add logo
    doc.addImage('/Logo.png', 'PNG', 15, 10, 30, 30);
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(39, 54, 140); // #27368c
    doc.text('TRANSPORT QUOTATION', 105, 20, { align: 'center' });
    
    // Quote details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black
    
    // Service Type
    doc.setFont(undefined, 'bold');
    doc.text('Service Type:', 15, 50);
    doc.setFont(undefined, 'normal');
    doc.text(quote.useCase, 50, 50);
    
    // Vehicle Details
    doc.setFont(undefined, 'bold');
    doc.text('Vehicle:', 15, 60);
    doc.setFont(undefined, 'normal');
    doc.text(quote.vehicleType, 50, 60);
    
    // Price
    doc.setFont(undefined, 'bold');
    doc.text('Total Price:', 15, 70);
    doc.setFont(undefined, 'normal');
   doc.text(`€${typeof quote.price === 'number' ? quote.price.toFixed(2) : 'N/A'}`, 50, 70);

    
    // Date
    doc.setFont(undefined, 'bold');
    doc.text('Date:', 15, 80);
    doc.setFont(undefined, 'normal');
    doc.text(new Date(quote.createdAt).toLocaleDateString(), 50, 80);
    
    // Form Data
    doc.setFont(undefined, 'bold');
    doc.text('Details:', 15, 90);
    doc.setFont(undefined, 'normal');
    
    let yPosition = 100;
    let formData = {};
try {
  formData = typeof quote.formData === 'string' ? JSON.parse(quote.formData) : quote.formData || {};
} catch (err) {
  console.error('Invalid formData in quote:', quote.formData);
  formData = {};
}

    
    Object.entries(formData).forEach(([key, value]) => {
      if (value && typeof value === 'string') {
        doc.text(`${key}: ${value}`, 20, yPosition);
        yPosition += 10;
      }
    });
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Thank you for choosing our services!', 105, 280, { align: 'center' });
    
    // Save the PDF
    doc.save(`quote_${quote.id}.pdf`);
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
          <p className="mb-4">We couldn t find your quote details.</p>
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
  Reference #QT-{quote?.id?.toString()?.padStart(5, '0') || '00000'}
</p>

        </div>

        {/* Quote Details */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-[#27368c] mb-4">Service Details</h3>
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
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-[#27368c] mb-4">Booking Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Date Created:</span>
                  <span>{new Date(quote.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Passengers:</span>
                  <span>{formData.travelers || formData.people || '-'}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Luggage:</span>
                  <span>{formData.luggage || formData.suitcases || '-'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form-specific details */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-[#27368c] mb-4">Journey Details</h3>
            {quote.useCase === 'One-Way Transfer' && (
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Pickup Location:</span>
                  <span>{formData.pickupPoint || formData.customPickup}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Drop-off Location:</span>
                  <span>{formData.dropoffPoint || formData.customDropoff}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Date:</span>
                  <span>{formData.pickupDate}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Time:</span>
                  <span>{formData.pickupTime}</span>
                </div>
              </div>
            )}

            {quote.useCase === 'Hourly Disposal' && (
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">City:</span>
                  <span>{formData.city}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Hours:</span>
                  <span>{formData.hours}</span>
                </div>
              </div>
            )}
            {quote.useCase === 'Intercity Transfer with Disposal' && (
  <div className="space-y-3">
    <div className="flex justify-between border-b pb-2">
      <span className="font-medium">Pickup City:</span>
      <span>{formData.pickupCity}</span>
    </div>
    <div className="flex justify-between border-b pb-2">
      <span className="font-medium">Dropping City:</span>
      <span>{formData.dropoffCity}</span>
    </div>
    <div className="flex justify-between border-b pb-2">
      <span className="font-medium">Date:</span>
      <span>{formData.date}</span>
    </div>
    <div className="flex justify-between border-b pb-2">
      <span className="font-medium">Hours:</span>
      <span>{formData.hours}</span>
    </div>
  </div>
)}

{quote.useCase === 'Multi-City Multi-Day Disposal' && (
  <div className="space-y-4">
    <h4 className="font-medium text-[#27368c]">Itinerary</h4>
    {formData.itinerary?.map((day, index) => (
      <div key={index} className="border rounded-lg p-3">
        <div className="flex justify-between font-medium">
          <span>Day {day.dayNumber}</span>
          <span>{day.date}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          <div>
            <span className="text-sm text-gray-600">Overnight City:</span>
            <p>{day.city}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">Service Type:</span>
            <p>{day.serviceType}</p>
          </div>
        </div>
      </div>
    ))}
    <div className="flex justify-between border-b pb-2">
      <span className="font-medium">Pickup Location:</span>
      <span>{formData.pickupLocation}</span>
    </div>
    <div className="flex justify-between border-b pb-2">
      <span className="font-medium">Final Drop-off:</span>
      <span>{formData.dropoffLocation}</span>
    </div>
  </div>
)}

{quote.useCase === 'Day Excursion' && (
  <div className="space-y-3">
    <div className="flex justify-between border-b pb-2">
      <span className="font-medium">City of Service:</span>
      <span>{formData.city}</span>
    </div>
    <div className="flex justify-between border-b pb-2">
      <span className="font-medium">Date:</span>
      <span>{formData.date}</span>
    </div>
    <div className="flex justify-between border-b pb-2">
      <span className="font-medium">Pickup Time:</span>
      <span>{formData.pickupTime}</span>
    </div>
    <div className="flex justify-between border-b pb-2">
      <span className="font-medium">Duration:</span>
      <span>{formData.hours} hours</span>
    </div>
    <div className="flex justify-between border-b pb-2">
      <span className="font-medium">Cities Visited:</span>
      <span>
        {formData.visitedCities?.filter(c => c).join(', ') || '-'}
      </span>
    </div>
    <div className="flex justify-between border-b pb-2">
      <span className="font-medium">Distance:</span>
      <span>{formData.distance} KM</span>
    </div>
  </div>
)}

{quote.useCase === 'Hourly Disposal' && (
  <div className="space-y-3">
    <div className="flex justify-between border-b pb-2">
      <span className="font-medium">City:</span>
      <span>{formData.city}</span>
    </div>
    <div className="flex justify-between border-b pb-2">
      <span className="font-medium">Date:</span>
      <span>{formData.date}</span>
    </div>
    <div className="flex justify-between border-b pb-2">
      <span className="font-medium">Hours:</span>
      <span>{formData.hours}</span>
    </div>
  </div>
)}

           
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