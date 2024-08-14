import axios from 'axios';
export const getUserDniFecha = async ({dni,fechaNacimiento}) => {
    return await axios.post('http://localhost:3000/api/usersdnifecha',{dni,fechaNacimiento});
}
export const createUser = async ({dni, fechaNacimiento, nombre, apellido, telefono, email, direccion, idObraSocial}) => {
    return await axios.post('http://localhost:3000/api/users',{dni, fechaNacimiento, nombre, apellido, telefono, email, direccion, idObraSocial});
}
