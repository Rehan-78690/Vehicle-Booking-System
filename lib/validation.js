export function validateQuoteRequest(data) {
  const errors = [];
  
  if (!data.use_case_type) {
    errors.push('use_case_type is required');
  }
  
  if (!data.form_data) {
    errors.push('form_data is required');
  } else {
    // Use case specific validations
    switch(data.use_case_type) {
      case 'one_way':
        if (!data.form_data.pickup_location) errors.push('pickup_location is required');
        if (!data.form_data.dropoff_location) errors.push('dropoff_location is required');
        break;
        
      case 'day_excursion':
        if (!data.form_data.city_of_service) errors.push('city_of_service is required');
        if (!data.form_data.visited_city) errors.push('visited_city is required');
        break;
        
      // Add validations for other use cases
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}