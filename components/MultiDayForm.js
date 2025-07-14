// components/MultiDayForm.js
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
  { id: 16, type: '77-Seater (Double-Decker)', category: 'Bus', capacity: '76 passengers, 60 suitcases', maxPassengers: 76, maxLuggage: 60 },
  // Additional vehicles
  { id: 17, type: 'Executive Sedan', category: 'Sedan', capacity: '1-3 passengers, 3 suitcases', maxPassengers: 3, maxLuggage: 3 },
  { id: 18, type: 'Luxury Minivan', category: 'Minivan', capacity: '1-6 passengers, 8 suitcases', maxPassengers: 6, maxLuggage: 8 },
  { id: 19, type: 'Executive Sprinter', category: 'Sprinter', capacity: '8 passengers, 12 suitcases', maxPassengers: 8, maxLuggage: 12 },
  { id: 20, type: 'Wheelchair Accessible Vehicle', category: 'Special', capacity: '1-4 passengers, 2 suitcases', maxPassengers: 4, maxLuggage: 2 }
];

const serviceTypes = ['Full Day', 'One-way Transfer'];

export default function MultiDayForm({ onSubmit }) {
  const [startDate, setStartDate] = useState('');
  const [days, setDays] = useState([
    { dayNumber: 1, date: '', city: '', serviceType: 'Full Day' },
    { dayNumber: 2, date: '', city: '', serviceType: 'Full Day' }
  ]);
  const [formData, setFormData] = useState({
    travelers: 1,
    luggage: 1,
    vehicleType: '',
    pickupLocation: '',
    dropoffLocation: ''
  });
  const [suggestedVehicles, setSuggestedVehicles] = useState([]);

  // Update dates when start date changes
  useEffect(() => {
    if (startDate) {
      const newDays = days.map((day, index) => {
        const date = new Date(startDate);
        date.setDate(date.getDate() + index);
        return {
          ...day,
          date: date.toISOString().split('T')[0]
        };
      });
      setDays(newDays);
    }
  }, [startDate]);

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

  const handleDayChange = (index, field, value) => {
    const newDays = [...days];
    newDays[index] = { ...newDays[index], [field]: value };
    setDays(newDays);
  };

  const addDay = () => {
    const newDayNumber = days.length + 1;
    const date = new Date(startDate);
    date.setDate(date.getDate() + days.length);
    
    setDays([
      ...days,
      {
        dayNumber: newDayNumber,
        date: date.toISOString().split('T')[0],
        city: '',
        serviceType: 'Full Day'
      }
    ]);
  };

  const removeDay = (index) => {
    if (days.length > 2) {
      const newDays = days.filter((_, i) => i !== index)
                         .map((day, i) => ({ ...day, dayNumber: i + 1 }));
      setDays(newDays);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formPayload = {
      startDate,
      itinerary: days,
      ...formData
    };
    onSubmit(formPayload);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header with Back Button */}
        <div className="bg-[#27368c] p-6 text-white relative">
          <Link href="/quotation" className="absolute left-6 top-6 text-white hover:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-center">Multi-City Multi-Day Disposal</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Tour Starting Date */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Tour Starting Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          {/* Daily Itinerary */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Daily Itinerary</h3>
            {days.map((day, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 border-b pb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Day {day.dayNumber}</label>
                  <input
                    type="text"
                    value={day.date}
                    readOnly
                    className="w-full border border-gray-300 rounded-md p-2 bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Overnight City</label>
                  <select
                    value={day.city}
                    onChange={(e) => handleDayChange(index, 'city', e.target.value)}
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
                  <label className="block text-sm font-medium mb-1">Service Type</label>
                  <select
                    value={day.serviceType}
                    onChange={(e) => handleDayChange(index, 'serviceType', e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                  >
                    {serviceTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                {days.length > 2 && (
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeDay(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addDay}
              className="text-[#27368c] hover:text-[#1a2a6b] font-medium"
            >
              + Add Day
            </button>
          </div>

          {/* Additional Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Total Number of Travelers</label>
              <input
                type="number"
                min="1"
                value={formData.travelers}
                onChange={(e) => setFormData({...formData, travelers: parseInt(e.target.value)})}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Number of Suitcases</label>
              <input
                type="number"
                min="0"
                value={formData.luggage}
                onChange={(e) => setFormData({...formData, luggage: parseInt(e.target.value)})}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Vehicle Type</label>
            <select
              value={formData.vehicleType}
              onChange={(e) => setFormData({...formData, vehicleType: e.target.value})}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Pickup Location (Day 1)</label>
              <input
                type="text"
                value={formData.pickupLocation}
                onChange={(e) => setFormData({...formData, pickupLocation: e.target.value})}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Full address"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Final Drop-off Location</label>
              <input
                type="text"
                value={formData.dropoffLocation}
                onChange={(e) => setFormData({...formData, dropoffLocation: e.target.value})}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Full address"
                required
              />
            </div>
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