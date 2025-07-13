import prisma from '@/lib/prisma';

let vehicleCache = null;
let lastCacheUpdate = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Utility to convert snake_case to camelCase for frontend use
function mapVehicle(vehicle) {
  return {
    id: vehicle.id,
    name: vehicle.name,
    type: vehicle.type,
    category: vehicle.category,
    passengerCapacity: vehicle.passenger_capacity,
    suitcaseCapacity: vehicle.suitcase_capacity,
  };
}

// Fetch and cache all vehicles
export async function getAllVehicles() {
  const now = Date.now();

  if (!vehicleCache || now - lastCacheUpdate > CACHE_DURATION) {
    try {
      const vehicles = await prisma.vehicles.findMany({
        orderBy: {
          passenger_capacity: 'asc',
        },
      });
      vehicleCache = vehicles.map(mapVehicle);
      lastCacheUpdate = now;
    } catch (error) {
      console.error('Prisma Error fetching all vehicles:', error);
      throw new Error('Failed to fetch vehicles');
    }
  }

  return vehicleCache;
}

// Suggest the best-suited vehicle
export async function suggestVehicle(passengers, suitcases) {
  if (passengers < 1 || suitcases < 0) {
    throw new Error('Invalid passenger or suitcase count');
  }

  try {
    const vehicles = await prisma.vehicles.findMany({
      where: {
        passenger_capacity: { gte: passengers },
        suitcase_capacity: { gte: suitcases },
      },
      orderBy: [
        {
          category: 'asc', // 'standard' should come first
        },
        {
          passenger_capacity: 'asc',
        },
        {
          suitcase_capacity: 'asc',
        },
      ],
      take: 1, // LIMIT 1
    });

    if (vehicles.length === 0) return null;
    return mapVehicle(vehicles[0]);

  } catch (error) {
    console.error('Prisma Error suggesting vehicle:', error);
    throw new Error('Failed to suggest vehicle');
  }
}
