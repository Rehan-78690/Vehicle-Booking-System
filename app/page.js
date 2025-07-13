'use client';

import { useState, useEffect } from 'react';
import VehicleSelector from '../components/VehicleSelector';

export default function HomePage() {
  const [formData, setFormData] = useState({
    passengers: 1,
    suitcases: 0
  });
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [inputError, setInputError] = useState('');

  useEffect(() => {
    if (formData.passengers < 1 || formData.suitcases < 0) {
      setInputError('Passengers must be at least 1 and suitcases cannot be negative');
    } else {
      setInputError('');
    }
  }, [formData]);

  return (
    <main className="max-w-2xl mx-auto p-6 bg-red shadow-lg rounded-md mt-70">
      <h1 className="text-2xl font-bold text-center mb-6">🚐 Vehicle Booking & Quotation</h1>

      <div className="mb-4">
        <label htmlFor="passengers" className="block text-sm font-medium bg-red text-gray-700 mb-1">Passengers:</label>
        <input
          id="passengers"
          type="number"
          min="1"
          value={formData.passengers}
          onChange={(e) =>
            setFormData({
              ...formData,
              passengers: Math.max(1, Number(e.target.value))
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="suitcases" className="block text-sm font-medium text-gray-700 mb-1">Suitcases:</label>
        <input
          id="suitcases"
          type="number"
          min="0"
          value={formData.suitcases}
          onChange={(e) =>
            setFormData({
              ...formData,
              suitcases: Math.max(0, Number(e.target.value))
            })
          }
          className="w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {inputError && (
        <div className="text-red-600 mb-4 font-medium">{inputError}</div>
      )}

      <div className="mb-6">
        <VehicleSelector
          passengers={formData.passengers}
          suitcases={formData.suitcases}
          onSelect={setSelectedVehicle}
        />
      </div>

      {selectedVehicle && (
        <div className="bg-blue-100 border border-blue-300 text-blue-900 px-4 py-3 rounded-md">
          <strong className="block">Selected Vehicle:</strong> {selectedVehicle.name}
          <div className="text-sm mt-1">
            (Passengers: {selectedVehicle.passengerCapacity}, Suitcases: {selectedVehicle.suitcaseCapacity})
          </div>
        </div>
      )}
    </main>
  );
}
// export default function Home() {
//     return (
//         <div className="bg-red-500 text-white p-10">
//             <h1 className="text-3xl font-bold">Tailwind is Working!</h1>
//         </div>
//     );
// }


