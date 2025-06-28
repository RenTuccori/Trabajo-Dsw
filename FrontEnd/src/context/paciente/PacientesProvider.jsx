import { useState, useContext, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../global/AuthProvider";


import { PacientesContext } from './PacientesContext';
import { getSedes } from '../../api/sedes.api';
import {
  getEspecialidades,
  getEspecialidadById,
} from '../../api/especialidades.api';
import { getDoctors, getDoctorById } from '../../api/doctores.api';
import { getFechasDispTodos, getHorariosDisp } from '../../api/horarios.api';
import { createUser, getUserDni, updateUser } from '../../api/usuarios.api';
import { getObrasSociales } from '../../api/obrasociales.api';
import { createPaciente, getPacienteDni } from '../../api/pacientes.api';
import { getSedeById } from '../../api/sedes.api';
import {
  createTurno,
  getTurnosPaciente,
  confirmarTurno,
  cancelarTurno,
} from '../../api/turnos.api';
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
  const [sedes, setSedes] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [fechas, setFechas] = useState([]);
  const [horarios, setHorarios] = useState([]);
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

  const { dni, userType } = useAuth();

  async function ActualizarUsuario(data) {
    const response = await updateUser(data);
    return response;
  }

  async function ObtenerSedes() {
    try {
      const response = await getSedes();
      
      if (response.error) {
        console.error('❌ Error al obtener sedes:', response.error);
        setSedes([]);
        return;
      }
      
      const sedesData = response.data || [];
      console.log('🏢 Sedes obtenidas:', sedesData);
      setSedes(Array.isArray(sedesData) ? sedesData : []);
    } catch (error) {
      console.error('❌ Error inesperado al obtener sedes:', error);
      setSedes([]);
    }
  }

  async function ObtenerEspecialidades({ idSede }) {
    try {
      const response = await getEspecialidades({ idSede });
      
      if (response.error) {
        console.error('❌ Error al obtener especialidades:', response.error);
        setEspecialidades([]);
        return;
      }
      
      const especialidadesData = response.data || [];
      console.log('🩺 Especialidades obtenidas:', especialidadesData);
      setEspecialidades(Array.isArray(especialidadesData) ? especialidadesData : []);
    } catch (error) {
      console.error('❌ Error inesperado al obtener especialidades:', error);
      setEspecialidades([]);
    }
  }

  async function ObtenerDoctores({ idSede, idEspecialidad }) {
    console.log({ idSede, idEspecialidad });
    const response = await getDoctors({ idSede, idEspecialidad });
    console.log("mis doctores", response.data);
    
    // Verificar si hay datos o si es un error
    if (response.data && Array.isArray(response.data)) {
      setDoctores(response.data);
    } else if (response.error) {
      console.log("No hay doctores para esta combinación:", response.error);
      setDoctores([]); // Array vacío cuando no hay doctores
    } else {
      setDoctores([]); // Fallback para cualquier otro caso
    }

  }
  async function ObtenerFechas({
    selectedOption,
    selectedEspecialidad,
    selectedSede,
  }) {
    try {
      console.log('🔍 Obteniendo fechas para:', { 
        idDoctor: selectedOption.value, 
        idEspecialidad: selectedEspecialidad.value, 
        idSede: selectedSede.value 
      });
      
      const response = await getFechasDispTodos({
        idDoctor: selectedOption.value,
        idEspecialidad: selectedEspecialidad.value,
        idSede: selectedSede.value,
      });

      // Verificar si hay error en la respuesta
      if (response.error) {
        console.error('❌ Error al obtener fechas:', response.error);
        setFechas([]);
        return;
      }

      // Verificar que response.data existe y es un array
      const fechasData = response.data || [];
      console.log('📅 Fechas obtenidas:', fechasData);

      if (!Array.isArray(fechasData) || fechasData.length === 0) {
        console.log('📅 No hay fechas disponibles');
        setFechas([]);
        return;
      }

      const fechasFormateadas = fechasData.map((item) => {
        const [year, month, day] = item.fecha.split("-"); // Descomponer la fecha
        return new Date(Number(year), Number(month) - 1, Number(day)); // Crear la fecha (mes empieza en 0)
      });

      setFechas(fechasFormateadas);
      console.log('✅ Fechas formateadas:', fechasFormateadas);
    } catch (error) {
      console.error('❌ Error inesperado al obtener fechas:', error);
      setFechas([]);
    }
  }
  async function ObtenerHorarios({
    selectedDoctor,
    selectedEspecialidad,
    selectedSede,
    date,
  }) {
    try {
      console.log('🔍 Obteniendo horarios para:', { 
        idDoctor: selectedDoctor.value, 
        idEspecialidad: selectedEspecialidad.value, 
        idSede: selectedSede.value,
        fecha: date
      });
      
      const response = await getHorariosDisp({
        idDoctor: selectedDoctor.value,
        idEspecialidad: selectedEspecialidad.value,
        idSede: selectedSede.value,
        fecha: date,
      });

      // Verificar si hay error en la respuesta
      if (response.error) {
        console.error('❌ Error al obtener horarios:', response.error);
        setHorarios([]);
        return;
      }

      // Verificar que response.data existe y es un array
      const horariosData = response.data || [];
      console.log('⏰ Horarios obtenidos:', horariosData);

      setHorarios(Array.isArray(horariosData) ? horariosData : []);
    } catch (error) {
      console.error('❌ Error inesperado al obtener horarios:', error);
      setHorarios([]);
    }
  }

  async function ObtenerObraSociales() {
    try {
      const response = await getObrasSociales();
      
      if (response.error) {
        console.error('❌ Error al obtener obras sociales:', response.error);
        setObraSociales([]);
        return;
      }
      
      const obrasSocialesData = response.data || [];
      console.log('💼 Obras sociales obtenidas:', obrasSocialesData);
      setObraSociales(Array.isArray(obrasSocialesData) ? obrasSocialesData : []);
    } catch (error) {
      console.error('❌ Error inesperado al obtener obras sociales:', error);
      setObraSociales([]);
    }
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
    try {
      console.log('🔍 Intentando obtener doctor con ID:', idDoctor);
      const response = await getDoctorById(idDoctor);
      console.log('🔍 Datos del doctor obtenidos:', response.data);
      
      // Los datos del doctor están en la relación usuario
      if (response.data.usuario) {
        setNombreDoctor(response.data.usuario.nombre);
        setApellidoDoctor(response.data.usuario.apellido);
        console.log('✅ Datos del doctor establecidos:', {
          nombre: response.data.usuario.nombre,
          apellido: response.data.usuario.apellido
        });
      } else {
        console.error('❌ No se encontraron datos de usuario para el doctor');
      }
    } catch (error) {
      console.error('❌ Error al obtener datos del doctor:', error);
    }
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

  const ObtenerPacienteDni = useCallback(async () => {
    try {
      const response = await getPacienteDni({ dni });
      if (response && response.data && response.data.idPaciente) {
        setIdPaciente(response.data.idPaciente);
      } else {
        console.log('No se encontró paciente para el DNI:', dni);
        setIdPaciente(null);
      }
    } catch (error) {
      console.error('Error al obtener paciente por DNI:', error);
      setIdPaciente(null);
    }
  }, [dni]);

  useEffect(() => {
    if (dni && userType === 'P') {
      ObtenerPacienteDni();
    }
  }, [dni, userType, ObtenerPacienteDni]);

  async function ObtenerTurnosPaciente() {
    try {
      console.log('🔍 Obteniendo turnos para DNI:', dni);
      const response = await getTurnosPaciente({ dni });
      console.log('🔍 Respuesta completa de turnos:', response);
      console.log('🔍 Datos de turnos recibidos:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        // Procesar los datos para que el frontend los entienda
        const turnosFormateados = response.data.map(turno => ({
          idTurno: turno.idTurno,
          fecha_hora: turno.fechaYHora,
          estado: turno.estado,
          dni: dni,
          Sede: turno.sede?.nombre || 'Sin sede',
          Direccion: turno.sede?.direccion || 'Sin dirección',
          Especialidad: turno.especialidad?.nombre || 'Sin especialidad',
          Doctor: turno.doctor?.usuario ? 
            `Dr. ${turno.doctor.usuario.nombre} ${turno.doctor.usuario.apellido}` : 
            'Sin doctor'
        }));
        
        console.log('🔍 Turnos formateados:', turnosFormateados);
        setTurnos(turnosFormateados);
      } else {
        console.log('❌ No se recibieron datos válidos de turnos');
        setTurnos([]);
      }
    } catch (error) {
      console.error('❌ Error al obtener turnos:', error);
      setTurnos([]);
    }
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
    try {
      const response = await getUserDni({ dni });
      if (response && response.data) {
        setUsuarioDni(response.data);
        setMailUsuario(response.data.email);
      } else {
        console.error('No se pudo obtener los datos del usuario');
        window.notifyError('Error al obtener los datos del usuario');
      }
    } catch (error) {
      console.error('Error al obtener usuario por DNI:', error);
      window.notifyError('Error al obtener los datos del usuario');
    }
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
        obraSociales,
        ObtenerObraSociales,
        idPacienteCreado,
        ObtenerPacienteDni,
        usuario,
        CrearPaciente,
        CrearUsuario,
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
        mailUsuario,
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
