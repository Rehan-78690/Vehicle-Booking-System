// app/api/quotes/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { validateQuoteRequest } from '@/lib/validation';

export async function GET() {
  try {
    const quotes = await prisma.quote.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(quotes);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      use_case_type,
      form_data,
      calculation_result, // ⬅ NEW
      price,
      vehicleType,
      distance,
      hours,
      bookingDays
    } = body;

    const validation = validateQuoteRequest(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.errors },
        { status: 400 }
      );
    }

    const saved = await prisma.quote.create({
      data: {
        useCase: use_case_type,
        formData: form_data, // Already JSON
        calculationResult: calculation_result || null, // Store full breakdown
        price: Number.isFinite(parseFloat(price)) ? parseFloat(price) : 0, 
        vehicleType,
        distance: parseFloat(distance),
        hours: hours ? parseInt(hours) : null,
        bookingDays: bookingDays ? parseInt(bookingDays) : 0
      },
    });

    return NextResponse.json(
      {
        id: saved.id,
        price: saved.price,
        vehicle: saved.vehicleType,
        calculationResult: saved.calculationResult // Optional: send back for immediate use
      },
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
