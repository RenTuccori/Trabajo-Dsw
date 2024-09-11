import { AdministracionContext } from './AdministracionContext';
import { getAdmin, createSede, deleteSede } from '../../api/admin.api.js'; // Asegúrate de tener una función para crear la sede en la API
import { useContext, useEffect, useState } from 'react';
import { getSedes } from '../../api/sedes.api.js'; // Asegúrate de tener una función para obtener las sedes en la API
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

  // Función para crear una nueva sede
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




  return (
    <AdministracionContext.Provider
      value={{ login, comprobarToken, idAdmin, sedes, crearNuevaSede, ObtenerSedes, borrarSede }}>
      {children}
    </AdministracionContext.Provider>
  );
};

AdministracionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdministracionProvider;
