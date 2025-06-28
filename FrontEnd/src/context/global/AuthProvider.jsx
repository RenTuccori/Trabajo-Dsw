import { AuthContext } from './AuthContext.jsx';
import { useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { verifyDoctor } from '../../api/doctores.api.js';
import { getUserDniFecha } from '../../api/usuarios.api.js';
import { getAdmin } from '../../api/admin.api.js';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [dni, setDni] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [apellidoUsuario, setApellidoUsuario] = useState('');
  const [idDoctor, setIdDoctor] = useState('');
  const [idAdmin, setIdAdmin] = useState('');
  const [rol, setRol] = useState('');
  const navigate = useNavigate();

  // Inicializar estado desde localStorage al montar el componente
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp > Date.now() / 1000) {
          // Token válido, restaurar estado según el rol del token
          if (decoded.rol === 'Patient') {
            setDni(decoded.dni);
            setNombreUsuario(decoded.nombre || '');
            setApellidoUsuario(decoded.apellido || '');
            setRol('Patient');
          } else if (decoded.rol === 'Doctor') {
            setIdDoctor(decoded.idDoctor);
            setNombreUsuario(decoded.nombre || '');
            setApellidoUsuario(decoded.apellido || '');
            setRol('Doctor');
          } else if (decoded.rol === 'Admin') {
            setIdAdmin(decoded.idAdmin);
            setRol('Admin');
          }
        } else {
          // Token expirado, limpiar
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Error al restaurar sesión:', error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  async function login({ identifier, credential, userType }) {
    try {
      let response;
      let token;

      switch (userType) {
        case 'Patient': {
          // Paciente
          response = await getUserDniFecha({
            dni: identifier,
            fechaNacimiento: credential,
          });
          token = response.data;
          localStorage.setItem('token', token);
          const decodedPatient = jwtDecode(token);
          setDni(decodedPatient.dni);
          setNombreUsuario(decodedPatient.nombre || '');
          setApellidoUsuario(decodedPatient.apellido || '');
          setRol('Patient');
          break;
        }
        case 'Doctor': {
          // Doctor
          response = await verifyDoctor({
            dni: identifier,
            contra: credential,
          });
          token = response.data;
          localStorage.setItem('token', token);
          const decodedDoctor = jwtDecode(token);
          setIdDoctor(decodedDoctor.idDoctor);
          setNombreUsuario(decodedDoctor.nombre || '');
          setApellidoUsuario(decodedDoctor.apellido || '');
          setRol('Doctor');
          break;
        }
        case 'Admin': {
          // Admin
          response = await getAdmin({
            usuario: identifier,
            contra: credential,
          });
          token = response.data;
          localStorage.setItem('token', token);
          const decodedAdmin = jwtDecode(token);
          setIdAdmin(decodedAdmin.idAdmin);
          setRol('Admin');
          break;
        }
        default:
          throw new Error('Tipo de usuario no válido');
      }
    } catch (error) {
      // Manejar errores de inicio de sesión
      console.error('Error en el inicio de sesión:', error);
      if (userType === 'Patient') {
        setDni(null);
        setNombreUsuario('');
        setApellidoUsuario('');
      } else if (userType === 'Doctor') {
        setIdDoctor(null);
        setNombreUsuario('');
        setApellidoUsuario('');
      } else if (userType === 'Admin') setIdAdmin(null);
      throw error;
    }
  }

  function comprobarToken(userType) {
    if (localStorage.getItem('token')) {
      try {
        const decoded = jwtDecode(localStorage.getItem('token'));
        if (decoded.exp < Date.now() / 1000) {
          console.error('Token expired');
          localStorage.removeItem('token');
          // Limpiar todos los estados
          setDni('');
          setIdDoctor('');
          setIdAdmin('');
          setNombreUsuario('');
          setApellidoUsuario('');
          setRol('');
          navigate('/');
        } else {
          switch (userType) {
            case 'Patient': // Paciente
              setDni(decoded.dni);
              setNombreUsuario(decoded.nombre || '');
              setApellidoUsuario(decoded.apellido || '');
              setRol('Patient');
              break;
            case 'Doctor': // Doctor
              setIdDoctor(decoded.idDoctor);
              setNombreUsuario(decoded.nombre || '');
              setApellidoUsuario(decoded.apellido || '');
              setRol('Doctor');
              break;
            case 'Admin': // Admin
              setIdAdmin(decoded.idAdmin);
              setRol('Admin');
              break;
            default:
              throw new Error('Tipo de usuario no válido');
          }
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token');
        // Limpiar todos los estados
        setDni('');
        setIdDoctor('');
        setIdAdmin('');
        setNombreUsuario('');
        setApellidoUsuario('');
        setRol('');
        navigate('/');
      }
    } else {
      // Limpiar todos los estados cuando no hay token
      setDni('');
      setIdDoctor('');
      setIdAdmin('');
      setNombreUsuario('');
      setApellidoUsuario('');
      setRol('');
    }
  }

  return (
    <AuthContext.Provider
      value={{
        login,
        comprobarToken,
        dni,
        idDoctor,
        idAdmin,
        rol,
        nombreUsuario,
        apellidoUsuario,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
