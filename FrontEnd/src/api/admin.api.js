import axiosInstance from './axiosInstance';

export const getAdmin = async ({ user, password }) => {
    return await axiosInstance.post(`admin`, { user, password });
}

//Doctor
export const createDoctor = async ({ dni, appointmentDuration, password }) => {
    try {
        const response = await axiosInstance.post(`adminCreateDr`, { dni, appointmentDuration, password });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const deleteDoctor = async (doctorId) => {
    try {
        const response = await axiosInstance.put(`adminDeleteDr/${doctorId}`, doctorId);
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const updateDoctor = async ({ doctorId, appointmentDuration, password }) => {
    try {
        const response = await axiosInstance.put(`adminUpdateDr/${doctorId}`, { doctorId, appointmentDuration, password });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

//Sede
export const createSede = async ({ name, address }) => {
    try {
        const response = await axiosInstance.post(`adminCreateSede`, { name, address });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const updateSede = async ({ venueId, name, address }) => {
    try {
        const response = await axiosInstance.put(`adminUpdateSede/${venueId}`, { name, address });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const deleteSede = async (venueId) => {
    try {
        const response = await axiosInstance.put(`adminDeleteSede/${venueId}`, venueId);
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

//ObraSocial
export const createObraSocial = async ({ name }) => {
    try {
        const response = await axiosInstance.post(`adminCreateObraSocial`, { name });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const updateObraSocial = async ({ insuranceId, name }) => {
    try {
        const response = await axiosInstance.put(`adminUpdateOS/${insuranceId}`, { name });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const deleteObraSocial = async (insuranceId) => {
    try {
        const response = await axiosInstance.put(`adminDeleteOS/${insuranceId}`, insuranceId);
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

//Especialidad
export const createSpecialty = async ({ name }) => {
    try {
        const response = await axiosInstance.post(`adminCreateEsp`, { name });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const deleteSpecialty = async (specialtyId) => {
    try {
        const response = await axiosInstance.put(`deleteSpecialties/${specialtyId}`, specialtyId);
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

//combinations
export const createSeEspDoc = async ({ venueId, specialtyId, doctorId }) => {
    try {
        const response = await axiosInstance.post(`adminCreateSeEspDoc`, { venueId, specialtyId, doctorId });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const deleteSeEspDoc = async ({ venueId, doctorId, specialtyId }) => {
    try {
        const response = await axiosInstance.put(`adminDeleteSeEspDoc`, { venueId, doctorId, specialtyId });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const getCombinaciones = async () => {
    try {
        const response = await axiosInstance.get(`adminGetCombinaciones`);
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

//Horarios
export const createHorarios = async ({ venueId, doctorId, specialtyId, day, startTime, endTime, status }) => {
    try {
        const response = await axiosInstance.post(`adminCreateHorario`, { venueId, doctorId, specialtyId, day, startTime, endTime, status });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const getHorariosXDoctor = async ({ venueId, specialtyId, doctorId }) => {
    try {
        const response = await axiosInstance.post(`adminGetHorariosXDoctor`, { venueId, specialtyId, doctorId });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const updateHorarios = async ({ venueId, doctorId, specialtyId, day, startTime, endTime, status }) => {
    try {
        const response = await axiosInstance.put(`adminUpdateHorario`, { venueId, doctorId, specialtyId, day, startTime, endTime, status });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

