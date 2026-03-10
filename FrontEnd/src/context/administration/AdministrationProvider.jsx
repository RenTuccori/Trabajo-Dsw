import { AdministrationContext } from './AdministrationContext';
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
} from '../../api/admin.api.js';
import { useContext, useState } from 'react';
import { getLocations } from '../../api/venues.api.js';
import {
  getSpecialties,
  getAllSpecialties,
} from '../../api/specialties.api';
import {
  getAllDoctors,
  getDoctorById as getDoctorByIdAPI,
} from '../../api/doctors.api';
import { getInsurance } from '../../api/insurance.api.js';
import {
  getUserDni,
  createUser as createUserAPI,
  updateUser as updateUserAPI,
} from '../../api/users.api.js';
import PropTypes from 'prop-types';
// eslint-disable-next-line react-refresh/only-export-components
export const useAdministration = () => {
  const context = useContext(AdministrationContext);
  if (!context) {
    throw new Error(
      'useAdministration must be used within an AdministrationProvider'
    );
  }
  return context;
};

const AdministrationProvider = ({ children }) => {
  const [locations, setLocations] = useState([]); // Estado para almacenar las locations
  const [specialties, setSpecialties] = useState('');
  const [healthInsurances, setHealthInsurances] = useState('');
  const [doctors, setDoctors] = useState('');
  const [doctor, setDoctor] = useState('');
  const [user, setUser] = useState({});
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [combinations, setCombinations] = useState([]);
  const [doctorSchedules, setDoctorSchedules] = useState([]);

  async function createNewLocation({ name, address }) {
    try {
      await createSede({ name, address }); // Llamada a la API
    } catch (error) {
      if (error.response) {
        // Error del servidor o del cliente
        if (error.response.status === 400) {
          console.error('La sede ya está habilitada.');
        } else if (error.response.status === 500) {
          console.error('Error en el servidor. Inténtalo de nuevo más tarde.');
        } else {
          console.error('Ocurrió un error inesperado:', error.response.data);
        }
        throw error;
      } else {
        // Error que no es de respuesta, como problemas de red
        console.error('Error de red o de conexión:', error);
      }
      throw error;
    }
  }

  async function getLocationsFunc() {
    const response = await getLocations();
    setLocations(response.data);
  }

  async function deleteLocation(locationId) {
    try {
      await deleteSede(locationId); // Llamada a la API
    } catch (error) {
      console.error('Error al borrar la sede:', error);
      throw error;
    }
  }

  //Especialidad
  async function getSpecialtiesFunc({ locationId }) {
    const response = await getSpecialties({ locationId });
    setSpecialties(response.data);
  }
  async function createSpecialtyFunction({ name }) {
    try {
      await createSpecialty({ name });
    } catch (error) {
      console.error('Error creating specialty:', error);
      throw error;
    }
  }
  async function deleteSpecialtyFunction(specialtyId) {
    try {
      await deleteSpecialty(specialtyId); // Llamada a la API
    } catch (error) {
      console.error('Error al borrar la especialidad:', error);
      throw error;
    }
  }
  async function getAvailableSpecialtiesFunc() {
    const response = await getAllSpecialties();
    setSpecialties(response.data);
  }

  //Doctor
  async function getDoctorsFunc() {
    const response = await getAllDoctors();
    setDoctors(response.data);
  }
  async function getDoctorById(doctorId) {
    try {
      const response = await getDoctorByIdAPI(doctorId);
      setDoctor(response.data);
    } catch (error) {
      console.error('Error al obtener el doctor por ID:', error);
      throw error;
    }
  }

  async function createDoctorFunction({ dni, appointmentDuration, password }) {
    try {
      await createDoctor({ dni, appointmentDuration, password });
    } catch (error) {
      console.error('Error al obtener las venues:', error);
    }
  }
  async function deleteDoctorFunction(doctorId) {
    try {
      await deleteDoctor(doctorId);
    } catch (error) {
      console.error('Error al borrar el doctor:', error);
      throw error;
    }
  }
  async function updateDoctorFunction({
    doctorId,
    appointmentDuration,
    password,
  }) {
    try {
      const response = await updateDoctor({
        doctorId,
        appointmentDuration,
        password,
      });
      return response;
    } catch (error) {
      console.error('Error al actualizar el doctor:', error);
    }
  }

  //Obra Social
  async function createHealthInsurance({ name }) {
    try {
      await createObraSocial({ name });
    } catch (error) {
      console.error('Error al obtener las venues:', error);
    }
  }

  async function getHealthInsurancesFunc() {
    try {
      const response = await getInsurance();
      setHealthInsurances(response.data);
    } catch (error) {
      console.error('Error getting health insurances:', error);
    }
  }

  async function deleteHealthInsurance(healthInsuranceId) {
    try {
      await deleteObraSocial(healthInsuranceId);
    } catch (error) {
      console.error('Error al borrar la obra social:', error);
      throw error;
    }
  }

  async function updateHealthInsurance({ healthInsuranceId, name }) {
    try {
      console.log('healthInsuranceId:', healthInsuranceId, 'name:', name);
      await updateObraSocial({ healthInsuranceId, name });
    } catch (error) {
      console.error('Error al actualizar la obra social:', error);
    }
  }

  //Combinaciones de location, especialidad y doctor
  async function createLocationSpecialtyDoctor({
    locationId,
    specialtyId,
    doctorId,
  }) {
    try {
      await createSeEspDoc({
        locationId,
        specialtyId,
        doctorId,
      });
    } catch (error) {
      console.error('Error al obtener las locations:', error);
      throw error;
    }
  }

  async function deleteLocationSpecialtyDoctor({
    locationId,
    doctorId,
    specialtyId,
  }) {
    try {
      await deleteSeEspDoc({
        locationId,
        doctorId,
        specialtyId,
      });
    } catch (error) {
      console.error(
        'Error al borrar la combinación de location, especialidad y doctor:',
        error
      );
      throw error;
    }
  }

  async function getCombinations() {
    try {
      const response = await getCombinaciones();
      setCombinations(response.data);
    } catch (error) {
      console.error(
        'Error al obtener las combinations de sede, especialidad y doctor:',
        error
      );
      throw error;
    }
  }

  //Horarios
  async function createSchedules({
    locationId,
    doctorId,
    specialtyId,
    dia,
    hora_inicio,
    hora_fin,
    status,
  }) {
    try {
      console.log(
        'data:',
        locationId,
        doctorId,
        specialtyId,
        dia,
        hora_inicio,
        hora_fin,
        status
      );
      await createHorarios({
        locationId,
        doctorId,
        specialtyId,
        day: dia,
        startTime: hora_inicio,
        endTime: hora_fin,
        status,
      });
    } catch (error) {
      console.error('Error al crear el horario:', error);
    }
  }
  async function updateSchedules({
    locationId,
    doctorId,
    specialtyId,
    dia,
    hora_inicio,
    hora_fin,
    status,
  }) {
    try {
      await updateHorarios({
        locationId,
        doctorId,
        specialtyId,
        day: dia,
        startTime: hora_inicio,
        endTime: hora_fin,
        status,
      });
    } catch (error) {
      console.error('Error al actualizar el horario:', error);
    }
  }
  async function getDoctorSchedules({ locationId, specialtyId, doctorId }) {
    try {
      const response = await getHorariosXDoctor({
        locationId,
        specialtyId,
        doctorId,
      });
      setDoctorSchedules(response.data); // Actualizar el status con los schedules obtenidos
    } catch (error) {
      console.error('Error al obtener los schedules del doctor:', error);
      if (error.response && error.response.status === 404) {
        setDoctorSchedules([]); // Establecer schedules a vacío
      }

      // Si hay otro tipo de error, lo lanzamos para que se maneje más arriba
      throw error;
    }
  }

  //Usuario

  async function getUserByDni(dni) {
    try {
      const response = await getUserDni({ dni });
      setUser(response.data);
      console.log('Paciente encontrado:', response.data);
    } catch (error) {
      console.error('Error al obtener el patient por DNI:', error);
      throw error;
    }
  }

  async function createUserFunction(data) {
    console.log('data:', data);
    const response = await createUserAPI(data);
    setUser(response.data);
  }
  async function updateUserFunction(data) {
    try {
      console.log('Datos enviados para actualizar user:', data);
      const response = await updateUserAPI(data);
      console.log('Usuario actualizado:', response?.data);
      return response;
    } catch (error) {
      console.error('Error al actualizar el user:', error);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      throw error; // Re-lanzar el error para que pueda ser manejado en el componente
    }
  }
  return (
    <AdministrationContext.Provider
      value={{
        updateUserFunction,
        updateUser: updateUserFunction,
        locations,
        createNewLocation,
        getLocationsFunc,
        getLocations: getLocationsFunc,
        deleteLocation,
        createSpecialty: createSpecialtyFunction,
        specialties,
        setSpecialties,
        deleteSpecialty: deleteSpecialtyFunction,
        createHealthInsurance,
        getHealthInsurancesFunc,
        getHealthInsurances: getHealthInsurancesFunc,
        healthInsurances,
        deleteHealthInsurance,
        updateHealthInsurance,
        createLocationSpecialtyDoctor,
        getSpecialtiesFunc,
        getDoctorsFunc,
        doctors,
        selectedDoctor,
        setSelectedDoctor,
        selectedSpecialty,
        setSelectedSpecialty,
        selectedLocation,
        setSelectedLocation,
        getAvailableSpecialtiesFunc,
        createDoctorFunction,
        createDoctor: createDoctorFunction,
        deleteDoctorFunction,
        updateDoctorFunction,
        updateDoctor: updateDoctorFunction,
        getUserByDni,
        createUserFunction,
        createUser: createUserFunction,
        setUser,
        user,
        deleteLocationSpecialtyDoctor,
        getCombinations,
        combinations,
        getDoctorById,
        doctor,
        createSchedules,
        getDoctorSchedules,
        doctorSchedules,
        updateSchedules,
      }}
    >
      {children}
    </AdministrationContext.Provider>
  );
};

AdministrationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdministrationProvider;
