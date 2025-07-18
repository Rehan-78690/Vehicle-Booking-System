// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

console.log('Prisma Client loaded:', PrismaClient);
console.log('Prisma instance:', prisma);

async function main() {
    console.log('Starting seed process...');

    // Seed vehicles data (16 vehicles from Doc 1)
    await prisma.vehicles.createMany({
        data: [
            { name: 'Standard Sedan', type: 'sedan', category: 'standard', passenger_capacity: 2, suitcase_capacity: 2 },
            { name: 'Premium Sedan (Mercedes E-Class/BMW/Audi)', type: 'sedan', category: 'luxury', passenger_capacity: 2, suitcase_capacity: 2 },
            { name: 'Standard Minivan (8-seater)', type: 'minivan', category: 'standard', passenger_capacity: 7, suitcase_capacity: 6 },
            { name: 'Premium Minivan (8-seater Mercedes)', type: 'minivan', category: 'luxury', passenger_capacity: 7, suitcase_capacity: 6 },
            { name: 'Standard Minivan (9-seater)', type: 'minivan', category: 'standard', passenger_capacity: 8, suitcase_capacity: 6 },
            { name: 'Mercedes Minivan (9-seater)', type: 'minivan', category: 'luxury', passenger_capacity: 8, suitcase_capacity: 6 },
            { name: 'Mercedes Sprinter (9-Seater)', type: 'sprinter', category: 'standard', passenger_capacity: 8, suitcase_capacity: 10 },
            { name: 'Mercedes Sprinter (12-Seater)', type: 'sprinter', category: 'standard', passenger_capacity: 11, suitcase_capacity: 12 },
            { name: 'Mercedes Sprinter (16-Seater)', type: 'sprinter', category: 'standard', passenger_capacity: 15, suitcase_capacity: 14 },
            { name: 'Mercedes Sprinter (19-Seater)', type: 'sprinter', category: 'standard', passenger_capacity: 18, suitcase_capacity: 15 },
            { name: '30-Seater Bus', type: 'bus', category: 'standard', passenger_capacity: 29, suitcase_capacity: 25 },
            { name: '50-Seater Bus', type: 'bus', category: 'standard', passenger_capacity: 49, suitcase_capacity: 45 },
            { name: '54-Seater Bus', type: 'bus', category: 'standard', passenger_capacity: 53, suitcase_capacity: 50 },
            { name: '57-Seater Bus', type: 'bus', category: 'standard', passenger_capacity: 56, suitcase_capacity: 55 },
            { name: '60-Seater Bus', type: 'bus', category: 'standard', passenger_capacity: 59, suitcase_capacity: 58 },
            { name: '77-Seater (Double-Decker)', type: 'bus', category: 'standard', passenger_capacity: 76, suitcase_capacity: 60 },
        ],
    });

    // Seed pricing data for all 16 vehicles
    await prisma.pricing.createMany({
        data: [
            // One-way Transfer and Day Excursion (distance-based)
            { vehicle_type: 'Standard Sedan', destination_category: 'Cheaper', rate_per_km: 1.9 },
            { vehicle_type: 'Standard Sedan', destination_category: 'Middle', rate_per_km: 2.5 },
            { vehicle_type: 'Standard Sedan', destination_category: 'Expensive', rate_per_km: 4.0 },
            { vehicle_type: 'Premium Sedan (Mercedes E-Class/BMW/Audi)', destination_category: 'Cheaper', rate_per_km: 1.9 },
            { vehicle_type: 'Premium Sedan (Mercedes E-Class/BMW/Audi)', destination_category: 'Middle', rate_per_km: 2.5 },
            { vehicle_type: 'Premium Sedan (Mercedes E-Class/BMW/Audi)', destination_category: 'Expensive', rate_per_km: 4.0 },
            { vehicle_type: 'Standard Minivan (8-seater)', destination_category: 'Cheaper', rate_per_km: 2.5 },
            { vehicle_type: 'Standard Minivan (8-seater)', destination_category: 'Middle', rate_per_km: 3.0 },
            { vehicle_type: 'Standard Minivan (8-seater)', destination_category: 'Expensive', rate_per_km: 4.5 },
            { vehicle_type: 'Premium Minivan (8-seater Mercedes)', destination_category: 'Cheaper', rate_per_km: 2.5 },
            { vehicle_type: 'Premium Minivan (8-seater Mercedes)', destination_category: 'Middle', rate_per_km: 3.0 },
            { vehicle_type: 'Premium Minivan (8-seater Mercedes)', destination_category: 'Expensive', rate_per_km: 4.5 },
            { vehicle_type: 'Standard Minivan (9-seater)', destination_category: 'Cheaper', rate_per_km: 2.5 },
            { vehicle_type: 'Standard Minivan (9-seater)', destination_category: 'Middle', rate_per_km: 3.0 },
            { vehicle_type: 'Standard Minivan (9-seater)', destination_category: 'Expensive', rate_per_km: 4.5 },
            { vehicle_type: 'Mercedes Minivan (9-seater)', destination_category: 'Cheaper', rate_per_km: 3.0 },
            { vehicle_type: 'Mercedes Minivan (9-seater)', destination_category: 'Middle', rate_per_km: 3.5 },
            { vehicle_type: 'Mercedes Minivan (9-seater)', destination_category: 'Expensive', rate_per_km: 5.0 },
            { vehicle_type: 'Mercedes Sprinter (9-Seater)', destination_category: 'Cheaper', rate_per_km: 3.0 },
            { vehicle_type: 'Mercedes Sprinter (9-Seater)', destination_category: 'Middle', rate_per_km: 3.5 },
            { vehicle_type: 'Mercedes Sprinter (9-Seater)', destination_category: 'Expensive', rate_per_km: 5.0 },
            { vehicle_type: 'Mercedes Sprinter (12-Seater)', destination_category: 'Cheaper', rate_per_km: 3.0 },
            { vehicle_type: 'Mercedes Sprinter (12-Seater)', destination_category: 'Middle', rate_per_km: 3.5 },
            { vehicle_type: 'Mercedes Sprinter (12-Seater)', destination_category: 'Expensive', rate_per_km: 5.0 },
            { vehicle_type: 'Mercedes Sprinter (16-Seater)', destination_category: 'Cheaper', rate_per_km: 3.0 },
            { vehicle_type: 'Mercedes Sprinter (16-Seater)', destination_category: 'Middle', rate_per_km: 3.5 },
            { vehicle_type: 'Mercedes Sprinter (16-Seater)', destination_category: 'Expensive', rate_per_km: 5.0 },
            { vehicle_type: 'Mercedes Sprinter (19-Seater)', destination_category: 'Cheaper', rate_per_km: 3.0 },
            { vehicle_type: 'Mercedes Sprinter (19-Seater)', destination_category: 'Middle', rate_per_km: 3.5 },
            { vehicle_type: 'Mercedes Sprinter (19-Seater)', destination_category: 'Expensive', rate_per_km: 5.0 },
            { vehicle_type: '30-Seater Bus', destination_category: 'Cheaper', rate_per_km: 4.0 },
            { vehicle_type: '30-Seater Bus', destination_category: 'Middle', rate_per_km: 4.5 },
            { vehicle_type: '30-Seater Bus', destination_category: 'Expensive', rate_per_km: 6.0 },
            { vehicle_type: '50-Seater Bus', destination_category: 'Cheaper', rate_per_km: 4.0 },
            { vehicle_type: '50-Seater Bus', destination_category: 'Middle', rate_per_km: 4.5 },
            { vehicle_type: '50-Seater Bus', destination_category: 'Expensive', rate_per_km: 6.0 },
            { vehicle_type: '54-Seater Bus', destination_category: 'Cheaper', rate_per_km: 4.0 },
            { vehicle_type: '54-Seater Bus', destination_category: 'Middle', rate_per_km: 4.5 },
            { vehicle_type: '54-Seater Bus', destination_category: 'Expensive', rate_per_km: 6.0 },
            { vehicle_type: '57-Seater Bus', destination_category: 'Cheaper', rate_per_km: 4.0 },
            { vehicle_type: '57-Seater Bus', destination_category: 'Middle', rate_per_km: 4.5 },
            { vehicle_type: '57-Seater Bus', destination_category: 'Expensive', rate_per_km: 6.0 },
            { vehicle_type: '60-Seater Bus', destination_category: 'Cheaper', rate_per_km: 4.0 },
            { vehicle_type: '60-Seater Bus', destination_category: 'Middle', rate_per_km: 4.5 },
            { vehicle_type: '60-Seater Bus', destination_category: 'Expensive', rate_per_km: 6.0 },
            { vehicle_type: '77-Seater (Double-Decker)', destination_category: 'Cheaper', rate_per_km: 4.0 },
            { vehicle_type: '77-Seater (Double-Decker)', destination_category: 'Middle', rate_per_km: 4.5 },
            { vehicle_type: '77-Seater (Double-Decker)', destination_category: 'Expensive', rate_per_km: 6.0 },

            // Hourly Disposal
            { vehicle_type: 'Standard Sedan', destination_category: null, rate_per_hour: 20.0 },
            { vehicle_type: 'Premium Sedan (Mercedes E-Class/BMW/Audi)', destination_category: null, rate_per_hour: 20.0 },
            { vehicle_type: 'Standard Minivan (8-seater)', destination_category: null, rate_per_hour: 30.0 },
            { vehicle_type: 'Premium Minivan (8-seater Mercedes)', destination_category: null, rate_per_hour: 30.0 },
            { vehicle_type: 'Standard Minivan (9-seater)', destination_category: null, rate_per_hour: 30.0 },
            { vehicle_type: 'Mercedes Minivan (9-seater)', destination_category: null, rate_per_hour: 30.0 },
            { vehicle_type: 'Mercedes Sprinter (9-Seater)', destination_category: null, rate_per_hour: 40.0 },
            { vehicle_type: 'Mercedes Sprinter (12-Seater)', destination_category: null, rate_per_hour: 40.0 },
            { vehicle_type: 'Mercedes Sprinter (16-Seater)', destination_category: null, rate_per_hour: 40.0 },
            { vehicle_type: 'Mercedes Sprinter (19-Seater)', destination_category: null, rate_per_hour: 40.0 },
            { vehicle_type: '30-Seater Bus', destination_category: null, rate_per_hour: 60.0 },
            { vehicle_type: '50-Seater Bus', destination_category: null, rate_per_hour: 60.0 },
            { vehicle_type: '54-Seater Bus', destination_category: null, rate_per_hour: 60.0 },
            { vehicle_type: '57-Seater Bus', destination_category: null, rate_per_hour: 60.0 },
            { vehicle_type: '60-Seater Bus', destination_category: null, rate_per_hour: 60.0 },
            { vehicle_type: '77-Seater (Double-Decker)', destination_category: null, rate_per_hour: 60.0 },

            // Multi-Day
            { vehicle_type: 'Standard Sedan', destination_category: null, rate_per_day: 150.0 },
            { vehicle_type: 'Premium Sedan (Mercedes E-Class/BMW/Audi)', destination_category: null, rate_per_day: 150.0 },
            { vehicle_type: 'Standard Minivan (8-seater)', destination_category: null, rate_per_day: 200.0 },
            { vehicle_type: 'Premium Minivan (8-seater Mercedes)', destination_category: null, rate_per_day: 200.0 },
            { vehicle_type: 'Standard Minivan (9-seater)', destination_category: null, rate_per_day: 200.0 },
            { vehicle_type: 'Mercedes Minivan (9-seater)', destination_category: null, rate_per_day: 200.0 },
            { vehicle_type: 'Mercedes Sprinter (9-Seater)', destination_category: null, rate_per_day: 250.0 },
            { vehicle_type: 'Mercedes Sprinter (12-Seater)', destination_category: null, rate_per_day: 250.0 },
            { vehicle_type: 'Mercedes Sprinter (16-Seater)', destination_category: null, rate_per_day: 250.0 },
            { vehicle_type: 'Mercedes Sprinter (19-Seater)', destination_category: null, rate_per_day: 250.0 },
            { vehicle_type: '30-Seater Bus', destination_category: null, rate_per_day: 300.0 },
            { vehicle_type: '50-Seater Bus', destination_category: null, rate_per_day: 300.0 },
            { vehicle_type: '54-Seater Bus', destination_category: null, rate_per_day: 300.0 },
            { vehicle_type: '57-Seater Bus', destination_category: null, rate_per_day: 300.0 },
            { vehicle_type: '60-Seater Bus', destination_category: null, rate_per_day: 300.0 },
            { vehicle_type: '77-Seater (Double-Decker)', destination_category: null, rate_per_day: 300.0 },

            // Adjustments
            { vehicle_type: 'Standard Sedan', condition: 'Booking < 3 days', adjustment: 0.10 },
            { vehicle_type: 'Premium Sedan (Mercedes E-Class/BMW/Audi)', condition: 'Booking < 3 days', adjustment: 0.10 },
            { vehicle_type: 'Standard Minivan (8-seater)', condition: 'Booking < 3 days', adjustment: 0.10 },
            { vehicle_type: 'Premium Minivan (8-seater Mercedes)', condition: 'Booking < 3 days', adjustment: 0.10 },
            { vehicle_type: 'Standard Minivan (9-seater)', condition: 'Booking < 3 days', adjustment: 0.10 },
            { vehicle_type: 'Mercedes Minivan (9-seater)', condition: 'Booking < 3 days', adjustment: 0.10 },
            { vehicle_type: 'Mercedes Sprinter (9-Seater)', condition: 'Booking < 3 days', adjustment: 0.10 },
            { vehicle_type: 'Mercedes Sprinter (12-Seater)', condition: 'Booking < 3 days', adjustment: 0.10 },
            { vehicle_type: 'Mercedes Sprinter (16-Seater)', condition: 'Booking < 3 days', adjustment: 0.10 },
            { vehicle_type: 'Mercedes Sprinter (19-Seater)', condition: 'Booking < 3 days', adjustment: 0.10 },
            { vehicle_type: '30-Seater Bus', condition: 'Booking < 3 days', adjustment: 0.10 },
            { vehicle_type: '50-Seater Bus', condition: 'Booking < 3 days', adjustment: 0.10 },
            { vehicle_type: '54-Seater Bus', condition: 'Booking < 3 days', adjustment: 0.10 },
            { vehicle_type: '57-Seater Bus', condition: 'Booking < 3 days', adjustment: 0.10 },
            { vehicle_type: '60-Seater Bus', condition: 'Booking < 3 days', adjustment: 0.10 },
            { vehicle_type: '77-Seater (Double-Decker)', condition: 'Booking < 3 days', adjustment: 0.10 },
            { vehicle_type: 'Standard Sedan', condition: 'Booking > 50 days', adjustment: -0.10 },
            { vehicle_type: 'Premium Sedan (Mercedes E-Class/BMW/Audi)', condition: 'Booking > 50 days', adjustment: -0.10 },
            { vehicle_type: 'Standard Minivan (8-seater)', condition: 'Booking > 50 days', adjustment: -0.10 },
            { vehicle_type: 'Premium Minivan (8-seater Mercedes)', condition: 'Booking > 50 days', adjustment: -0.10 },
            { vehicle_type: 'Standard Minivan (9-seater)', condition: 'Booking > 50 days', adjustment: -0.10 },
            { vehicle_type: 'Mercedes Minivan (9-seater)', condition: 'Booking > 50 days', adjustment: -0.10 },
            { vehicle_type: 'Mercedes Sprinter (9-Seater)', condition: 'Booking > 50 days', adjustment: -0.10 },
            { vehicle_type: 'Mercedes Sprinter (12-Seater)', condition: 'Booking > 50 days', adjustment: -0.10 },
            { vehicle_type: 'Mercedes Sprinter (16-Seater)', condition: 'Booking > 50 days', adjustment: -0.10 },
            { vehicle_type: 'Mercedes Sprinter (19-Seater)', condition: 'Booking > 50 days', adjustment: -0.10 },
            { vehicle_type: '30-Seater Bus', condition: 'Booking > 50 days', adjustment: -0.10 },
            { vehicle_type: '50-Seater Bus', condition: 'Booking > 50 days', adjustment: -0.10 },
            { vehicle_type: '54-Seater Bus', condition: 'Booking > 50 days', adjustment: -0.10 },
            { vehicle_type: '57-Seater Bus', condition: 'Booking > 50 days', adjustment: -0.10 },
            { vehicle_type: '60-Seater Bus', condition: 'Booking > 50 days', adjustment: -0.10 },
            { vehicle_type: '77-Seater (Double-Decker)', condition: 'Booking > 50 days', adjustment: -0.10 },
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