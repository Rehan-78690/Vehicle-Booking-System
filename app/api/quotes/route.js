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
    const { use_case_type, form_data, price, vehicleType, distance, hours, bookingDays } = body;

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
        formData: JSON.stringify(form_data),
        price: parseFloat(price), // Ensure Float
        vehicleType: vehicleType,
        distance: parseFloat(distance), // Ensure Float
        hours: hours ? parseInt(hours) : null, // Ensure Int or null
        bookingDays: bookingDays ? parseInt(bookingDays) : 0, // Ensure Int
      },
    });

    return NextResponse.json(
      { id: saved.id, price: saved.price, vehicle: saved.vehicleType },
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