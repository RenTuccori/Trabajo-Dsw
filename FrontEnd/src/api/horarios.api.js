import axiosInstance from "./axiosInstance";

export const getAvailableDates = async ({ idDoctor, idEspecialidad, idSede }) => {
    try {
        const response = await axiosInstance.post(`DispDocEspSed`, { idDoctor, idEspecialidad, idSede });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const getAvailableSchedules = async ({ idDoctor, idEspecialidad, idSede, fecha }) => {
    try {
        const response = await axiosInstance.post(`HorariosDispDocEspSed`, { idDoctor, idEspecialidad, idSede, fecha });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}
