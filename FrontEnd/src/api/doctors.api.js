import axiosInstance from './axiosInstance';

export const verifyDoctor = async ({ dni, password }) => {
    return await axiosInstance.post(`doctors/login`, { dni, password });
}

export const getDoctors = async ({ locationId, specialtyId }) => {
    console.log('🌐 FRONTEND - getDoctors: Sending request for:', { locationId, specialtyId });
    try {
        const response = await axiosInstance.post(`doctors`, { locationId, specialtyId });
        console.log('✅ FRONTEND - Doctors response:', response.data);
        return response;
    } catch (error) {
        console.error('❌ FRONTEND - Error in getDoctors:', error);
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

export const getAllDoctors = async () => {
    try {
        const response = await axiosInstance.post(`doctors/all`);
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const getAvailableDoctors = async ({ locationId }) => {
    try {
        const response = await axiosInstance.post(`doctors/available`, { locationId });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}



