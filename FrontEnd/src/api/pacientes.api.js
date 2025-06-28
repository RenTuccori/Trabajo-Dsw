import axiosInstance from './axiosInstance';

export const getPacientes = async () => {
  try {
    const response = await axiosInstance.get(`/api/pacientes`);
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getPacienteDni = async ({ dni }) => {
  try {
    const response = await axiosInstance.post(`/api/paciente`, { dni });
    return response;
  } catch (error) {
    console.error('Error in getPacienteDni:', error);
    throw error;
  }
};

export const createPaciente = async ({ dni }) => {
  try {
    const response = await axiosInstance.post(`/api/pacientes`, { dni });
    return response;
  } catch (error) {
    return error.response.data.message;
  }
};
