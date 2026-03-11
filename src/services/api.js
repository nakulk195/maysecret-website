import axios from 'axios';

// Environment-based API configuration
const getApiBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.REACT_APP_API_URL || 'https://yourdomain.com/api';
  }
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

console.log('🔗 API Base URL:', API_BASE_URL);
console.log('🌍 Environment:', process.env.NODE_ENV || 'development');

// Create axios instance with enhanced configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging and token handling
api.interceptors.request.use(
  (config) => {
    // Log outgoing requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for enhanced error handling
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    // Enhanced error logging and handling
    console.error('❌ API Error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      data: error.response?.data
    });

    // Handle specific error types
    if (error.code === 'ERR_NETWORK') {
      // Network error - backend not reachable
      console.error('🌐 Network Error: Backend server is not reachable');
      console.error('💡 Check if backend is running on port 5000');
    } else if (error.code === 'ECONNABORTED') {
      // Request timeout
      console.error('⏰ Request Timeout: Backend took too long to respond');
    } else if (error.response?.status === 401) {
      // Unauthorized - clear stored auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.log('🔒 Unauthorized: Cleared stored authentication data');
    }

    return Promise.reject(error);
  }
);

// Enhanced error handler for API calls
const handleApiError = (error) => {
  if (error.code === 'ERR_NETWORK') {
    throw new Error('Unable to connect to server. Please check if backend is running.');
  } else if (error.code === 'ECONNABORTED') {
    throw new Error('Request timed out. Please try again.');
  } else if (error.response?.data?.message) {
    throw new Error(error.response.data.message);
  } else if (error.response?.status === 500) {
    throw new Error('Server error. Please try again later.');
  } else if (error.response?.status === 404) {
    throw new Error('API endpoint not found. Please check the URL.');
  } else if (error.message) {
    throw new Error(error.message);
  } else {
    throw new Error('An unexpected error occurred. Please try again.');
  }
};

// Auth API with enhanced error handling
export const authAPI = {
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  addAddress: async (addressData) => {
    try {
      const response = await api.post('/auth/address', addressData);
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  getAddresses: async () => {
    try {
      const response = await api.get('/auth/addresses');
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// Products API with enhanced error handling
export const productsAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/products');
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  getById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  search: async (query) => {
    try {
      const response = await api.get(`/products/search/${query}`);
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  getByCategory: async (category) => {
    try {
      const response = await api.get(`/products/category/${category}`);
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// Cart API with enhanced error handling
export const cartAPI = {
  get: async () => {
    try {
      const response = await api.get('/cart');
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  addItem: async (productId, quantity) => {
    try {
      const response = await api.post('/cart/add', { productId, quantity });
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  updateQuantity: async (productId, quantity) => {
    try {
      const response = await api.put(`/cart/update/${productId}`, { quantity });
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  removeItem: async (productId) => {
    try {
      const response = await api.delete(`/cart/remove/${productId}`);
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  clear: async () => {
    try {
      const response = await api.delete('/cart/clear');
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// Users API with enhanced error handling
export const usersAPI = {
  create: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  getAll: async () => {
    try {
      const response = await api.get('/users');
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  getById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  update: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  delete: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// Addresses API with enhanced error handling
export const addressesAPI = {
  create: async (addressData) => {
    try {
      const response = await api.post('/addresses', addressData);
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  getAll: async () => {
    try {
      const response = await api.get('/addresses');
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  getById: async (id) => {
    try {
      const response = await api.get(`/addresses/${id}`);
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  update: async (id, addressData) => {
    try {
      const response = await api.put(`/addresses/${id}`, addressData);
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  delete: async (id) => {
    try {
      const response = await api.delete(`/addresses/${id}`);
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// Orders API with enhanced error handling
export const ordersAPI = {
  create: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  getAll: async () => {
    try {
      const response = await api.get('/orders');
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  getById: async (id) => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  updatePaymentStatus: async (id, status) => {
    try {
      const response = await api.patch(`/orders/${id}/payment-status`, { paymentStatus: status });
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  cancel: async (id) => {
    try {
      const response = await api.patch(`/orders/${id}/cancel`);
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// Payment API with enhanced error handling and new endpoints
export const paymentAPI = {
  // New payment endpoints
  createPayment: async (amount) => {
    try {
      const response = await api.post('/payment/create-payment', { amount });
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  verifyPayment: async (paymentId) => {
    try {
      const response = await api.post('/payment/verify-payment', { paymentId });
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  // Existing payment endpoints
  generateUPILink: async (orderId, amount) => {
    try {
      const response = await api.post('/payment/upi-link', { orderId, amount });
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  verifyPaymentOrder: async (orderId, transactionId, status) => {
    try {
      const response = await api.post('/payment/verify-payment-order', { orderId, transactionId, status });
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  getStatus: async (orderId) => {
    try {
      const response = await api.get(`/payment/status/${orderId}`);
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  mockSuccess: async (orderId) => {
    try {
      const response = await api.post('/payment/mock-success', { orderId });
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// Export the base API instance for custom requests
export default api;
