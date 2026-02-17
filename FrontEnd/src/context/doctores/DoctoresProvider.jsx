import { DoctoresContext } from './DoctoresContext';
import {
  getTurnosHistoricoDoctor,
  getTurnosDoctorFecha,
  getTurnosDoctorHoy,
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
  //proveedor para acceder a los datos de los empleados desde cualquier componente
  const [turnosHist, setTurnosHist] = useState([]);
  const [turnosFecha, setTurnosFecha] = useState([]);
  const [turnosHoy, setTurnosHoy] = useState([]);
  const [fechas, setFechas] = useState([]);

  const {idDoctor} = useAuth();


  async function Historico() {
    try {
      const response = await getTurnosHistoricoDoctor({ idDoctor : idDoctor });
      if (response.data && response.data.data.length > 0) {
        setTurnosHist(response.data.data);
        const fechasDisponibles = response.data.data.map(
          (turno) => new Date(turno.fechaYHora.split('T')[0])
        );
        setFechas(fechasDisponibles);
      } else {
        setTurnosHist([]);
        setFechas([]);
      }
    } catch {
      setTurnosHist([]);
      setFechas([]);
    }
  }

  async function Fecha(fecha) {
    const formattedDate = `${fecha.getFullYear()}-${(fecha.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${fecha.getDate().toString().padStart(2, '0')}`;
    const response = await getTurnosDoctorFecha({
      idDoctor,
      fechaYHora: formattedDate,
    });
    setTurnosFecha(response.data);
  }

  async function TurnosHoy() {
    try {
      const response = await getTurnosDoctorHoy({ idDoctor });
      setTurnosHoy(response.data || []);
    } catch {
      setTurnosHoy([]);
    }
  }

  return (
    <DoctoresContext.Provider
      value={{
        Historico,
        turnosHist,
        fechas,
        turnosFecha,
        Fecha,
        turnosHoy,
        TurnosHoy,
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
