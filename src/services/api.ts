import axios, { AxiosError } from 'axios';

const BASE_URL = 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000;

const retryRequest = async (error: AxiosError, retryCount = 0) => {
  if (retryCount >= MAX_RETRIES || !error.config) {
    throw error;
  }

  const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
  await new Promise(resolve => setTimeout(resolve, delay));

  return api.request({
    ...error.config,
    _retry: retryCount + 1,
  });
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle token refresh or logout
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    const retryCount = (error.config as any)?._retry || 0;
    if (error.response?.status >= 500 && retryCount < MAX_RETRIES) {
      return retryRequest(error, retryCount);
    }

    return Promise.reject(error);
  }
);

export const llmApi = {
  generate: async (message: string, provider: string, model: string) => {
    const response = await api.post('/llm/generate', {
      message,
      provider,
      model,
    });
    return response.data;
  },
};

export default api;