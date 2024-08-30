import axios from 'axios';
const dbUrl = import.meta.env.VITE_DB_URL
export const getPacienteDni = async ({dni}) => {
    return await axios.post(`http://${dbUrl}/api/patientdni`,{dni});
}
;
export const createPaciente = async ({dni}) => {
    return await axios.post(`http://${dbUrl}/api/patientcreate`,{dni});
}