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
} from '../../api/admin.api.js'; // Asegúrate de tener una función para crear la sede en la API
import { useContext, useState } from 'react';
import { getSedes } from '../../api/venues.api.js';
import {
  getEspecialidades,
  getAllSpecialities,
} from '../../api/specialties.api';
import { getDoctores, getDoctorById as getDoctorByIdAPI } from '../../api/doctors.api';
import { getObrasSociales } from '../../api/insurance.api.js';
import { getUserDni, createUser as createUserAPI, updateUser as updateUserAPI } from '../../api/users.api.js';
import PropTypes from 'prop-types';
// eslint-disable-next-line react-refresh/only-export-components
export const useAdministracion = () => {
  const context = useContext(AdministrationContext);
  if (!context) {
    throw new Error(
      'useAdministracion must be used within an AdministrationProvider'
    );
  }
  return context;
};

const AdministrationProvider = ({ children }) => {
  const [venues, setVenues] = useState([]); // Estado para almacenar las venues
  const [specialties, setSpecialties] = useState('');
  const [healthInsurances, setHealthInsurances] = useState('');
  const [doctors, setDoctors] = useState('');
  const [doctor, setDoctor] = useState('');
  const [user, setUser] = useState({});
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [combinations, setCombinations] = useState([]);
  const [doctorSchedules, setDoctorSchedules] = useState([]);

  async function createNewVenue({ name, address }) {
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

  async function getVenues() {
    const response = await getSedes();
    setVenues(response.data);
  }

  async function deleteVenue(venueId) {
    try {
      await deleteSede(venueId); // Llamada a la API
    } catch (error) {
      console.error('Error al borrar la sede:', error);
      throw error;
    }
  }

  //Especialidad
  async function getSpecialties({ venueId }) {
    const response = await getEspecialidades({ venueId });
    setSpecialties(response.data);
  }
  async function createSpecialtyFunction({ name }) {
    try {
      await createSpecialty({ name });
    } catch (error) {
      console.error('Error al obtener las venues:', error);
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
  async function getAvailableSpecialties() {
    const response = await getAllSpecialities();
    setSpecialties(response.data);
  }

  //Doctor
  async function getDoctors() {
    const response = await getDoctores();
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
  async function updateDoctorFunction({ doctorId, appointmentDuration, password }) {
    try {
      const response = await updateDoctor({ doctorId, appointmentDuration, password });
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

  async function getHealthInsurances() {
    try {
      const response = await getObrasSociales();
      setHealthInsurances(response.data);
    } catch (error) {
      console.error('Error al obtener las venues:', error);
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

  //Combinaciones de sede, especialidad y doctor
  async function createVenueSpecialtyDoctor({ venueId, specialtyId, doctorId }) {
    try {
      await createSeEspDoc({
        venueId,
        specialtyId,
        doctorId,
      });
    } catch (error) {
      console.error('Error al obtener las venues:', error);
      throw error;
    }
  }

  async function deleteVenueSpecialtyDoctor({ venueId, doctorId, specialtyId }) {
    try {
      await deleteSeEspDoc({
        venueId,
        doctorId,
        specialtyId,
      });
    } catch (error) {
      console.error(
        'Error al borrar la combinación de sede, especialidad y doctor:',
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
    venueId,
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
        venueId,
        doctorId,
        specialtyId,
        dia,
        hora_inicio,
        hora_fin,
        status
      );
      await createHorarios({
        venueId,
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
    venueId,
    doctorId,
    specialtyId,
    dia,
    hora_inicio,
    hora_fin,
    status,
  }) {
    try {
      await updateHorarios({
        venueId,
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
  async function getDoctorSchedules({ venueId, specialtyId, doctorId }) {
    try {
      const response = await getHorariosXDoctor({
        venueId,
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
        venues,
        createNewVenue,
        getVenues,
        deleteVenue,
        createSpecialtyFunction,
        specialties,
        setSpecialties,
        deleteSpecialtyFunction,
        createHealthInsurance,
        getHealthInsurances,
        healthInsurances,
        deleteHealthInsurance,
        updateHealthInsurance,
        createVenueSpecialtyDoctor,
        getSpecialties,
        getDoctors,
        doctors,
        selectedDoctor,
        setSelectedDoctor,
        selectedSpecialty,
        setSelectedSpecialty,
        selectedVenue,
        setSelectedVenue,
        getAvailableSpecialties,
        createDoctorFunction,
        deleteDoctorFunction,
        updateDoctorFunction,
        getUserByDni,
        createUserFunction,
        setUser,
        user,
        deleteVenueSpecialtyDoctor,
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



