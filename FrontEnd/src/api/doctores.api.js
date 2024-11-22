import axios from 'axios';
import axiosInstance from './axiosInstance';
const dbUrl = import.meta.env.VITE_DB_URL

export const verifyDoctor = async ({ dni, contra }) => {
    return await axios.post(`http://${dbUrl}/api/doctorscontra`, { dni, contra });
}

export const getDoctors = async ({ idSede, idEspecialidad }) => {
    try {
        const response = await axiosInstance.post(`doctors`, { idSede, idEspecialidad });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const getDoctorById = async (idDoctor) => {
    try {
        const response = await axiosInstance.get(`doctorsId/${idDoctor}`);
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const getDoctores = async () => {
    try {
        const response = await axiosInstance.post(`alldoctors`);
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const getAvailableDoctors = async ({ idSede }) => {
    try {
        const response = await axiosInstance.post(`availabledoctors`, { idSede });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

