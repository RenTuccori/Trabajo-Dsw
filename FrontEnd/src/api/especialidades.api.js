import axios from 'axios';
const dbUrl = import.meta.env.VITE_DB_URL
export const getEspecialidades = async ({ idSede }) => {
    return await axios.post(`http://${dbUrl}/api/allspecialties`, { idSede });
};

export const getEspecialidadById = async (idEspecialidad) => {
    return await axios.get(`http://${dbUrl}/api/idspecialties/${idEspecialidad}`);
};


