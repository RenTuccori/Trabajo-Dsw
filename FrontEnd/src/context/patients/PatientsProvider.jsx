import { useState, useContext, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../global/AuthProvider';

import { PatientsContext } from './PatientsContext';
import { getSedes } from '../../api/venues.api';
import {
  getEspecialidades,
  getEspecialidadById,
} from '../../api/specialties.api';
import { getDoctors as getDoctorsAPI, getDoctorById } from '../../api/doctors.api';
import { getFechasDispTodos, getHorariosDisp } from '../../api/schedules.api';
import { createUser, getUserDni, updateUser } from '../../api/users.api';
import { getObrasSociales } from '../../api/insurance.api';
import { createPaciente, getPacienteDni } from '../../api/patients.api';
import { getSedeById } from '../../api/venues.api';
import {
  createTurno,
  getpatientAppointments,
  confirmarTurno,
  cancelarTurno,
} from '../../api/appointments.api';
import { sendEmail } from '../../api/email.api';

export const usePacientes = () => {
  const context = useContext(PatientsContext);
  if (!context) {
    throw new Error('usePacientes must be used within an PatientsProvider');
  }
  return context;
};

const PatientsProvider = ({ children }) => {
  //proveedor para acceder a los datos de los empleados desde cualquier componente
  const [venues, setVenues] = useState([]);
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
  const [venueName, setVenueName] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [dateAndTime, setDateAndTime] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [specialtyId, setSpecialtyId] = useState('');
  const [venueId, setVenueId] = useState('');
  const [patientId, setPatientId] = useState('');
  const [status, setStatus] = useState('');
  const [cancellationDate, setCancellationDate] = useState('');
  const [confirmationDate, setConfirmationDate] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [userByDni, setUserByDni] = useState({});
  const [userEmail, setUserEmail] = useState('');

  const { dni } = useAuth();

  async function updateUserFunction(data) {
    const response = await updateUser(data);
    return response;
  }

  async function getVenues() {
    const response = await getSedes();
    setVenues(response.data);
  }

  async function getSpecialties({ venueId }) {
    const response = await getEspecialidades({ venueId });
    setSpecialties(response.data);
  }

  async function getDoctors({ venueId, specialtyId }) {
    console.log({ venueId, specialtyId });
    const response = await getDoctorsAPI({ venueId, specialtyId });
    console.log('mis doctors', response.data);
    setDoctors(response.data);
  }
  async function getDates({
    selectedOption,
    selectedSpecialty,
    selectedVenue,
  }) {
    const response = await getFechasDispTodos({
      doctorId: selectedOption.value,
      specialtyId: selectedSpecialty.value,
      venueId: selectedVenue.value,
    });
    const fechasFormateadas = response.data.map((item) => {
      const [year, month, day] = item.fecha.split('-'); // Descomponer la fecha
      return new Date(Number(year), Number(month) - 1, Number(day)); // Crear la fecha (mes empieza en 0)
    });

    setDates(fechasFormateadas);
  }
  async function getSchedules({
    selectedDoctor,
    selectedSpecialty,
    selectedVenue,
    date,
  }) {
    const response = await getHorariosDisp({
      doctorId: selectedDoctor.value,
      specialtyId: selectedSpecialty.value,
      venueId: selectedVenue.value,
      fecha: date,
    });
    setSchedules(response.data);
  }

  useEffect(() => {
    if (dni) {
      getPatientByDni();
    }
  }, [dni, getPatientByDni]);

  async function getHealthInsurances() {
    const response = await getObrasSociales();
    setHealthInsurances(response.data);
  }

  async function createUserFunction(data) {
    const response = await createUser(data);
    setUser(response.data);
    createPaciente({ dni: data.dni });
  }

  async function createPatient({ dni }) {
    const response = await createPaciente({ dni });
    setCreatedPatientId(response.data.patientId);
  }

  async function getSpecialtyById() {
    const response = await getEspecialidadById(specialtyId);
    setSpecialtyName(response.data.name);
  }

  async function getDoctorByIdFunction() {
    const response = await getDoctorById(doctorId);
    setDoctorName(response.data.name);
    setDoctorLastName(response.data.lastName);
  }

  async function getVenueById() {
    const response = await getSedeById(venueId);
    setVenueName(response.data.name);
    setVenueAddress(response.data.address);
  }

  async function createAppointment() {
    await createTurno({
      patientId,
      dateAndTime,
      cancellationDate,
      confirmationDate,
      status,
      specialtyId,
      doctorId,
      venueId,
    });
  }

  const getPatientByDni = useCallback(async () => {
    const reponse = await getPacienteDni({ dni });
    setPatientId(reponse.data.patientId);
  }, [dni]);

  async function getPatientAppointments() {
    try {
      const response = await getpatientAppointments({ dni });
      if (response && response.data) {
        setAppointments(response.data);
      } else {
        console.error('No se pudieron obtener los appointments');
        setAppointments([]);
        window.notifyError('Error al obtener los appointments');
      }
    } catch (error) {
      console.error('Error al obtener appointments del patient:', error);
      setAppointments([]);
      window.notifyError('Error al obtener los appointments');
    }
  }

  async function confirmAppointment({ appointmentId }) {
    await confirmarTurno({ appointmentId });
    setAppointments((prevTurnos) =>
      prevTurnos.map((appointment) =>
        appointment.appointmentId === appointmentId ? { ...appointment, status: 'Confirmado' } : appointment
      )
    );
  }

  async function getUserByDniFunction() {
    try {
      const response = await getUserDni({ dni });
      if (response && response.data) {
        setUserByDni(response.data);
        setUserEmail(response.data.email);
      } else {
        console.error('No se pudo obtener los datos del user');
        window.notifyError('Error al obtener los datos del user');
      }
    } catch (error) {
      console.error('Error al obtener user por DNI:', error);
      window.notifyError('Error al obtener los datos del user');
    }
  }

  async function cancelAppointment({ appointmentId }) {
    await cancelarTurno({ appointmentId });
    setAppointments((prevTurnos) =>
      prevTurnos.map((appointment) =>
        appointment.appointmentId === appointmentId ? { ...appointment, status: 'Cancelado' } : appointment
      )
    );
  }
  async function sendEmailFunction(data) {
    await sendEmail(data);
  }
  return (
    <PatientsContext.Provider
      value={{
        venues,
        specialties,
        doctors,
        getVenues,
        getSpecialties,
        getDoctors,
        dates,
        getDates,
        schedules,
        getSchedules,
        healthInsurances,
        getHealthInsurances,
        createdPatientId,
        getPatientByDni,
        user,
        createPatient,
        createUserFunction,
        getDoctorByIdFunction,
        getSpecialtyById,
        getVenueById,
        doctorName,
        specialtyName,
        venueName,
        doctorLastName,
        venueAddress,
        createAppointment,
        dateAndTime,
        setDateAndTime,
        setDoctorId,
        setSpecialtyId,
        setVenueId,
        setStatus,
        setCancellationDate,
        setConfirmationDate,
        getPatientAppointments,
        appointments,
        confirmAppointment,
        cancelAppointment,
        getUserByDniFunction,
        userByDni,
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



