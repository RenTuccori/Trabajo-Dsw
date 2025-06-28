import axios from 'axios';
const dbUrl = import.meta.env.VITE_DB_URL
import axiosInstance from './axiosInstance';
export const getUserDniFecha = async ({dni,birthDate}) => {
    return await axios.post(`http://${dbUrl}/api/usersdnifecha`,{dni,birthDate});
}
export const createUser = async ({dni,birthDate,name,lastName,phone,email,address,healthInsuranceId}) => {
    return await axios.post(`http://${dbUrl}/api/users`,{dni,birthDate,name,lastName,phone,email,address,healthInsuranceId});
}


export const updateUser = async ({ dni, name, lastName, phone, email, address, healthInsuranceId }) => {
    try {
        const response = await axiosInstance.put(`users`, { dni, name, lastName, phone, email, address, healthInsuranceId });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}

export const getUserDni = async ({ dni }) => {
    try {
        const response = await axiosInstance.post(`usersdni`, { dni });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}


