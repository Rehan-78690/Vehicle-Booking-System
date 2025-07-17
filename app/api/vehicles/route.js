import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Caching for GET requests
let vehicleCache = null;
let lastCacheUpdate = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function getAllVehicles() {
  const now = Date.now();
  if (!vehicleCache || now - lastCacheUpdate > CACHE_DURATION) {
    try {
      const vehicles = await prisma.vehicles.findMany({
        orderBy: { passenger_capacity: 'asc' },
      });

      const vehicleTypes = [...new Set(vehicles.map(v => v.type))];

      const pricingData = await prisma.pricing.findMany({
        where: {
          vehicle_type: { in: vehicleTypes },
          // destination_category: null, // adjust if needed
        },
        select: {
          vehicle_type: true,
          destination_category: true,
          rate_per_km: true,
          rate_per_hour: true,
        },
      });

      const pricingMap = {};

pricingData.forEach(p => {
  const type = p.vehicle_type;

  if (!pricingMap[type]) {
    pricingMap[type] = {};
  }

  if (p.destination_category === null) {
    if (p.rate_per_km != null) pricingMap[type].ratePerKm = p.rate_per_km;
    if (p.rate_per_hour != null) pricingMap[type].ratePerHour = p.rate_per_hour;
  }
});
      const mapVehicle = (v) => ({
        id: v.id,
        name: v.name,
        type: v.type,
        category: v.category,
        passengerCapacity: v.passenger_capacity,
        suitcaseCapacity: v.suitcase_capacity,
        ratePerKm: pricingMap[v.type]?.ratePerKm ?? null,
        ratePerHour: pricingMap[v.type]?.ratePerHour ?? null,
      });
        console.log('Fetched pricingData:', pricingData);

      vehicleCache = vehicles.map(mapVehicle);
      lastCacheUpdate = now;
    } catch (error) {
      console.error('Prisma Error fetching vehicles:', error);
      throw new Error('Database error');
    }

  }

  return vehicleCache;
}

export async function GET() {
  try {
    const vehicles = await getAllVehicles();
    return NextResponse.json(vehicles);
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Database error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { passengers, suitcases } = await request.json();

    if (passengers < 1 || suitcases < 0) {
      return NextResponse.json({ error: 'Invalid passenger or suitcase count' }, { status: 400 });
    }

    const allowedVehicles = await prisma.vehicles.findMany({
      where: {
        passenger_capacity: { gte: passengers },
        suitcase_capacity: { gte: suitcases },
      },
      orderBy: [
        { category: 'asc' },
        { passenger_capacity: 'asc' },
        { suitcase_capacity: 'asc' },
      ],
    });

    const vehicleTypes = [...new Set(allowedVehicles.map(v => v.type))];

    const pricingData = await prisma.pricing.findMany({
      where: {
        vehicle_type: { in: vehicleTypes },
        destination_category: null,
      },
      select: {
        vehicle_type: true,
        rate_per_km: true,
        rate_per_hour: true,
      },
    });

    const pricingMap = {};
    pricingData.forEach(p => {
      pricingMap[p.vehicle_type] = {
        ratePerKm: p.rate_per_km,
        ratePerHour: p.rate_per_hour,
      };
    });

    const mapVehicle = (v) => ({
      id: v.id,
      name: v.name,
      type: v.type,
      category: v.category,
      passengerCapacity: v.passenger_capacity,
      suitcaseCapacity: v.suitcase_capacity,
      ratePerKm: pricingMap[v.type]?.ratePerKm ?? null,
      ratePerHour: pricingMap[v.type]?.ratePerHour ?? null,
    });

    const mappedVehicles = allowedVehicles.map(mapVehicle);
    const suggestedVehicle = mappedVehicles[0] || null;

    return NextResponse.json({ suggestedVehicle, allowedVehicles: mappedVehicles });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
