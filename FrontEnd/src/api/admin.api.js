import axios from 'axios';
export const getAdmin = async ({usuario,contra}) => {
    return await axios.post('http://localhost:3000/api/admin',{usuario,contra});
}
