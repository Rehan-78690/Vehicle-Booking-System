// prisma/seed.js
// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

console.log('Prisma Client loaded:', PrismaClient);
console.log('Prisma instance:', prisma);

async function main() {
    console.log('Starting seed process...');

    // Seed vehicles data
    await prisma.vehicles.createMany({
        data: [
            { name: 'Toyota Camry', type: 'sedan', category: 'standard', passenger_capacity: 4, suitcase_capacity: 3 },
            { name: 'Honda Odyssey', type: 'minivan', category: 'standard', passenger_capacity: 7, suitcase_capacity: 6 },
            { name: 'Mercedes S-Class', type: 'sedan', category: 'luxury', passenger_capacity: 4, suitcase_capacity: 2 },
            { name: 'Ford Transit', type: 'van', category: 'standard', passenger_capacity: 12, suitcase_capacity: 10 },
        ],
    });

    // Seed pricing data for all use cases
    await prisma.pricing.createMany({
        data: [
            // One-Way Transfer and Day Excursions (distance-based)
            { vehicle_type: 'sedan', destination_category: 'Cheaper', rate_per_km: 1.9 },
            { vehicle_type: 'sedan', destination_category: 'Middle', rate_per_km: 2.5 },
            { vehicle_type: 'sedan', destination_category: 'Expensive', rate_per_km: 4.0 },
            { vehicle_type: 'minivan', destination_category: 'Cheaper', rate_per_km: 2.5 },
            { vehicle_type: 'minivan', destination_category: 'Middle', rate_per_km: 3.0 },
            { vehicle_type: 'minivan', destination_category: 'Expensive', rate_per_km: 4.5 },
            { vehicle_type: 'van', destination_category: 'Middle', rate_per_km: 3.5 },

            // Disposal (hourly-based)
            { vehicle_type: 'sedan', destination_category: null, rate_per_hour: 20.0 },
            { vehicle_type: 'minivan', destination_category: null, rate_per_hour: 25.0 },
            { vehicle_type: 'van', destination_category: null, rate_per_hour: 30.0 },

            // Multi-Day Tours (daily-based)
            { vehicle_type: 'sedan', destination_category: null, rate_per_day: 100.0 },
            { vehicle_type: 'minivan', destination_category: null, rate_per_day: 120.0 },
            { vehicle_type: 'van', destination_category: null, rate_per_day: 150.0 },

            // Adjustments for all use cases
            { vehicle_type: 'sedan', condition: 'Booking < 1 day', adjustment: 0.20 },
            { vehicle_type: 'minivan', condition: 'Booking < 1 day', adjustment: 0.20 },
            { vehicle_type: 'van', condition: 'Booking < 1 day', adjustment: 0.20 },
            { vehicle_type: 'sedan', condition: 'Booking 2-3 days', adjustment: 0.10 },
            { vehicle_type: 'minivan', condition: 'Booking 2-3 days', adjustment: 0.10 },
            { vehicle_type: 'van', condition: 'Booking 2-3 days', adjustment: 0.10 },
            { vehicle_type: 'sedan', condition: 'Booking > 50 days', adjustment: -0.10 },
            { vehicle_type: 'minivan', condition: 'Booking > 50 days', adjustment: -0.10 },
            { vehicle_type: 'van', condition: 'Booking > 50 days', adjustment: -0.10 },
        ],
    });

    console.log('Seeding completed.');
}

main()
    .catch(e => console.error('Error during seeding:', e))
    .finally(async () => {
        console.log('Disconnecting Prisma...');
        await prisma.$disconnect();
    });