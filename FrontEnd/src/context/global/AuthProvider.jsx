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
          if (decoded.rol === 'P') {
            setDni(decoded.dni);
            setNombreUsuario(decoded.nombre || '');
            setApellidoUsuario(decoded.apellido || '');
            setRol('P');
          } else if (decoded.rol === 'D') {
            setIdDoctor(decoded.idDoctor);
            setNombreUsuario(decoded.nombre || '');
            setApellidoUsuario(decoded.apellido || '');
            setRol('D');
          } else if (decoded.rol === 'A') {
            setIdAdmin(decoded.idAdmin);
            setRol('A');
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

    // Escuchar eventos de token expirado desde axios interceptor
    const handleTokenExpired = () => {
      setDni('');
      setIdDoctor('');
      setIdAdmin('');
      setNombreUsuario('');
      setApellidoUsuario('');
      setRol('');
    };

    window.addEventListener('tokenExpired', handleTokenExpired);

    return () => {
      window.removeEventListener('tokenExpired', handleTokenExpired);
    };
  }, []);

  async function login({ identifier, credential, userType }) {
    try {
      let response;
      let token;

      switch (userType) {
        case 'P': {
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
          setRol('P');
          break;
        }
        case 'D': {
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
          setRol('D');
          break;
        }
        case 'A': {
          // Admin
          response = await getAdmin({
            usuario: identifier,
            contra: credential,
          });
          token = response.data;
          localStorage.setItem('token', token);
          const decodedAdmin = jwtDecode(token);
          setIdAdmin(decodedAdmin.idAdmin);
          setRol('A');
          break;
        }
        default:
          throw new Error('Tipo de usuario no válido');
      }
    } catch (error) {
      // Manejar errores de inicio de sesión
      console.error('Error en el inicio de sesión:', error);
      if (userType === 'P') {
        setDni(null);
        setNombreUsuario('');
        setApellidoUsuario('');
      } else if (userType === 'D') {
        setIdDoctor(null);
        setNombreUsuario('');
        setApellidoUsuario('');
      } else if (userType === 'A') setIdAdmin(null);
      throw error;
    }
  }

  function comprobarToken(userType) {
    const token = localStorage.getItem('token');
    if (!token) {
      // No hay token, limpiar estados y redirigir
      setDni('');
      setIdDoctor('');
      setIdAdmin('');
      setNombreUsuario('');
      setApellidoUsuario('');
      setRol('');
      navigate('/');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.exp < Date.now() / 1000) {
        // Token expirado, limpiar y redirigir
        localStorage.removeItem('token');
        setDni('');
        setIdDoctor('');
        setIdAdmin('');
        setNombreUsuario('');
        setApellidoUsuario('');
        setRol('');
        navigate('/');
        return;
      }

      // Token válido, verificar que el tipo de usuario coincida
      if (decoded.rol !== userType) {
        console.error('Tipo de usuario no coincide con el token');
        navigate('/');
        return;
      }

      // El resto de la validación la maneja el interceptor de axios
    } catch (error) {
      console.error('Error decoding token:', error);
      localStorage.removeItem('token');
      setDni('');
      setIdDoctor('');
      setIdAdmin('');
      setNombreUsuario('');
      setApellidoUsuario('');
      setRol('');
      navigate('/');
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
