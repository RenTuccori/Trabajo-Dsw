import axios from 'axios';
export const getUserDniFecha = async ({dni,fechaNacimiento}) => {
    return await axios.post('http://localhost:3000/api/usersdnifecha',{dni,fechaNacimiento});
}
export const createUser = async ({dni, nombre, apellido, fechaNacimiento, direccion, telefono, email, idObraSocial}) => {
    return await axios.post('http://localhost:3000/api/users',{dni, nombre, apellido, fechaNacimiento, direccion, telefono, email, idObraSocial});
}
