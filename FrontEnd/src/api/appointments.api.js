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
    console.log('🌐 FRONTEND - createAppointment: Starting request to backend');
    console.log('📋 FRONTEND - Received parameters:');
    console.log('  - patientId:', patientId);
    console.log('  - dateAndTime:', dateAndTime);
    console.log('  - specialtyId:', specialtyId);
    console.log('  - doctorId:', doctorId);
    console.log('  - locationId:', locationId);
    console.log('  - status:', status);
    console.log('  - cancellationDate:', cancellationDate);
    console.log('  - confirmationDate:', confirmationDate);
    
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
    
    console.log('📤 FRONTEND - Data sent to backend:', requestData);
    
    try {
        const response = await axiosInstance.post(`appointments`, requestData);
        console.log('✅ FRONTEND - createAppointment: Successful backend response:', response);
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
    console.log('🌐 FRONTEND - getPatientAppointments: Getting appointments for nationalId:', nationalId);
    try {
        const response = await axiosInstance.post(`appointments/patient`, { nationalId });
        console.log('✅ FRONTEND - getPatientAppointments: Response received:', response);
        console.log('📊 FRONTEND - getPatientAppointments: Data:', response.data);
        return response;
    } catch (error) {
        console.error('❌ FRONTEND - getPatientAppointments: Error:', error);
        console.error('📄 FRONTEND - Error details:', error.response?.data);
        return error.response.data.message;
    }
}

export const confirmAppointment = async ({ id }) => {
    console.log('🌐 FRONTEND - confirmAppointment: Starting confirmation for id:', id);
    try {
        const response = await axiosInstance.put(`appointments/confirm`, { id });
        console.log('✅ FRONTEND - confirmAppointment: Appointment confirmed successfully:', response);
        return response;
    } catch (error) {
        console.error('❌ FRONTEND - confirmAppointment: Error:', error);
        console.error('📄 FRONTEND - Error details:', error.response?.data);
        return error.response.data.message;
    }
}

export const cancelAppointment = async ({ id }) => {
    console.log('🌐 FRONTEND - cancelAppointment: Starting cancellation for id:', id);
    try {
        const response = await axiosInstance.put(`appointments/cancel`, { id });
        console.log('✅ FRONTEND - cancelAppointment: Appointment cancelled successfully:', response);
        return response;
    } catch (error) {
        console.error('❌ FRONTEND - cancelAppointment: Error:', error);
        console.error('📄 FRONTEND - Error details:', error.response?.data);
        return error.response.data.message;
    }
}



