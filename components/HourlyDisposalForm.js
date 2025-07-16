// components/HourlyDisposalForm.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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
  'Birmingham, UK': {}
};

const vehicleOptions = [
  // Sedans
  { id: 1, type: 'Standard Sedan', category: 'Sedan', capacity: '1-2 passengers, 2 suitcases', maxPassengers: 2, maxLuggage: 2 },
  { id: 2, type: 'Premium Sedan (Mercedes E-Class/BMW/Audi)', category: 'Sedan', capacity: '1-2 passengers, 2 suitcases', maxPassengers: 2, maxLuggage: 2 },
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

export default function HourlyDisposalForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    date: '',
    city: '',
    hours: 1,
    people: 1,
    vehicleType: ''
  });
  const [suggestedVehicles, setSuggestedVehicles] = useState([]);

  // Vehicle suggestion logic
  useEffect(() => {
    const filtered = vehicleOptions.filter(
      vehicle => vehicle.maxPassengers >= formData.people
    );
    setSuggestedVehicles(filtered);
    if (filtered.length > 0 && !formData.vehicleType) {
      setFormData(prev => ({ ...prev, vehicleType: filtered[0].type }));
    }
  }, [formData.people]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header with Back Button */}
        <div className="bg-[#27368c] p-6 text-white relative">
          <Link href="/quotation" className="absolute left-6 top-6 text-white hover:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-center">Hourly Disposal</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Date Field */}
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          {/* City Selection */}
          <div>
            <label className="block text-sm font-medium mb-1">Pickup City</label>
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

          {/* Hours and People */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <label className="block text-sm font-medium mb-1">No. of People</label>
              <input
                type="number"
                name="people"
                min="1"
                value={formData.people}
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