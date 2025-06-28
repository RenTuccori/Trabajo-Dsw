import axios from 'axios';
const dbUrl = import.meta.env.VITE_DB_URL;
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
  try {
    const response = await axiosInstance.post(`patientdni`, { dni });
    return response;
  } catch (error) {
    return error.response.data.message;
  }
};

export const createPaciente = async ({ dni }) => {
  return await axios.post(`http://${dbUrl}/api/patientcreate`, { dni });
};


