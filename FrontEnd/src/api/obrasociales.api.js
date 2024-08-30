import axios from 'axios';
const dbUrl = import.meta.env.VITE_DB_URL
export const getObraSociales = async () => {
    return await axios.get(`http://${dbUrl}/api/medicalinsurance`);
}
