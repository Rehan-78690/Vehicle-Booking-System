// components/IntercityTransferForm.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import FormLayout from './FormLayout';

// Reuse the same europeanCities and vehicleOptions from previous forms
const europeanCities = {
  'Paris, France': {},
  'Rome, Italy': {},
  'London, UK': {},
  'Berlin, Germany': {},
  'Madrid, Spain': {},
  'Amsterdam, Netherlands': {},
  'Vienna, Austria': {},
  'Brussels, Belgium': {},
  'Prague, Czech Republic': {},
  'Budapest, Hungary': {},
  'Warsaw, Poland': {},
  'Lisbon, Portugal': {},
  'Dublin, Ireland': {},
  'Stockholm, Sweden': {},
  'Oslo, Norway': {},
  'Copenhagen, Denmark': {},
  'Athens, Greece': {},
  'Zurich, Switzerland': {},
  'Munich, Germany': {},
  'Milan, Italy': {},
  'Barcelona, Spain': {},
  'Edinburgh, UK': {},
  'Helsinki, Finland': {},
  'Reykjavik, Iceland': {},
  'Luxembourg City, Luxembourg': {},
  'Monaco, Monaco': {},
  'Dubrovnik, Croatia': {},
  'Santorini, Greece': {},
  'Nice, France': {},
  'Venice, Italy': {},
  'Florence, Italy': {},
  'Naples, Italy': {},
  'Porto, Portugal': {},
  'Seville, Spain': {},
  'Valencia, Spain': {},
  'Geneva, Switzerland': {},
  'Salzburg, Austria': {},
  'Krakow, Poland': {},
  'Gdańsk, Poland': {},
  'Bratislava, Slovakia': {},
  'Ljubljana, Slovenia': {},
  'Zagreb, Croatia': {},
  'Belgrade, Serbia': {},
  'Bucharest, Romania': {},
  'Sofia, Bulgaria': {},
  'Thessaloniki, Greece': {},
  'Tallinn, Estonia': {},
  'Riga, Latvia': {},
  'Vilnius, Lithuania': {},
  'Bergen, Norway': {},
  'Gothenburg, Sweden': {},
  'Malmo, Sweden': {},
  'Aarhus, Denmark': {},
  'Galway, Ireland': {},
  'Cardiff, UK': {},
  'Manchester, UK': {},
  'Glasgow, UK': {},
  'Birmingham, UK': {},
  'Lyon, France': {},
  'Marseille, France': {},
  'Turin, Italy': {},
  'Verona, Italy': {},
  'Bilbao, Spain': {},
  'Granada, Spain': {},
  'Rotterdam, Netherlands': {},
  'The Hague, Netherlands': {},
  'Ghent, Belgium': {},
  'Antwerp, Belgium': {},
  'Wroclaw, Poland': {},
  'Kraków, Poland': {},
  'Bratislava, Slovakia': {},
  'Brasov, Romania': {},
  'Split, Croatia': {},
  'Zadar, Croatia': {},
  'Sarajevo, Bosnia': {},
  'Podgorica, Montenegro': {},
  'Tirana, Albania': {},
  'Skopje, North Macedonia': {}
};

export default function IntercityTransferForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    date: '',
    pickupCity: '',
    hours: 1,
    travelers: 1,
    luggage: 1,
    vehicleType: '',
    dropoffCity: '',
    distance: 0
  });
  const [suggestedVehicles, setSuggestedVehicles] = useState([]);
  const [allVehicles, setAllVehicles] = useState([]);

//fetching vehicles dynamically
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

  // Vehicle suggestion logic
  useEffect(() => {
  if (allVehicles.length === 0) return;
  const filtered = allVehicles.filter(
    (vehicle) => vehicle.passengerCapacity >= formData.travelers
  );
  setSuggestedVehicles(filtered);
  if (filtered.length > 0 && !formData.vehicleType) {
    setFormData((prev) => ({ ...prev, vehicleType: filtered[0].type }));
  }
}, [formData.travelers, allVehicles]);

  // Mock distance calculation when cities are selected
  useEffect(() => {
    if (formData.pickupCity && formData.dropoffCity) {
      const mockDistance = Math.floor(Math.random() * 500) + 50;
      setFormData(prev => ({ ...prev, distance: mockDistance }));
    }
  }, [formData.pickupCity, formData.dropoffCity]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
 
      <div className="min-h-screen bg-gray-50 ">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header with Back Button */}
          <div className="bg-[#27368c] p-4 text-white relative">
            <Link href="/quotation" className="absolute left-3 top-5 text-white hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-center">Intercity Transfer with Disposal</h1>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Date and Cities */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Pickup City</label>
                <select
                  name="pickupCity"
                  value={formData.pickupCity}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                >
                  <option value="">Select City</option>
                  {Object.keys(europeanCities).map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Dropping City</label>
                <select
                  name="dropoffCity"
                  value={formData.dropoffCity}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                >
                  <option value="">Select City</option>
                  {Object.keys(europeanCities).map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Distance Display */}
            {formData.distance > 0 && (
              <div className="text-right">
                <span className="text-sm font-medium">Estimated Distance: </span>
                <span className="text-sm">{formData.distance} KM</span>
              </div>
            )}

            {/* Hours and Passengers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">No. of Hours</label>
                <input
                  type="number"
                  name="hours"
                  min="1"
                  value={formData.hours}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">No. of Travellers</label>
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
                <label className="block text-sm font-medium mb-1">No. of Luggages</label>
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