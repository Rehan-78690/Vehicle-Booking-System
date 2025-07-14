// app/api/pricing/route.js
import { calculatePrice, getAllPricingRules, updatePricingRule } from '@/lib/pricingLogic';

export async function GET() {
    const rules = await getAllPricingRules();
    return new Response(JSON.stringify(rules), { status: 200 });
}

export async function POST(request) {
    const { action, useCase, distance, bookingDays, hours, vehicleType, destinationCategory, ratePerKm, ratePerHour, ratePerDay, condition, adjustment } = await request.json();

    if (action === 'calculate') {
        const price = await calculatePrice(useCase, distance, bookingDays, hours, vehicleType);
        return new Response(JSON.stringify({ totalPrice: price }), { status: 200 });
    } else if (action === 'update') {
        const rule = await updatePricingRule(vehicleType, destinationCategory, ratePerKm, ratePerHour, ratePerDay, condition, adjustment);
        return new Response(JSON.stringify({ success: true, rule }), { status: 200 });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 });
}