import axiosInstance from "./axiosInstance";

export const getAvailableDatesByDocSpecLoc = async ({ doctorId, specialtyId, locationId }) => {
    try {
        const response = await axiosInstance.post(`schedules/available/doctor-specialty-location`, { doctorId, specialtyId, locationId });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const getAvailableSchedulesByDocSpecLoc = async ({ doctorId, specialtyId, locationId, fecha }) => {
    try {
        const response = await axiosInstance.post(`schedules/doctor-specialty-location`, { doctorId, specialtyId, locationId, fecha });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}


