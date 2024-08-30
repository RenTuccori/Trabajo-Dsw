import axios from 'axios';
const dbUrl = import.meta.env.VITE_DB_URL
export const getSedes = async () => {
    return await axios.get(`http://${dbUrl}/api/sedes`);
}

export const getSedeById = async ({idSede}) => {
    return await axios.post(`http://${dbUrl}/api/sedes`,{idSede});
}