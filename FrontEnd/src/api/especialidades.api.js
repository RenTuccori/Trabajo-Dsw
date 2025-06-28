import axiosInstance from './axiosInstance';

export const getEspecialidades = async ({ idSede } = {}) => {
    try {
        let url = `/api/especialidades`;
        let method = 'get';
        let data = {};
        
        // Si se proporciona idSede, usar la funcionalidad de filtrado por sede
        if (idSede) {
            // Como no hay endpoint específico, traemos todas y las devolvemos
            // En el futuro se podría crear un endpoint específico en el backend
            url = `/api/especialidades`;
        }
        
        const response = await axiosInstance[method](url, data);
        return response;
    } catch (error) {
        return error.response.data.message;
    }
};

export const getEspecialidadById = async (idEspecialidad) => {
    try {
        const response = await axiosInstance.get(`/api/especialidades/${idEspecialidad}`);
        return response;
    } catch (error) {
        return error.response.data.message;
    }
};

export const getDoctoresByEspecialidad = async (idEspecialidad) => {
    try {
        const response = await axiosInstance.get(`/api/especialidades/${idEspecialidad}/doctores`);
        return response;
    } catch (error) {
        return error.response.data.message;
    }
};

// Función que necesita el AdministracionProvider
export const getAllSpecialities = async () => {
    try {
        const response = await axiosInstance.get(`/api/especialidades`);
        return response;
    } catch (error) {
        return error.response.data.message;
    }
};

// Función para especialidades disponibles por sede (si se necesita)
export const getAvailableSpecialties = async ({ idSede }) => {
    try {
        const response = await axiosInstance.post(`/api/availablespecialties`, { idSede });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
};


