import axios from 'axios';
const dbUrl = import.meta.env.VITE_DB_URL
export const getHealthInsuranceList = async () => {
    return await axios.get(`http://${dbUrl}/api/os`);
}

