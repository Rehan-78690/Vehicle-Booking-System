import { useState, useEffect } from 'react';

export default function VehicleSelector({ passengers, suitcases, onSelect }) {
  const [suggested, setSuggested] = useState(null);
  const [allowedVehicles, setAllowedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getSuggestion = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const res = await fetch('/api/vehicles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ passengers, suitcases })
        });
        
        if (!res.ok) throw new Error('Request failed');
        
        const { suggestedVehicle, allowedVehicles, error } = await res.json();
        
        if (error) {
          setError(error);
          setSuggested(null);
          setAllowedVehicles([]);
          onSelect(null);
        } else {
          setSuggested(suggestedVehicle);
          setAllowedVehicles(allowedVehicles || []);
          onSelect(suggestedVehicle);
        }
      } catch (err) {
        console.error('Suggestion error:', err);
        setError('Failed to get vehicle suggestions');
        onSelect(null);
      } finally {
        setLoading(false);
      }
    };
    
    getSuggestion();
  }, [passengers, suitcases, onSelect]);

  if (loading) {
    return <div className="loading">Loading vehicles...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!suggested) {
    return <div className="warning">No vehicles available for your requirements</div>;
  }

  return (
    <div className="vehicle-selector">
      <h3>Recommended: {suggested.name}</h3>
      <div className="vehicle-grid">
        {allowedVehicles.map(vehicle => (
          <div 
            key={vehicle.id} 
            className={`vehicle-card ${vehicle.id === suggested.id ? 'recommended' : ''}`}
            onClick={() => onSelect(vehicle)}
            aria-label={`Select ${vehicle.name}`}
          >
            <div className="vehicle-icon">{getVehicleIcon(vehicle.type)}</div>
            <div className="vehicle-details">
              <h4>{vehicle.name}</h4>
              <p>Passengers: {vehicle.passengerCapacity}</p>
              <p>Suitcases: {vehicle.suitcaseCapacity}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Improved icon mapping
function getVehicleIcon(type) {
  const icons = {
    sedan: '🚗',
    minivan: '🚐',
    sprinter: '🚙',
    bus: '🚌',
    doubleDecker: '🚍'
  };
  return icons[type.toLowerCase()] || '🚘';
}