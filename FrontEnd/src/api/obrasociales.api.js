import axiosInstance from './axiosInstance';

export const getObrasSociales = async () => {
    try {
        const response = await axiosInstance.get(`/api/os`);
        return {
            data: response.data || [],
            error: null
        };
    } catch (error) {
        console.error('❌ Error en getObrasSociales:', error);
        return {
            data: [],
            error: error.response?.data?.message || 'Error al obtener obras sociales'
        };
    }
}

