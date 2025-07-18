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
            const rules = await prisma.pricing.findMany({
                orderBy: {
                    vehicle_type: 'asc',
                },
            });
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
export async function calculatePrice(useCase, distance, bookingDays, hours, vehicleType = 'sedan') {
     const validUseCases = [
    'one_way', 'disposal', 'multi_day', 
    'day_excursion', 'day_excursion_disposal'
  ];
  console.log(' useCase:', useCase);
console.log(' vehicleType:', vehicleType,);
console.log('validUseCases:', validUseCases);
  
  if (!vehicleType || !validUseCases.includes(useCase)) {
    throw new Error(`Invalid use case (${useCase}) or vehicle type (${vehicleType})`);
  }

    try {
        const pricingRules = await prisma.pricing.findMany({ where: { vehicle_type: vehicleType } });
const destinationCategory = 'Middle'; // In real app, determine based on cities
    
    // Find rule for specific destination category
const rule = pricingRules.find(r => 
      r.vehicle_type === vehicleType && 
      r.destination_category === destinationCategory
    );
     if (!rule) {
      throw new Error(`No pricing rule found for ${vehicleType} in ${destinationCategory}`);
    }

        let basePrice = 0;
    switch (useCase) {
      case 'disposal':
        basePrice = hours ? (rule.rate_per_hour || 0) * hours : 0;
        break;
      case 'multi_day':
        basePrice = bookingDays ? (rule.rate_per_day || 0) * bookingDays : 0;
        break;
      case 'one_way':
        basePrice = distance ? rule.rate_per_km * distance : 0;
        break;
      case 'day_excursion':
        basePrice = distance ? rule.rate_per_km * (distance * 2) : 0;
        break;
      case 'day_excursion_disposal':
        basePrice = (distance ? rule.rate_per_km * (distance * 2) : 0) + 
                   (hours ? (rule.rate_per_hour || 0) * hours : 0);
        break;
      default:
        throw new Error('Unsupported use case');
    }


        let adjustment = 0;
        const conditionRule = pricingRules.find(r => r.condition && r.vehicle_type === vehicleType);
        if (conditionRule) {
            if (bookingDays < 1 && conditionRule.condition === 'Booking < 1 day') adjustment = conditionRule.adjustment || 0;
            else if (bookingDays >= 2 && bookingDays <= 3 && conditionRule.condition === 'Booking 2-3 days') adjustment = conditionRule.adjustment || 0;
            else if (bookingDays > 50 && conditionRule.condition === 'Booking > 50 days') adjustment = conditionRule.adjustment || 0;
        }

        return basePrice * (1 + adjustment);
    } catch (error) {
        console.error('Prisma Error calculating price:', error);
        throw new Error('Failed to calculate price');
    }
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
         if (vehicleType === 'admin_config') {
      data.rate_per_km = null;
      data.rate_per_hour = null;
      data.rate_per_day = null;
    }

        const whereClause = {
            vehicle_type_destination_category: {
                vehicle_type: vehicleType,
                destination_category: destinationCategory || null,
            },
        };
        const result = await prisma.pricing.upsert({
            where: whereClause,
            update: data,
            create: data,
        });
        pricingCache = null; // Invalidate cache
        return mapPricingRule(result);
    } catch (error) {
        console.error('Prisma Error updating pricing rule:', error);
        throw new Error('Failed to update pricing rule');
    }
}