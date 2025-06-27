import axiosInstance from './axiosInstance';

export const getSedes = async () => {
    try {
        const response = await axiosInstance.get(`/api/sedes`);
        return {
            data: response.data || [],
            error: null
        };
    } catch (error) {
        console.error('❌ Error en getSedes:', error);
        return {
            data: [],
            error: error.response?.data?.message || 'Error al obtener sedes'
        };
    }
}

export const getSedeById = async (idSede) => {
    try {
        const response = await axiosInstance.get(`/api/sedes/${idSede}`);
        return {
            data: response.data || {},
            error: null
        };
    } catch (error) {
        console.error('❌ Error en getSedeById:', error);
        return {
            data: {},
            error: error.response?.data?.message || 'Error al obtener sede'
        };
    }
}

export const getDoctorById = async (idDoctor) => {
    try {
        const response = await axiosInstance.get(`/api/doctorsId/${idDoctor}`);
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}
