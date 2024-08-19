import axios from 'axios';
export const getTurnosHistoricoDoctor = async ({idDoctor}) => {
    return await axios.post('http://localhost:3000/api/turnosdoc',{idDoctor});
}
export const getTurnosDoctorHoy = async ({idDoctor}) => {
    return await axios.post('http://localhost:3000/api/turnosdochoy',{idDoctor});
}

export const getTurnosDoctorFecha = async ({idDoctor,fechaYHora}) => {
    return await axios.post('http://localhost:3000/api/turnosdocfecha',{idDoctor,fechaYHora});
}

export const createTurno = async ({idPaciente,fechaYHora,fechaCancelacion,fechaConfirmacion,estado,idEspecialidad,idDoctor,idSede}) => {
    return await axios.post('http://localhost:3000/api/turnos',{idPaciente,fechaYHora,fechaCancelacion,fechaConfirmacion,estado,idEspecialidad,idDoctor,idSede});
}