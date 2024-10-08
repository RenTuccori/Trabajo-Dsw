import { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import { PacientesContext } from './PacientesContext';
import { getSedes } from '../../api/sedes.api';
import { getEspecialidades, getEspecialidadById } from '../../api/especialidades.api';
import { getDoctors, getDoctorById } from '../../api/doctores.api';
import { getFechasDispTodos, getHorariosDisp } from '../../api/horarios.api';
import { getUserDniFecha, createUser, getUserDni, updateUser } from '../../api/usuarios.api';
import { getObrasSociales } from '../../api/obrasociales.api';
import { createPaciente, getPacienteDni } from '../../api/pacientes.api';
import { getSedeById } from '../../api/sedes.api';
import { createTurno, getTurnosPaciente, confirmarTurno, cancelarTurno } from '../../api/turnos.api';
import { sendEmail } from '../../api/email.api';

export const usePacientes = () => {
  const context = useContext(PacientesContext);
  if (!context) {
    throw new Error('usePacientes must be used within an PacientesProvider');
  }
  return context;
};


const PacientesProvider = ({ children }) => {
  //proveedor para acceder a los datos de los empleados desde cualquier componente
  const navigate = useNavigate();
  const [sedes, setSedes] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [fechas, setFechas] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [dni, setDni] = useState('');
  const [obraSociales, setObraSociales] = useState([]);
  const [usuario, setUsuario] = useState({});
  const [idPacienteCreado, setidPacienteCreado] = useState('');
  const [nombreEspecialidad, setNombreEspecialidad] = useState('');
  const [nombreDoctor, setNombreDoctor] = useState('');
  const [apellidoDoctor, setApellidoDoctor] = useState('');
  const [nombreSede, setNombreSede] = useState('');
  const [direccionSede, setDireccionSede] = useState('');
  const [fechaYHora, setFechaYHora] = useState('');
  const [idDoctor, setIdDoctor] = useState('');
  const [idEspecialidad, setIdEspecialidad] = useState('');
  const [idSede, setIdSede] = useState('');
  const [idPaciente, setIdPaciente] = useState('');
  const [estado, setEstado] = useState('');
  const [fechaCancelacion, setFechaCancelacion] = useState('');
  const [fechaConfirmacion, setFechaConfirmacion] = useState('');
  const [turnos, setTurnos] = useState([]);
  const [usuarioDni, setUsuarioDni] = useState({});
  const [mailUsuario, setMailUsuario] = useState('');

  async function ActualizarUsuario(data) {
    const response = await updateUser(data);
    return response;
  }

  async function ObtenerSedes() {
    const response = await getSedes();
    setSedes(response.data);
  }

  async function ObtenerEspecialidades({ idSede }) {
    const response = await getEspecialidades({ idSede });
    setEspecialidades(response.data);
  }

  async function ObtenerDoctores({ idSede, idEspecialidad }) {
    console.log({idSede, idEspecialidad});
    const response = await getDoctors({ idSede, idEspecialidad });
    console.log('mis doctores',response.data);
    setDoctores(response.data);
  }
  async function ObtenerFechas({
    selectedOption,
    selectedEspecialidad,
    selectedSede,
  }) {
    const response = await getFechasDispTodos({
      idDoctor: selectedOption.value,
      idEspecialidad: selectedEspecialidad.value,
      idSede: selectedSede.value,
    });
    const fechasFormateadas = response.data.map((item) => {
      return new Date(item.fecha);
    });
    setFechas(fechasFormateadas);
  }
  async function ObtenerHorarios({
    selectedDoctor,
    selectedEspecialidad,
    selectedSede,
    date,
  }) {
    const response = await getHorariosDisp({
      idDoctor: selectedDoctor.value,
      idEspecialidad: selectedEspecialidad.value,
      idSede: selectedSede.value,
      fecha: date,
    });
    setHorarios(response.data);
  }

  async function login({ dni, fechaNacimiento }) {
    try {
      const response = await getUserDniFecha({ dni, fechaNacimiento });
      //console.log(response);
      const token = response.data;
      //console.log(token);
      localStorage.setItem('token', token);
      const decoded = jwtDecode(token);
      setDni(decoded.dni);
      /*window.location.reload();*/
    } catch (error) {
      setDni(null);
      // Handle error here
    }
  }

  useEffect(() => {
    if (dni) {
      ObtenerPacienteDni();
    }
  }, [dni]); 

  function comprobarToken() {
    if (localStorage.getItem('token')) {
      try {
        const decoded = jwtDecode(localStorage.getItem('token'));
        if (decoded.exp < Date.now() / 1000) {
          console.error('Token expired');
          localStorage.removeItem('token');
          navigate('/');
        } else {
          setDni(decoded.dni);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token');
        navigate('/');
      }
    } else {
      setDni('');
    }
  }

  async function ObtenerObraSociales() {
    const response = await getObrasSociales();
    setObraSociales(response.data);
    console.log(response.data);
  }

  async function CrearUsuario(data) {
    const response = await createUser(data);
    setUsuario(response.data);
    createPaciente({ dni: data.dni });
  }

  async function CrearPaciente({ dni }) {
    const response = await createPaciente({ dni });
    setidPacienteCreado(response.data.idPaciente);
  }

  async function ObtenerEspecialidadId() {
    const response = await getEspecialidadById(idEspecialidad);
    setNombreEspecialidad(response.data.nombre);
  }

  async function ObtenerDoctorId() {
    const response = await getDoctorById(idDoctor);
    setNombreDoctor(response.data.nombre);
    setApellidoDoctor(response.data.apellido);
  }

  async function ObtenerSedeId() {
    const response = await getSedeById(idSede);
    setNombreSede(response.data.nombre);
    setDireccionSede(response.data.direccion);
  }

  async function CrearTurno() {
    await createTurno({
      idPaciente,
      fechaYHora,
      fechaCancelacion,
      fechaConfirmacion,
      estado,
      idEspecialidad,
      idDoctor,
      idSede,
    });
  }

  async function ObtenerPacienteDni() {
    const reponse = await getPacienteDni({ dni });
    setIdPaciente(reponse.data.idPaciente);
  }

  async function ObtenerTurnosPaciente() {
    const response = await getTurnosPaciente({ dni });
    setTurnos(response.data);
  }

  async function ConfirmarTurno({ idTurno }) {
    await confirmarTurno({ idTurno });
    setTurnos((prevTurnos) =>
      prevTurnos.map((turno) =>
        turno.idTurno === idTurno ? { ...turno, estado: 'Confirmado' } : turno
      )
    );
  }

  async function ObtenerUsuarioDni() {
    const response = await getUserDni({ dni });
    setUsuarioDni(response.data);
    setMailUsuario(response.data.email);
  }

  async function CancelarTurno({ idTurno }) {
    await cancelarTurno({ idTurno });
    setTurnos((prevTurnos) =>
      prevTurnos.map((turno) =>
        turno.idTurno === idTurno ? { ...turno, estado: 'Cancelado' } : turno
      )
    );
  }
  async function MandarMail(data) {
    await sendEmail(data);
  }
  return (
    <PacientesContext.Provider
      value={{
        sedes,
        especialidades,
        doctores,
        ObtenerSedes,
        ObtenerEspecialidades,
        ObtenerDoctores,
        fechas,
        ObtenerFechas,
        horarios,
        ObtenerHorarios,
        login,
        dni,
        obraSociales,
        ObtenerObraSociales,
        idPacienteCreado,
        ObtenerPacienteDni,
        usuario,
        CrearPaciente,
        CrearUsuario,
        comprobarToken,
        ObtenerDoctorId,
        ObtenerEspecialidadId,
        ObtenerSedeId,
        nombreDoctor,
        nombreEspecialidad,
        nombreSede,
        apellidoDoctor,
        direccionSede,
        CrearTurno,
        fechaYHora,
        setFechaYHora,
        setIdDoctor,
        setIdEspecialidad,
        setIdSede,
        setEstado,
        setFechaCancelacion,
        setFechaConfirmacion,
        ObtenerTurnosPaciente,
        turnos,
        ConfirmarTurno,
        CancelarTurno,
        ObtenerUsuarioDni,
        usuarioDni,
        ActualizarUsuario,
        MandarMail,
        mailUsuario
      }}
    >
      {children}
    </PacientesContext.Provider>
  );
};

PacientesProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PacientesProvider;
