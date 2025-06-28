import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const dbUrl = import.meta.env.VITE_DB_URL;

const axiosInstance = axios.create({
  baseURL: `http://${dbUrl}/api/`, //colocar la ip de la maquina donde se esta ejecutando el backend
});

// Función para verificar si el token es válido
const isTokenValid = (token) => {
  if (!token) return false;
  try {
    const decoded = jwtDecode(token);
    return decoded.exp > Date.now() / 1000;
  } catch (error) {
    return false;
  }
};

// Función para limpiar token inválido y redirigir
const handleInvalidToken = () => {
  localStorage.removeItem('token');
  // Despachamos un evento personalizado para que el AuthProvider pueda escucharlo
  window.dispatchEvent(new CustomEvent('tokenExpired'));
  window.location.href = '/';
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      if (isTokenValid(token)) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        // Token expirado, limpiamos y redirigimos
        handleInvalidToken();
        return Promise.reject(new Error('Token expirado'));
      }
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
    if (error.response && error.response.status === 401) {
      console.log('Token no válido o expirado');
      handleInvalidToken();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
