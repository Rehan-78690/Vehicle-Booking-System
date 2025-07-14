// components/OneWayForm.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const europeanCities = {
  'Paris, France': {
    pickups: ['CDG Airport', 'Orly Airport', 'Gare du Nord', 'Gare de Lyon', 'Hotel Le Bristol'],
    dropoffs: ['Eiffel Tower', 'Louvre Museum', 'Champs-Élysées', 'Montmartre', 'Notre-Dame']
  },
  'Rome, Italy': {
    pickups: ['Fiumicino Airport', 'Ciampino Airport', 'Roma Termini', 'Hotel Hassler'],
    dropoffs: ['Colosseum', 'Vatican City', 'Trevi Fountain', 'Pantheon']
  },
  'London, UK': {
    pickups: ['Heathrow Airport', 'Gatwick Airport', 'King\'s Cross Station', 'The Savoy Hotel'],
    dropoffs: ['Big Ben', 'London Eye', 'Buckingham Palace', 'Tower of London']
  },
  'Berlin, Germany': {
    pickups: ['BER Airport', 'Berlin Hauptbahnhof', 'Hotel Adlon Kempinski'],
    dropoffs: ['Brandenburg Gate', 'Reichstag', 'Berlin Wall Memorial']
  },
  'Madrid, Spain': {
    pickups: ['Adolfo Suárez Airport', 'Atocha Station', 'Hotel Ritz Madrid'],
    dropoffs: ['Prado Museum', 'Royal Palace', 'Plaza Mayor']
  },
  'Amsterdam, Netherlands': {
    pickups: ['Schiphol Airport', 'Amsterdam Centraal', 'Hotel TwentySeven'],
    dropoffs: ['Van Gogh Museum', 'Anne Frank House', 'Rijksmuseum']
  },
  'Vienna, Austria': {
    pickups: ['Vienna Airport', 'Wien Hauptbahnhof', 'Hotel Sacher'],
    dropoffs: ['Schönbrunn Palace', 'St. Stephen\'s Cathedral', 'Belvedere Palace']
  },
  'Brussels, Belgium': {
    pickups: ['Brussels Airport', 'Brussels Central Station', 'Hotel Amigo'],
    dropoffs: ['Grand Place', 'Atomium', 'Manneken Pis']
  },
  'Prague, Czech Republic': {
    pickups: ['Václav Havel Airport', 'Prague Main Station', 'Hotel Paris Prague'],
    dropoffs: ['Charles Bridge', 'Prague Castle', 'Old Town Square']
  },
  'Budapest, Hungary': {
    pickups: ['Budapest Airport', 'Keleti Station', 'Four Seasons Gresham Palace'],
    dropoffs: ['Buda Castle', 'Parliament Building', 'Fisherman\'s Bastion']
  },
  'Warsaw, Poland': {
    pickups: ['Chopin Airport', 'Warsaw Central Station', 'Hotel Bristol'],
    dropoffs: ['Old Town', 'Royal Castle', 'Łazienki Park']
  },
  'Lisbon, Portugal': {
    pickups: ['Humberto Delgado Airport', 'Santa Apolónia Station', 'Hotel Avenida Palace'],
    dropoffs: ['Belém Tower', 'Jerónimos Monastery', 'Alfama District']
  },
  'Dublin, Ireland': {
    pickups: ['Dublin Airport', 'Heuston Station', 'The Shelbourne'],
    dropoffs: ['Trinity College', 'Guinness Storehouse', 'Temple Bar']
  },
  'Stockholm, Sweden': {
    pickups: ['Arlanda Airport', 'Stockholm Central Station', 'Grand Hôtel'],
    dropoffs: ['Gamla Stan', 'Vasa Museum', 'Skansen']
  },
  'Oslo, Norway': {
    pickups: ['Oslo Airport', 'Oslo Central Station', 'The Thief'],
    dropoffs: ['Viking Ship Museum', 'Opera House', 'Frogner Park']
  },
  'Copenhagen, Denmark': {
    pickups: ['Copenhagen Airport', 'København H', 'Hotel d\'Angleterre'],
    dropoffs: ['Tivoli Gardens', 'The Little Mermaid', 'Nyhavn']
  },
  'Athens, Greece': {
    pickups: ['Athens Airport', 'Larissa Station', 'Hotel Grande Bretagne'],
    dropoffs: ['Acropolis', 'Parthenon', 'Plaka District']
  },
  'Zurich, Switzerland': {
    pickups: ['Zurich Airport', 'Zürich HB', 'Baur au Lac'],
    dropoffs: ['Lake Zurich', 'Old Town', 'Bahnhofstrasse']
  }
};

const vehicleOptions = [
  // Sedans
  { id: 1, type: 'Standard Sedan', category: 'Sedan', capacity: '1-2 passengers, 2 suitcases', maxPassengers: 2, maxLuggage: 2 },
  { id: 2, type: 'Premium Sedan', category: 'Sedan', capacity: '1-2 passengers, 2 suitcases', maxPassengers: 2, maxLuggage: 2 },
  // Minivans
  { id: 3, type: 'Standard Minivan (8-seater)', category: 'Minivan', capacity: '1-7 passengers, 6 suitcases', maxPassengers: 7, maxLuggage: 6 },
  { id: 4, type: 'Premium Minivan (8-seater Mercedes)', category: 'Minivan', capacity: '1-7 passengers, 6 suitcases', maxPassengers: 7, maxLuggage: 6 },
  { id: 5, type: 'Standard Minivan (9-seater)', category: 'Minivan', capacity: '1-8 passengers, 6 suitcases', maxPassengers: 8, maxLuggage: 6 },
  { id: 6, type: 'Mercedes Minivan (9-seater)', category: 'Minivan', capacity: '1-8 passengers, 6 suitcases', maxPassengers: 8, maxLuggage: 6 },
  // Sprinters
  { id: 7, type: 'Mercedes Sprinter (9-Seater)', category: 'Sprinter', capacity: '8 passengers, 10 suitcases', maxPassengers: 8, maxLuggage: 10 },
  { id: 8, type: 'Mercedes Sprinter (12-Seater)', category: 'Sprinter', capacity: '11 passengers, 12 suitcases', maxPassengers: 11, maxLuggage: 12 },
  { id: 9, type: 'Mercedes Sprinter (16-Seater)', category: 'Sprinter', capacity: '15 passengers, 14 suitcases', maxPassengers: 15, maxLuggage: 14 },
  { id: 10, type: 'Mercedes Sprinter (19-Seater)', category: 'Sprinter', capacity: '18 passengers, 15 suitcases', maxPassengers: 18, maxLuggage: 15 },
  // Buses
  { id: 11, type: '30-Seater Bus', category: 'Bus', capacity: '29 passengers, 25 suitcases', maxPassengers: 29, maxLuggage: 25 },
  { id: 12, type: '50-Seater Bus', category: 'Bus', capacity: '49 passengers, 45 suitcases', maxPassengers: 49, maxLuggage: 45 },
  { id: 13, type: '54-Seater Bus', category: 'Bus', capacity: '53 passengers, 50 suitcases', maxPassengers: 53, maxLuggage: 50 },
  { id: 14, type: '57-Seater Bus', category: 'Bus', capacity: '56 passengers, 55 suitcases', maxPassengers: 56, maxLuggage: 55 },
  { id: 15, type: '60-Seater Bus', category: 'Bus', capacity: '59 passengers, 58 suitcases', maxPassengers: 59, maxLuggage: 58 },
  { id: 16, type: '77-Seater (Double-Decker)', category: 'Bus', capacity: '76 passengers, 60 suitcases', maxPassengers: 76, maxLuggage: 60 }
];

export default function OneWayForm({ onSubmit }) {
  const router = useRouter();
  const [routeType, setRouteType] = useState('predefined');
  const [formData, setFormData] = useState({
    city: '',
    pickupPoint: '',
    dropoffPoint: '',
    customPickup: '',
    customDropoff: '',
    pickupDate: '',
    pickupTime: '',
    travelers: 1,
    luggage: 1,
    vehicleType: ''
  });
  const [suggestedVehicles, setSuggestedVehicles] = useState([]);

  // Reset pickup/dropoff when city changes
  useEffect(() => {
    if (formData.city) {
      setFormData(prev => ({
        ...prev,
        pickupPoint: '',
        dropoffPoint: ''
      }));
    }
  }, [formData.city]);

  // Vehicle suggestion logic
  useEffect(() => {
    const filtered = vehicleOptions.filter(
      vehicle => vehicle.maxPassengers >= formData.travelers && 
                vehicle.maxLuggage >= formData.luggage
    );
    setSuggestedVehicles(filtered);
    if (filtered.length > 0 && !formData.vehicleType) {
      setFormData(prev => ({ ...prev, vehicleType: filtered[0].type }));
    }
  }, [formData.travelers, formData.luggage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header with Back Button */}
        <div className="bg-[#27368c] p-6 text-white relative">
          <Link href="/quotation" className="absolute left-6 top-6 text-white hover:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-center">One-Way Transfer</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Route Type Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Route Type</h3>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="routeType"
                  checked={routeType === 'predefined'}
                  onChange={() => setRouteType('predefined')}
                  className="text-[#b82025] focus:ring-[#b82025]"
                />
                Predefined Route
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="routeType"
                  checked={routeType === 'custom'}
                  onChange={() => setRouteType('custom')}
                  className="text-[#b82025] focus:ring-[#b82025]"
                />
                Custom Route
              </label>
            </div>

            {/* Predefined Route Fields */}
            {routeType === 'predefined' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                  >
                    <option value="">Select European City</option>
                    {Object.keys(europeanCities).map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Pickup Point</label>
                  <select
                    name="pickupPoint"
                    value={formData.pickupPoint}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                    disabled={!formData.city}
                  >
                    <option value="">Select Pickup</option>
                    {formData.city && europeanCities[formData.city].pickups.map(point => (
                      <option key={point} value={point}>{point}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Drop-off Point</label>
                  <select
                    name="dropoffPoint"
                    value={formData.dropoffPoint}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                    disabled={!formData.city}
                  >
                    <option value="">Select Drop-off</option>
                    {formData.city && europeanCities[formData.city].dropoffs.map(point => (
                      <option key={point} value={point}>{point}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Custom Route Fields */}
            {routeType === 'custom' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Pickup Location</label>
                  <input
                    type="text"
                    name="customPickup"
                    value={formData.customPickup}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                    placeholder="Full address"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Drop-off Location</label>
                  <input
                    type="text"
                    name="customDropoff"
                    value={formData.customDropoff}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                    placeholder="Full address"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* Common Fields */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Pickup Date</label>
              <input
                type="date"
                name="pickupDate"
                value={formData.pickupDate}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Pickup Time</label>
              <input
                type="time"
                name="pickupTime"
                value={formData.pickupTime}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Number of Travelers</label>
              <input
                type="number"
                name="travelers"
                min="1"
                value={formData.travelers}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Number of Suitcases</label>
              <input
                type="number"
                name="luggage"
                min="0"
                value={formData.luggage}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
          </div>

          {/* Vehicle Selection */}
          <div>
            <label className="block text-sm font-medium mb-1">Vehicle Type</label>
            <select
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="">Select Vehicle</option>
              {suggestedVehicles.map(vehicle => (
                <option key={vehicle.id} value={vehicle.type}>
                  {vehicle.type} ({vehicle.capacity})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="bg-[#b82025] text-white px-6 py-2 rounded-md hover:bg-[#9a1a1f]"
            >
              Get Quote
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}