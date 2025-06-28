import axiosInstance from './axiosInstance';

export const getEspecialidades = async ({ venueId }) => {
    try {
        const response = await axiosInstance.post(`allspecialties`, { venueId });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
};

export const getEspecialidadById = async (specialtyId) => {
    try {
        const response = await axiosInstance.get(`idspecialties/${specialtyId}`);
        return response;
    } catch (error) {
        return error.response.data.message;
    }
};

export const getAvailableSpecialties = async ({ venueId }) => {
    try {
        const response = await axiosInstance.post(`availablespecialties`, { venueId });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
};

export const getAllSpecialities = async () => {
    try {
        const response = await axiosInstance.post(`allespecialties`);
        return response;
    } catch (error) {
        return error.response.data.message;
    }
};




