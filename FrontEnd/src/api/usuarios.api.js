import axios from 'axios';
const dbUrl = import.meta.env.VITE_DB_URL
import axiosInstance from './axiosInstance';
export const getUserDniFecha = async ({dni,fechaNacimiento}) => {
    return await axios.post(`http://${dbUrl}/api/usersdnifecha`,{dni,fechaNacimiento});
}
export const createUser = async ({dni,fechaNacimiento,nombre,apellido,telefono,email,direccion,idObraSocial}) => {
    return await axios.post(`http://${dbUrl}/api/users`,{dni,fechaNacimiento,nombre,apellido,telefono,email,direccion,idObraSocial});
}


export const updateUser = async ({ dni, nombre, apellido, telefono, email, direccion, idObraSocial }) => {
    try {
        const response = await axiosInstance.put(`users`, { dni, nombre, apellido, telefono, email, direccion, idObraSocial });
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
