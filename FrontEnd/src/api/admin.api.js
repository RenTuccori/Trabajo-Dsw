import axios from 'axios';

const dbUrl = import.meta.env.VITE_DB_URL

export const getAdmin = async ({ usuario, contra }) => {
    return await axios.post(`http://${dbUrl}/api/admin`, { usuario, contra });
}
//Doctor

export const createDoctor = async ({ dni, duracionTurno, contra }) => {
    return await axios.post(`http://${dbUrl}/api/adminCreateDr`, { dni, duracionTurno, contra });
}
export const deleteDoctor = async ({ idDoctor }) => {
    return await axios.delete(`http://${dbUrl}/api/adminDeleteDr${idDoctor}`, { idDoctor });
}
export const updateDoctor = async ({ idDoctor, duracionTurno, contra }) => {
    return await axios.put(`http://${dbUrl}/api/adminUpdateDr/${idDoctor}`, { idDoctor, duracionTurno, contra });
}

//Sede
export const createSede = async ({ nombre, direccion }) => {
    return await axios.post(`http://${dbUrl}/api/adminCreateSede`, { nombre, direccion });
}
export const updateSede = async ({ idSede, nombre, direccion }) => {
    return await axios.put(`http://${dbUrl}/api/adminUpdateSede/${idSede}`, { nombre, direccion });
}
export const deleteSede = async (idSede) => {
    return await axios.delete(`http://${dbUrl}/api/adminDeleteSede/${idSede}`, idSede);
}
//ObraSocial
export const createObraSocial = async ({ nombre }) => {
    return await axios.post(`http://${dbUrl}/api/adminCreateObraSocial`, { nombre });
}
export const updateObraSocial = async ({ idObraSocial, nombre }) => {
    return await axios.put(`http://${dbUrl}/api/adminUpdateOS/${idObraSocial}`, { nombre });
}
export const deleteObraSocial = async (idObraSocial) => {
    return await axios.delete(`http://${dbUrl}/api/adminDeleteOS/${idObraSocial}`, idObraSocial);
}
//Especialidad
export const createSpecialty = async ({ nombre }) => {
    return await axios.post(`http://${dbUrl}/api/adminCreateEsp`, { nombre });
}
export const deleteSpecialty = async (idEspecialidad) => {
    return await axios.delete(`http://${dbUrl}/api/deleteSpecialties/${idEspecialidad}`, idEspecialidad);
}

//combinaciones
export const createSeEspDoc = async ({ idSede, idEspecialidad, idDoctor }) => {
    return await axios.post(`http://${dbUrl}/api/adminCreateSeEspDoc`, { idSede, idEspecialidad, idDoctor });
}