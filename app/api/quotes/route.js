// app/api/quotes/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { calculateQuote } from '@/lib/quoteLogic';
import { validateQuoteRequest } from '@/lib/validation';

export async function POST(req) {
  try {
    /* ---------- 1. read the body ONCE ---------- */
    const body = await req.json();       // <-- only call json() here
    const { use_case_type, form_data } = body;

    /* ---------- 2. validate input BEFORE work ---------- */
    const validation = validateQuoteRequest(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.errors },
        { status: 400 }
      );
    }

    /* ---------- 3. run quotation ---------- */
     const priceDetails = await calculateQuote(use_case_type, form_data);

    /* ---------- 4. persist & respond ---------- */
    const saved = await prisma.quote.create({
      data: {
        useCase: use_case_type,
        formData: JSON.stringify(form_data),
        price: priceDetails.total_price,
        vehicleType: form_data.vehicle_type,
        distance: form_data.distance ?? 0,
      },
    });

    return NextResponse.json(
      { id: saved.id,   price: priceDetails, vehicle: form_data.vehicle_type },
      { status: 200 }
    );
  } catch (err) {
    console.error('Quotation Error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
