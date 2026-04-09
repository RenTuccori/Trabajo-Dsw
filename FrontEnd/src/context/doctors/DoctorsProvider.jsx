import { DoctorsContext } from './DoctorsContext';
import {
  getHistoricalAppointmentsDoctor,
  getAppointmentsByDate,
  getTodayAppointments,
} from '../../api/appointments.api.js';
import { useContext,  useState } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line react-refresh/only-export-components
export const useDoctors = () => {
  const context = useContext(DoctorsContext);
  if (!context) {
    throw new Error('useDoctors must be used within an DoctorsProvider');
  }
  return context;
};
import {useAuth} from '../global/AuthProvider';

const DoctorsProvider = ({ children }) => {
  const [historicalAppointments, setHistoricalAppointments] = useState([]);
  const [appointmentsByDate, setAppointmentsByDate] = useState([]);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);

  const {doctorId} = useAuth();


  async function loadHistoricalAppointments() {
    try {
      const response = await getHistoricalAppointmentsDoctor({ doctorId : doctorId });
      if (response.data && response.data.data.length > 0) {
        const mapped = response.data.data.map((appointment) => ({
          ...appointment,
          nationalId: appointment.nationalId,
          patientName: appointment.patientName ?? appointment.fullName,
        }));

        setHistoricalAppointments(mapped);
        const uniqueDates = new Set(
          mapped.map((appointment) => appointment.dateTime.split('T')[0])
        );

        const normalizedAvailableDates = Array.from(uniqueDates).map((dateStr) => {
          const [year, month, day] = dateStr.split('-').map(Number);
          // Build local date to avoid UTC parsing offset issues.
          return new Date(year, month - 1, day);
        });

        setAvailableDates(normalizedAvailableDates);
      } else {
        setHistoricalAppointments([]);
        setAvailableDates([]);
      }
    } catch (error) {
      console.error('Error getting historical appointments:', error);
      setHistoricalAppointments([]);
      setAvailableDates([]);
    }
  }

  async function loadAppointmentsByDate(date) {
    if (!date) {
      setAppointmentsByDate([]);
      return;
    }

    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    try {
      const response = await getAppointmentsByDate({
        doctorId,
        dateTime: formattedDate,
      });
      setAppointmentsByDate(response?.data || []);
    } catch (error) {
      console.error('Error getting appointments by date:', error);
      setAppointmentsByDate([]);
    }
  }

  async function loadTodayAppointments() {
    try {
      const response = await getTodayAppointments({ doctorId });
      setTodayAppointments(response.data || []);
    } catch (error) {
      console.error('Error getting today appointments:', error);
      setTodayAppointments([]);
    }
  }

  return (
    <DoctorsContext.Provider
      value={{
        loadHistoricalAppointments,
        historicalAppointments,
        availableDates,
        appointmentsByDate,
        loadAppointmentsByDate,
        todayAppointments,
        loadTodayAppointments,
      }}
    >
      {children}
    </DoctorsContext.Provider>
  );
};

DoctorsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export default DoctorsProvider;



