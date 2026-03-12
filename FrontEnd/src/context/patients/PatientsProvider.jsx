import { useState, useContext, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../global/AuthProvider';

import { PatientsContext } from './PatientsContext';
import { getLocations, getLocationById } from '../../api/locations.api';
import {
  getSpecialties,
  getSpecialtyById,
} from '../../api/specialties.api';
import {
  getDoctors as getDoctorsAPI,
  getDoctorById,
} from '../../api/doctors.api';
import { getAvailableDatesByDocSpecLoc, getAvailableSchedulesByDocSpecLoc } from '../../api/schedules.api';
import { createUser, getUserDni, updateUser } from '../../api/users.api';
import { getInsurance } from '../../api/insurance.api';
import { createPatient, getPatientbyNationalId } from '../../api/patients.api';
import {
  createAppointment,
  getPatientAppointments,
  confirmAppointment,
  cancelAppointment,
} from '../../api/appointments.api';
import { sendEmail } from '../../api/email.api';

export const usePatients = () => {
  const context = useContext(PatientsContext);
  if (!context) {
    throw new Error('usePatients must be used within a PatientsProvider');
  }
  return context;
};

const PatientsProvider = ({ children }) => {
  //proveedor para acceder a los datos de los empleados desde cualquier componente
  const [locations, setLocations] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [dates, setDates] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [healthInsurances, setHealthInsurances] = useState([]);
  const [user, setUser] = useState({});
  const [createdPatientId, setCreatedPatientId] = useState('');
  const [specialtyName, setSpecialtyName] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [doctorLastName, setDoctorLastName] = useState('');
  const [locationName, setLocationName] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [dateAndTime, setDateAndTime] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [specialtyId, setSpecialtyId] = useState('');
  const [locationId, setLocationId] = useState('');
  const [patientId, setPatientId] = useState('');
  const [status, setStatus] = useState('');
  const [cancellationDate, setCancellationDate] = useState('');
  const [confirmationDate, setConfirmationDate] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [userByNationalId, setUserByNationalId] = useState({});
  const [userEmail, setUserEmail] = useState('');

  const { dni } = useAuth();

  async function updateUserFunction(data) {
    return await updateUser(data);
  }

  async function getLocationsFunc() {
    try {
      const response = await getLocations();
      setLocations(response.data);
    } catch (error) {
      // Handle error silently or show user notification
    }
  }

  async function getSpecialtiesFunc({ locationId }) {
    console.log(
      '🩺 FRONTEND - getSpecialties: Getting specialties for location:',
      locationId
    );
    try {
      const response = await getSpecialties({ locationId });
      console.log('✅ FRONTEND - Specialties obtained:', response.data);
      setSpecialties(response.data);
    } catch (error) {
      console.error('❌ FRONTEND - Error getting specialties:', error);
    }
  }

  async function getDoctorsFunc({ locationId, specialtyId }) {
    console.log('👨‍⚕️ FRONTEND - getDoctors: Getting doctors for:', {
      locationId,
      specialtyId,
    });
    try {
      const response = await getDoctorsAPI({ locationId, specialtyId });
      console.log('✅ FRONTEND - Doctors obtained:', response.data);
      setDoctors(response.data);
    } catch (error) {
      console.error('❌ FRONTEND - Error getting doctors:', error);
    }
  }
  async function getDates({
    selectedOption,
    selectedSpecialty,
    selectedLocation,
  }) {
    console.log('📅 FRONTEND - getDates: Getting dates for:', {
      doctorId: selectedOption.value,
      specialtyId: selectedSpecialty.value,
      locationId: selectedLocation.value,
    });

    try {
      const response = await getAvailableDatesByDocSpecLoc({
        doctorId: selectedOption.value,
        specialtyId: selectedSpecialty.value,
        locationId: selectedLocation.value,
      });

      console.log('✅ FRONTEND - Dates obtained from backend:', response.data);

      const formattedDates = response.data.map((item) => {
        const [year, month, day] = item.fecha.split('-');
        return new Date(Number(year), Number(month) - 1, Number(day));
      });

      console.log('📅 FRONTEND - Formatted dates:', formattedDates);
      setDates(formattedDates);
    } catch (error) {
      console.error('❌ FRONTEND - Error getting dates:', error);
    }
  }
  async function getSchedules({
    selectedDoctor,
    selectedSpecialty,
    selectedLocation,
    date,
  }) {
    const response = await getAvailableSchedulesByDocSpecLoc({
      doctorId: selectedDoctor.value,
      specialtyId: selectedSpecialty.value,
      locationId: selectedLocation.value,
      fecha: date,
    });
    setSchedules(response.data);
  }

  async function getHealthInsurances() {
    console.log('🏥 FRONTEND - getHealthInsurances: Getting insurance options');
    try {
      const response = await getInsurance();
      console.log('✅ FRONTEND - Insurance options obtained:', response.data);
      setHealthInsurances(response.data);
    } catch (error) {
      console.error('❌ FRONTEND - Error getting insurance options:', error);
    }
  }

  async function createUserFunction(data) {
    console.log(
      '🎯 FRONTEND - createUserFunction: Starting user creation'
    );
    console.log('📋 FRONTEND - Received data:', data);

    // Mapear campos del frontend al backend
    const backendData = {
      dni: data.dni,
      birthDate: data.birthDate,
      firstName: data.name, // Mapear name a firstName
      lastName: data.lastName,
      phone: data.phone,
      email: data.email,
      address: data.address,
      insuranceCompanyId: data.healthInsuranceId, // Mapear healthInsuranceId a insuranceCompanyId
    };

    console.log('🔄 FRONTEND - Data mapped for backend:', backendData);

    try {
      const response = await createUser(backendData);
      console.log(
        '✅ FRONTEND - createUserFunction: User created in DB:',
        response
      );
      setUser(response.data);

      console.log(
        '📝 FRONTEND - createUserFunction: Creating patient with DNI:',
        data.dni
      );
      await createPatient({ nationalId: data.dni });
      console.log(
        '✅ FRONTEND - createUserFunction: Patient created successfully'
      );
    } catch (error) {
      console.error('❌ FRONTEND - createUserFunction: Error:', error);
      throw error;
    }
  }

  async function createPatientFunc({ nationalId }) {
    const response = await createPatient({ nationalId });
    setCreatedPatientId(response.data.id);
  }

  async function getSpecialtyByIdFunc() {
    const response = await getSpecialtyById(specialtyId);
    setSpecialtyName(response.data.name);
  }

  async function getDoctorByIdFunction() {
    try {
      console.log(
        '👨‍⚕️ FRONTEND - getDoctorByIdFunction: Getting doctor with ID:',
        doctorId
      );
      const response = await getDoctorById(doctorId);
      console.log(
        '📋 FRONTEND - getDoctorByIdFunction: Response received:',
        response.data
      );
      setDoctorName(response.data.firstName);
      setDoctorLastName(response.data.lastName);
      console.log(
        '✅ FRONTEND - getDoctorByIdFunction: Doctor set:',
        response.data.firstName,
        response.data.lastName
      );
    } catch (error) {
      console.error(
        '💥 FRONTEND - getDoctorByIdFunction: Error getting doctor:',
        error
      );
      throw error; // Re-lanzar para que lo maneje appointmentConfirmation
    }
  }

  async function getLocationByIdFunc() {
    const response = await getLocationById(locationId);
    setLocationName(response.data.name);
    setLocationAddress(response.data.address);
  }

  async function createAppointmentFunc() {
    console.log('🎯 FRONTEND - createAppointment: Starting appointment creation');
    console.log('📋 FRONTEND - Context values before sending:');
    console.log('  - patientId:', patientId);
    console.log('  - dateAndTime:', dateAndTime);
    console.log('  - specialtyId:', specialtyId);
    console.log('  - doctorId:', doctorId);
    console.log('  - locationId:', locationId);
    console.log('  - status:', status);
    console.log('  - cancellationDate:', cancellationDate);
    console.log('  - confirmationDate:', confirmationDate);

    const appointmentData = {
      patientId,
      dateAndTime,
      cancellationDate,
      confirmationDate,
      status,
      specialtyId,
      doctorId,
      locationId,
    };

    console.log(
      '📤 FRONTEND - Data object sent to createAppointment:',
      appointmentData
    );

    try {
      const result = await createAppointment(appointmentData);
      console.log(
        '✅ FRONTEND - createAppointment: Response received:',
        result
      );
      return result;
    } catch (error) {
      console.error('❌ FRONTEND - createAppointment: Error:', error);
      throw error;
    }
  }

  const getPatientByNationalId = useCallback(async () => {
    console.log(
      '🔍 FRONTEND - getPatientByNationalId: Getting patient with nationalId:',
      dni
    );
    try {
      const response = await getPatientbyNationalId({ nationalId: dni });
      console.log(
        '✅ FRONTEND - getPatientByNationalId: Response received:',
        response
      );
      console.log('🆔 FRONTEND - idPatient obtained:', response.data.id);
      setPatientId(response.data.id);
      return response.data.id;
    } catch (error) {
      console.error('❌ FRONTEND - getPatientByNationalId: Error:', error);
      throw error;
    }
  }, [dni]);

  useEffect(() => {
    if (dni) {
      getPatientByNationalId();
    }
  }, [dni, getPatientByNationalId]);

  async function getPatientAppointmentsFunc() {
    console.log(
      '🎯 FRONTEND - getPatientAppointments: Getting appointments for nationalId:',
      dni
    );
    try {
      const response = await getPatientAppointments({ nationalId: dni });
      console.log(
        '📋 FRONTEND - getPatientAppointments: Response received:',
        response
      );

      if (response && response.data) {
        console.log(
          '📊 FRONTEND - getPatientAppointments: Appointments data:',
          response.data
        );
        if (response.data.length > 0) {
          console.log(
            '🔍 FRONTEND - getPatientAppointments: First appointment structure:',
            response.data[0]
          );
        }
        setAppointments(response.data);
      } else {
        console.error('❌ FRONTEND - Could not get appointments');
        setAppointments([]);
        window.notifyError('Error getting appointments');
      }
    } catch (error) {
      console.error(
        '❌ FRONTEND - Error getting patient appointments:',
        error
      );
      setAppointments([]);
      window.notifyError('Error getting appointments');
    }
  }

  async function confirmAppointmentFunc({ appointmentId }) {
    console.log(
      '🎯 FRONTEND - confirmAppointment: Confirming appointment with ID:',
      appointmentId
    );
    try {
      const result = await confirmAppointment({ id: appointmentId });
      console.log('✅ FRONTEND - confirmAppointment: Result:', result);

      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === appointmentId
            ? { ...appointment, status: 'Confirmed' }
            : appointment
        )
      );
      console.log(
        '📝 FRONTEND - confirmAppointment: Status updated in context'
      );
    } catch (error) {
      console.error('❌ FRONTEND - confirmAppointment: Error:', error);
      throw error;
    }
  }

  async function getUserByNationalIdFunction() {
    console.log('🔍 FRONTEND - getUserByNationalIdFunction: Starting function');
    console.log('📋 FRONTEND - National ID to search:', dni);

    try {
      const response = await getUserDni({ dni });
      console.log('📨 FRONTEND - getUserDni response:', response);

      if (response && response.data) {
        console.log(
          '✅ FRONTEND - User data obtained:',
          response.data
        );
        setUserByNationalId(response.data);
        setUserEmail(response.data.email);
        console.log('💾 FRONTEND - State updated with user data');
      } else {
        console.error('❌ FRONTEND - Could not get user data');
        window.notifyError('Error getting user data');
      }
    } catch (error) {
      console.error('💥 FRONTEND - Error getting user by national ID:', error);
      window.notifyError('Error getting user data');
    }
  }

  async function cancelAppointmentFunc({ appointmentId }) {
    console.log(
      '🎯 FRONTEND - cancelAppointment: Cancelling appointment with ID:',
      appointmentId
    );
    try {
      const result = await cancelAppointment({ id: appointmentId });
      console.log('✅ FRONTEND - cancelAppointment: Result:', result);

      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === appointmentId
            ? { ...appointment, status: 'Cancelled' }
            : appointment
        )
      );
      console.log(
        '📝 FRONTEND - cancelAppointment: Status updated in context'
      );
    } catch (error) {
      console.error('❌ FRONTEND - cancelAppointment: Error:', error);
      throw error;
    }
  }
  async function sendEmailFunction(data) {
    await sendEmail(data);
  }
  return (
    <PatientsContext.Provider
      value={{
        locations,
        venues: locations,
        specialties,
        doctors,
        getLocationsFunc,
        getLocations: getLocationsFunc,
        getVenues: getLocationsFunc,
        getSpecialtiesFunc,
        getSpecialties: getSpecialtiesFunc,
        getDoctorsFunc,
        getDoctors: getDoctorsFunc,
        dates,
        getDates,
        schedules,
        getSchedules,
        healthInsurances,
        getHealthInsurances,
        createdPatientId,
        getPatientByNationalId,
        getPatientByDni: getPatientByNationalId,
        user,
        createPatientFunc,
        createUserFunction,
        getDoctorByIdFunction,
        getSpecialtyByIdFunc,
        getSpecialtyById: getSpecialtyByIdFunc,
        getLocationByIdFunc,
        getVenueById: getLocationByIdFunc,
        doctorName,
        specialtyName,
        locationName,
        venueName: locationName,
        doctorLastName,
        locationAddress,
        venueAddress: locationAddress,
        createAppointmentFunc,
        createAppointment: createAppointmentFunc,
        dateAndTime,
        setDateAndTime,
        setDoctorId,
        setSpecialtyId,
        setLocationId,
        setlocationId: setLocationId,
        setStatus,
        setCancellationDate,
        setConfirmationDate,
        getPatientAppointmentsFunc,
        getPatientAppointments: getPatientAppointmentsFunc,
        appointments,
        confirmAppointmentFunc,
        confirmAppointment: confirmAppointmentFunc,
        cancelAppointmentFunc,
        cancelAppointment: cancelAppointmentFunc,
        getUserByNationalIdFunction,
        getUserByDniFunction: getUserByNationalIdFunction,
        userByNationalId,
        userByDni: userByNationalId,
        updateUserFunction,
        sendEmailFunction,
        userEmail,
      }}
    >
      {children}
    </PatientsContext.Provider>
  );
};

PatientsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PatientsProvider;
