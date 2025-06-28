import axiosInstance from './axiosInstance';

export const getSedes = async () => {
    try {
        const response = await axiosInstance.get(`venues`);
        return response;
    } catch (error) {
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


