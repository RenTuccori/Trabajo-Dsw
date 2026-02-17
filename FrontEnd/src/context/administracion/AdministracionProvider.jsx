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
} from '../../api/admin.api.js'; // Asegúrate de tener una función para crear la sede en la API
import { useContext, useState } from 'react';
import { getSedes } from '../../api/sedes.api.js';
import {
  getEspecialidades,
  getAllSpecialities,
} from '../../api/especialidades.api';
import { getDoctores, getDoctorById } from '../../api/doctores.api';
import { getObrasSociales } from '../../api/obrasociales.api.js';
import { getUserDni, createUser, updateUser } from '../../api/usuarios.api.js';
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
  const [especialidades, setEspecialidades] = useState('');
  const [obrasSociales, setObrasSociales] = useState('');
  const [doctores, setDoctores] = useState('');
  const [doctor, setDoctor] = useState('');
  const [usuario, setUsuario] = useState({});
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedEspecialidad, setSelectedEspecialidad] = useState(null);
  const [selectedSede, setSelectedSede] = useState(null);
  const [combinaciones, setCombinaciones] = useState([]);
  const [horariosDoctor, setHorariosDoctor] = useState([]);

  async function crearNuevaSede({ nombre, direccion }) {
    try {
      await createSede({ nombre, direccion });
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          window.notifyError('La sede ya está habilitada.');
        } else if (error.response.status === 500) {
          window.notifyError('Error en el servidor. Inténtalo de nuevo más tarde.');
        } else {
          window.notifyError('Ocurrió un error inesperado.');
        }
      } else {
        window.notifyError('Error de red o de conexión.');
      }
      throw error;
    }
  }

  async function ObtenerSedes() {
    const response = await getSedes();
    setSedes(response.data);
  }

  async function borrarSede(idSede) {
    try {
      await deleteSede(idSede);
    } catch (error) {
      window.notifyError('Error al borrar la sede.');
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
      window.notifyError('Error al crear la especialidad.');
      throw error;
    }
  }
  async function borrarEspecialidad(idEspecialidad) {
    try {
      await deleteSpecialty(idEspecialidad);
    } catch (error) {
      window.notifyError('Error al borrar la especialidad.');
      throw error;
    }
  }
  async function ObtenerEspecialidadesDisponibles() {
    const response = await getAllSpecialities();
    setEspecialidades(response.data);
  }

  //Doctor
  async function ObtenerDoctores() {
    const response = await getDoctores();
    setDoctores(response.data);
  }
  async function ObtenerDoctorPorId(idDoctor) {
    try {
      const response = await getDoctorById(idDoctor);
      setDoctor(response.data);
    } catch (error) {
      window.notifyError('Error al obtener el doctor.');
      throw error;
    }
  }

  async function CreaDoctor({ dni, duracionTurno, contra }) {
    try {
      await createDoctor({ dni, duracionTurno, contra });
    } catch {
      window.notifyError('Error al crear el doctor.');
    }
  }
  async function borrarDoctor(idDoctor) {
    try {
      await deleteDoctor(idDoctor);
    } catch (error) {
      window.notifyError('Error al borrar el doctor.');
      throw error;
    }
  }
  async function actualizarDoctor({ idDoctor, duracionTurno, contra }) {
    try {
      const response = await updateDoctor({ idDoctor, duracionTurno, contra });
      return response;
    } catch {
      window.notifyError('Error al actualizar el doctor.');
    }
  }

  //Obra Social
  async function crearObraSocial({ nombre }) {
    try {
      await createObraSocial({ nombre });
    } catch {
      window.notifyError('Error al crear la obra social.');
    }
  }

  async function ObtenerOS() {
    try {
      const response = await getObrasSociales();
      setObrasSociales(response.data);
    } catch {
      window.notifyError('Error al obtener las obras sociales.');
    }
  }

  async function borrarObraSocial(idObraSocial) {
    try {
      await deleteObraSocial(idObraSocial);
    } catch (error) {
      window.notifyError('Error al borrar la obra social.');
      throw error;
    }
  }

  async function actualizarObraSocial({ idObraSocial, nombre }) {
    try {
      await updateObraSocial({ idObraSocial, nombre });
    } catch {
      window.notifyError('Error al actualizar la obra social.');
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
      window.notifyError('Error al crear la combinación.');
      throw error;
    }
  }

  async function borrarSedEspDoc({ idSede, idDoctor, idEspecialidad }) {
    try {
      await deleteSeEspDoc({
        idSede,
        idDoctor,
        idEspecialidad,
      });
    } catch (error) {
      window.notifyError('Error al borrar la combinación.');
      throw error;
    }
  }

  async function obtenerCombinaciones() {
    try {
      const response = await getCombinaciones();
      setCombinaciones(response.data);
    } catch (error) {
      window.notifyError('Error al obtener las combinaciones.');
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
      await createHorarios({
        idSede,
        idDoctor,
        idEspecialidad,
        dia,
        hora_inicio,
        hora_fin,
        estado,
      });
    } catch {
      window.notifyError('Error al crear el horario.');
    }
  }
  async function actualizarHorarios({
    idSede,
    idDoctor,
    idEspecialidad,
    dia,
    hora_inicio,
    hora_fin,
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
        estado,
      });
    } catch {
      window.notifyError('Error al actualizar el horario.');
    }
  }
  async function obtenerHorariosXDoctor({ idSede, idEspecialidad, idDoctor }) {
    try {
      const response = await getHorariosXDoctor({
        idSede,
        idEspecialidad,
        idDoctor,
      });
      setHorariosDoctor(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setHorariosDoctor([]);
      }
      throw error;
    }
  }

  //Usuario

  async function ObtenerUsuarioDni(dni) {
    try {
      const response = await getUserDni({ dni });
      setUsuario(response.data);
    } catch (error) {
      window.notifyError('Error al obtener el paciente.');
      throw error;
    }
  }

  async function CrearUsuario(data) {
    const response = await createUser(data);
    setUsuario(response.data);
  }
  async function actualizarUsuario(data) {
    try {
      const response = await updateUser(data);
      return response;
    } catch (error) {
      window.notifyError('Error al actualizar el usuario.');
      throw error;
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
