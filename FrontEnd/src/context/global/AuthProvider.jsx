import { AuthContext } from './AuthContext.jsx';
import { useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { verifyDoctor } from '../../api/doctors.api.js';
import { getUserDniFecha } from '../../api/users.api.js';
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

  useEffect(() => {
    // Initialize status from localStorage when component mounts
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp > Date.now() / 1000) {
          // Valid token, restore status based on token role
          if (decoded.role === 'Patient') {
            setDni(decoded.nationalId);
            setNombreUsuario(decoded.firstName || '');
            setApellidoUsuario(decoded.lastName || '');
            setRol('Patient');
          } else if (decoded.role === 'Doctor') {
            setDoctorId(decoded.doctorId);
            setNombreUsuario(decoded.firstName || '');
            setApellidoUsuario(decoded.lastName || '');
            setRol('Doctor');
          } else if (decoded.role === 'Admin') {
            console.log('AuthProvider: restored admin from token, id=', decoded.id);
            setIdAdmin(decoded.id);
            setRol('Admin');
          }
        } else {
          // Token expired, clear
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
            password: credential,
          });

          token = response.data;
          localStorage.setItem('token', token);

          const decodedPatient = jwtDecode(token);

          setDni(decodedPatient.nationalId);
          setNombreUsuario(decodedPatient.firstName || '');
          setApellidoUsuario(decodedPatient.lastName || '');
          setRol('Patient');
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
          setDoctorId(decodedDoctor.doctorId);
          setNombreUsuario(decodedDoctor.firstName || '');
          setApellidoUsuario(decodedDoctor.lastName || '');
          setRol('Doctor');
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
          console.log('AuthProvider: login decoded admin id=', decodedAdmin.id);
          setIdAdmin(decodedAdmin.id);
          setRol('Admin');
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

  function comprobarToken(userType) {
    if (localStorage.getItem('token')) {
      try {
        const decoded = jwtDecode(localStorage.getItem('token'));

        if (decoded.exp < Date.now() / 1000) {
          console.error('⏰ FRONTEND - Token expired');
          localStorage.removeItem('token');
          // Limpiar todos los estados
          setDni('');
          setDoctorId('');
          setIdAdmin('');
          setNombreUsuario('');
          setApellidoUsuario('');
          setRol('');
          navigate('/');
        } else {
          switch (userType) {
            case 'Patient': // Paciente
              setDni(decoded.nationalId);
              setNombreUsuario(decoded.firstName || '');
              setApellidoUsuario(decoded.lastName || '');
              setRol('Patient');
              break;
            case 'Doctor': // Doctor
              setDoctorId(decoded.doctorId);
              setNombreUsuario(decoded.firstName || '');
              setApellidoUsuario(decoded.lastName || '');
              setRol('Doctor');
              break;
            case 'Admin': // Admin
              setIdAdmin(decoded.id);
              setRol('Admin');
              break;
            default:
              throw new Error('Tipo de user no válido');
          }
        }
      } catch (error) {
        console.error('💥 FRONTEND - Error decoding token:', error);
        localStorage.removeItem('token');
        // Limpiar todos los estados
        setDni('');
        setDoctorId('');
        setIdAdmin('');
        setNombreUsuario('');
        setApellidoUsuario('');
        setRol('');
        navigate('/');
      }
    } else {
      // Limpiar todos los estados cuando no hay token
      setDni('');
      setDoctorId('');
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
