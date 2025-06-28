import axiosInstance from './axiosInstance';

export const getSedes = async () => {
    try {
        const response = await axiosInstance.get(`sedes`);
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const getSedeById = async (idSede) => {
    try {
        const response = await axiosInstance.get(`sedes/${idSede}`);
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const getDoctorById = async (idDoctor) => {
    try {
        const response = await axiosInstance.get(`doctorsId/${idDoctor}`);
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}
