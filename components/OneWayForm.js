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




export default function OneWayForm({ onSubmit }) {
  const router = useRouter();
  const [allVehicles, setAllVehicles] = useState([]);
  const [suggestedVehicles, setSuggestedVehicles] = useState([]);

  const [routeType, setRouteType] = useState('predefined');
  useEffect(() => {
  const fetchVehicles = async () => {
    try {
      const res = await fetch('/api/vehicles');
      if (!res.ok) throw new Error('Failed to fetch vehicles');
      const data = await res.json();
      setAllVehicles(data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  fetchVehicles();
}, []);
  
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
  if (allVehicles.length === 0) return;

  const filtered = allVehicles.filter(
    vehicle =>
      vehicle.passengerCapacity >= formData.travelers &&
      vehicle.suitcaseCapacity >= formData.luggage
  );

  setSuggestedVehicles(filtered);

  if (filtered.length > 0 && !formData.vehicle_type) {
    setFormData(prev => ({
      ...prev,
      vehicleType: filtered[0].type // use .name if that’s what’s used in the API
    }));
  }
}, [formData.travelers, formData.luggage, allVehicles]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

const handleSubmit = (e) => {
  e.preventDefault();
  onSubmit({ ...formData, routeType });
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
              name="vehicle_type"
              value={formData.vehicle_type}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="">Select Vehicle</option>
             {suggestedVehicles.map(vehicle => (
  <option key={vehicle.id} value={vehicle.type}>
    {vehicle.type} - {vehicle.name} ({vehicle.passengerCapacity} pax, {vehicle.suitcaseCapacity} bags)
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