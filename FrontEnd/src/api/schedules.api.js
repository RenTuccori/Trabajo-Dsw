import axiosInstance from "./axiosInstance";

export const getFechasDispTodos = async ({ doctorId, specialtyId, venueId }) => {
    try {
        const response = await axiosInstance.post(`DispDocEspSed`, { doctorId, specialtyId, venueId });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const getHorariosDisp = async ({ doctorId, specialtyId, venueId, fecha }) => {
    try {
        const response = await axiosInstance.post(`HorariosDispDocEspSed`, { doctorId, specialtyId, venueId, fecha });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}


