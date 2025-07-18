'use client';

import { useState, useEffect } from 'react';

// Helper to map API rules to UI structure
const mapApiToUi = (apiRules) => {
  // Find admin configuration rules
  const adminRules = apiRules.filter(rule => rule.vehicleType === 'admin_config');
  
  // Create UI structure from API rules
  return {
    baseMarkup: adminRules.find(r => r.destinationCategory === 'baseMarkup')?.adjustment || 15,
    peakHourMarkup: adminRules.find(r => r.destinationCategory === 'peakHourMarkup')?.adjustment || 25,
    weekendMarkup: adminRules.find(r => r.destinationCategory === 'weekendMarkup')?.adjustment || 20,
    distanceTiers: JSON.parse(adminRules.find(r => r.destinationCategory === 'distanceTiers')?.condition || '[]'),
    timeTiers: JSON.parse(adminRules.find(r => r.destinationCategory === 'timeTiers')?.condition || '[]')
  };
};

// Helper to map UI structure to API rules
const mapUiToApi = (uiRules) => {
  return [
    {
      vehicleType: 'admin_config',
      destinationCategory: 'baseMarkup',
      adjustment: uiRules.baseMarkup
    },
    {
      vehicleType: 'admin_config',
      destinationCategory: 'peakHourMarkup',
      adjustment: uiRules.peakHourMarkup
    },
    {
      vehicleType: 'admin_config',
      destinationCategory: 'weekendMarkup',
      adjustment: uiRules.weekendMarkup
    },
    {
      vehicleType: 'admin_config',
      destinationCategory: 'distanceTiers',
      condition: JSON.stringify(uiRules.distanceTiers)
    },
    {
      vehicleType: 'admin_config',
      destinationCategory: 'timeTiers',
      condition: JSON.stringify(uiRules.timeTiers)
    }
  ];
};

export default function PricingPage() {
  const [pricingRules, setPricingRules] = useState({
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

  const [activeTab, setActiveTab] = useState('general');
  const [isEditing, setIsEditing] = useState(false);
  const [tempRules, setTempRules] = useState(pricingRules);
  const [isLoading, setIsLoading] = useState(true);

  const tabs = [
    { id: 'general', name: 'General Pricing', icon: '💰' },
    { id: 'distance', name: 'Distance Tiers', icon: '📏' },
    { id: 'time', name: 'Time-based', icon: '⏰' },
    { id: 'special', name: 'Special Rules', icon: '⭐' }
  ];

  // Fetch pricing rules from API
  useEffect(() => {
    const fetchPricingRules = async () => {
      try {
        const response = await fetch('/api/pricing');
        const data = await response.json();
        
        if (data && data.length > 0) {
          const uiRules = mapApiToUi(data);
          setPricingRules(uiRules);
          setTempRules(uiRules);
        }
      } catch (error) {
        console.error('Failed to fetch pricing rules:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPricingRules();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setTempRules({ ...pricingRules });
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Convert UI rules to API format
      const apiRules = mapUiToApi(tempRules);
      
      // Update each rule in the backend
      await Promise.all(apiRules.map(async (rule) => {
        const response = await fetch('/api/pricing', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'update',
            vehicleType: rule.vehicleType,
            destinationCategory: rule.destinationCategory,
            adjustment: rule.adjustment,
            condition: rule.condition
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to update pricing rule');
        }
      }));
      
      // Update local state
      setPricingRules(tempRules);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving pricing rules:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setTempRules(pricingRules);
    setIsEditing(false);
  };

  const updateGeneralRule = (field, value) => {
    setTempRules(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const updateDistanceTier = (index, field, value) => {
    setTempRules(prev => ({
      ...prev,
      distanceTiers: prev.distanceTiers.map((tier, i) => 
        i === index ? { ...tier, [field]: parseFloat(value) || 0 } : tier
      )
    }));
  };

  const addDistanceTier = () => {
    setTempRules(prev => ({
      ...prev,
      distanceTiers: [...prev.distanceTiers, { min: 0, max: 100, multiplier: 1.0 }]
    }));
  };

  const removeDistanceTier = (index) => {
    setTempRules(prev => ({
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
          <p className="mt-2 text-gray-600">Configure pricing rules and markups for your transport services</p>
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
          {/* General Pricing Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">General Markup Rules</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base Markup (%)
                  </label>
                  <input
                    type="number"
                    value={isEditing ? tempRules.baseMarkup : pricingRules.baseMarkup}
                    onChange={(e) => updateGeneralRule('baseMarkup', e.target.value)}
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
                    value={isEditing ? tempRules.peakHourMarkup : pricingRules.peakHourMarkup}
                    onChange={(e) => updateGeneralRule('peakHourMarkup', e.target.value)}
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
                    value={isEditing ? tempRules.weekendMarkup : pricingRules.weekendMarkup}
                    onChange={(e) => updateGeneralRule('weekendMarkup', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                  <p className="mt-1 text-xs text-gray-500">Saturday & Sunday</p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Pricing Formula</h4>
                <p className="text-sm text-blue-800">
                  Final Price = (Base Rate × Distance × Distance Multiplier + Time Charges) × (1 + Base Markup/100) × Time Multiplier × Weekend Multiplier
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
                {(isEditing ? tempRules.distanceTiers : pricingRules.distanceTiers).map((tier, index) => (
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
                  Lower multipliers for longer distances encourage bulk bookings. For example, 0.8 means 20% discount on the base rate for that distance range.
                </p>
              </div>
            </div>
          )}

          {/* Time-based Tab */}
          {activeTab === 'time' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Time-based Pricing</h3>
              
              <div className="space-y-4">
                {pricingRules.timeTiers.map((tier, index) => (
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

          {/* Special Rules Tab */}
          {activeTab === 'special' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Special Pricing Rules</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Minimum Charges</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">One-way minimum:</span>
                      <span className="font-medium">₹500</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Round-trip minimum:</span>
                      <span className="font-medium">₹800</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Multi-day minimum:</span>
                      <span className="font-medium">₹2000/day</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Additional Charges</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Driver allowance:</span>
                      <span className="font-medium">₹300/day</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Toll charges:</span>
                      <span className="font-medium">As applicable</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Parking charges:</span>
                      <span className="font-medium">As applicable</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">🎯 Optimization Tips</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Use distance tiers to encourage longer bookings</li>
                  <li>• Peak hour pricing helps manage demand</li>
                  <li>• Weekend markups account for higher operational costs</li>
                  <li>• Regular review of pricing ensures competitivenes</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    

   
  </div>
  );
}