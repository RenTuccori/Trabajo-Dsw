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

export const getTurnosPaciente = async ({dni,fechaNacimiento}) => {
    return await axios.post('http://localhost:3000/api/turnospac',{dni,fechaNacimiento});
}

export const confirmarTurno = async ({idTurno}) => {
    return await axios.put('http://localhost:3000/api/turnos',{idTurno});
}

export const cancelarTurno = async ({idTurno}) => {
    return await axios.put('http://localhost:3000/api/turnoscancel',{idTurno});
}