// GET/POST for quotes
import { NextResponse } from 'next/server';
import { calculateQuote } from '@/lib/quoteLogic';
import { validateQuoteRequest } from '@/lib/validation';

export async function POST(request) {
  try {
     const { use_case_type, form_data } = await request.json();
    
    // Calculate price
    const price = await calculateQuote(use_case_type, form_data);
    const requestData = await request.json();
    
    // Validate request structure
    const validation = validateQuoteRequest(requestData);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.errors },
        { status: 400 }
      );
    }

    // Calculate quotation
    // const quote = await calculateQuote(
    //   requestData.use_case_type,
    //   requestData.form_data
    // );
 const savedQuote = await prisma.quote.create({
      data: {
        useCase: use_case_type,
        formData: JSON.stringify(form_data),
        price,
        vehicleType: form_data.vehicleType,
        distance: form_data.distance || 0
      }
    });
    return NextResponse.json({
      id: savedQuote.id,
      price,
      vehicle: form_data.vehicleType
    });
  } catch (error) {
    console.error('Quotation Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}