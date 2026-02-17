import { DoctoresContext } from './DoctoresContext';
import {
  getAppointmentHistoryByDoctor,
  getAppointmentsByDoctorDate,
  getAppointmentsByDoctorToday,
} from '../../api/turnos.api.js';
import { useContext,  useState } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line react-refresh/only-export-components
export const useDoctores = () => {
  const context = useContext(DoctoresContext);
  if (!context) {
    throw new Error('useDoctores must be used within an DoctoresProvider');
  }
  return context;
};
import {useAuth} from '../global/AuthProvider';

const DoctoresProvider = ({ children }) => {
  // Provider to access employee data from any component
  const [appointmentHistory, setAppointmentHistory] = useState([]);
  const [appointmentsByDate, setAppointmentsByDate] = useState([]);
  const [appointmentsToday, setAppointmentsToday] = useState([]);
  const [dates, setDates] = useState([]);

  const {idDoctor} = useAuth();


  async function fetchHistory() {
    try {
      const response = await getAppointmentHistoryByDoctor({ idDoctor: idDoctor });
      if (response.data && response.data.data.length > 0) {
        setAppointmentHistory(response.data.data);
        const fechasDisponibles = response.data.data.map(
          (turno) => new Date(turno.fechaYHora.split('T')[0])
        );
        setDates(fechasDisponibles);
      } else {
        setAppointmentHistory([]);
        setDates([]);
      }
    } catch {
      setAppointmentHistory([]);
      setDates([]);
    }
  }

  async function fetchByDate(fecha) {
    const formattedDate = `${fecha.getFullYear()}-${(fecha.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${fecha.getDate().toString().padStart(2, '0')}`;
    const response = await getAppointmentsByDoctorDate({
      idDoctor,
      fechaYHora: formattedDate,
    });
    setAppointmentsByDate(response.data);
  }

  async function fetchToday() {
    try {
      const response = await getAppointmentsByDoctorToday({ idDoctor });
      setAppointmentsToday(response.data || []);
    } catch {
      setAppointmentsToday([]);
    }
  }

  return (
    <DoctoresContext.Provider
      value={{
        fetchHistory,
        appointmentHistory,
        dates,
        appointmentsByDate,
        fetchByDate,
        appointmentsToday,
        fetchToday,
      }}
    >
      {children}
    </DoctoresContext.Provider>
  );
};

DoctoresProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export default DoctoresProvider;
