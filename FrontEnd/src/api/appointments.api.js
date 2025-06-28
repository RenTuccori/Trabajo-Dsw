import axiosInstance from './axiosInstance';

export const getTurnosHistoricoDoctor = async ({doctorId}) => {
    try {
        const response = await axiosInstance.post(`turnosdoc`,{doctorId});
        return response
    } catch (error) {
        return (error.response.data.message);
    }
}

export const gettodayAppointments = async ({doctorId}) => {
    try {
        const response = await axiosInstance.post(`turnosdochoy`, {doctorId});
        return response;
    } catch (error) {
        return (error.response.data.message);
    }
}

export const getappointmentsByDate = async ({doctorId, dateAndTime}) => {
    try {
        const response = await axiosInstance.post(`turnosdocfecha`, {doctorId, dateAndTime});
        return response;
    } catch (error) {
        return (error.response.data.message);
    }
}


export const createTurno = async ({ patientId, dateAndTime, cancellationDate, confirmationDate, status, specialtyId, doctorId, venueId }) => {
    try {
        const response = await axiosInstance.post(`appointments`, { patientId, dateAndTime, cancellationDate, confirmationDate, status, specialtyId, doctorId, venueId });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const getpatientAppointments = async ({ dni }) => {
    try {
        const response = await axiosInstance.post(`turnospac`, { dni });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const confirmarTurno = async ({ appointmentId }) => {
    try {
        const response = await axiosInstance.put(`appointments`, { appointmentId });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const cancelarTurno = async ({ appointmentId }) => {
    try {
        const response = await axiosInstance.put(`turnoscancel`, { appointmentId });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}



