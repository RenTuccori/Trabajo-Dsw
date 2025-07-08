import { DoctorsContext } from './DoctorsContext';
import {
  getTurnosHistoricoDoctor,
  getappointmentsByDate,
  gettodayAppointments,
} from '../../api/appointments.api.js';
import { useContext,  useState } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line react-refresh/only-export-components
export const useDoctores = () => {
  const context = useContext(DoctorsContext);
  if (!context) {
    throw new Error('useDoctores must be used within an DoctorsProvider');
  }
  return context;
};
import {useAuth} from '../global/AuthProvider';

const DoctorsProvider = ({ children }) => {
  //proveedor para acceder a los datos de los empleados desde cualquier componente
  const [turnosHist, setTurnosHist] = useState([]);
  const [turnosFecha, setTurnosFecha] = useState([]);
  const [turnosHoy, setTurnosHoy] = useState([]);
  const [dates, setDates] = useState([]);

  const {doctorId} = useAuth();


  async function Historico() {
    try {
      const response = await getTurnosHistoricoDoctor({ doctorId : doctorId });
      console.log(response.data.data)
      console.log('length', response.data.data.length)
      if (response.data && response.data.data.length > 0) {
        setTurnosHist(response.data.data);
        console.log('entre')
        const fechasDisponibles = response.data.data.map(
          (appointment) => new Date(appointment.dateTime.split('T')[0])
        );
        setDates(fechasDisponibles);
      } else {
        console.log('sali por else')
        setTurnosHist([]);
        setDates([]);
      }
    } catch (error) {
      console.log('sali por catch')
      console.error('Error al obtener appointments históricos:', error);
      setTurnosHist([]);
      setDates([]);
    }
  }

  async function Fecha(fecha) {
    const formattedDate = `${fecha.getFullYear()}-${(fecha.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${fecha.getDate().toString().padStart(2, '0')}`;
    const response = await getappointmentsByDate({
      doctorId,
      dateTime: formattedDate,
    });
    setTurnosFecha(response.data);
  }

  async function TurnosHoy() {
    try {
      const response = await gettodayAppointments({ doctorId });
      setTurnosHoy(response.data || []);
    } catch (error) {
      console.error('Error al obtener los appointments de hoy:', error);
      setTurnosHoy([]);
    }
  }

  return (
    <DoctorsContext.Provider
      value={{
        Historico,
        turnosHist,
        dates,
        turnosFecha,
        Fecha,
        turnosHoy,
        TurnosHoy,
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



