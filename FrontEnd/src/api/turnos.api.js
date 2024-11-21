import axios from 'axios';
import axiosInstance from './axiosInstance';
const dbUrl = import.meta.env.VITE_DB_URL


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

export const createTurno = async ({idPaciente,fechaYHora,fechaCancelacion,fechaConfirmacion,estado,idEspecialidad,idDoctor,idSede}) => {
    return await axios.post(`http://${dbUrl}/api/turnos`,{idPaciente,fechaYHora,fechaCancelacion,fechaConfirmacion,estado,idEspecialidad,idDoctor,idSede});
}

export const getTurnosPaciente = async ({dni}) => {
    return await axios.post(`http://${dbUrl}/api/turnospac`,{dni});
}

export const confirmarTurno = async ({idTurno}) => {
    return await axios.put(`http://${dbUrl}/api/turnos`,{idTurno});
}

export const cancelarTurno = async ({idTurno}) => {
    return await axios.put(`http://${dbUrl}/api/turnoscancel`,{idTurno});
}