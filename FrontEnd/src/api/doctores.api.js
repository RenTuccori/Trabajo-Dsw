import axios from 'axios';
export const getDoctores = async ({idSede,idEspecialidad}) => {
    return await axios.post('http://localhost:3000/api/doctors',{idSede,idEspecialidad});
}
