import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Map Prisma results to camelCase
const mapVehicle = (v) => ({
  id: v.id,
  name: v.name,
  type: v.type,
  category: v.category,
  passengerCapacity: v.passenger_capacity,
  suitcaseCapacity: v.suitcase_capacity,
});

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
    return NextResponse.json(
      { error: error.message || 'Database error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { passengers, suitcases } = await request.json();
    
    // Validate inputs
    if (passengers < 1 || suitcases < 0) {
      return NextResponse.json(
        { error: 'Invalid passenger or suitcase count' },
        { status: 400 }
      );
    }

    // Get allowed vehicles with proper ordering
    const allowedVehicles = await prisma.vehicles.findMany({
      where: {
        passenger_capacity: { gte: passengers },
        suitcase_capacity: { gte: suitcases },
      },
      orderBy: [
        { 
          category: 'asc' // Corrected ordering: standard first
        },
        { passenger_capacity: 'asc' },
        { suitcase_capacity: 'asc' },
      ],
    });

    // Map to camelCase and get suggested vehicle
    const mappedVehicles = allowedVehicles.map(mapVehicle);
    const suggestedVehicle = mappedVehicles[0] || null;

    return NextResponse.json({
      suggestedVehicle,
      allowedVehicles: mappedVehicles
    });
    
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}