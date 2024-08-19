import axios from 'axios';
export const getEspecialidades = async ({idSede}) => {
    return await axios.post('http://localhost:3000/api/allspecialties',{idSede});
};

export const getEspecialidadById = async ({idEspecialidad}) => {
return await axios.post('http://localhost:3000/api/idspecialties',{idEspecialidad});
};
