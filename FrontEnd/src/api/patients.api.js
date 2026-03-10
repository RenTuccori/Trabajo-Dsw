import axiosInstance from './axiosInstance';

export const getPacientes = async () => {
  try {
    const response = await axiosInstance.get(`patient`);
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getPacienteDni = async ({ dni }) => {
  console.log('🌐 FRONTEND - getPacienteDni: Iniciando petición al backend');
  console.log('📋 FRONTEND - DNI enviado:', dni);
  
  try {
    const response = await axiosInstance.post(`patientdni`, { dni });
    console.log('✅ FRONTEND - getPacienteDni: Respuesta recibida:', response);
    console.log('🆔 FRONTEND - idPatient en respuesta:', response.data?.idPatient);
    return response;
  } catch (error) {
    console.error('❌ FRONTEND - getPacienteDni: Error:', error);
    console.error('📄 FRONTEND - Detalles del error:', error.response?.data);
    return error.response.data.message;
  }
};

export const createPaciente = async ({ dni }) => {
  return await axiosInstance.post(`patientcreate`, { dni });
};


