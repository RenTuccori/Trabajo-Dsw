import { AdministracionContext } from './AdministracionContext';
import {
  createLocation,
  deleteLocation,
  createSpecialty,
  deleteSpecialty,
  createHealthInsurance,
  deleteHealthInsurance,
  updateHealthInsurance,
  createCombination,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  deleteCombination,
  getCombinations,
  createSchedule,
  getSchedulesByDoctor,
  updateSchedule,
} from '../../api/admin.api.js'; // Make sure to have a function to create the location in the API
import { useContext, useState } from 'react';
import { getLocations } from '../../api/sedes.api.js';
import {
  getSpecialties,
  getAllSpecialties,
} from '../../api/especialidades.api';
import { getAllDoctors, getDoctorById } from '../../api/doctores.api';
import { getHealthInsuranceList } from '../../api/obrasociales.api.js';
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
  const [locations, setLocations] = useState([]); // State to store locations
  const [specialties, setSpecialties] = useState('');
  const [healthInsuranceList, setHealthInsuranceList] = useState('');
  const [doctors, setDoctors] = useState('');
  const [doctor, setDoctor] = useState('');
  const [user, setUser] = useState({});
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [combinations, setCombinations] = useState([]);
  const [doctorSchedules, setDoctorSchedules] = useState([]);

  async function createNewLocation({ nombre, direccion }) {
    try {
      await createLocation({ nombre, direccion });
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          window.notifyError('La sede ya está habilitada.');
        } else if (error.response.status === 500) {
          window.notifyError('Error del servidor. Intente nuevamente más tarde.');
        } else {
          window.notifyError('Ocurrió un error inesperado.');
        }
      } else {
        window.notifyError('Error de red o conexión.');
      }
      throw error;
    }
  }

  async function fetchLocations() {
    const response = await getLocations();
    setLocations(response.data);
  }

  async function removeLocation(idSede) {
    try {
      await deleteLocation(idSede);
    } catch (error) {
      window.notifyError('Error al eliminar la sede.');
      throw error;
    }
  }

  // Specialty
  async function fetchSpecialtiesByLocation({ idSede }) {
    const response = await getSpecialties({ idSede });
    setSpecialties(response.data);
  }
  async function createNewSpecialty({ nombre }) {
    try {
      await createSpecialty({ nombre });
    } catch (error) {
      window.notifyError('Error al crear la especialidad.');
      throw error;
    }
  }
  async function removeSpecialty(idEspecialidad) {
    try {
      await deleteSpecialty(idEspecialidad);
    } catch (error) {
      window.notifyError('Error al eliminar la especialidad.');
      throw error;
    }
  }
  async function fetchAllSpecialties() {
    const response = await getAllSpecialties();
    setSpecialties(response.data);
  }

  // Doctor
  async function fetchDoctors() {
    const response = await getAllDoctors();
    setDoctors(response.data);
  }
  async function fetchDoctorById(idDoctor) {
    try {
      const response = await getDoctorById(idDoctor);
      setDoctor(response.data);
    } catch (error) {
      window.notifyError('Error al obtener el doctor.');
      throw error;
    }
  }

  async function createNewDoctor({ dni, duracionTurno, contra }) {
    try {
      await createDoctor({ dni, duracionTurno, contra });
    } catch {
      window.notifyError('Error al crear el doctor.');
    }
  }
  async function removeDoctor(idDoctor) {
    try {
      await deleteDoctor(idDoctor);
    } catch (error) {
      window.notifyError('Error al eliminar el doctor.');
      throw error;
    }
  }
  async function updateDoctorData({ idDoctor, duracionTurno, contra }) {
    try {
      const response = await updateDoctor({ idDoctor, duracionTurno, contra });
      return response;
    } catch {
      window.notifyError('Error al actualizar el doctor.');
    }
  }

  // Health Insurance
  async function createNewHealthInsurance({ nombre }) {
    try {
      await createHealthInsurance({ nombre });
    } catch {
      window.notifyError('Error al crear la obra social.');
    }
  }

  async function fetchHealthInsurance() {
    try {
      const response = await getHealthInsuranceList();
      setHealthInsuranceList(response.data);
    } catch {
      window.notifyError('Error al obtener la lista de obras sociales.');
    }
  }

  async function removeHealthInsurance(idObraSocial) {
    try {
      await deleteHealthInsurance(idObraSocial);
    } catch (error) {
      window.notifyError('Error al eliminar la obra social.');
      throw error;
    }
  }

  async function updateHealthInsuranceData({ idObraSocial, nombre }) {
    try {
      await updateHealthInsurance({ idObraSocial, nombre });
    } catch {
      window.notifyError('Error al actualizar la obra social.');
    }
  }

  //Combinations of location, specialty and doctor
  async function createNewCombination({ idSede, idEspecialidad, idDoctor }) {
    try {
      await createCombination({
        idSede,
        idEspecialidad,
        idDoctor,
      });
    } catch (error) {
      window.notifyError('Error al crear la combinación.');
      throw error;
    }
  }

  async function removeCombination({ idSede, idDoctor, idEspecialidad }) {
    try {
      await deleteCombination({
        idSede,
        idDoctor,
        idEspecialidad,
      });
    } catch (error) {
      window.notifyError('Error al eliminar la combinación.');
      throw error;
    }
  }

  async function fetchCombinations() {
    try {
      const response = await getCombinations();
      setCombinations(response.data);
    } catch (error) {
      window.notifyError('Error al obtener las combinaciones.');
      throw error;
    }
  }

  // Schedules
  async function createNewSchedule({
    idSede,
    idDoctor,
    idEspecialidad,
    dia,
    hora_inicio,
    hora_fin,
    estado,
  }) {
    try {
      await createSchedule({
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
  async function updateScheduleData({
    idSede,
    idDoctor,
    idEspecialidad,
    dia,
    hora_inicio,
    hora_fin,
    estado,
  }) {
    try {
      await updateSchedule({
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
  async function fetchSchedulesByDoctor({ idSede, idEspecialidad, idDoctor }) {
    try {
      const response = await getSchedulesByDoctor({
        idSede,
        idEspecialidad,
        idDoctor,
      });
      setDoctorSchedules(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setDoctorSchedules([]);
      }
      throw error;
    }
  }

  // User

  async function fetchUserByDni(dni) {
    try {
      const response = await getUserDni({ dni });
      setUser(response.data);
    } catch (error) {
      window.notifyError('Error al obtener el paciente.');
      throw error;
    }
  }

  async function createNewUser(data) {
    const response = await createUser(data);
    setUser(response.data);
  }
  async function updateUserData(data) {
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
        updateUserData,
        locations,
        createNewLocation,
        fetchLocations,
        removeLocation,
        createNewSpecialty,
        specialties,
        setSpecialties,
        removeSpecialty,
        createNewHealthInsurance,
        fetchHealthInsurance,
        healthInsuranceList,
        removeHealthInsurance,
        updateHealthInsuranceData,
        createNewCombination,
        fetchSpecialtiesByLocation,
        fetchDoctors,
        doctors,
        selectedDoctor,
        setSelectedDoctor,
        selectedSpecialty,
        setSelectedSpecialty,
        selectedLocation,
        setSelectedLocation,
        fetchAllSpecialties,
        createNewDoctor,
        removeDoctor,
        updateDoctorData,
        fetchUserByDni,
        createNewUser,
        setUser,
        user,
        removeCombination,
        fetchCombinations,
        combinations,
        fetchDoctorById,
        doctor,
        createNewSchedule,
        fetchSchedulesByDoctor,
        doctorSchedules,
        updateScheduleData,
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
