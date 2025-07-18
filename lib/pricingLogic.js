// lib/pricingLogic.js
import prisma from '@/lib/prisma';

let pricingCache = null;
let lastCacheUpdate = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Utility to convert snake_case to camelCase for frontend use
function mapPricingRule(rule) {
    return {
        id: rule.id,
        vehicleType: rule.vehicle_type,
        destinationCategory: rule.destination_category,
        ratePerKm: rule.rate_per_km,
        ratePerHour: rule.rate_per_hour,
        ratePerDay: rule.rate_per_day,
        condition: rule.condition,
        adjustment: rule.adjustment,
        createdAt: rule.created_at,
    };
}

// Fetch and cache all pricing rules
export async function getAllPricingRules() {
    const now = Date.now();
    if (!pricingCache || now - lastCacheUpdate > CACHE_DURATION) {
        try {
            const rules = await prisma.pricing.findMany({ orderBy: { vehicle_type: 'asc' } });
            pricingCache = rules.map(mapPricingRule);
            lastCacheUpdate = now;
        } catch (error) {
            console.error('Prisma Error fetching pricing rules:', error);
            throw new Error('Failed to fetch pricing rules');
        }
    }
    return pricingCache;
}

// Calculate price based on use case
export async function calculatePrice(useCase, distance, daysUntilTrip, hours, totalDays, vehicleType, travelers, suitcases, city) {
    const validUseCases = ['one-way', 'hourly-disposal', 'multi-day', 'day-excursion', 'day-excursion-disposal'];
    console.log('useCase:', useCase);
    console.log('vehicleType:', vehicleType);
    console.log('validUseCases:', validUseCases);

    if (!useCase || !validUseCases.includes(useCase)) {
        throw new Error(`Invalid use case: ${useCase}. Valid options are ${validUseCases.join(', ')}`);
    }
    // if (!vehicleType) {
    //     throw new Error('Vehicle type is required');
    // }

    // Validate vehicleType and capacity
    const vehicle = await prisma.vehicles.findFirst({ where: { name: vehicleType } });
    if (!vehicle) throw new Error(`Invalid vehicle type: ${vehicleType}. No vehicle found`);
    if (travelers > vehicle.passenger_capacity || suitcases > vehicle.suitcase_capacity) {
        throw new Error('Vehicle capacity exceeded. Upgrade required.');
    }

    // Determine destination category
    const destinationCategories = {
        'Paris, France': 'middle',
        'Rome, Italy': 'expensive',
        'London, UK': 'middle',
        // Add more cities as per client input
    };
    const destCategory = city && destinationCategories[city] ? destinationCategories[city] : 'middle';

    // Get applicable pricing rule
    const pricingRules = await prisma.pricing.findMany({ where: { vehicle_type: vehicleType } });
    const rule = pricingRules.find(r => r.destination_category === destCategory || r.destination_category === null);
    if (!rule) throw new Error(`No pricing rule found for ${vehicleType} in ${destCategory}`);

    let basePrice = 0;
    switch (useCase) {
        case 'hourly-disposal':
            basePrice = hours ? (rule.rate_per_hour || 0) * hours : 0;
            break;
        case 'multi-day':
            basePrice = totalDays ? (rule.rate_per_day || 0) * totalDays : 0;
            break;
        case 'one-way':
            basePrice = distance ? (rule.rate_per_km || 0) * distance : 0;
            break;
        case 'day-excursion':
        case 'day-excursion-disposal':
            basePrice = (distance ? (rule.rate_per_km || 0) * distance : 0) + (hours ? (rule.rate_per_hour || 0) * hours : 0);
            break;
        default:
            throw new Error('Unsupported use case');
    }

    // Apply adjustment
    let adjustment = 0;
    const conditionRule = pricingRules.find(r => r.condition && r.vehicle_type === vehicleType);
    if (conditionRule && daysUntilTrip !== undefined) {
        if (daysUntilTrip < 3 && conditionRule.condition === 'Booking < 3 days') adjustment = conditionRule.adjustment || 0;
        else if (daysUntilTrip > 50 && conditionRule.condition === 'Booking > 50 days') adjustment = conditionRule.adjustment || 0;
    }

    return Math.round(basePrice * (1 + adjustment) * 100) / 100;
}

// Update or create a pricing rule
export async function updatePricingRule(vehicleType, destinationCategory, ratePerKm, ratePerHour, ratePerDay, condition, adjustment) {
    try {
        const data = {
            vehicle_type: vehicleType,
            destination_category: destinationCategory || null,
            rate_per_km: ratePerKm || null,
            rate_per_hour: ratePerHour || null,
            rate_per_day: ratePerDay || null,
            condition: condition || null,
            adjustment: adjustment || null,
        };
        const whereClause = { vehicle_type_destination_category: { vehicle_type: vehicleType, destination_category: destinationCategory || null } };
        const result = await prisma.pricing.upsert({ where: whereClause, update: data, create: data });
        pricingCache = null; // Invalidate cache
        return mapPricingRule(result);
    } catch (error) {
        console.error('Prisma Error updating pricing rule:', error);
        throw new Error('Failed to update pricing rule');
    }
}