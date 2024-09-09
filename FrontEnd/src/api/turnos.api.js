import axios from 'axios';
const dbUrl = import.meta.env.VITE_DB_URL
export const getTurnosHistoricoDoctor = async ({idDoctor}) => {
    return await axios.post(`http://${dbUrl}/api/turnosdoc`,{idDoctor});
}
export const getTurnosDoctorHoy = async ({idDoctor}) => {
    return await axios.post(`http://${dbUrl}/api/turnosdochoy`,{idDoctor});
}

export const getTurnosDoctorFecha = async ({idDoctor,fechaYHora}) => {
    return await axios.post(`http://${dbUrl}/api/turnosdocfecha`,{idDoctor,fechaYHora});
}

export const createTurno = async ({idPaciente,fechaYHora,fechaCancelacion,fechaConfirmacion,estado,idEspecialidad,idDoctor,idSede}) => {
    return await axios.post(`http://${dbUrl}/api/turnos`,{idPaciente,fechaYHora,fechaCancelacion,fechaConfirmacion,estado,idEspecialidad,idDoctor,idSede});
}

export const getTurnosPaciente = async ({dni}) => {
    return await axios.post(`http://${dbUrl}/api/turnospac`,{dni});
}

export const confirmarTurno = async ({idTurno}) => {
    return await axios.put(`http://${dbUrl}/api/turnos`,{idTurno});
}

export const cancelarTurno = async ({idTurno}) => {
    return await axios.put(`http://${dbUrl}/api/turnoscancel`,{idTurno});
}