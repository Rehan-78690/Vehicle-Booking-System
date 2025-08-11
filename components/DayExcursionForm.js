// components/DayExcursionForm.js
'use client';
import FormLayout from './FormLayout';
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



export default function DayExcursionForm({ onPriceCalculated, onSubmit }) {
  const [formData, setFormData] = useState({
    city: '',
    date: '',
    pickupTime: '10:00',
    hours: 4,
    travelers: 1,
    visitedCity: '',
    distance: 0, // Temporary manual input field (to be replaced with Google Maps API later)
    vehicleType: '',
  });

  const [suggestedVehicles, setSuggestedVehicles] = useState([]);
  const [price, setPrice] = useState(null);
  const [error, setError] = useState(null);
  const [allVehicles, setAllVehicles] = useState([]);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data before submission:', formData); // Debug log
    if (!formData.vehicleType || !formData.distance || !formData.hours) {
      setError('Please fill all required fields (vehicle, distance, hours)');
      return;
    }
    if (onSubmit) onSubmit(formData); // Pass form data to parent
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <FormLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-[#27368c] p-6 text-white relative">
            <Link href="/quotation" className="absolute left-6 top-6 text-white hover:text-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-center">Day Excursion</h1>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">City of Service *</label>
              <select
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select City</option>
                {Object.keys(europeanCities).map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Date of Service *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  min={today}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Pickup Time *</label>
                <input
                  type="time"
                  name="pickupTime"
                  value={formData.pickupTime}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Total Duration (Hours) *</label>
                <input
                  type="number"
                  name="hours"
                  min="1"
                  max="16"
                  value={formData.hours}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 4 hours, maximum 16 hours</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Number of Travelers *</label>
                <input
                  type="number"
                  name="travelers"
                  min="1"
                  max="100"
                  value={formData.travelers}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Visited City / Main Destination *</label>
              <input
                type="text"
                name="visitedCity"
                value={formData.visitedCity}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter destination city"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Distance (KM) * {/* Temporary field; will be calculated automatically with Google Maps API */}
              </label>
              <input
                type="number"
                name="distance"
                value={formData.distance}
                onChange={handleInputChange}
                min="0"
                step="0.1"
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="Enter distance in kilometers"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Vehicle Type *</label>
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Vehicle</option>
              {suggestedVehicles.map(vehicle => (
  <option key={vehicle.id} value={vehicle.type}>
    {vehicle.type} - {vehicle.name} ({vehicle.passengerCapacity} pax, {vehicle.suitcaseCapacity} bags)
  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Vehicles filtered based on number of travelers</p>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="bg-[#b82025] text-white px-6 py-3 rounded-md hover:bg-[#9a1a1f] transition-colors font-medium shadow-md hover:shadow-lg"
              >
                Get Quote
              </button>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {price && <p>Total Price: ${price}</p>}
          </form>
        </div>
      </div>
    </FormLayout>
  );
}