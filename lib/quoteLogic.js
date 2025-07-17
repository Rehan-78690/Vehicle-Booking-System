// Quote management logic
import { suggestVehicle } from '@/lib/vehicleLogic';
import { calculatePrice } from '@/lib/pricingLogic';

// Hardcoded data (temporary)
const DISTANCE_LOOKUP = {
  'Paris → Versailles': 25,
  'Rome → Vatican': 10,
  'Berlin → Potsdam': 40,
  // Add more routes as needed
};

const DESTINATION_CATEGORIES = {
  'Versailles': 'cheaper',
  'Vatican': 'cheaper',
  'Milan': 'expensive',
  'Zurich': 'expensive',
  // Add more cities
};

export async function calculateQuote(useCaseType, formData) {
  // 1. Vehicle Selection
  const suggestedVehicle = suggestVehicle(
    formData.number_of_travelers,
    formData.number_of_suitcases || 0
  );
  
  // Apply vehicle override rules
  const selectedVehicle = formData.vehicle_type && 
    isUpgrade(suggestedVehicle.type, formData.vehicle_type)
      ? formData.vehicle_type
      : suggestedVehicle.type;

  // 2. Use Case Specific Calculations
  switch (useCaseType) {
    case 'one_way':
      return calculateOneWay(formData, selectedVehicle);
      
    case 'disposal':
      return calculateDisposal(formData, selectedVehicle);
      
    case 'multi_day':
      return calculateMultiDay(formData, selectedVehicle);
      
    case 'day_excursion':
      return calculateDayExcursion(formData, selectedVehicle);
      
    case 'one_way_plus_disposal':
      return calculateCombined(formData, selectedVehicle);
      
    default:
      throw new Error('Invalid use case type');
  }
}

// Helper function: Check if vehicle upgrade is valid
function isUpgrade(currentVehicle, newVehicle) {
  const VEHICLE_HIERARCHY = [
    'Standard Sedan', 'Premium Sedan', 
    'Standard Minivan (8-seater)', 'Premium Minivan (8-seater)',
    // ... all vehicles in capacity order
  ];
  
  return VEHICLE_HIERARCHY.indexOf(newVehicle) > 
         VEHICLE_HIERARCHY.indexOf(currentVehicle);
}

// Use Case Calculations
async function calculateOneWay(formData, vehicle) {
   // city names
  const serviceCity = (formData.city || '').split(',')[0].trim();        // e.g. "Paris"
  const dropCity    = (formData.dropoff_location || '').split(',')[0].trim(); // "Paris"

  /* ---------- 1. distance ---------- */
  // try detailed route first
  const directKey = `${formData.pickup_location} → ${formData.dropoff_location}`;
  // const distance = DISTANCE_LOOKUP[route] || 50;
  let distance = DISTANCE_LOOKUP[directKey];
 if (!distance) {
    const cityKey = `${serviceCity} → ${dropCity}`;
    distance = DISTANCE_LOOKUP[cityKey];
  }
if (!distance) distance = 50; // Default distance if no route found
  const dropoffCity = formData.dropoff_location?.split(',')[0]?.trim() || '';
  // const category = DESTINATION_CATEGORIES[dropoffCity] || 'middle';

  const category =
    DESTINATION_CATEGORIES[dropCity] ||
    DESTINATION_CATEGORIES[serviceCity] ||
    'middle';


  
  const rate = await calculatePrice('one_way', distance, null, null, vehicle, category.toLowerCase());
  // console.log(rate);
  if (isNaN(rate) || rate <= 0) {
    throw new Error(`Invalid rate calculation: ${rate}`);
  }
    // const total = distance * rate;
    

  return {
    vehicle: vehicle,
    distance_km: distance,
    rate_per_km: rate,
    total_price: distance * rate,
    calculation_type: 'distance_based',
  };
}


function calculateDayExcursion(formData, vehicle) {
  const route = `${formData.city_of_service} → ${formData.visited_city}`;
  const distance = DISTANCE_LOOKUP[route] || 60; // Default 60km
  const category = DESTINATION_CATEGORIES[formData.visited_city] || (destinationCategory || 'middle').toLowerCase();
 const rate = calculatePrice('day_excursion', distance, null, null, vehicle, category.toLowerCase());

  
  // Round trip calculation
  return {
    vehicle: vehicle,
    distance_km: distance * 2,
    rate_per_km: rate,
    total_price: distance * 2 * rate,
    calculation_type: 'round_trip'
  };
}

// Similar functions for other use cases...