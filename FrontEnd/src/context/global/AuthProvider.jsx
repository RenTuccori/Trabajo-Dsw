import { AuthContext } from './AuthContext.jsx';
import { useContext, useState, useEffect } from 'react';
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
  const [nationalId, setNationalId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [adminId, setAdminId] = useState('');
  const [role, setRole] = useState('');
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
            setNationalId(decoded.nationalId);
            setFirstName(decoded.firstName || '');
            setLastName(decoded.lastName || '');
            setRole('Patient');
          } else if (decoded.role === 'Doctor') {
            setDoctorId(decoded.doctorId);
            setFirstName(decoded.firstName || '');
            setLastName(decoded.lastName || '');
            setRole('Doctor');
          } else if (decoded.role === 'Admin') {
            console.log('AuthProvider: restored admin from token, id=', decoded.id);
            setAdminId(decoded.id);
            setRole('Admin');
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
          response = await getUserByNationalIdPassword({
            nationalId: identifier,
            password: credential,
          });

          token = response.data;
          localStorage.setItem('token', token);

          const decodedPatient = jwtDecode(token);

          setNationalId(decodedPatient.nationalId);
          setFirstName(decodedPatient.firstName || '');
          setLastName(decodedPatient.lastName || '');
          setRole('Patient');
          navigate('/patient');
          break;
        }
        case 'Doctor': {
          // Doctor
          response = await verifyDoctor({
            nationalId: identifier,
            password: credential,
          });
          token = response.data;
          localStorage.setItem('token', token);
          const decodedDoctor = jwtDecode(token);
          setDoctorId(decodedDoctor.doctorId);
          setFirstName(decodedDoctor.firstName || '');
          setLastName(decodedDoctor.lastName || '');
          setRole('Doctor');
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
          setAdminId(decodedAdmin.id);
          setRole('Admin');
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
        setNationalId(null);
        setFirstName('');
        setLastName('');
      } else if (userType === 'Doctor') {
        setDoctorId(null);
        setFirstName('');
        setLastName('');
      } else if (userType === 'Admin') {
        setAdminId(null);
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
          setNationalId('');
          setDoctorId('');
          setAdminId('');
          setFirstName('');
          setLastName('');
          setRole('');
          navigate('/');
        } else {
          switch (userType) {
            case 'Patient': // Paciente
              setNationalId(decoded.nationalId);
              setFirstName(decoded.firstName || '');
              setLastName(decoded.lastName || '');
              setRole('Patient');
              break;
            case 'Doctor': // Doctor
              setDoctorId(decoded.doctorId);
              setFirstName(decoded.firstName || '');
              setLastName(decoded.lastName || '');
              setRole('Doctor');
              break;
            case 'Admin': // Admin
              setAdminId(decoded.id);
              setRole('Admin');
              break;
            default:
              throw new Error('Tipo de user no válido');
          }
        }
      } catch (error) {
        console.error('💥 FRONTEND - Error decoding token:', error);
        localStorage.removeItem('token');
        // Limpiar todos los estados
        setNationalId('');
        setDoctorId('');
        setAdminId('');
        setFirstName('');
        setLastName('');
        setRole('');
        navigate('/');
      }
    } else {
      // Limpiar todos los estados cuando no hay token
      setNationalId('');
      setDoctorId('');
      setAdminId('');
      setFirstName('');
      setLastName('');
      setRole('');
    }
  }

  return (
    <AuthContext.Provider
      value={{
        login,
        comprobarToken,
        nationalId,
        doctorId,
        adminId,
        role,
        firstName,
        lastName,
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
