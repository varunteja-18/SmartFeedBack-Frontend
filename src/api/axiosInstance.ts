import axios from 'axios';

// Create Axios instance with default config
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5169/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Authorization header with Bearer token (from localStorage)
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Handle unauthorized or forbidden responses globally
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("token");

      // Optional: redirect to login
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
