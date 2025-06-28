import axios from 'axios';
import axiosInstance from './axiosInstance';
const dbUrl = import.meta.env.VITE_DB_URL

export const verifyDoctor = async ({ dni, password }) => {
    return await axios.post(`http://${dbUrl}/api/doctorscontra`, { dni, password });
}

export const getDoctors = async ({ venueId, specialtyId }) => {
    try {
        const response = await axiosInstance.post(`doctors`, { venueId, specialtyId });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const getDoctorById = async (doctorId) => {
    try {
        const response = await axiosInstance.get(`doctorsId/${doctorId}`);
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

export const getAvailableDoctors = async ({ venueId }) => {
    try {
        const response = await axiosInstance.post(`availabledoctors`, { venueId });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}



