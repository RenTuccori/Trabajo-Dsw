import axiosInstance from './axiosInstance';

export const getHistoricalAppointmentsDoctor = async ({doctorId}) => {
    try {
        const response = await axiosInstance.post(`appointments/doctor/history`,{doctorId});
        return response
    } catch (error) {
        return (error.response.data.message);
    }
}

export const getTodayAppointments = async ({doctorId}) => {
    try {
        const response = await axiosInstance.post(`appointments/doctor/today`, {doctorId});
        return response;
    } catch (error) {
        return (error.response.data.message);
    }
}

export const getAppointmentsByDate = async ({doctorId, dateTime}) => {
    try {
        const response = await axiosInstance.post(`appointments/doctor/date`, {doctorId, dateTime});
        return response;
    } catch (error) {
        if (error.response?.status === 404) {
            return { data: [] };
        }
        throw error;
    }
}


export const createAppointment = async ({ patientId, dateAndTime, cancellationDate, confirmationDate, status, specialtyId, doctorId, locationId }) => {
    
    // Backend expects `dateTime` field name
    const requestData = {
        patientId,
        dateTime: dateAndTime,
        cancellationDate,
        confirmationDate,
        status,
        specialtyId,
        doctorId,
        locationId,
    };
    
    
    try {
        const response = await axiosInstance.post(`appointments`, requestData);
        return response;
    } catch (error) {
        console.error('❌ FRONTEND - createAppointment: Request error:', error);
        console.error('📄 FRONTEND - Error details:', error.response?.data);
        const backendPayload = error.response?.data;
        const validationErrors = backendPayload?.errors;

        if (Array.isArray(validationErrors) && validationErrors.length > 0) {
            const message = validationErrors
                .map((e) => `${e.field}: ${e.message}`)
                .join(' | ');
            throw new Error(message);
        }

        throw new Error(backendPayload?.message || error.message || 'Error creating appointment');
    }
}

export const getPatientAppointments = async ({ nationalId }) => {
    try {
        const response = await axiosInstance.post(`appointments/patient`, { nationalId });
        return response;
    } catch (error) {
        console.error('❌ FRONTEND - getPatientAppointments: Error:', error);
        console.error('📄 FRONTEND - Error details:', error.response?.data);
        return error.response.data.message;
    }
}

export const confirmAppointment = async ({ id }) => {
    try {
        const response = await axiosInstance.put(`appointments/confirm`, { id });
        return response;
    } catch (error) {
        console.error('❌ FRONTEND - confirmAppointment: Error:', error);
        console.error('📄 FRONTEND - Error details:', error.response?.data);
        return error.response.data.message;
    }
}

export const cancelAppointment = async ({ id }) => {
    try {
        const response = await axiosInstance.put(`appointments/cancel`, { id });
        return response;
    } catch (error) {
        console.error('❌ FRONTEND - cancelAppointment: Error:', error);
        console.error('📄 FRONTEND - Error details:', error.response?.data);
        return error.response.data.message;
    }
}



