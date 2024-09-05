import { PacientesContext } from './PacientesContext';
import { getSedes } from '../../api/sedes.api';
import { getEspecialidades } from '../../api/especialidades.api';
import { getDoctores } from '../../api/doctores.api';
import { getFechasDispTodos, getHorariosDisp } from '../../api/horarios.api';
import { useContext, useState } from 'react';
import { getUserDniFecha } from '../../api/usuarios.api';
import PropTypes from 'prop-types';
import { jwtDecode } from "jwt-decode";
import { getObraSociales } from '../../api/obrasociales.api';
import { createUser } from '../../api/usuarios.api';
import { createPaciente } from '../../api/pacientes.api';


// eslint-disable-next-line react-refresh/only-export-components
export const usePacientes = () => {
    const context = useContext(PacientesContext);
    if (!context) {
      throw new Error(
        'usePacientes must be used within an PacientesProvider',
      );
    }
    return context;
  };
  
  const PacientesProvider = ({ children }) => {  
    //proveedor para acceder a los datos de los empleados desde cualquier componente
    
    const [sedes, setSedes] = useState([]);
    const [especialidades, setEspecialidades] = useState([]);
    const [doctores, setDoctores] = useState([]);
    const [fechas, setFechas] = useState([]);
    const [horarios, setHorarios] = useState([]);
    const [detalles, setDetalles] = useState({});
    const [dni, setDni] = useState('');
    const [obraSociales, setObraSociales] = useState([]);
    const [usuario,setUsuario] = useState({});
    const [idPacienteCreado,setidPacienteCreado] = useState(''); 
  

    async function ObtenerSedes(){
      const response = await getSedes();
      setSedes(response.data);
    }

    async function ObtenerEspecialidades({idSede}){
      const response = await getEspecialidades({idSede});
      setEspecialidades(response.data);
    }   

    async function ObtenerDoctores({idSede, idEspecialidad}){
      const response = await getDoctores({idSede, idEspecialidad});
      setDoctores(response.data);
    }
    async function ObtenerFechas({selectedOption, selectedEspecialidad, selectedSede}){
      const response = await getFechasDispTodos({
          idDoctor: selectedOption.value,
          idEspecialidad: selectedEspecialidad.value,
          idSede: selectedSede.value
      });
      const fechasFormateadas = response.data.map(item => {
          return new Date(item.fecha);
      });
      setFechas(fechasFormateadas);
    }
    async function ObtenerHorarios({selectedDoctor, selectedEspecialidad, selectedSede, date}){
        const response = await getHorariosDisp({
            idDoctor: selectedDoctor.value,
            idEspecialidad: selectedEspecialidad.value,
            idSede: selectedSede.value,
            fecha: date
        });
        setHorarios(response.data);
    }
    
    async function Login({dni,fechaNacimiento}) {
      const response = await getUserDniFecha({dni,fechaNacimiento});
      console.log(response);
      const token = response.data;
      console.log(token);
      localStorage.setItem('token', token);
      const decoded = jwtDecode(token);
      setDni(decoded.dni);
      /*window.location.reload();*/
  }

    async function ObtenerObraSociales(){
      const response = await getObraSociales();
      setObraSociales(response.data);
    }

    async function CrearUsuario(data){
      const response = await createUser(data);
      setUsuario(response.data);
    }

    async function CrearPaciente({dni}){
      const response = await createPaciente({dni});
      setidPacienteCreado(response.data.idPaciente);
    } 

    return (
      <PacientesContext.Provider
        value={{ sedes, especialidades, doctores, ObtenerSedes, ObtenerEspecialidades, ObtenerDoctores, fechas, ObtenerFechas, horarios, ObtenerHorarios, setDetalles, detalles, Login, dni, obraSociales, ObtenerObraSociales,idPacienteCreado,usuario,CrearPaciente,CrearUsuario}}>
        {children}
      </PacientesContext.Provider>
    );
    }
    
    PacientesProvider.propTypes = {
    children: PropTypes.node.isRequired,
    };
    
    export default PacientesProvider;
