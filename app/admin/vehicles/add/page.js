'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddVehiclePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    capacity: '',
    luggage: '',
    baseRate: '',
    hourlyRate: '',
    description: '',
    features: [],
    status: 'Active'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const vehicleTypes = [
    { value: 'Car', label: 'Car' },
    { value: 'SUV', label: 'SUV' },
    { value: 'Van', label: 'Van' },
    { value: 'Bus', label: 'Bus' },
    { value: 'Luxury', label: 'Luxury Car' }
  ];

  const availableFeatures = [
    'Air Conditioning',
    'GPS Navigation',
    'WiFi',
    'Entertainment System',
    'Reclining Seats',
    'USB Charging',
    'Bluetooth',
    'Leather Seats'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Vehicle name is required';
    if (!formData.type) newErrors.type = 'Vehicle type is required';
    if (!formData.capacity || formData.capacity < 1) newErrors.capacity = 'Valid capacity is required';
    if (!formData.luggage || formData.luggage < 0) newErrors.luggage = 'Valid luggage capacity is required';
    if (!formData.baseRate || formData.baseRate < 0) newErrors.baseRate = 'Valid base rate is required';
    if (!formData.hourlyRate || formData.hourlyRate < 0) newErrors.hourlyRate = 'Valid hourly rate is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would make the actual API call to save the vehicle
      console.log('Vehicle data to save:', formData);
      
      // Redirect to vehicles list
      router.push('/admin/vehicles');
    } catch (error) {
      console.error('Error saving vehicle:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Vehicle</h1>
          <p className="mt-2 text-gray-600">Create a new vehicle entry for your fleet</p>
        </div>
        <Link
          href="/admin/vehicles"
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
        >
          ← Back to Vehicles
        </Link>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Vehicle Information</h2>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., Toyota Innova"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Type *
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.type ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select vehicle type</option>
                {vehicleTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
            </div>
          </div>

          {/* Capacity Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
                Passenger Capacity *
              </label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                min="1"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.capacity ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., 7"
              />
              {errors.capacity && <p className="mt-1 text-sm text-red-600">{errors.capacity}</p>}
            </div>

            <div>
              <label htmlFor="luggage" className="block text-sm font-medium text-gray-700 mb-2">
                Luggage Capacity *
              </label>
              <input
                type="number"
                id="luggage"
                name="luggage"
                value={formData.luggage}
                onChange={handleInputChange}
                min="0"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.luggage ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., 4"
              />
              {errors.luggage && <p className="mt-1 text-sm text-red-600">{errors.luggage}</p>}
            </div>
          </div>

          {/* Pricing Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="baseRate" className="block text-sm font-medium text-gray-700 mb-2">
                Base Rate (₹/km) *
              </label>
              <input
                type="number"
                id="baseRate"
                name="baseRate"
                value={formData.baseRate}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.baseRate ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., 15.50"
              />
              {errors.baseRate && <p className="mt-1 text-sm text-red-600">{errors.baseRate}</p>}
            </div>

            <div>
              <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-2">
                Hourly Rate (₹/hour) *
              </label>
              <input
                type="number"
                id="hourlyRate"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.hourlyRate ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., 200.00"
              />
              {errors.hourlyRate && <p className="mt-1 text-sm text-red-600">{errors.hourlyRate}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Brief description of the vehicle..."
            />
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Features
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availableFeatures.map(feature => (
                <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.features.includes(feature)}
                    onChange={() => handleFeatureToggle(feature)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{feature}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Form Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          <Link
            href="/admin/vehicles"
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Save Vehicle'}
          </button>
        </div>
      </form>
    </div>
  );
}

