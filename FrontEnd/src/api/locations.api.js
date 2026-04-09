import axiosInstance from './axiosInstance';

export const getLocations = async () => {
    try {
        const response = await axiosInstance.get(`locations`);
        return response;
    } catch (error) {
        console.error('❌ FRONTEND - Error in getLocations:', error);
        throw error.response?.data || error;
    }
}

export const getLocationById = async (locationId) => {
    try {
        const response = await axiosInstance.get(`locations/${locationId}`);
        return response;
    } catch (error) {
        throw error.response?.data || error;
    }
}

export const getDoctorById = async (doctorId) => {
    try {
        const response = await axiosInstance.get(`doctorsId/${doctorId}`);
        return response;
    } catch (error) {
        throw error.response?.data || error;
    }
}


