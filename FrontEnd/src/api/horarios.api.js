import axios from 'axios';
const dbUrl = import.meta.env.VITE_DB_URL
export const getFechasDispTodos = async ({idDoctor,idEspecialidad,idSede}) => {
    return await axios.post(`http://${dbUrl}/api/DispDocEspSed`,{idDoctor,idEspecialidad,idSede});
}
export const getHorariosDisp = async ({idDoctor, idEspecialidad, idSede, fecha}) => {
    return await axios.post(`http://${dbUrl}/api/HorariosDispDocEspSed`,{idDoctor, idEspecialidad, idSede, fecha});
}
