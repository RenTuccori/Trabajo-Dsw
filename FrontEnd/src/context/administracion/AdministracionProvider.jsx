import { AdministracionContext } from './AdministracionContext';
import {
  createSede,
  deleteSede,
  createSpecialty,
  deleteSpecialty,
  createObraSocial,
  deleteObraSocial,
  updateObraSocial,
  createSeEspDoc,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  deleteSeEspDoc,
  getCombinaciones,
  createHorarios,
  getHorariosXDoctor,
  updateHorarios,
  getUserByDni,
  createUserAdmin,
} from '../../api/admin.api.js'; // Asegúrate de tener una función para crear la sede en la API
import { useContext, useState } from 'react';
import { getSedes } from '../../api/sedes.api.js';
import {
  getEspecialidades,
  getAllSpecialities,
} from '../../api/especialidades.api';
import { getDoctores, getDoctorById } from '../../api/doctores.api';
import { getObrasSociales } from '../../api/obrasociales.api.js';
import { updateUser } from '../../api/usuarios.api.js';
import PropTypes from 'prop-types';
// eslint-disable-next-line react-refresh/only-export-components
export const useAdministracion = () => {
  const context = useContext(AdministracionContext);
  if (!context) {
    throw new Error(
      'useAdministracion must be used within an AdministracionProvider'
    );
  }
  return context;
};

const AdministracionProvider = ({ children }) => {
  const [sedes, setSedes] = useState([]); // Estado para almacenar las sedes
  const [especialidades, setEspecialidades] = useState([]);
  const [obrasSociales, setObrasSociales] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [doctor, setDoctor] = useState({});
  const [usuario, setUsuario] = useState({});
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedEspecialidad, setSelectedEspecialidad] = useState(null);
  const [selectedSede, setSelectedSede] = useState(null);
  const [combinaciones, setCombinaciones] = useState([]);
  const [horariosDoctor, setHorariosDoctor] = useState([]);

  async function crearNuevaSede({ nombre, direccion }) {
    try {
      const response = await createSede({ nombre, direccion }); // Llamada a la API
      return response;
    } catch (error) {
      console.error('Error en crearNuevaSede:', error);
      if (error.response) {
        // Error del servidor o del cliente
        if (error.response.status === 400) {
          console.error('Error 400 - Datos inválidos:', error.response.data);
        } else if (error.response.status === 401) {
          console.error('Error 401 - No autorizado, token inválido o expirado');
        } else if (error.response.status === 500) {
          console.error('Error 500 - Error en el servidor:', error.response.data);
        } else {
          console.error('Error inesperado:', error.response.status, error.response.data);
        }
      } else {
        // Error que no es de respuesta, como problemas de red
        console.error('Error de red o de conexión:', error.message);
      }
      throw error;
    }
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
      console.log('🏢 Sedes obtenidas (Admin):', sedesData);
      setSedes(Array.isArray(sedesData) ? sedesData : []);
    } catch (error) {
      console.error('❌ Error inesperado al obtener sedes:', error);
      setSedes([]);
    }
  }

  async function borrarSede(idSede) {
    try {
      const response = await deleteSede(idSede); // Llamada a la API
      return response;
    } catch (error) {
      console.error('Error al borrar la sede:', error);
      if (error.response?.status === 401) {
        console.error('Token expirado o inválido');
      }
      throw error;
    }
  }

  //Especialidad
  async function ObtenerEspecialidades({ idSede }) {
    const response = await getEspecialidades({ idSede });
    setEspecialidades(response.data);
  }
  async function crearEspecialidad({ nombre }) {
    try {
      await createSpecialty({ nombre });
    } catch (error) {
      console.error('Error al crear especialidad:', error);
      throw error; // Re-throw para que el componente pueda manejarlo
    }
  }
  async function borrarEspecialidad(idEspecialidad) {
    try {
      const response = await deleteSpecialty(idEspecialidad); // Llamada a la API
      return response;
    } catch (error) {
      console.error('Error al borrar la especialidad:', error);
      if (error.response?.status === 401) {
        console.error('Token expirado o inválido');
      }
      throw error;
    }
  }
  async function ObtenerEspecialidadesDisponibles() {
    const response = await getAllSpecialities();
    setEspecialidades(response.data);
  }

  //Doctor
  async function ObtenerDoctores() {
    try {
      console.log('🔍 Llamando a ObtenerDoctores en el Provider');
      const response = await getDoctores();
      
      if (response.error) {
        console.error('❌ Error al obtener doctores:', response.error);
        setDoctores([]);
        return;
      }
      
      const doctoresData = response.data || [];
      console.log('👨‍⚕️ Doctores obtenidos:', doctoresData);
      setDoctores(Array.isArray(doctoresData) ? doctoresData : []);
    } catch (error) {
      console.error('❌ Error inesperado al obtener doctores:', error);
      setDoctores([]);
    }
  }
  async function ObtenerDoctorPorId(idDoctor) {
    try {
      const response = await getDoctorById(idDoctor);
      setDoctor(response.data);
    } catch (error) {
      console.error('Error al obtener el doctor por ID:', error);
      throw error;
    }
  }

  async function CreaDoctor({ dni, duracionTurno, contra }) {
    try {
      console.log('🏥 Creando doctor en el provider:', { dni, duracionTurno, contra });
      const response = await createDoctor({ dni, duracionTurno, contra });
      console.log('✅ Doctor creado exitosamente:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Error al crear el doctor:', error);
      throw error;
    }
  }
  async function borrarDoctor(idDoctor) {
    try {
      const response = await deleteDoctor(idDoctor);
      return response;
    } catch (error) {
      console.error('Error al borrar el doctor:', error);
      if (error.response?.status === 401) {
        console.error('Token expirado o inválido');
      }
      throw error;
    }
  }
  async function actualizarDoctor({ idDoctor, duracionTurno, contra }) {
    try {
      const response = await updateDoctor({ idDoctor, duracionTurno, contra });
      return response;
    } catch (error) {
      console.error('Error al actualizar el doctor:', error);
    }
  }

  //Obra Social
  async function crearObraSocial({ nombre }) {
    try {
      await createObraSocial({ nombre });
    } catch (error) {
      console.error('Error al obtener las sedes:', error);
    }
  }

  async function ObtenerOS() {
    try {
      const response = await getObrasSociales();
      
      if (response.error) {
        console.error('❌ Error al obtener obras sociales:', response.error);
        setObrasSociales([]);
        return;
      }
      
      const obrasSocialesData = response.data || [];
      console.log('💼 Obras sociales obtenidas (Admin):', obrasSocialesData);
      setObrasSociales(Array.isArray(obrasSocialesData) ? obrasSocialesData : []);
    } catch (error) {
      console.error('❌ Error inesperado al obtener obras sociales:', error);
      setObrasSociales([]);
    }
  }

  async function borrarObraSocial(idObraSocial) {
    try {
      const response = await deleteObraSocial(idObraSocial);
      return response;
    } catch (error) {
      console.error('Error al borrar la obra social:', error);
      if (error.response?.status === 401) {
        console.error('Token expirado o inválido');
      }
      throw error;
    }
  }

  async function actualizarObraSocial({ idObraSocial, nombre }) {
    try {
      console.log('idObraSocial:', idObraSocial, 'nombre:', nombre);
      await updateObraSocial({ idObraSocial, nombre });
    } catch (error) {
      console.error('Error al actualizar la obra social:', error);
    }
  }

  //Combinaciones de sede, especialidad y doctor
  async function crearSedEspDoc({ idSede, idEspecialidad, idDoctor }) {
    try {
      await createSeEspDoc({
        idSede,
        idEspecialidad,
        idDoctor,
      });
    } catch (error) {
      console.error('Error al obtener las sedes:', error);
      throw error;
    }
  }

  async function borrarSedEspDoc({ idSede, idDoctor, idEspecialidad }) {
    try {
      const response = await deleteSeEspDoc({
        idSede,
        idDoctor,
        idEspecialidad,
      });
      return response;
    } catch (error) {
      console.error(
        'Error al borrar la combinación de sede, especialidad y doctor:',
        error
      );
      if (error.response?.status === 401) {
        console.error('Token expirado o inválido');
      }
      throw error;
    }
  }

  async function obtenerCombinaciones() {
    try {
      const response = await getCombinaciones();
      setCombinaciones(response.data);
    } catch (error) {
      console.error(
        'Error al obtener las combinaciones de sede, especialidad y doctor:',
        error
      );
      throw error;
    }
  }

  //Horarios
  async function crearHorarios({
    idSede,
    idDoctor,
    idEspecialidad,
    dia,
    hora_inicio,
    hora_fin,
    estado,
  }) {
    try {
      console.log(
        'data:',
        idSede,
        idDoctor,
        idEspecialidad,
        dia,
        hora_inicio,
        hora_fin,
        estado
      );
      await createHorarios({
        idSede,
        idDoctor,
        idEspecialidad,
        dia,
        hora_inicio,
        hora_fin,
        estado,
      });
    } catch (error) {
      console.error('Error al crear el horario:', error);
    }
  }
  async function actualizarHorarios({
    idSede,
    idDoctor,
    idEspecialidad,
    dia,
    hora_inicio,
    hora_fin,
    hora_inicio_original,
    hora_fin_original,
    estado,
  }) {
    try {
      await updateHorarios({
        idSede,
        idDoctor,
        idEspecialidad,
        dia,
        hora_inicio,
        hora_fin,
        hora_inicio_original,
        hora_fin_original,
        estado,
      });
    } catch (error) {
      console.error('Error al actualizar el horario:', error);
    }
  }
  async function obtenerHorariosXDoctor({ idSede, idEspecialidad, idDoctor }) {
    try {
      const response = await getHorariosXDoctor({
        idSede,
        idEspecialidad,
        idDoctor,
      });
      setHorariosDoctor(response.data); // Actualizar el estado con los horarios obtenidos
    } catch (error) {
      console.error('Error al obtener los horarios del doctor:', error);
      if (error.response && error.response.status === 404) {
        setHorariosDoctor([]); // Establecer horarios a vacío
      }

      // Si hay otro tipo de error, lo lanzamos para que se maneje más arriba
      throw error;
    }
  }

  //Usuario

  async function ObtenerUsuarioDni(dni) {
    try {
      console.log('🔍 Buscando usuario con DNI:', dni);
      const response = await getUserByDni({ dni });
      console.log('✅ Usuario encontrado:', response.data);
      setUsuario(response.data || {});
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener el usuario por DNI:', error);
      setUsuario({});
      throw error;
    }
  }

  async function CrearUsuario(data) {
    try {
      console.log('📝 Creando usuario:', data);
      const response = await createUserAdmin(data);
      console.log('✅ Usuario creado:', response.data);
      setUsuario(response.data || {});
      return response;
    } catch (error) {
      console.error('❌ Error al crear usuario:', error);
      throw error;
    }
  }
  async function actualizarUsuario(data) {
    try {
      console.log('Datos enviados para actualizar usuario:', data);
      const response = await updateUser(data);
      console.log('Usuario actualizado:', response?.data);
      return response;
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      throw error; // Re-lanzar el error para que pueda ser manejado en el componente
    }
  }
  return (
    <AdministracionContext.Provider
      value={{
        actualizarUsuario,
        sedes,
        crearNuevaSede,
        ObtenerSedes,
        borrarSede,
        crearEspecialidad,
        especialidades,
        setEspecialidades,
        borrarEspecialidad,
        crearObraSocial,
        ObtenerOS,
        obrasSociales,
        borrarObraSocial,
        actualizarObraSocial,
        crearSedEspDoc,
        ObtenerEspecialidades,
        ObtenerDoctores,
        doctores,
        selectedDoctor,
        setSelectedDoctor,
        selectedEspecialidad,
        setSelectedEspecialidad,
        selectedSede,
        setSelectedSede,
        ObtenerEspecialidadesDisponibles,
        CreaDoctor,
        borrarDoctor,
        actualizarDoctor,
        ObtenerUsuarioDni,
        CrearUsuario,
        setUsuario,
        usuario,
        borrarSedEspDoc,
        obtenerCombinaciones,
        combinaciones,
        ObtenerDoctorPorId,
        doctor,
        crearHorarios,
        obtenerHorariosXDoctor,
        horariosDoctor,
        actualizarHorarios,
      }}
    >
      {children}
    </AdministracionContext.Provider>
  );
};

AdministracionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdministracionProvider;
