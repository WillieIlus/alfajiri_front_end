const API_BASE_URL = 'https://willieilus.pythonanywhere.com';

export async function fetchWithErrorHandling(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      // Try to parse error message from response
      let errorMessage;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
      } else {
        errorMessage = `HTTP error! status: ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      throw new Error('Received non-JSON response from server');
    }
  } catch (error) {
    if (error instanceof TypeError) {
      // Network error or CORS issue
      throw new Error('Network error. Please check your connection and try again.');
    }
    throw error;
  }
}