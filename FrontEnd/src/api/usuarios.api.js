import axiosInstance from './axiosInstance';

export const getUserDniFecha = async ({dni,fechaNacimiento}) => {
    return await axiosInstance.post(`/api/usersdnifecha`,{dni,fechaNacimiento});
}

export const createUser = async ({dni,fechaNacimiento,nombre,apellido,telefono,email,direccion,idObraSocial}) => {
    return await axiosInstance.post(`/api/users`,{dni,fechaNacimiento,nombre,apellido,telefono,email,direccion,idObraSocial});
}

export const updateUser = async ({ dni, nombre, apellido, telefono, email, direccion, idObraSocial }) => {
    try {
        const response = await axiosInstance.put(`/api/users`, { dni, nombre, apellido, telefono, email, direccion, idObraSocial });
        return response;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}

export const getUserDni = async ({ dni }) => {
    try {
        const response = await axiosInstance.post(`/api/usersdni`, { dni });
        return response;
    } catch (error) {
        return error.response.data.message;
    }
}
