import axios from 'axios';
const dbUrl = import.meta.env.VITE_DB_URL;

const axiosInstance = axios.create({
  baseURL: `http://${dbUrl}/api/`, //colocar la ip de la maquina donde se esta ejecutando el backend
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
      console.log('Token no válido, expirado o sin permisos');
      // Limpiar el token inválido
      localStorage.removeItem('token');
      // Redirigir al home
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
