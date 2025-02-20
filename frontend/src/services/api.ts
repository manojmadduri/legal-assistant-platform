import axios from 'axios';
import { auth } from '../config/firebase';
import CustomToast from '../components/CustomToast';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add authentication token to requests
api.interceptors.request.use(
  async (config) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    if (!error.response) {
      CustomToast.error('Network error. Please check your connection.');
      return Promise.reject(new Error('Network error'));
    }

    // Don't show error messages for 404 errors - let the components handle these
    if (error.response.status === 404) {
      return Promise.reject(error);
    }

    const errorMessage = error.response.data?.error || error.response.data?.message || 'An error occurred';

    switch (error.response.status) {
      case 401:
        // Handle unauthorized error
        if (!window.location.pathname.includes('/login')) {
          CustomToast.error('Session expired. Please login again.');
          // Add a small delay before redirect to ensure the user sees the message
          setTimeout(() => {
            window.location.href = '/login';
          }, 1500);
        }
        break;
      case 403:
        CustomToast.error('You do not have permission to perform this action.');
        break;
      case 422:
        CustomToast.error('Invalid data provided.');
        break;
      case 429:
        CustomToast.error('Too many requests. Please try again later.');
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        CustomToast.error('Server error. Please try again later.');
        break;
      default:
        CustomToast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

export default api;
