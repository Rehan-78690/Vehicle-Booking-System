'use client';

import { useState, useEffect } from 'react';

// Removed PricingRule type import as it's not needed in JS

export default function PricingPage() {
  const [adminRules, setAdminRules] = useState({
    baseMarkup: 15,
    peakHourMarkup: 25,
    weekendMarkup: 20,
    distanceTiers: [
      { min: 0, max: 50, multiplier: 1.0 },
      { min: 51, max: 200, multiplier: 0.9 },
      { min: 201, max: 500, multiplier: 0.8 },
      { min: 501, max: 999999, multiplier: 0.75 }
    ],
    timeTiers: [
      { name: 'Peak Hours (8AM-10AM, 6PM-8PM)', multiplier: 1.25 },
      { name: 'Regular Hours', multiplier: 1.0 },
      { name: 'Night Hours (10PM-6AM)', multiplier: 1.15 }
    ]
  });

  const [vehicleRules, setVehicleRules] = useState([]);
  const [activeTab, setActiveTab] = useState('vehicles');
  const [isEditing, setIsEditing] = useState(false);
  const [tempAdminRules, setTempAdminRules] = useState(adminRules);
  const [tempVehicleRules, setTempVehicleRules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const tabs = [
    { id: 'vehicles', name: 'Vehicle Pricing', icon: '🚗' },
    { id: 'admin', name: 'Admin Rules', icon: '⚙️' },
    { id: 'distance', name: 'Distance Tiers', icon: '📏' },
    { id: 'time', name: 'Time-based', icon: '⏰' }
  ];

  // Fetch pricing rules from API
  useEffect(() => {
    const fetchPricingRules = async () => {
      try {
        const response = await fetch('/api/pricing');
        const data = await response.json();
        
        // Separate admin config rules and vehicle rules
        const adminConfigRules = data.filter(rule => rule.vehicleType === 'admin_config');
        const vehiclePricingRules = data.filter(rule => rule.vehicleType !== 'admin_config');
        
        // Map to UI structures
        setVehicleRules(vehiclePricingRules.map(mapToVehicleRule));
        setAdminRules(mapToAdminRules(adminConfigRules));
        setTempAdminRules(mapToAdminRules(adminConfigRules));
        setTempVehicleRules(vehiclePricingRules.map(mapToVehicleRule));
        
      } catch (error) {
        console.error('Failed to fetch pricing rules:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPricingRules();
  }, []);

  // Helper to map API rules to admin UI structure
  const mapToAdminRules = (apiRules) => {
    return {
      baseMarkup: apiRules.find(r => r.destinationCategory === 'baseMarkup')?.adjustment || 15,
      peakHourMarkup: apiRules.find(r => r.destinationCategory === 'peakHourMarkup')?.adjustment || 25,
      weekendMarkup: apiRules.find(r => r.destinationCategory === 'weekendMarkup')?.adjustment || 20,
      distanceTiers: JSON.parse(apiRules.find(r => r.destinationCategory === 'distanceTiers')?.condition || '[]'),
      timeTiers: JSON.parse(apiRules.find(r => r.destinationCategory === 'timeTiers')?.condition || '[]')
    };
  };

  // Helper to map API rules to vehicle rule structure
  const mapToVehicleRule = (rule) => ({
    id: rule.id,
    vehicleType: rule.vehicleType,
    destinationCategory: rule.destinationCategory,
    ratePerKm: rule.ratePerKm,
    ratePerHour: rule.ratePerHour,
    ratePerDay: rule.ratePerDay
  });

  // Helper to map UI structures back to API format
  const mapToApiFormat = () => {
    // Admin rules
    const adminRules = [
      {
        vehicleType: 'admin_config',
        destinationCategory: 'baseMarkup',
        adjustment: tempAdminRules.baseMarkup,
        condition: null,
        ratePerKm: null,
        ratePerHour: null,
        ratePerDay: null
      },
      {
        vehicleType: 'admin_config',
        destinationCategory: 'peakHourMarkup',
        adjustment: tempAdminRules.peakHourMarkup,
        condition: null,
        ratePerKm: null,
        ratePerHour: null,
        ratePerDay: null
      },
      {
        vehicleType: 'admin_config',
        destinationCategory: 'weekendMarkup',
        adjustment: tempAdminRules.weekendMarkup,
        condition: null,
        ratePerKm: null,
        ratePerHour: null,
        ratePerDay: null
      },
      {
        vehicleType: 'admin_config',
        destinationCategory: 'distanceTiers',
        condition: JSON.stringify(tempAdminRules.distanceTiers),
        adjustment: null,
        ratePerKm: null,
        ratePerHour: null,
        ratePerDay: null
      },
      {
        vehicleType: 'admin_config',
        destinationCategory: 'timeTiers',
        condition: JSON.stringify(tempAdminRules.timeTiers),
        adjustment: null,
        ratePerKm: null,
        ratePerHour: null,
        ratePerDay: null
      }
    ];

    // Vehicle rules
    const vehicleRules = tempVehicleRules.map(rule => ({
      id: rule.id,
      vehicleType: rule.vehicleType,
      destinationCategory: rule.destinationCategory || null,
      ratePerKm: rule.ratePerKm,
      ratePerHour: rule.ratePerHour,
      ratePerDay: rule.ratePerDay,
      adjustment: null,
      condition: null
    }));

    return [...adminRules, ...vehicleRules];
  };

  const handleEdit = () => {
    setIsEditing(true);
    setTempAdminRules({ ...adminRules });
    setTempVehicleRules([...vehicleRules]);
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Convert UI rules to API format
      const apiRules = mapToApiFormat();
      
      // Send bulk update to API
      const response = await fetch('/api/pricing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiRules)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update pricing rules');
      }
      
      // Update local state
      setAdminRules(tempAdminRules);
      setVehicleRules(tempVehicleRules);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving pricing rules:', error);
      alert('Failed to save pricing rules. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setTempAdminRules(adminRules);
    setTempVehicleRules(vehicleRules);
    setIsEditing(false);
  };

  // Vehicle rule handlers
  const updateVehicleRule = (index, field, value) => {
    setTempVehicleRules(prev => {
      const newRules = [...prev];
      newRules[index] = { ...newRules[index], [field]: value };
      return newRules;
    });
  };

  const addVehicleRule = () => {
    setTempVehicleRules(prev => [
      ...prev,
      {
        id: 0,
        vehicleType: 'sedan',
        destinationCategory: null,
        ratePerKm: 10,
        ratePerHour: 500,
        ratePerDay: 3000
      }
    ]);
  };

  const removeVehicleRule = (index) => {
    setTempVehicleRules(prev => prev.filter((_, i) => i !== index));
  };

  // Admin rule handlers
  const updateAdminRule = (field, value) => {
    setTempAdminRules(prev => ({
      ...prev,
      [field]: typeof value === 'number' ? value : Number(value)
    }));
  };

  const updateDistanceTier = (index, field, value) => {
    setTempAdminRules(prev => ({
      ...prev,
      distanceTiers: prev.distanceTiers.map((tier, i) => 
        i === index ? { ...tier, [field]: Number(value) } : tier
      )
    }));
  };

  const addDistanceTier = () => {
    setTempAdminRules(prev => ({
      ...prev,
      distanceTiers: [
        ...prev.distanceTiers, 
        { min: 0, max: 100, multiplier: 1.0 }
      ]
    }));
  };

  const removeDistanceTier = (index) => {
    setTempAdminRules(prev => ({
      ...prev,
      distanceTiers: prev.distanceTiers.filter((_, i) => i !== index)
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pricing Management</h1>
          <p className="mt-2 text-gray-600">Configure pricing rules for vehicles and markups</p>
        </div>
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Edit Pricing
            </button>
          )}
        </div>
      </div>
      
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Vehicle Pricing Tab */}
          {activeTab === 'vehicles' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Vehicle Pricing</h3>
                {isEditing && (
                  <button
                    onClick={addVehicleRule}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                  >
                    + Add Vehicle
                  </button>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate per km (₹)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate per hour (₹)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate per day (₹)</th>
                      {isEditing && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(isEditing ? tempVehicleRules : vehicleRules).map((rule, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isEditing ? (
                            <input
                              type="text"
                              value={rule.vehicleType}
                              onChange={(e) => updateVehicleRule(index, 'vehicleType', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded-md"
                            />
                          ) : (
                            <span className="text-sm font-medium text-gray-900">{rule.vehicleType}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isEditing ? (
                            <input
                              type="text"
                              value={rule.destinationCategory || ''}
                              onChange={(e) => updateVehicleRule(index, 'destinationCategory', e.target.value || null)}
                              className="w-full px-2 py-1 border border-gray-300 rounded-md"
                            />
                          ) : (
                            <span className="text-sm text-gray-500">{rule.destinationCategory || 'All'}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isEditing ? (
                            <input
                              type="number"
                              step="0.01"
                              value={rule.ratePerKm || ''}
                              onChange={(e) => updateVehicleRule(index, 'ratePerKm', e.target.value ? parseFloat(e.target.value) : null)}
                              className="w-full px-2 py-1 border border-gray-300 rounded-md"
                            />
                          ) : (
                            <span className="text-sm text-gray-900">₹{rule.ratePerKm?.toFixed(2) || 'N/A'}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isEditing ? (
                            <input
                              type="number"
                              step="0.01"
                              value={rule.ratePerHour || ''}
                              onChange={(e) => updateVehicleRule(index, 'ratePerHour', e.target.value ? parseFloat(e.target.value) : null)}
                              className="w-full px-2 py-1 border border-gray-300 rounded-md"
                            />
                          ) : (
                            <span className="text-sm text-gray-900">₹{rule.ratePerHour?.toFixed(2) || 'N/A'}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isEditing ? (
                            <input
                              type="number"
                              step="0.01"
                              value={rule.ratePerDay || ''}
                              onChange={(e) => updateVehicleRule(index, 'ratePerDay', e.target.value ? parseFloat(e.target.value) : null)}
                              className="w-full px-2 py-1 border border-gray-300 rounded-md"
                            />
                          ) : (
                            <span className="text-sm text-gray-900">₹{rule.ratePerDay?.toFixed(2) || 'N/A'}</span>
                          )}
                        </td>
                        {isEditing && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => removeVehicleRule(index)}
                              className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm"
                            >
                              Remove
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Admin Rules Tab */}
          {activeTab === 'admin' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Pricing Markups</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base Markup (%)
                  </label>
                  <input
                    type="number"
                    value={isEditing ? tempAdminRules.baseMarkup : adminRules.baseMarkup}
                    onChange={(e) => updateAdminRule('baseMarkup', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                  <p className="mt-1 text-xs text-gray-500">Applied to all base rates</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Peak Hour Markup (%)
                  </label>
                  <input
                    type="number"
                    value={isEditing ? tempAdminRules.peakHourMarkup : adminRules.peakHourMarkup}
                    onChange={(e) => updateAdminRule('peakHourMarkup', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                  <p className="mt-1 text-xs text-gray-500">8AM-10AM, 6PM-8PM</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weekend Markup (%)
                  </label>
                  <input
                    type="number"
                    value={isEditing ? tempAdminRules.weekendMarkup : adminRules.weekendMarkup}
                    onChange={(e) => updateAdminRule('weekendMarkup', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                  <p className="mt-1 text-xs text-gray-500">Saturday & Sunday</p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Pricing Formula</h4>
                <p className="text-sm text-blue-800">
                  Final Price = (Base Rate × Distance × Distance Multiplier + Time Charges) × 
                  (1 + Base Markup/100) × Time Multiplier × Weekend Multiplier
                </p>
              </div>
            </div>
          )}

          {/* Distance Tiers Tab */}
          {activeTab === 'distance' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Distance-based Pricing Tiers</h3>
                {isEditing && (
                  <button
                    onClick={addDistanceTier}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                  >
                    + Add Tier
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {(isEditing ? tempAdminRules.distanceTiers : adminRules.distanceTiers).map((tier, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Min Distance (km)
                        </label>
                        <input
                          type="number"
                          value={tier.min}
                          onChange={(e) => updateDistanceTier(index, 'min', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Max Distance (km)
                        </label>
                        <input
                          type="number"
                          value={tier.max}
                          onChange={(e) => updateDistanceTier(index, 'max', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Rate Multiplier
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={tier.multiplier}
                          onChange={(e) => updateDistanceTier(index, 'multiplier', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        />
                      </div>
                      {isEditing && (
                        <div>
                          <button
                            onClick={() => removeDistanceTier(index)}
                            className="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">💡 Distance Tier Logic</h4>
                <p className="text-sm text-yellow-800">
                  Lower multipliers for longer distances encourage bulk bookings. For example, 
                  0.8 means 20% discount on the base rate for that distance range.
                </p>
              </div>
            </div>
          )}

          {/* Time-based Tab */}
          {activeTab === 'time' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Time-based Pricing</h3>
              
              <div className="space-y-4">
                {adminRules.timeTiers.map((tier, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{tier.name}</h4>
                        <p className="text-sm text-gray-600">Multiplier: {tier.multiplier}x</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          tier.multiplier > 1 ? 'bg-red-100 text-red-800' : 
                          tier.multiplier === 1 ? 'bg-green-100 text-green-800' : 
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {tier.multiplier > 1 ? '+' : tier.multiplier < 1 ? '-' : ''}
                          {Math.abs((tier.multiplier - 1) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}