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
    
    // Verificar que el token existe y tiene el formato correcto
    if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
      // Solo limpiar estados si hay algo que limpiar, no navegar si ya estamos en home
      if (rol || dni || idDoctor || idAdmin) {
        console.warn('Token inválido, limpiando sesión');
        localStorage.removeItem('token');
        setDni('');
        setIdDoctor('');
        setIdAdmin('');
        setNombreUsuario('');
        setApellidoUsuario('');
        setRol('');
        navigate('/');
      }
      return;
    }

    try {
      const decoded = jwtDecode(token);
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
          case 'P': // Paciente
            setDni(decoded.dni);
            setNombreUsuario(decoded.nombre || '');
            setApellidoUsuario(decoded.apellido || '');
            setRol('P');
            break;
          case 'D': // Doctor
            setIdDoctor(decoded.idDoctor);
            setNombreUsuario(decoded.nombre || '');
            setApellidoUsuario(decoded.apellido || '');
            setRol('D');
            break;
          case 'A': // Admin
            setIdAdmin(decoded.idAdmin);
            setRol('A');
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
  }

  // Computed userType based on rol for backward compatibility
  const userType = rol;
  
  // Solo logear cuando hay datos significativos (usuario logueado)
  useEffect(() => {
    if (rol && (dni || idDoctor || idAdmin)) {
      console.log('AuthProvider - Usuario logueado:', { rol, userType, dni, idDoctor, idAdmin });
    }
  }, [rol, userType, dni, idDoctor, idAdmin]);

  return (
    <AuthContext.Provider
      value={{
        login,
        comprobarToken,
        dni,
        idDoctor,
        idAdmin,
        rol,
        userType, // Add userType for backward compatibility
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
