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
    console.log('🌐 FRONTEND - createTurno: Iniciando petición al backend');
    console.log('📋 FRONTEND - Parámetros recibidos:');
    console.log('  - patientId:', patientId);
    console.log('  - dateAndTime:', dateAndTime);
    console.log('  - specialtyId:', specialtyId);
    console.log('  - doctorId:', doctorId);
    console.log('  - venueId:', venueId);
    console.log('  - status:', status);
    console.log('  - cancellationDate:', cancellationDate);
    console.log('  - confirmationDate:', confirmationDate);
    
    const requestData = { 
        patientId, 
        dateAndTime, 
        cancellationDate, 
        confirmationDate, 
        status, 
        specialtyId, 
        doctorId, 
        venueId 
    };
    
    console.log('📤 FRONTEND - Datos enviados al backend:', requestData);
    
    try {
        const response = await axiosInstance.post(`appointments`, requestData);
        console.log('✅ FRONTEND - createTurno: Respuesta exitosa del backend:', response);
        return response;
    } catch (error) {
        console.error('❌ FRONTEND - createTurno: Error en petición:', error);
        console.error('📄 FRONTEND - Detalles del error:', error.response?.data);
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



