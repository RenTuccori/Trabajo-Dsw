import axiosInstance from './axiosInstance';

export const getSpecialties = async ({ locationId }) => {
    console.log('🌐 FRONTEND - getSpecialties: Getting specialties for location:', locationId);
    try {
        const response = await axiosInstance.post(`specialties`, { locationId });
        console.log('✅ FRONTEND - Specialties response:', response.data);
        return response;
    } catch (error) {
        console.error('❌ FRONTEND - Error in getSpecialties:', error);
        return error.response.data.message;
    }
};

export const getSpecialtyById = async (specialtyId) => {
    try {
        const response = await axiosInstance.get(`specialties/${specialtyId}`);
        return response;
    } catch (error) {
        return error.response.data.message;
    }
};

export const getAvailableSpecialties = async ({ locationId }) => {
    try {
        const response = await axiosInstance.post(`specialties/available`, { locationId });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
};

export const getAllSpecialties = async () => {
    try {
        const response = await axiosInstance.post(`specialties/all`);
        return response;
    } catch (error) {
        return error.response.data.message;
    }
};




