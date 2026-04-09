import { AdministrationContext } from './AdministrationContext';
import {
  createLocation as createLocationAPI,
  deleteLocation as deleteLocationAPI,
  createSpecialty,
  deleteSpecialty,
  createHealthInsurance as createHealthInsuranceAPI,
  deleteHealthInsurance as deleteHealthInsuranceAPI,
  updateHealthInsurance as updateHealthInsuranceAPI,
  createSeEspDoc,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  deleteSeEspDoc,
  getCombinations as getCombinationsAPI,
  createSchedule as createScheduleAPI,
  replaceSchedules as replaceSchedulesAPI,
  getSchedulesByDoctor as getSchedulesByDoctorAPI,
  updateSchedule as updateScheduleAPI,
} from '../../api/admin.api.js';
import { useContext, useState } from 'react';
import { getLocations } from '../../api/locations.api.js';
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
  const [locations, setLocations] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [healthInsurances, setHealthInsurances] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [doctor, setDoctor] = useState('');
  const [user, setUser] = useState({});
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [combinations, setCombinations] = useState([]);
  const [doctorSchedules, setDoctorSchedules] = useState([]);

  async function createNewLocation({ name, address }) {
    try {
      await createLocationAPI({ name, address });
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          console.error('Location already exists.');
        } else if (error.response.status === 500) {
          console.error('Server error. Please try again later.');
        } else {
          console.error('Unexpected error:', error.response.data);
        }
        throw error;
      } else {
        console.error('Network or connection error:', error);
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
      await deleteLocationAPI(locationId);
    } catch (error) {
      console.error('Error deleting location:', error);
      throw error;
    }
  }

  // Specialty
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
      await deleteSpecialty(specialtyId);
    } catch (error) {
      console.error('Error deleting specialty:', error);
      throw error;
    }
  }
  async function getAvailableSpecialtiesFunc() {
    const response = await getAllSpecialties();
    setSpecialties(response.data);
  }

  // Doctor
  async function getDoctorsFunc() {
    const response = await getAllDoctors();
    setDoctors(response.data);
  }
  async function getDoctorById(doctorId) {
    try {
      const response = await getDoctorByIdAPI(doctorId);
      setDoctor(response.data);
    } catch (error) {
      console.error('Error fetching doctor by ID:', error);
      throw error;
    }
  }

  async function createDoctorFunction({ nationalId, appointmentDuration, password }) {
    try {
      await createDoctor({ nationalId, appointmentDuration, password });
    } catch (error) {
      console.error('Error creating doctor:', error);
    }
  }
  async function deleteDoctorFunction(doctorId) {
    try {
      await deleteDoctor(doctorId);
    } catch (error) {
      console.error('Error deleting doctor:', error);
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
      console.error('Error updating doctor:', error);
      throw error;
    }
  }

  // Health Insurance
  async function createHealthInsurance({ name }) {
    try {
      await createHealthInsuranceAPI({ name });
    } catch (error) {
      console.error('Error creating health insurance:', error);
      throw error;
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
      await deleteHealthInsuranceAPI(healthInsuranceId);
    } catch (error) {
      console.error('Error deleting health insurance:', error);
      throw error;
    }
  }

  async function updateHealthInsurance({ healthInsuranceId, name }) {
    try {
      await updateHealthInsuranceAPI({ insuranceId: healthInsuranceId, name });
    } catch (error) {
      console.error('Error updating health insurance:', error);
      throw error;
    }
  }

  // Location-specialty-doctor combinations
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
      console.error('Error creating combination:', error);
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
      console.error('Error deleting location-specialty-doctor combination:', error);
      throw error;
    }
  }

  async function getCombinations() {
    try {
      const response = await getCombinationsAPI();
      setCombinations(response.data);
    } catch (error) {
      console.error('Error fetching combinations:', error);
      throw error;
    }
  }

  // Schedules
  async function replaceSchedules({ locationId, doctorId, specialtyId, schedules }) {
    try {
      await replaceSchedulesAPI({ locationId, doctorId, specialtyId, schedules });
    } catch (error) {
      console.error('Error replacing doctor schedules:', error);
      throw error;
    }
  }

  async function createSchedules({
    locationId,
    doctorId,
    specialtyId,
    day,
    startTime,
    endTime,
    status,
  }) {
    try {
      await createScheduleAPI({
        locationId,
        doctorId,
        specialtyId,
        day,
        startTime,
        endTime,
        status,
      });
    } catch (error) {
      console.error('Error creating schedule:', error);
    }
  }
  async function updateSchedules({
    locationId,
    doctorId,
    specialtyId,
    day,
    startTime,
    endTime,
    status,
  }) {
    try {
      await updateScheduleAPI({
        locationId,
        doctorId,
        specialtyId,
        day,
        startTime,
        endTime,
        status,
      });
    } catch (error) {
      console.error('Error updating schedule:', error);
    }
  }
  async function getDoctorSchedules({ locationId, specialtyId, doctorId }) {
    try {
      const response = await getSchedulesByDoctorAPI({
        locationId,
        specialtyId,
        doctorId,
      });
      const normalizedSchedules = (response?.data || []).map((schedule) => ({
        ...schedule,
        day: schedule.day ?? schedule.dia,
        startTime: schedule.startTime ?? schedule.hora_inicio,
        endTime: schedule.endTime ?? schedule.hora_fin,
      }));
      setDoctorSchedules(normalizedSchedules);
    } catch (error) {
      console.error('Error fetching doctor schedules:', error);
      if (error.response && error.response.status === 404) {
        setDoctorSchedules([]);
      }
      throw error;
    }
  }

  //Usuario

  async function getUserByDni(nationalId) {
    try {
      const response = await getUserDni({ nationalId });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user by national ID:', error);
      throw error;
    }
  }

  async function createUserFunction(data) {
    const response = await createUserAPI(data);
    setUser(response.data);
  }
  async function updateUserFunction(data) {
    try {
      const response = await updateUserAPI(data);
      return response;
    } catch (error) {
      console.error('Error updating user:', error);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      throw error;
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
        getDoctors: getDoctorsFunc,
        doctors,
        selectedDoctor,
        setSelectedDoctor,
        selectedSpecialty,
        setSelectedSpecialty,
        selectedLocation,
        setSelectedLocation,
        getAvailableSpecialtiesFunc,
        getAvailableSpecialties: getAvailableSpecialtiesFunc,
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
        replaceSchedules,
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
