import { DoctoresContext } from './DoctoresContext';
import { verifyDoctor } from '../../api/doctores.api.js';
import {
  getTurnosHistoricoDoctor,
  getTurnosDoctorFecha,
  getTurnosDoctorHoy,
} from '../../api/turnos.api.js';
import { useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line react-refresh/only-export-components
export const useDoctores = () => {
  const context = useContext(DoctoresContext);
  if (!context) {
    throw new Error('useDoctores must be used within an DoctoresProvider');
  }
  return context;
};

const DoctoresProvider = ({ children }) => {
  //proveedor para acceder a los datos de los empleados desde cualquier componente
  const navigate = useNavigate();
  const [idDoctor, setidDoctor] = useState('');
  const [turnosHist, setTurnosHist] = useState([]);
  const [turnosFecha, setTurnosFecha] = useState([]);
  const [turnosHoy, setTurnosHoy] = useState([]);
  const [fechas, setFechas] = useState([]);

  useEffect(() => {
    comprobarToken();
  }, []);

  async function login({ dni, contra }) {
    const response = await verifyDoctor({ dni, contra });
    const token = response.data;
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    setidDoctor(decoded.idDoctor);
  }

  function comprobarToken() {
    if (localStorage.getItem('token')) {
      try {
        const decoded = jwtDecode(localStorage.getItem('token'));
        if (decoded.exp < Date.now() / 1000) {
          console.error('Token expired');
          localStorage.removeItem('token');
          navigate('/');
        } else {
          setidDoctor(decoded.idDoctor);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token');
        navigate('/');
      }
    } else {
      setidDoctor('');
    }
  }

  async function Historico() {
    try {
      const response = await getTurnosHistoricoDoctor({ idDoctor });
      if (response.data && response.data.length > 0) {
        setTurnosHist(response.data);
        const fechasDisponibles = response.data.map(
          (turno) => new Date(turno.fechaYHora.split('T')[0])
        );
        setFechas(fechasDisponibles);
      } else {
        setTurnosHist([]);
        setFechas([]);
      }
    } catch (error) {
      console.error('Error al obtener turnos históricos:', error);
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
    } catch (error) {
      console.error('Error al obtener los turnos de hoy:', error);
      setTurnosHoy([]);
    }
  }

  return (
    <DoctoresContext.Provider
      value={{
        login,
        comprobarToken,
        Historico,
        turnosHist,
        idDoctor,
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
