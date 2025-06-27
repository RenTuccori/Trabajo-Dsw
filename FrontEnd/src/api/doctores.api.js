import axiosInstance from './axiosInstance';

export const verifyDoctor = async ({ dni, contra }) => {
    try {
        const response = await axiosInstance.post(`/api/doctorscontra`, { dni, contra });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const getDoctors = async ({ idSede, idEspecialidad }) => {
    try {
        console.log('🔍 Llamando a getDoctors con:', { idSede, idEspecialidad });
        const response = await axiosInstance.post(`/api/doctors`, { idSede, idEspecialidad });
        console.log('✅ Respuesta de getDoctors:', response.data);
        return response;
    } catch (error) {
        console.error('❌ Error en getDoctors:', error.response?.data || error.message);
        // En lugar de devolver un string, devolver un objeto consistente
        return {
            data: [], // Array vacío cuando no hay doctores
            error: error.response?.data?.message || 'Error al obtener doctores'
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

export const getDoctores = async () => {
    try {
        console.log('📞 Llamando a getDoctores API');
        const response = await axiosInstance.post(`/api/alldoctors`);
        console.log('✅ Respuesta de getDoctores API:', response.data);
        return response;
    } catch (error) {
        console.error('❌ Error en getDoctores API:', error.response?.data || error.message);
        // En lugar de devolver solo un mensaje de error, devolvemos un objeto con formato consistente
        return {
            data: [], // Array vacío cuando hay error
            error: error.response?.data?.message || 'Error al obtener doctores'
        };
    }
}

export const getAvailableDoctors = async ({ idSede }) => {
    try {
        const response = await axiosInstance.post(`/api/availabledoctors`, { idSede });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

