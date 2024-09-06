import axios from 'axios';
const dbUrl = import.meta.env.VITE_DB_URL
export const getDoctores = async ({idSede,idEspecialidad}) => {
    return await axios.post(`http://${dbUrl}/api/doctors`,{idSede,idEspecialidad});
}
;
export const verifyDoctor = async ({dni,contra}) => {
    return await axios.post(`http://${dbUrl}/api/doctorscontra`,{dni,contra});
}
export const getDoctorById = async (idDoctor) => {
    return await axios.get(`http://${dbUrl}/api/doctorsId/${idDoctor}`);
}
