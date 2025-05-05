/**
 * API utility for making requests to the backend
 */

type RequestOptions = {
  credentials?: RequestCredentials;
  headers?: HeadersInit;
  body?: any;
};

type ApiResponse<T> = {
  data: T;
  error?: string;
  status: number;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

/**
 * Handles API requests with error handling and response parsing
 */
async function apiRequest<T>(
  endpoint: string,
  method: string = 'GET',
  data?: any,
  customOptions: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Default options for fetch
  const options: RequestInit = {
    method,
    credentials: 'include', // Include cookies for auth
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    ...customOptions,
  };
  
  // Add JWT token to Authorization header if available
  const token = localStorage.getItem('authToken');
  if (token && !(options.headers as any)['Authorization']) {
    (options.headers as any)['Authorization'] = `Bearer ${token}`;
  }

  // Add body if it exists
  if (data) {
    if (data instanceof FormData) {
      // If FormData, remove Content-Type header to let browser set it with boundary
      delete (options.headers as any)['Content-Type'];
      options.body = data;
    } else {
      options.body = JSON.stringify(data);
    }
  }

  try {
    const response = await fetch(url, options);
    
    // Parse JSON response if possible
    let responseData: any;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }
    
    // Handle error responses
    if (!response.ok) {
      return {
        data: null as unknown as T,
        error: responseData.message || 'An error occurred',
        status: response.status,
      };
    }
    
    return {
      data: responseData,
      status: response.status,
    };
  } catch (error) {
    console.error('API request failed:', error);
    return {
      data: null as unknown as T,
      error: error instanceof Error ? error.message : 'Network error',
      status: 0,
    };
  }
}

/**
 * API utility functions for making requests
 */
export const api = {
  /**
   * Make a GET request
   */
  get: <T>(endpoint: string, options: RequestOptions = {}) => 
    apiRequest<T>(endpoint, 'GET', undefined, options),
  
  /**
   * Make a POST request
   */
  post: <T>(endpoint: string, data?: any, options: RequestOptions = {}) => 
    apiRequest<T>(endpoint, 'POST', data, options),
  
  /**
   * Make a PUT request
   */
  put: <T>(endpoint: string, data?: any, options: RequestOptions = {}) => 
    apiRequest<T>(endpoint, 'PUT', data, options),
  
  /**
   * Make a PATCH request
   */
  patch: <T>(endpoint: string, data?: any, options: RequestOptions = {}) => 
    apiRequest<T>(endpoint, 'PATCH', data, options),
  
  /**
   * Make a DELETE request
   */
  delete: <T>(endpoint: string, options: RequestOptions = {}) => 
    apiRequest<T>(endpoint, 'DELETE', undefined, options),
  
  /**
   * Upload files using FormData
   */
  upload: <T>(endpoint: string, formData: FormData, method: string = 'POST') => 
    apiRequest<T>(endpoint, method, formData, {}),
};
