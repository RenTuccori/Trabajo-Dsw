import { AdministracionContext } from './AdministracionContext';
import {
  getAdmin, createSede, deleteSede, createSpecialty, deleteSpecialty, createObraSocial, deleteObraSocial, updateObraSocial,
  createSeEspDoc
} from '../../api/admin.api.js'; // Asegúrate de tener una función para crear la sede en la API
import { useContext, useEffect, useState } from 'react';
import { getSedes } from '../../api/sedes.api.js';
import { getEspecialidades, getAllSpecialities } from '../../api/especialidades.api';
import { getDoctores } from '../../api/doctores.api';
import { getObrasSociales } from '../../api/obrasociales.api.js';
import { jwtDecode } from "jwt-decode";
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line react-refresh/only-export-components
export const useAdministracion = () => {
  const context = useContext(AdministracionContext);
  if (!context) {
    throw new Error(
      'useAdministracion must be used within an AdministracionProvider',
    );
  }
  return context;
};

const AdministracionProvider = ({ children }) => {
  const [idAdmin, setIdAdmin] = useState('');
  const [sedes, setSedes] = useState([]); // Estado para almacenar las sedes
  const [especialidades, setEspecialidades] = useState('');
  const [obrasSociales, setObrasSociales] = useState('');
  const [doctores, setDoctores] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedEspecialidad, setSelectedEspecialidad] = useState(null);
  const [selectedSede, setSelectedSede] = useState(null);
  const navigate = useNavigate(); // Hook de React Router para navegar entre rutas

  useEffect(() => {
    comprobarToken();
    // Podrías llamar a una función para obtener las sedes al cargar el componente
  }, []);

  async function login({ usuario, contra }) {
    const response = await getAdmin({ usuario, contra });
    const token = response.data;
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    setIdAdmin(decoded.idAdmin);
    //window.location.reload(); // Recarga la página para que se actualice el rol globalmente en los componentes hijos
  }

  function comprobarToken() {
    if (localStorage.getItem('token')) {
      try {
        const decoded = jwtDecode(localStorage.getItem('token'));
        if (decoded.exp < Date.now() / 1000) {
          console.error('Token expired');
          localStorage.removeItem('token');
          navigate('/')
        } else {
          setIdAdmin(decoded.idAdmin);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token');
        navigate('/')
      }
    } else {
      setIdAdmin('');
    }
  }

  //Sede
  async function crearNuevaSede({ nombre, direccion }) {
    try {
      const response = await createSede({ nombre, direccion }); // Llamada a la API
      console.log('Sede creada:', response.data);
    } catch (error) {
      console.error('Error al crear la sede:', error);
    }
  }
  async function ObtenerSedes() {
    const response = await getSedes();
    setSedes(response.data);
  }

  async function borrarSede(idSede) {
    try {
      const response = await deleteSede(idSede); // Llamada a la API
      console.log('Sede borrada:', response.data);
    } catch (error) {
      console.error('Error al borrar la sede:', error);
    }
  }

  //Especialidad
  async function ObtenerEspecialidades({ idSede }) {
    const response = await getEspecialidades({ idSede });
    setEspecialidades(response.data);
  }
  async function crearEspecialidad({ nombre }) {
    try {
      const response = await createSpecialty({ nombre });
      console.log('Especialidad creada:', response.data);
    } catch (error) {
      console.error('Error al obtener las sedes:', error);
    }
  }
  async function borrarEspecialidad(idEspecialidad) {
    try {
      const response = await deleteSpecialty(idEspecialidad); // Llamada a la API
      console.log('Especialidad borrada:', response.data);
    } catch (error) {
      console.error('Error al borrar la especialidad:', error);
    }
  }
  async function ObtenerEspecialidadesDisponibles() {
    const response = await getAllSpecialities();
    setEspecialidades(response.data);
  }

  //Doctor
  async function ObtenerDoctores() {
    const response = await getDoctores();
    setDoctores(response.data);
  }

  //Obra Social
  async function crearObraSocial({ nombre }) {
    try {
      const response = await createObraSocial({ nombre });
      console.log('Obra Social creada:', response.data);
    } catch (error) {
      console.error('Error al obtener las sedes:', error);
    }
  }

  async function ObtenerOS() {
    try {
      const response = await getObrasSociales();
      setObrasSociales(response.data);
    } catch (error) {
      console.error('Error al obtener las sedes:', error);
    }
  }

  async function borrarObraSocial(idObraSocial) {
    try {
      const response = await deleteObraSocial(idObraSocial); // Llamada a la API
      console.log('Obra Social borrada:', response.data);
    } catch (error) {
      console.error('Error al borrar la obra social:', error);
    }
  }

  async function actualizarObraSocial({ idObraSocial, nombre }) {
    try {
      console.log('idObraSocial:', idObraSocial, 'nombre:', nombre);
      const response = await updateObraSocial({ idObraSocial, nombre });
      console.log('Obra Social actualizada:', response.data);
    } catch (error) {
      console.error('Error al actualizar la obra social:', error);
    }
  }

  //Combinaciones de sede, especialidad y doctor
  async function crearSedEspDoc({ idSede, idEspecialidad, idDoctor }) {
    try {
      const response = await createSeEspDoc({ idSede, idEspecialidad, idDoctor });
      console.log('Sede, especialidad y doctor creados:', response.data);
    } catch (error) {
      console.error('Error al obtener las sedes:', error);
    }
  }

  return (
    <AdministracionContext.Provider
      value={{
        login, comprobarToken, idAdmin, sedes, crearNuevaSede, ObtenerSedes, borrarSede, crearEspecialidad, especialidades, setEspecialidades,
        borrarEspecialidad, crearObraSocial, ObtenerOS, obrasSociales, borrarObraSocial, actualizarObraSocial, crearSedEspDoc, ObtenerEspecialidades,
        ObtenerDoctores, doctores, selectedDoctor, setSelectedDoctor, selectedEspecialidad, setSelectedEspecialidad, selectedSede, setSelectedSede,
        ObtenerEspecialidadesDisponibles
      }}>
      {children}
    </AdministracionContext.Provider>
  );
};

AdministracionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdministracionProvider;
