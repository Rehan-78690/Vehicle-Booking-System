// lib/googleMaps.js
export async function calculateDistance(origin, destination) {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.status !== 'OK') {
      throw new Error(`Google Maps API error: ${data.status}`);
    }
    
    if (data.rows[0].elements[0].status !== 'OK') {
      throw new Error('Route not found');
    }
    
    // Convert meters to kilometers
    return data.rows[0].elements[0].distance.value / 1000;
  } catch (error) {
    console.error('Distance calculation failed:', error);
    throw error;
  }
}