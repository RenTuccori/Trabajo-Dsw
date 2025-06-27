import axiosInstance from "./axiosInstance";

export const getFechasDispTodos = async ({ idDoctor, idEspecialidad, idSede }) => {
    try {
        console.log('🔍 Llamando a getFechasDispTodos con:', { idDoctor, idEspecialidad, idSede });
        const response = await axiosInstance.post(`/api/DispDocEspSed`, { idDoctor, idEspecialidad, idSede });
        console.log('✅ Respuesta de getFechasDispTodos:', response.data);
        
        // Asegurar que siempre retornemos la estructura esperada
        return {
            data: response.data || [],
            error: null
        };
    } catch (error) {
        console.error('❌ Error en getFechasDispTodos:', error.response?.data || error.message);
        return {
            data: [], // Array vacío cuando hay error
            error: error.response?.data?.message || 'Error al obtener fechas disponibles'
        };
    }
}

export const getHorariosDisp = async ({ idDoctor, idEspecialidad, idSede, fecha }) => {
    try {
        console.log('🔍 Llamando a getHorariosDisp con:', { idDoctor, idEspecialidad, idSede, fecha });
        const response = await axiosInstance.post(`/api/HorariosDispDocEspSed`, { idDoctor, idEspecialidad, idSede, fecha });
        console.log('✅ Respuesta de getHorariosDisp:', response.data);
        
        return {
            data: response.data || [],
            error: null
        };
    } catch (error) {
        console.error('❌ Error en getHorariosDisp:', error.response?.data || error.message);
        return {
            data: [], // Array vacío cuando hay error
            error: error.response?.data?.message || 'Error al obtener horarios disponibles'
        };
    }
}
