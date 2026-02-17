import { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../global/AuthProvider';

import { PacientesContext } from './PacientesContext';
import { getLocations } from '../../api/sedes.api';
import {
  getSpecialties,
  getSpecialtyById,
} from '../../api/especialidades.api';
import { getDoctors, getDoctorById } from '../../api/doctores.api';
import { getAvailableDates, getAvailableSchedules } from '../../api/horarios.api';
import { createUser, getUserDni, updateUser } from '../../api/usuarios.api';
import { getHealthInsuranceList } from '../../api/obrasociales.api';
import { createPatient, getPatientByDni } from '../../api/pacientes.api';
import { getLocationById } from '../../api/sedes.api';
import {
  createAppointment,
  getAppointmentsByPatient,
  confirmAppointment,
  cancelAppointment,
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
  // Provider to access patient data from any component
  const [locations, setLocations] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [dates, setDates] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [healthInsuranceList, setHealthInsuranceList] = useState([]);
  const [user, setUser] = useState({});
  const [createdPatientId, setCreatedPatientId] = useState('');
  const [specialtyName, setSpecialtyName] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [doctorLastName, setDoctorLastName] = useState('');
  const [locationName, setLocationName] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [dateAndTime, setDateAndTime] = useState('');
  const [idDoctor, setIdDoctor] = useState('');
  const [idSpecialty, setIdSpecialty] = useState('');
  const [idLocation, setIdLocation] = useState('');
  const [idPatient, setIdPatient] = useState('');
  const [status, setStatus] = useState('');
  const [cancellationDate, setCancellationDate] = useState('');
  const [confirmationDate, setConfirmationDate] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [userByDni, setUserByDni] = useState({});
  const [userEmail, setUserEmail] = useState('');

  const { dni } = useAuth();

  async function updateUserData(data) {
    const response = await updateUser(data);
    return response;
  }

  async function fetchLocations() {
    const response = await getLocations();
    setLocations(response.data);
  }

  async function fetchSpecialties({ idSede }) {
    const response = await getSpecialties({ idSede });
    setSpecialties(response.data);
  }

  async function fetchDoctors({ idSede, idEspecialidad }) {
    const response = await getDoctors({ idSede, idEspecialidad });
    setDoctors(response.data);
  }
  async function fetchAvailableDates({
    selectedOption,
    selectedEspecialidad,
    selectedSede,
  }) {
    const response = await getAvailableDates({
      idDoctor: selectedOption.value,
      idEspecialidad: selectedEspecialidad.value,
      idSede: selectedSede.value,
    });
    const formattedDates = response.data.map((item) => {
      const [year, month, day] = item.fecha.split('-'); // Parse the date
      return new Date(Number(year), Number(month) - 1, Number(day)); // Create date (month starts at 0)
    });

    setDates(formattedDates);
  }
  async function fetchAvailableSchedules({
    selectedDoctor,
    selectedEspecialidad,
    selectedSede,
    date,
  }) {
    const response = await getAvailableSchedules({
      idDoctor: selectedDoctor.value,
      idEspecialidad: selectedEspecialidad.value,
      idSede: selectedSede.value,
      fecha: date,
    });
    setSchedules(response.data);
  }

  useEffect(() => {
    if (dni) {
      fetchPatientByDni();
    }
  }, [dni]);

  async function fetchHealthInsurance() {
    const response = await getHealthInsuranceList();
    setHealthInsuranceList(response.data);
  }

  async function createNewUser(data) {
    const response = await createUser(data);
    setUser(response.data);
    createPatient({ dni: data.dni });
  }

  async function createNewPatient({ dni }) {
    const response = await createPatient({ dni });
    setCreatedPatientId(response.data.idPaciente);
  }

  async function fetchSpecialtyById() {
    const response = await getSpecialtyById(idSpecialty);
    setSpecialtyName(response.data.nombre);
  }

  async function fetchDoctorById() {
    const response = await getDoctorById(idDoctor);
    setDoctorName(response.data.nombre);
    setDoctorLastName(response.data.apellido);
  }

  async function fetchLocationById() {
    const response = await getLocationById(idLocation);
    setLocationName(response.data.nombre);
    setLocationAddress(response.data.direccion);
  }

  async function createNewAppointment() {
    await createAppointment({
      idPaciente: idPatient,
      fechaYHora: dateAndTime,
      fechaCancelacion: cancellationDate,
      fechaConfirmacion: confirmationDate,
      estado: status,
      idEspecialidad: idSpecialty,
      idDoctor,
      idSede: idLocation,
    });
  }

  async function fetchPatientByDni() {
    const reponse = await getPatientByDni({ dni });
    setIdPatient(reponse.data.idPaciente);
  }

  async function fetchPatientAppointments() {
    try {
      const response = await getAppointmentsByPatient({ dni });
      if (response && response.data) {
        setAppointments(response.data);
      } else {
        setAppointments([]);
        window.notifyError('Error al obtener los turnos');
      }
    } catch {
      setAppointments([]);
      window.notifyError('Error al obtener los turnos');
    }
  }

  async function confirmAppointmentAction({ idTurno }) {
    await confirmAppointment({ idTurno });
    setAppointments((prevAppointments) =>
      prevAppointments.map((turno) =>
        turno.idTurno === idTurno ? { ...turno, estado: 'Confirmado' } : turno
      )
    );
  }

  async function fetchUserByDni() {
    try {
      const response = await getUserDni({ dni });
      if (response && response.data) {
        setUserByDni(response.data);
        setUserEmail(response.data.email);
      } else {
        window.notifyError('Error al obtener datos del usuario');
      }
    } catch {
      window.notifyError('Error al obtener datos del usuario');
    }
  }

  async function cancelAppointmentAction({ idTurno }) {
    await cancelAppointment({ idTurno });
    setAppointments((prevAppointments) =>
      prevAppointments.map((turno) =>
        turno.idTurno === idTurno ? { ...turno, estado: 'Cancelado' } : turno
      )
    );
  }
  async function sendEmailAction(data) {
    await sendEmail(data);
  }
  return (
    <PacientesContext.Provider
      value={{
        locations,
        specialties,
        doctors,
        fetchLocations,
        fetchSpecialties,
        fetchDoctors,
        dates,
        fetchAvailableDates,
        schedules,
        fetchAvailableSchedules,
        healthInsuranceList,
        fetchHealthInsurance,
        createdPatientId,
        fetchPatientByDni,
        user,
        createNewPatient,
        createNewUser,
        fetchDoctorById,
        fetchSpecialtyById,
        fetchLocationById,
        doctorName,
        specialtyName,
        locationName,
        doctorLastName,
        locationAddress,
        createNewAppointment,
        dateAndTime,
        setDateAndTime,
        setIdDoctor,
        setIdSpecialty,
        setIdLocation,
        setStatus,
        setCancellationDate,
        setConfirmationDate,
        fetchPatientAppointments,
        appointments,
        confirmAppointmentAction,
        cancelAppointmentAction,
        fetchUserByDni,
        userByDni,
        updateUserData,
        sendEmailAction,
        userEmail,
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
