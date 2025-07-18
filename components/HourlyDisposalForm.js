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



export default function HourlyDisposalForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    date: '',
    city: '',
    hours: 1,
    people: 1,
    vehicleType: ''
  });
  const [allVehicles, setAllVehicles] = useState([]);
  const [suggestedVehicles, setSuggestedVehicles] = useState([]);

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
    (vehicle) => vehicle.passengerCapacity >= formData.people
  );
  setSuggestedVehicles(filtered);
  if (filtered.length > 0 && !formData.vehicleType) {
    setFormData((prev) => ({ ...prev, vehicleType: filtered[0].type }));
  }
}, [formData.people, allVehicles]);


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
    <div className="min-h-screen bg-gray-50">
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