import axios from 'axios';
const dbUrl = import.meta.env.VITE_DB_URL
export const getUserDniFecha = async ({dni,fechaNacimiento}) => {
    return await axios.post(`http://${dbUrl}/api/usersdnifecha`,{dni,fechaNacimiento});
}
export const createUser = async ({dni, fechaNacimiento, nombre, apellido, telefono, email, direccion, idObraSocial}) => {
    return await axios.post(`http://${dbUrl}/api/users`,{dni, fechaNacimiento, nombre, apellido, telefono, email, direccion, idObraSocial});
}

export const updateUser = async ({dni, nombre, apellido, telefono, email, direccion, idObraSocial}) => {
    return await axios.put(`http://${dbUrl}/api/users`,{dni, nombre, apellido, telefono, email, direccion, idObraSocial});
}

export const getUserDni = async ({dni}) => {
    return await axios.post(`http://${dbUrl}/api/usersdni`,{dni});
}