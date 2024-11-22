import axiosInstance from './axiosInstance';

export const getTurnosHistoricoDoctor = async ({idDoctor}) => {
    try {
        const response = await axiosInstance.post(`turnosdoc`,{idDoctor});
        return response
    } catch (error) {
        return (error.response.data.message);
    }
}

export const getTurnosDoctorHoy = async ({idDoctor}) => {
    try {
        const response = await axiosInstance.post(`turnosdochoy`, {idDoctor});
        return response;
    } catch (error) {
        return (error.response.data.message);
    }
}

export const getTurnosDoctorFecha = async ({idDoctor, fechaYHora}) => {
    try {
        const response = await axiosInstance.post(`turnosdocfecha`, {idDoctor, fechaYHora});
        return response;
    } catch (error) {
        return (error.response.data.message);
    }
}


export const createTurno = async ({ idPaciente, fechaYHora, fechaCancelacion, fechaConfirmacion, estado, idEspecialidad, idDoctor, idSede }) => {
    try {
        const response = await axiosInstance.post(`turnos`, { idPaciente, fechaYHora, fechaCancelacion, fechaConfirmacion, estado, idEspecialidad, idDoctor, idSede });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const getTurnosPaciente = async ({ dni }) => {
    try {
        const response = await axiosInstance.post(`turnospac`, { dni });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const confirmarTurno = async ({ idTurno }) => {
    try {
        const response = await axiosInstance.put(`turnos`, { idTurno });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const cancelarTurno = async ({ idTurno }) => {
    try {
        const response = await axiosInstance.put(`turnoscancel`, { idTurno });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}
