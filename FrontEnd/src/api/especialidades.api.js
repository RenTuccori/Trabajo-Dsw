import axiosInstance from './axiosInstance';

export const getSpecialties = async ({ idSede }) => {
    try {
        const response = await axiosInstance.post(`allspecialties`, { idSede });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
};

export const getSpecialtyById = async (idEspecialidad) => {
    try {
        const response = await axiosInstance.get(`idspecialties/${idEspecialidad}`);
        return response;
    } catch (error) {
        return error.response.data.message;
    }
};

export const getAvailableSpecialties = async ({ idSede }) => {
    try {
        const response = await axiosInstance.post(`availablespecialties`, { idSede });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
};

export const getAllSpecialties = async () => {
    try {
        const response = await axiosInstance.post(`allespecialties`);
        return response;
    } catch (error) {
        return error.response.data.message;
    }
};


