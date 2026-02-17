import axiosInstance from './axiosInstance';

export const getAppointmentHistoryByDoctor = async ({idDoctor}) => {
    try {
        const response = await axiosInstance.post(`turnosdoc`,{idDoctor});
        return response
    } catch (error) {
        return (error.response.data.message);
    }
}

export const getAppointmentsByDoctorToday = async ({idDoctor}) => {
    try {
        const response = await axiosInstance.post(`turnosdochoy`, {idDoctor});
        return response;
    } catch (error) {
        return (error.response.data.message);
    }
}

export const getAppointmentsByDoctorDate = async ({idDoctor, fechaYHora}) => {
    try {
        const response = await axiosInstance.post(`turnosdocfecha`, {idDoctor, fechaYHora});
        return response;
    } catch (error) {
        return (error.response.data.message);
    }
}


export const createAppointment = async ({ idPaciente, fechaYHora, fechaCancelacion, fechaConfirmacion, estado, idEspecialidad, idDoctor, idSede }) => {
    try {
        const response = await axiosInstance.post(`turnos`, { idPaciente, fechaYHora, fechaCancelacion, fechaConfirmacion, estado, idEspecialidad, idDoctor, idSede });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const getAppointmentsByPatient = async ({ dni }) => {
    try {
        const response = await axiosInstance.post(`turnospac`, { dni });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const confirmAppointment = async ({ idTurno }) => {
    try {
        const response = await axiosInstance.put(`turnos`, { idTurno });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const cancelAppointment = async ({ idTurno }) => {
    try {
        const response = await axiosInstance.put(`turnoscancel`, { idTurno });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}
