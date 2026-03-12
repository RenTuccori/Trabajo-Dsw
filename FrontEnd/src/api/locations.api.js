import axiosInstance from './axiosInstance';

export const getLocations = async () => {
    console.log('🌐 FRONTEND - getLocations: Getting locations from backend');
    try {
        const response = await axiosInstance.get(`locations`);
        console.log('✅ FRONTEND - Locations response:', response.data);
        return response;
    } catch (error) {
        console.error('❌ FRONTEND - Error in getLocations:', error);
        return error.response.data.message;
    }
}

export const getLocationById = async (locationId) => {
    try {
        const response = await axiosInstance.get(`locations/${locationId}`);
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


