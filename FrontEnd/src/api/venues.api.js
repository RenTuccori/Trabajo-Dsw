import axiosInstance from './axiosInstance';

export const getSedes = async () => {
    console.log('🌐 FRONTEND - getSedes: Obteniendo sedes del backend');
    try {
        const response = await axiosInstance.get(`venues`);
        console.log('✅ FRONTEND - Respuesta sedes:', response.data);
        return response;
    } catch (error) {
        console.error('❌ FRONTEND - Error en getSedes:', error);
        return error.response.data.message;
    }
}

export const getSedeById = async (venueId) => {
    try {
        const response = await axiosInstance.get(`venues/${venueId}`);
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const getDoctorById = async (doctorId) => {
    try {
        const response = await axiosInstance.get(`doctorsId/${doctorId}`);
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}


