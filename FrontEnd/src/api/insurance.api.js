import axiosInstance from './axiosInstance';

export const getObrasSociales = async () => {
    console.log('🌐 FRONTEND - getObrasSociales: Obteniendo obras sociales');
    try {
        const response = await axiosInstance.get(`os`);
        console.log('✅ FRONTEND - Respuesta obras sociales:', response.data);
        return response;
    } catch (error) {
        console.error('❌ FRONTEND - Error en getObrasSociales:', error);
        throw error;
    }
}



