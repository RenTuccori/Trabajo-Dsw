import axios from 'axios';
const dbUrl = import.meta.env.VITE_DB_URL;

const axiosInstance = axios.create({
  baseURL: `http://${dbUrl}/api/`, // Set the IP of the machine running the backend
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      // Clear the invalid token
      localStorage.removeItem('token');
      // Redirect to home
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
