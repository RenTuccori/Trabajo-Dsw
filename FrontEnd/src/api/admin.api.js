import axiosInstance from './axiosInstance';

export const getAdmin = async ({ usuario, contra }) => {
    try {
        const response = await axiosInstance.post(`/api/admin`, { usuario, contra });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

//Doctor
export const createDoctor = async ({ dni, duracionTurno, contra }) => {
    try {
        const response = await axiosInstance.post(`/api/adminCreateDr`, { dni, duracionTurno, contra });
        return response;
    } catch (error) {
        console.error('Error en createDoctor:', error.response?.data || error.message);
        throw error;
    }
}

export const deleteDoctor = async (idDoctor) => {
    try {
        const response = await axiosInstance.put(`/api/adminDeleteDr/${idDoctor}`);
        return response;
    } catch (error) {
        console.error('Error en deleteDoctor:', error.response?.data || error.message);
        throw error;
    }
}

export const updateDoctor = async ({ idDoctor, duracionTurno, contra }) => {
    try {
        const response = await axiosInstance.put(`/api/adminUpdateDr/${idDoctor}`, { duracionTurno, contra });
        return response;
    } catch (error) {
        console.error('Error en updateDoctor:', error.response?.data || error.message);
        throw error;
    }
}

//Sede
export const createSede = async ({ nombre, direccion }) => {
    try {
        const response = await axiosInstance.post(`/api/adminCreateSede`, { nombre, direccion });
        return response;
    } catch (error) {
        console.error('Error en createSede:', error.response?.data || error.message);
        throw error; // Re-lanzar el error para que pueda ser manejado por el provider
    }
}

export const updateSede = async ({ idSede, nombre, direccion }) => {
    try {
        const response = await axiosInstance.put(`/api/adminUpdateSede/${idSede}`, { nombre, direccion });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const deleteSede = async (idSede) => {
    try {
        const response = await axiosInstance.put(`/api/adminDeleteSede/${idSede}`);
        return response;
    } catch (error) {
        console.error('Error en deleteSede:', error.response?.data || error.message);
        throw error;
    }
}

//ObraSocial
export const createObraSocial = async ({ nombre }) => {
    try {
        const response = await axiosInstance.post(`/api/adminCreateObraSocial`, { nombre });
        return response;
    } catch (error) {
        console.error('Error en createObraSocial:', error.response?.data || error.message);
        throw error;
    }
}

export const updateObraSocial = async ({ idObraSocial, nombre }) => {
    try {
        const response = await axiosInstance.put(`/api/adminUpdateOS/${idObraSocial}`, { nombre });
        return response;
    } catch (error) {
        console.error('Error en updateObraSocial:', error.response?.data || error.message);
        throw error;
    }
}

export const deleteObraSocial = async (idObraSocial) => {
    try {
        const response = await axiosInstance.put(`/api/adminDeleteOS/${idObraSocial}`);
        return response;
    } catch (error) {
        console.error('Error en deleteObraSocial:', error.response?.data || error.message);
        throw error;
    }
}

//Especialidad
export const createSpecialty = async ({ nombre }) => {
    try {
        const response = await axiosInstance.post(`/api/adminCreateEsp`, { nombre });
        return response;
    } catch (error) {
        console.error('Error en createSpecialty:', error.response?.data || error.message);
        throw error; // Re-throw para que el contexto y componente puedan manejarlo
    }
}

export const deleteSpecialty = async (idEspecialidad) => {
    try {
        const response = await axiosInstance.put(`/api/deleteSpecialties/${idEspecialidad}`);
        return response;
    } catch (error) {
        console.error('Error en deleteSpecialty:', error.response?.data || error.message);
        throw error;
    }
}

//combinaciones
export const createSeEspDoc = async ({ idSede, idEspecialidad, idDoctor }) => {
    try {
        const response = await axiosInstance.post(`/api/adminCreateSeEspDoc`, { idSede, idEspecialidad, idDoctor });
        return response;
    } catch (error) {
        console.error('Error en createSeEspDoc:', error.response?.data || error.message);
        throw error;
    }
}

export const deleteSeEspDoc = async ({ idSede, idDoctor, idEspecialidad }) => {
    try {
        const response = await axiosInstance.put(`/api/adminDeleteSeEspDoc`, { idSede, idDoctor, idEspecialidad });
        return response;
    } catch (error) {
        console.error('Error en deleteSeEspDoc:', error.response?.data || error.message);
        throw error;
    }
}

export const getCombinaciones = async () => {
    try {
        const response = await axiosInstance.get(`/api/adminGetCombinaciones`);
        return response;
    } catch (error) {
        console.error('Error en getCombinaciones:', error.response?.data || error.message);
        throw error;
    }
}

//Horarios
export const createHorarios = async ({ idSede, idDoctor, idEspecialidad, dia, hora_inicio, hora_fin, estado }) => {
    try {
        const response = await axiosInstance.post(`/api/adminCreateHorario`, { idSede, idDoctor, idEspecialidad, dia, hora_inicio, hora_fin, estado });
        return response;
    } catch (error) {
        console.error('Error en createHorarios:', error.response?.data || error.message);
        throw error;
    }
}

export const getHorariosXDoctor = async ({ idSede, idEspecialidad, idDoctor }) => {
    try {
        const response = await axiosInstance.post(`/api/adminGetHorariosXDoctor`, { idSede, idEspecialidad, idDoctor });
        return response;
    } catch (error) {
        console.error('Error en getHorariosXDoctor:', error.response?.data || error.message);
        throw error;
    }
}

export const updateHorarios = async ({ idSede, idDoctor, idEspecialidad, dia, hora_inicio, hora_fin, hora_inicio_original, hora_fin_original, estado }) => {
    try {
        const response = await axiosInstance.put(`/api/adminUpdateHorario`, { idSede, idDoctor, idEspecialidad, dia, hora_inicio, hora_fin, hora_inicio_original, hora_fin_original, estado });
        return response;
    } catch (error) {
        console.error('Error en updateHorarios:', error.response?.data || error.message);
        throw error;
    }
}

//Usuarios
export const getUserByDni = async ({ dni }) => {
    try {
        const response = await axiosInstance.post(`/api/adminGetUserByDni`, { dni });
        return response;
    } catch (error) {
        console.error('Error en getUserByDni:', error.response?.data || error.message);
        throw error;
    }
}

export const createUserAdmin = async ({ dni, fechaNacimiento, nombre, apellido, telefono, email, direccion, idObraSocial }) => {
    try {
        const response = await axiosInstance.post(`/api/adminCreateUser`, { dni, fechaNacimiento, nombre, apellido, telefono, email, direccion, idObraSocial });
        return response;
    } catch (error) {
        console.error('Error en createUserAdmin:', error.response?.data || error.message);
        throw error;
    }
}