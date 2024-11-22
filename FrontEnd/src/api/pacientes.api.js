import axios from 'axios';
const dbUrl = import.meta.env.VITE_DB_URL
import axiosInstance from './axiosInstance';
export const getPacienteDni = async ({ dni }) => {
    try {
        const response = await axiosInstance.post(`patientdni`, { dni });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
};
export const createPaciente = async ({dni}) => {
    return await axios.post(`http://${dbUrl}/api/patientcreate`,{dni});
}
