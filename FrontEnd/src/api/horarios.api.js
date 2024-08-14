import axios from 'axios';
export const getFechasDispTodos = async ({idDoctor,idEspecialidad,idSede}) => {
    return await axios.post('http://localhost:3000/api/DispDocEspSed',{idDoctor,idEspecialidad,idSede});
}
export const getHorariosDisp = async ({idDoctor, idEspecialidad, idSede, fecha}) => {
    return await axios.post('http://localhost:3000/api/HorariosDispDocEspSed',{idDoctor, idEspecialidad, idSede, fecha});
}
