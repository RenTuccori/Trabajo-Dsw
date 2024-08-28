import axios from 'axios';
export const getSedes = async () => {
    return await axios.get('http://localhost:3000/api/sedes');
}

export const getSedeById = async ({idSede}) => {
    return await axios.post('http://localhost:3000/api/sedes',{idSede});
}