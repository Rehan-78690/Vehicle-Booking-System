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

export default function DayExcursionForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    city: '',
    date: '',
    pickupTime: '10:00',
    hours: 4,
    travelers: 1,
    visitedCities: [''],
    distance: 0,
    vehicleType: ''
  });
  const [suggestedVehicles, setSuggestedVehicles] = useState([]);

  // Vehicle suggestion logic
  useEffect(() => {
    const filtered = vehicleOptions.filter(
      vehicle => vehicle.maxPassengers >= formData.travelers
    );
    setSuggestedVehicles(filtered);
    if (filtered.length > 0 && !formData.vehicleType) {
      setFormData(prev => ({ ...prev, vehicleType: filtered[0].type }));
    }
  }, [formData.travelers]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCityChange = (index, value) => {
    const newCities = [...formData.visitedCities];
    newCities[index] = value;
    setFormData(prev => ({ ...prev, visitedCities: newCities }));
    
    // Mock distance calculation (replace with Google Maps API call)
    if (formData.city && value) {
      const mockDistance = Math.floor(Math.random() * 200) + 20;
      setFormData(prev => ({ ...prev, distance: mockDistance }));
    }
  };

  const addCity = () => {
    setFormData(prev => ({
      ...prev,
      visitedCities: [...prev.visitedCities, '']
    }));
  };

  const removeCity = (index) => {
    if (formData.visitedCities.length > 1) {
      const newCities = formData.visitedCities.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, visitedCities: newCities }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

return (
  <FormLayout>
    <div className="min-h-screen bg-gray-50 ">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header with Back Button */}
        <div className="bg-[#27368c] p-6 text-white relative">
          <Link href="/quotation" className="absolute left-6 top-6 text-white hover:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-center">Day Excursion</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* City of Service */}
          <div>
            <label className="block text-sm font-medium mb-1">City of Service</label>
            <select
              name="city"
              value={formData.city}
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

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date of Service</label>
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
              <label className="block text-sm font-medium mb-1">Pickup Time</label>
              <input
                type="time"
                name="pickupTime"
                value={formData.pickupTime}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>

          {/* Duration and Travelers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Total Duration (Hours)</label>
              <input
                type="number"
                name="hours"
                min="1"
                max="16"
                value={formData.hours}
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
          </div>

          {/* Visited Cities */}
          <div className="space-y-4">
            <label className="block text-sm font-medium mb-1">Cities Visited</label>
            {formData.visitedCities.map((city, index) => (
              <div key={index} className="flex gap-2 items-end">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => handleCityChange(index, e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md p-2"
                  placeholder="Enter city name"
                  required
                />
                {formData.visitedCities.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCity(index)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addCity}
              className="text-[#27368c] hover:text-[#1a2a6b] font-medium flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add City
            </button>
            
            {/* Distance Display */}
            {formData.distance > 0 && (
              <div className="mt-2">
                <span className="text-sm font-medium">Distance: </span>
                <span className="text-sm">{formData.distance} KM</span>
              </div>
            )}
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
   </FormLayout>);
}    