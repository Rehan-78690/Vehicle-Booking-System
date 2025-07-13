// Vehicle suggestion logic
import prisma from '@/lib/prisma';

// Add caching for better performance
let vehicleCache = null;
let lastCacheUpdate = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getAllVehicles() {
  const now = Date.now();
  
  if (!vehicleCache || now - lastCacheUpdate > CACHE_DURATION) {
    try {
      const result = await db.query(`
        SELECT id, name, type, category, 
               passenger_capacity AS "passengerCapacity",
               suitcase_capacity AS "suitcaseCapacity"
        FROM vehicles 
        ORDER BY passenger_capacity
      `);
      vehicleCache = result.rows;
      lastCacheUpdate = now;
    } catch (error) {
      console.error('DB Error fetching vehicles:', error);
      throw new Error('Database error');
    }
  }
  return vehicleCache;
}

export async function suggestVehicle(passengers, suitcases) {
  // Validate inputs
  if (passengers < 1 || suitcases < 0) {
    throw new Error('Invalid passenger or suitcase count');
  }

  try {
    const result = await db.query(`
      SELECT id, name, type, category, 
             passenger_capacity AS "passengerCapacity",
             suitcase_capacity AS "suitcaseCapacity"
      FROM vehicles
      WHERE passenger_capacity >= $1 AND suitcase_capacity >= $2
      ORDER BY
        CASE WHEN category = 'standard' THEN 0 ELSE 1 END,
        passenger_capacity ASC,
        suitcase_capacity ASC
      LIMIT 1
    `, [passengers, suitcases]);

    return result.rows[0] || null;
  } catch (error) {
    console.error('DB Error suggesting vehicle:', error);
    throw new Error('Database error');
  }
}