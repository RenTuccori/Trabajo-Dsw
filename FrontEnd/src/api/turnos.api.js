import axios from 'axios';
export const getTurnosDoctor = async ({dni,contra}) => {
    return await axios.post('http://localhost:3000/api/turnosdoc',{dni,contra});
}
