import axios from 'axios';
export const getTurnosHistoricoDoctor = async ({idDoctor}) => {
    return await axios.post('http://localhost:3000/api/turnosdoc',{idDoctor});
}
export const getTurnosDoctorHoy = async ({idDoctor}) => {
    return await axios.post('http://localhost:3000/api/turnosdochoy',{idDoctor});
}
