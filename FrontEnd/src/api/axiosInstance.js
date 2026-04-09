import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const normalizedApiUrl = apiUrl.replace(/\/$/, '');

const axiosInstance = axios.create({
  baseURL: `${normalizedApiUrl}/api/`,
});

axiosInstance.interceptors.request.use(
  (config) => {
    console.log('🌐 FRONTEND - Interceptor Request: Preparando petición');
    console.log('🎯 FRONTEND - URL:', config.baseURL + config.url);
    console.log('📨 FRONTEND - Método:', config.method?.toUpperCase());
    console.log('📋 FRONTEND - Datos:', config.data);
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 FRONTEND - Token añadido a headers');
    } else {
      console.log('⚠️ FRONTEND - No hay token en localStorage');
    }
    return config;
  },
  (error) => {
    console.error('💥 FRONTEND - Error en interceptor request:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log('📨 FRONTEND - Interceptor Response: Respuesta recibida');
    console.log('✅ FRONTEND - Status:', response.status);
    console.log('📄 FRONTEND - Data:', response.data);
    return response;
  },
  (error) => {
    console.error('💥 FRONTEND - Error en interceptor response:', error);
    console.error('🔢 FRONTEND - Status code:', error.response?.status);
    console.error('📄 FRONTEND - Error data:', error.response?.data);
    
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      console.log('🚫 FRONTEND - Token no válido, expirado o sin permisos');
      // Limpiar el token inválido
      localStorage.removeItem('token');
      // Redirigir al home
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;


