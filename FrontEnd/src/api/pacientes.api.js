import axios from 'axios';
const dbUrl = import.meta.env.VITE_DB_URL;
import axiosInstance from './axiosInstance';

export const getPatients = async () => {
  try {
    const response = await axiosInstance.get(`patient`);
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getPatientByDni = async ({ dni }) => {
  try {
    const response = await axiosInstance.post(`patientdni`, { dni });
    return response;
  } catch (error) {
    return error.response.data.message;
  }
};

export const createPatient = async ({ dni }) => {
  return await axios.post(`http://${dbUrl}/api/patientcreate`, { dni });
};
