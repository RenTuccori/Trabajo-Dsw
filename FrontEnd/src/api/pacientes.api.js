import axios from 'axios';
export const getPacienteDni = async ({dni}) => {
    return await axios.post('http://localhost:3000/api/patientdni',{dni});
}
;
export const createPaciente = async ({dni}) => {
    return await axios.post('http://localhost:3000/api/patientcreate',{dni});
}