import axios from 'axios';
const dbUrl = import.meta.env.VITE_DB_URL
export const getEspecialidades = async ({ idSede }) => {
    return await axios.post(`http://${dbUrl}/api/allspecialties`, { idSede });
};

export const getEspecialidadById = async (idEspecialidad) => {
    return await axios.get(`http://${dbUrl}/api/idspecialties/${idEspecialidad}`);
};
export const getAvailableSpecialties = async ({ idSede }) => {
    return await axios.post(`http://${dbUrl}/api/availablespecialties`, { idSede });
};
export const getAllSpecialities = async () => {
    return await axios.post(`http://${dbUrl}/api/allespecialties`);
};
