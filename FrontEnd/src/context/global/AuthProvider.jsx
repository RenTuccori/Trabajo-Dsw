import { AuthContext } from './AuthContext.jsx';
import { useCallback, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { verifyDoctor } from '../../api/doctors.api.js';
import { getUserByNationalIdPassword } from '../../api/users.api.js';
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
  const [doctorId, setDoctorId] = useState('');
  const [idAdmin, setIdAdmin] = useState('');
  const [rol, setRol] = useState('');
  const navigate = useNavigate();

  const clearSessionState = useCallback((removeToken = false) => {
    if (removeToken) {
      localStorage.removeItem('token');
    }

    setDni('');
    setDoctorId('');
    setIdAdmin('');
    setNombreUsuario('');
    setApellidoUsuario('');
    setRol('');
  }, []);

  const restoreSessionState = useCallback((decoded) => {
    setDni('');
    setDoctorId('');
    setIdAdmin('');
    setNombreUsuario(decoded.firstName || '');
    setApellidoUsuario(decoded.lastName || '');

    switch (decoded.role) {
      case 'Patient':
        setDni(decoded.nationalId);
        setRol('Patient');
        break;
      case 'Doctor':
        setDoctorId(decoded.doctorId);
        setRol('Doctor');
        break;
      case 'Admin':
        setIdAdmin(decoded.id);
        setNombreUsuario('');
        setApellidoUsuario('');
        setRol('Admin');
        break;
      default:
        clearSessionState(true);
    }
  }, [clearSessionState]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      return;
    }

    try {
      const decoded = jwtDecode(token);

      if (decoded.exp > Date.now() / 1000) {
        restoreSessionState(decoded);
      } else {
        clearSessionState(true);
      }
    } catch (error) {
      console.error('Error al restaurar sesión:', error);
      clearSessionState(true);
    }
  }, [clearSessionState, restoreSessionState]);

  async function login({ identifier, credential, userType }) {
    try {
      let response;
      let token;

      switch (userType) {
        case 'Patient': {
          // Paciente
          response = await getUserByNationalIdPassword({
            dni: identifier,
            password: credential,
          });

          token = response.data;
          localStorage.setItem('token', token);

          const decodedPatient = jwtDecode(token);
          restoreSessionState(decodedPatient);
          navigate('/patient');
          break;
        }
        case 'Doctor': {
          // Doctor
          response = await verifyDoctor({
            dni: identifier,
            password: credential,
          });
          token = response.data;
          localStorage.setItem('token', token);
          const decodedDoctor = jwtDecode(token);
          restoreSessionState(decodedDoctor);
          navigate('/doctor');
          break;
        }
        case 'Admin': {
          // Admin
          response = await getAdmin({
            user: identifier,
            password: credential,
          });
          token = response.data;
          localStorage.setItem('token', token);
          const decodedAdmin = jwtDecode(token);
          restoreSessionState(decodedAdmin);
          navigate('/admin');
          break;
        }
        default:
          throw new Error('Tipo de user no válido');
      }
    } catch (error) {
      // Manejar errores de inicio de sesión
      console.error('💥 FRONTEND - Error en el inicio de sesión:', error);
      console.error('📄 FRONTEND - Detalles del error:', error.response?.data);
      console.error('🔢 FRONTEND - Código de estado:', error.response?.status);

      if (userType === 'Patient') {
        setDni(null);
        setNombreUsuario('');
        setApellidoUsuario('');
      } else if (userType === 'Doctor') {
        setDoctorId(null);
        setNombreUsuario('');
        setApellidoUsuario('');
      } else if (userType === 'Admin') {
        setIdAdmin(null);
      }
      throw error;
    }
  }

  const comprobarToken = useCallback((userType) => {
    const token = localStorage.getItem('token');

    if (!token) {
      clearSessionState();
      return false;
    }

    try {
      const decoded = jwtDecode(token);

      if (decoded.exp < Date.now() / 1000) {
        console.error('⏰ FRONTEND - Token expired');
        clearSessionState(true);
        navigate('/');
        return false;
      }

      restoreSessionState(decoded);

      if (userType && decoded.role !== userType) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('💥 FRONTEND - Error decoding token:', error);
      clearSessionState(true);
      navigate('/');
      return false;
    }
  }, [clearSessionState, navigate, restoreSessionState]);


  return (
    <AuthContext.Provider
      value={{
        login,
        comprobarToken,
        dni,
        doctorId,
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
