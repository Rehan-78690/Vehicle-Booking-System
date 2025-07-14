// GET/POST for quotes
import { NextResponse } from 'next/server';
import { calculateQuote } from '@/lib/quoteLogic';
import { validateQuoteRequest } from '@/lib/validation';

export async function POST(request) {
  try {
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
    const quote = await calculateQuote(
      requestData.use_case_type,
      requestData.form_data
    );

    return NextResponse.json(quote);
  } catch (error) {
    console.error('Quotation Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}