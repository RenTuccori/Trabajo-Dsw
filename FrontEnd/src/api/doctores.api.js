import axios from 'axios';
export const getDoctores = async ({idSede,idEspecialidad}) => {
    return await axios.post('http://localhost:3000/api/doctors',{idSede,idEspecialidad});
}
;
export const verifyDoctor = async ({dni,contra}) => {
    return await axios.post('http://localhost:3000/api/doctorscontra',{dni,contra});
}

export const getDoctorById = async ({idDoctor}) => {
    return await axios.get('http://localhost:3000/api/doctorsId',{idDoctor});
}