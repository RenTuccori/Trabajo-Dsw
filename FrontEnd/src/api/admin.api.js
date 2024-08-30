import axios from 'axios';

const dbUrl = import.meta.env.VITE_DB_URL

export const getAdmin = async ({usuario,contra}) => {
    return await axios.post(`http://${dbUrl}/api/admin`, {usuario, contra});
}
