import { useState } from 'react';

export default function QuoteDisplay({ formData, useCaseType }) {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuote = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          use_case_type: useCaseType,
          form_data: formData
        })
      });
      
      if (!response.ok) throw new Error('Failed to get quote');
      
      const data = await response.json();
      setQuote(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quote-container">
      <button onClick={fetchQuote} disabled={loading}>
        {loading ? 'Calculating...' : 'Get Quote'}
      </button>
      
      {error && <div className="error">{error}</div>}
      
      {quote && (
        <div className="quote-result">
          <h3>Your Quotation</h3>
          <p><strong>Vehicle:</strong> {quote.vehicle}</p>
          <p><strong>Total Price:</strong> €{quote.price.total_price.toFixed(2)}</p>
          <p><strong>Calculation:</strong> {quote.price.calculation_type}</p>
          {quote.price.distance_km && (
            <p><strong>Distance:</strong> {quote.price.distance_km} km</p>
          )}
        </div>
      )}
    </div>
  );
}