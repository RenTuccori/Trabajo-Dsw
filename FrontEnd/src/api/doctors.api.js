import axiosInstance from './axiosInstance';

export const verifyDoctor = async ({ dni, password }) => {
    return await axiosInstance.post(`doctorscontra`, { dni, password });
}

export const getDoctors = async ({ venueId, specialtyId }) => {
    console.log('🌐 FRONTEND - getDoctors: Enviando petición para:', { venueId, specialtyId });
    try {
        // Cambiamos la ruta para usar la función correcta que filtra por sede y especialidad
        const response = await axiosInstance.post(`availabledoctors`, { venueId, specialtyId });
        console.log('✅ FRONTEND - Respuesta doctores:', response.data);
        return response;
    } catch (error) {
        console.error('❌ FRONTEND - Error en getDoctors:', error);
        return error.response.data.message;
    }
}

export const getDoctorById = async (doctorId) => {
    try {
        console.log('👨‍⚕️ FRONTEND - getDoctorById: Obteniendo doctor con ID:', doctorId);
        const response = await axiosInstance.get(`doctorsId/${doctorId}`);
        console.log('✅ FRONTEND - getDoctorById: Doctor obtenido:', response.data);
        return response;
    } catch (error) {
        console.error('❌ FRONTEND - Error en getDoctorById:', error);
        if (error.response && error.response.data) {
            return error.response.data.message;
        }
        throw error; // Re-lanzar el error para que lo maneje el contexto
    }
}

export const getDoctores = async () => {
    try {
        const response = await axiosInstance.post(`alldoctors`);
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const getAvailableDoctors = async ({ venueId }) => {
    try {
        const response = await axiosInstance.post(`availabledoctors`, { venueId });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}



