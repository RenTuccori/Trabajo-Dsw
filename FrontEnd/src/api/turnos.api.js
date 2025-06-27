import axiosInstance from './axiosInstance';

export const getTurnosHistoricoDoctor = async ({idDoctor}) => {
    try {
        const response = await axiosInstance.post(`/api/turnosdoc`,{idDoctor});
        return response;
    } catch (error) {
        console.error('Error en getTurnosHistoricoDoctor:', error);
        throw error; // Lanzar el error para que se maneje en el provider
    }
}

export const getTurnosDoctorHoy = async ({idDoctor}) => {
    try {
        const response = await axiosInstance.post(`/api/turnosdochoy`, {idDoctor});
        return response;
    } catch (error) {
        console.error('Error en getTurnosDoctorHoy:', error);
        throw error;
    }
}

export const getTurnosDoctorFecha = async ({idDoctor, fechaYHora}) => {
    try {
        const response = await axiosInstance.post(`/api/turnosdocfecha`, {idDoctor, fechaYHora});
        return response;
    } catch (error) {
        console.error('Error en getTurnosDoctorFecha:', error);
        throw error;
    }
}


export const createTurno = async ({ idPaciente, fechaYHora, fechaCancelacion, fechaConfirmacion, estado, idEspecialidad, idDoctor, idSede }) => {
    try {
        const response = await axiosInstance.post(`/api/turnos`, { idPaciente, fechaYHora, fechaCancelacion, fechaConfirmacion, estado, idEspecialidad, idDoctor, idSede });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const getTurnosPaciente = async ({ dni }) => {
    try {
        const response = await axiosInstance.post(`/api/turnospac`, { dni });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const confirmarTurno = async ({ idTurno }) => {
    try {
        const response = await axiosInstance.put(`/api/turnos`, { idTurno });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const cancelarTurno = async ({ idTurno }) => {
    try {
        const response = await axiosInstance.put(`/api/turnoscancel`, { idTurno });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}
