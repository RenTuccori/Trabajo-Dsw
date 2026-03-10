import { useState, useContext, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../global/AuthProvider';

import { PatientsContext } from './PatientsContext';
import { getSedes } from '../../api/venues.api';
import {
  getEspecialidades,
  getEspecialidadById,
} from '../../api/specialties.api';
import {
  getDoctors as getDoctorsAPI,
  getDoctorById,
} from '../../api/doctors.api';
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
    return await updateUser(data);
  }

  async function getVenues() {
    try {
      const response = await getSedes();
      setVenues(response.data);
    } catch (error) {
      // Handle error silently or show user notification
    }
  }

  async function getSpecialties({ venueId }) {
    console.log(
      '🩺 FRONTEND - getSpecialties: Obteniendo especialidades para sede:',
      venueId
    );
    try {
      const response = await getEspecialidades({ venueId });
      console.log('✅ FRONTEND - Especialidades obtenidas:', response.data);
      setSpecialties(response.data);
    } catch (error) {
      console.error('❌ FRONTEND - Error obteniendo especialidades:', error);
    }
  }

  async function getDoctors({ venueId, specialtyId }) {
    console.log('👨‍⚕️ FRONTEND - getDoctors: Obteniendo doctores para:', {
      venueId,
      specialtyId,
    });
    try {
      const response = await getDoctorsAPI({ venueId, specialtyId });
      console.log('✅ FRONTEND - Doctores obtenidos:', response.data);
      setDoctors(response.data);
    } catch (error) {
      console.error('❌ FRONTEND - Error obteniendo doctores:', error);
    }
  }
  async function getDates({
    selectedOption,
    selectedSpecialty,
    selectedVenue,
  }) {
    console.log('📅 FRONTEND - getDates: Obteniendo fechas para:', {
      doctorId: selectedOption.value,
      specialtyId: selectedSpecialty.value,
      venueId: selectedVenue.value,
    });

    try {
      const response = await getFechasDispTodos({
        doctorId: selectedOption.value,
        specialtyId: selectedSpecialty.value,
        venueId: selectedVenue.value,
      });

      console.log('✅ FRONTEND - Fechas obtenidas del backend:', response.data);

      const fechasFormateadas = response.data.map((item) => {
        const [year, month, day] = item.date.split('-'); // Descomponer la fecha
        return new Date(Number(year), Number(month) - 1, Number(day)); // Crear la fecha (mes empieza en 0)
      });

      console.log('📅 FRONTEND - Fechas formateadas:', fechasFormateadas);
      setDates(fechasFormateadas);
    } catch (error) {
      console.error('❌ FRONTEND - Error obteniendo fechas:', error);
    }
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
      date: date,
    });
    setSchedules(response.data);
  }

  async function getHealthInsurances() {
    console.log('🏥 FRONTEND - getHealthInsurances: Obteniendo obras sociales');
    try {
      const response = await getObrasSociales();
      console.log('✅ FRONTEND - Obras sociales obtenidas:', response.data);
      setHealthInsurances(response.data);
    } catch (error) {
      console.error('❌ FRONTEND - Error obteniendo obras sociales:', error);
    }
  }

  async function createUserFunction(data) {
    console.log(
      '🎯 FRONTEND - createUserFunction: Iniciando creación de usuario'
    );
    console.log('📋 FRONTEND - Datos recibidos:', data);

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

    console.log('🔄 FRONTEND - Datos mapeados para backend:', backendData);

    try {
      const response = await createUser(backendData);
      console.log(
        '✅ FRONTEND - createUserFunction: Usuario creado en BD:',
        response
      );
      setUser(response.data);

      console.log(
        '📝 FRONTEND - createUserFunction: Creando paciente con DNI:',
        data.dni
      );
      await createPaciente({ dni: data.dni });
      console.log(
        '✅ FRONTEND - createUserFunction: Paciente creado exitosamente'
      );
    } catch (error) {
      console.error('❌ FRONTEND - createUserFunction: Error:', error);
      throw error;
    }
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
    try {
      console.log(
        '👨‍⚕️ FRONTEND - getDoctorByIdFunction: Obteniendo doctor con ID:',
        doctorId
      );
      const response = await getDoctorById(doctorId);
      console.log(
        '📋 FRONTEND - getDoctorByIdFunction: Respuesta recibida:',
        response.data
      );
      setDoctorName(response.data.firstName);
      setDoctorLastName(response.data.lastName);
      console.log(
        '✅ FRONTEND - getDoctorByIdFunction: Doctor configurado:',
        response.data.firstName,
        response.data.lastName
      );
    } catch (error) {
      console.error(
        '💥 FRONTEND - getDoctorByIdFunction: Error obteniendo doctor:',
        error
      );
      throw error; // Re-lanzar para que lo maneje appointmentConfirmation
    }
  }

  async function getVenueById() {
    const response = await getSedeById(venueId);
    setVenueName(response.data.name);
    setVenueAddress(response.data.address);
  }

  async function createAppointment() {
    console.log('🎯 FRONTEND - createAppointment: Iniciando creación de cita');
    console.log('📋 FRONTEND - Valores del contexto antes de enviar:');
    console.log('  - patientId:', patientId);
    console.log('  - dateAndTime:', dateAndTime);
    console.log('  - specialtyId:', specialtyId);
    console.log('  - doctorId:', doctorId);
    console.log('  - venueId:', venueId);
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
      venueId,
    };

    console.log(
      '📤 FRONTEND - Objeto de datos enviado a createTurno:',
      appointmentData
    );

    try {
      const result = await createTurno(appointmentData);
      console.log(
        '✅ FRONTEND - createAppointment: Respuesta recibida:',
        result
      );
      return result;
    } catch (error) {
      console.error('❌ FRONTEND - createAppointment: Error:', error);
      throw error;
    }
  }

  const getPatientByDni = useCallback(async () => {
    console.log(
      '🔍 FRONTEND - getPatientByDni: Obteniendo paciente con DNI:',
      dni
    );
    try {
      const response = await getPacienteDni({ dni });
      console.log(
        '✅ FRONTEND - getPatientByDni: Respuesta recibida:',
        response
      );
      console.log('🆔 FRONTEND - idPatient obtenido:', response.data.idPatient);
      setPatientId(response.data.idPatient); // Usar idPatient, no patientId
      return response.data.idPatient; // Retornar el idPatient para poder verificar que se obtuvo
    } catch (error) {
      console.error('❌ FRONTEND - getPatientByDni: Error:', error);
      throw error;
    }
  }, [dni]);

  useEffect(() => {
    if (dni) {
      getPatientByDni();
    }
  }, [dni, getPatientByDni]);

  async function getPatientAppointments() {
    console.log(
      '🎯 FRONTEND - getPatientAppointments: Obteniendo citas para DNI:',
      dni
    );
    try {
      const response = await getpatientAppointments({ dni });
      console.log(
        '📋 FRONTEND - getPatientAppointments: Respuesta recibida:',
        response
      );

      if (response && response.data) {
        console.log(
          '📊 FRONTEND - getPatientAppointments: Datos de citas:',
          response.data
        );
        // Los appointments del backend siempre tienen idAppointment
        if (response.data.length > 0) {
          console.log(
            '🔍 FRONTEND - getPatientAppointments: Estructura del primer appointment:',
            response.data[0]
          );
        }
        setAppointments(response.data);
      } else {
        console.error('❌ FRONTEND - No se pudieron obtener los appointments');
        setAppointments([]);
        window.notifyError('Error al obtener los appointments');
      }
    } catch (error) {
      console.error(
        '❌ FRONTEND - Error al obtener appointments del patient:',
        error
      );
      setAppointments([]);
      window.notifyError('Error al obtener los appointments');
    }
  }

  async function confirmAppointment({ appointmentId }) {
    console.log(
      '🎯 FRONTEND - confirmAppointment: Confirmando turno con ID:',
      appointmentId
    );
    try {
      const result = await confirmarTurno({ appointmentId });
      console.log('✅ FRONTEND - confirmAppointment: Resultado:', result);

      setAppointments((prevTurnos) =>
        prevTurnos.map((appointment) =>
          appointment.idAppointment === appointmentId
            ? { ...appointment, status: 'Confirmado' }
            : appointment
        )
      );
      console.log(
        '📝 FRONTEND - confirmAppointment: Estado actualizado en el contexto'
      );
    } catch (error) {
      console.error('❌ FRONTEND - confirmAppointment: Error:', error);
      throw error;
    }
  }

  async function getUserByDniFunction() {
    console.log('🔍 FRONTEND - getUserByDniFunction: Iniciando función');
    console.log('📋 FRONTEND - DNI para buscar:', dni);

    try {
      const response = await getUserDni({ dni });
      console.log('📨 FRONTEND - Respuesta de getUserDni:', response);

      if (response && response.data) {
        console.log(
          '✅ FRONTEND - Datos del usuario obtenidos:',
          response.data
        );
        setUserByDni(response.data);
        setUserEmail(response.data.email);
        console.log('💾 FRONTEND - Estado actualizado con datos del usuario');
      } else {
        console.error('❌ FRONTEND - No se pudo obtener los datos del user');
        window.notifyError('Error al obtener los datos del user');
      }
    } catch (error) {
      console.error('💥 FRONTEND - Error al obtener user por DNI:', error);
      window.notifyError('Error al obtener los datos del user');
    }
  }

  async function cancelAppointment({ appointmentId }) {
    console.log(
      '🎯 FRONTEND - cancelAppointment: Cancelando turno con ID:',
      appointmentId
    );
    try {
      const result = await cancelarTurno({ appointmentId });
      console.log('✅ FRONTEND - cancelAppointment: Resultado:', result);

      setAppointments((prevTurnos) =>
        prevTurnos.map((appointment) =>
          appointment.idAppointment === appointmentId
            ? { ...appointment, status: 'Cancelado' }
            : appointment
        )
      );
      console.log(
        '📝 FRONTEND - cancelAppointment: Estado actualizado en el contexto'
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
