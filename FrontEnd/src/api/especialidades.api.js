import axios from 'axios';
export const getEspecialidades = async ({idSede}) => {
    return await axios.post('http://localhost:3000/api/allspecialties',{idSede});
};

export const getSpecialtyById = async ({idEspecialidad}) => {
return await axios.get('http://localhost:3000/api/allspecialties',{idEspecialidad});
};
