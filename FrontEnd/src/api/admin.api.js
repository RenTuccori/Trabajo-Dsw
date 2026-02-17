import axios from 'axios';
import axiosInstance from './axiosInstance';
const dbUrl = import.meta.env.VITE_DB_URL

export const getAdmin = async ({ usuario, contra }) => {
    return await axios.post(`http://${dbUrl}/api/admin`, { usuario, contra });
}

// Doctor
export const createDoctor = async ({ dni, duracionTurno, contra }) => {
    try {
        const response = await axiosInstance.post(`adminCreateDr`, { dni, duracionTurno, contra });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const deleteDoctor = async (idDoctor) => {
    try {
        const response = await axiosInstance.put(`adminDeleteDr/${idDoctor}`, idDoctor);
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const updateDoctor = async ({ idDoctor, duracionTurno, contra }) => {
    try {
        const response = await axiosInstance.put(`adminUpdateDr/${idDoctor}`, { idDoctor, duracionTurno, contra });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

// Location
export const createLocation = async ({ nombre, direccion }) => {
    try {
        const response = await axiosInstance.post(`adminCreateSede`, { nombre, direccion });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const updateLocation = async ({ idSede, nombre, direccion }) => {
    try {
        const response = await axiosInstance.put(`adminUpdateSede/${idSede}`, { nombre, direccion });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const deleteLocation = async (idSede) => {
    try {
        const response = await axiosInstance.put(`adminDeleteSede/${idSede}`, idSede);
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

// Health Insurance
export const createHealthInsurance = async ({ nombre }) => {
    try {
        const response = await axiosInstance.post(`adminCreateObraSocial`, { nombre });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const updateHealthInsurance = async ({ idObraSocial, nombre }) => {
    try {
        const response = await axiosInstance.put(`adminUpdateOS/${idObraSocial}`, { nombre });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const deleteHealthInsurance = async (idObraSocial) => {
    try {
        const response = await axiosInstance.put(`adminDeleteOS/${idObraSocial}`, idObraSocial);
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

// Specialty
export const createSpecialty = async ({ nombre }) => {
    try {
        const response = await axiosInstance.post(`adminCreateEsp`, { nombre });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const deleteSpecialty = async (idEspecialidad) => {
    try {
        const response = await axiosInstance.put(`deleteSpecialties/${idEspecialidad}`, idEspecialidad);
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

// Combinations
export const createCombination = async ({ idSede, idEspecialidad, idDoctor }) => {
    try {
        const response = await axiosInstance.post(`adminCreateSeEspDoc`, { idSede, idEspecialidad, idDoctor });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const deleteCombination = async ({ idSede, idDoctor, idEspecialidad }) => {
    try {
        const response = await axiosInstance.put(`adminDeleteSeEspDoc`, { idSede, idDoctor, idEspecialidad });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const getCombinations = async () => {
    try {
        const response = await axiosInstance.get(`adminGetCombinaciones`);
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

// Schedules
export const createSchedule = async ({ idSede, idDoctor, idEspecialidad, dia, hora_inicio, hora_fin, estado }) => {
    try {
        const response = await axiosInstance.post(`adminCreateHorario`, { idSede, idDoctor, idEspecialidad, dia, hora_inicio, hora_fin, estado });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const getSchedulesByDoctor = async ({ idSede, idEspecialidad, idDoctor }) => {
    try {
        const response = await axiosInstance.post(`adminGetHorariosXDoctor`, { idSede, idEspecialidad, idDoctor });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const updateSchedule = async ({ idSede, idDoctor, idEspecialidad, dia, hora_inicio, hora_fin, estado }) => {
    try {
        const response = await axiosInstance.put(`adminUpdateHorario`, { idSede, idDoctor, idEspecialidad, dia, hora_inicio, hora_fin, estado });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}