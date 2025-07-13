'use client';

import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    googleMapsApiKey: '',
    companyName: 'Transport Solutions',
    companyEmail: 'info@transportsolutions.com',
    companyPhone: '+91 9876543210',
    companyAddress: '123 Business Street, Mumbai, Maharashtra 400001',
    quotationValidityDays: 7,
    emailNotifications: true,
    smsNotifications: false,
    autoConfirmQuotes: false,
    defaultCurrency: 'INR',
    timeZone: 'Asia/Kolkata',
    businessHours: {
      start: '09:00',
      end: '18:00'
    }
  });

  const [activeTab, setActiveTab] = useState('general');
  const [isEditing, setIsEditing] = useState(false);
  const [tempSettings, setTempSettings] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'api', name: 'API Keys', icon: '🔑' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'business', name: 'Business Info', icon: '🏢' }
  ];

  const handleEdit = () => {
    setIsEditing(true);
    setTempSettings({ ...settings });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSettings(tempSettings);
      setIsEditing(false);
      console.log('Settings saved:', tempSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempSettings(settings);
    setIsEditing(false);
  };

  const updateSetting = (key, value) => {
    setTempSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateNestedSetting = (parent, key, value) => {
    setTempSettings(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [key]: value
      }
    }));
  };

  const testGoogleMapsApi = async () => {
    if (!tempSettings.googleMapsApiKey) {
      alert('Please enter a Google Maps API key first');
      return;
    }
    
    try {
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Google Maps API key is valid!');
    } catch (error) {
      alert('Google Maps API key test failed. Please check your key.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-600">Configure your system settings and preferences</p>
        </div>
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Edit Settings
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
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">General Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Currency
                  </label>
                  <select
                    value={isEditing ? tempSettings.defaultCurrency : settings.defaultCurrency}
                    onChange={(e) => updateSetting('defaultCurrency', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  >
                    <option value="INR">Indian Rupee (₹)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Zone
                  </label>
                  <select
                    value={isEditing ? tempSettings.timeZone : settings.timeZone}
                    onChange={(e) => updateSetting('timeZone', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quotation Validity (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={isEditing ? tempSettings.quotationValidityDays : settings.quotationValidityDays}
                    onChange={(e) => updateSetting('quotationValidityDays', parseInt(e.target.value))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Auto-confirm Quotes
                  </label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isEditing ? tempSettings.autoConfirmQuotes : settings.autoConfirmQuotes}
                      onChange={(e) => updateSetting('autoConfirmQuotes', e.target.checked)}
                      disabled={!isEditing}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Automatically confirm quotes without manual approval
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Business Hours</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={isEditing ? tempSettings.businessHours.start : settings.businessHours.start}
                      onChange={(e) => updateNestedSetting('businessHours', 'start', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={isEditing ? tempSettings.businessHours.end : settings.businessHours.end}
                      onChange={(e) => updateNestedSetting('businessHours', 'end', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* API Keys Tab */}
          {activeTab === 'api' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">API Configuration</h3>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">🔐 Security Notice</h4>
                <p className="text-sm text-yellow-800">
                  API keys are sensitive information. Ensure they are kept secure and not shared publicly.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Maps API Key
                </label>
                <div className="flex space-x-3">
                  <input
                    type="password"
                    value={isEditing ? tempSettings.googleMapsApiKey : settings.googleMapsApiKey}
                    onChange={(e) => updateSetting('googleMapsApiKey', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Enter your Google Maps API key"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                  {isEditing && (
                    <button
                      onClick={testGoogleMapsApi}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                    >
                      Test API
                    </button>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Required for distance calculation and route optimization
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">📚 Setup Instructions</h4>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. Go to Google Cloud Console</li>
                  <li>2. Enable Maps JavaScript API and Distance Matrix API</li>
                  <li>3. Create an API key with appropriate restrictions</li>
                  <li>4. Enter the API key above and test the connection</li>
                </ol>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Email Notifications</h4>
                    <p className="text-sm text-gray-600">Receive email alerts for new quotes and bookings</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isEditing ? tempSettings.emailNotifications : settings.emailNotifications}
                    onChange={(e) => updateSetting('emailNotifications', e.target.checked)}
                    disabled={!isEditing}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                    <p className="text-sm text-gray-600">Receive SMS alerts for urgent updates</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isEditing ? tempSettings.smsNotifications : settings.smsNotifications}
                    onChange={(e) => updateSetting('smsNotifications', e.target.checked)}
                    disabled={!isEditing}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">📧 Email Templates</h4>
                <p className="text-sm text-green-800 mb-3">
                  Customize email templates for different notification types
                </p>
                <div className="space-y-2">
                  <button className="block w-full text-left px-3 py-2 bg-white border border-green-200 rounded-md text-sm hover:bg-green-50">
                    Quote Confirmation Template
                  </button>
                  <button className="block w-full text-left px-3 py-2 bg-white border border-green-200 rounded-md text-sm hover:bg-green-50">
                    Booking Confirmation Template
                  </button>
                  <button className="block w-full text-left px-3 py-2 bg-white border border-green-200 rounded-md text-sm hover:bg-green-50">
                    Payment Reminder Template
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Business Info Tab */}
          {activeTab === 'business' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Business Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={isEditing ? tempSettings.companyName : settings.companyName}
                    onChange={(e) => updateSetting('companyName', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Email
                  </label>
                  <input
                    type="email"
                    value={isEditing ? tempSettings.companyEmail : settings.companyEmail}
                    onChange={(e) => updateSetting('companyEmail', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Phone
                  </label>
                  <input
                    type="tel"
                    value={isEditing ? tempSettings.companyPhone : settings.companyPhone}
                    onChange={(e) => updateSetting('companyPhone', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Address
                </label>
                <textarea
                  rows={3}
                  value={isEditing ? tempSettings.companyAddress : settings.companyAddress}
                  onChange={(e) => updateSetting('companyAddress', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">📄 Document Settings</h4>
                <p className="text-sm text-gray-600 mb-3">
                  This information will appear on generated quotes and invoices
                </p>
                <div className="text-sm text-gray-700">
                  <p><strong>Company:</strong> {settings.companyName}</p>
                  <p><strong>Email:</strong> {settings.companyEmail}</p>
                  <p><strong>Phone:</strong> {settings.companyPhone}</p>
                  <p><strong>Address:</strong> {settings.companyAddress}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

