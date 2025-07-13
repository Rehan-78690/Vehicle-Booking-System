'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);

  // Mock data - replace with actual API calls
  useEffect(() => {
    setVehicles([
      {
        id: 1,
        name: 'Sedan',
        type: 'Car',
        capacity: 4,
        luggage: 2,
        baseRate: 12,
        hourlyRate: 150,
        image: '/images/sedan.jpg',
        status: 'Active'
      },
      {
        id: 2,
        name: 'SUV',
        type: 'Car',
        capacity: 7,
        luggage: 4,
        baseRate: 18,
        hourlyRate: 250,
        image: '/images/suv.jpg',
        status: 'Active'
      },
      {
        id: 3,
        name: 'Tempo Traveller',
        type: 'Van',
        capacity: 12,
        luggage: 8,
        baseRate: 25,
        hourlyRate: 400,
        image: '/images/tempo.jpg',
        status: 'Active'
      },
      {
        id: 4,
        name: 'Bus',
        type: 'Bus',
        capacity: 35,
        luggage: 20,
        baseRate: 35,
        hourlyRate: 600,
        image: '/images/bus.jpg',
        status: 'Inactive'
      }
    ]);
  }, []);

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (vehicle) => {
    setVehicleToDelete(vehicle);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setVehicles(vehicles.filter(v => v.id !== vehicleToDelete.id));
    setShowDeleteModal(false);
    setVehicleToDelete(null);
  };

  const toggleStatus = (id) => {
    setVehicles(vehicles.map(vehicle => 
      vehicle.id === id 
        ? { ...vehicle, status: vehicle.status === 'Active' ? 'Inactive' : 'Active' }
        : vehicle
    ));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vehicle Management</h1>
          <p className="mt-2 text-gray-600">Manage your fleet of vehicles and their configurations</p>
        </div>
        <Link
          href="/admin/vehicles/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <span>+</span>
          <span>Add Vehicle</span>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="sr-only">Search vehicles</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id="search"
                type="text"
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
              <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <span className="text-4xl">{vehicle.type === 'Car' ? '🚗' : vehicle.type === 'Van' ? '🚐' : '🚌'}</span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{vehicle.name}</h3>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  vehicle.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {vehicle.status}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{vehicle.type}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Capacity:</span>
                  <span className="font-medium">{vehicle.capacity} passengers</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Luggage:</span>
                  <span className="font-medium">{vehicle.luggage} bags</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Base Rate:</span>
                  <span className="font-medium">₹{vehicle.baseRate}/km</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Hourly Rate:</span>
                  <span className="font-medium">₹{vehicle.hourlyRate}/hr</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Link
                  href={`/admin/vehicles/${vehicle.id}/edit`}
                  className="flex-1 bg-blue-600 text-white text-center py-2 px-3 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  Edit
                </Link>
                <button
                  onClick={() => toggleStatus(vehicle.id)}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors duration-200 ${
                    vehicle.status === 'Active'
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  {vehicle.status === 'Active' ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleDelete(vehicle)}
                  className="bg-red-100 text-red-800 py-2 px-3 rounded-md text-sm font-medium hover:bg-red-200 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🚗</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first vehicle.'}
          </p>
          <Link
            href="/admin/vehicles/add"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Add Vehicle
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Vehicle
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete "{vehicleToDelete?.name}"? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

