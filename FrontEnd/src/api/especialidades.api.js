import axios from 'axios';
export const getEspecialidades = async ({idSede}) => {
    return await axios.post('http://localhost:3000/api/allspecialties',{idSede});
}
