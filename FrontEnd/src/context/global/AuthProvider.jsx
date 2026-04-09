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
  const [nationalId, setNationalId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [idAdmin, setIdAdmin] = useState('');
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
            setIdAdmin(decoded.id);
            setRole('Admin');
          }
        } else {
          // Token expired, clear
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Error restoring session:', error);
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
          // Patient login
          response = await getUserDniFecha({
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
          // Doctor login
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
          // Admin login
          response = await getAdmin({
            user: identifier,
            password: credential,
          });
          token = response.data;
          localStorage.setItem('token', token);
          const decodedAdmin = jwtDecode(token);
          setIdAdmin(decodedAdmin.id);
          setRole('Admin');
          navigate('/admin');
          break;
        }
        default:
          throw new Error('Invalid user type');
      }
    } catch (error) {
      // Handle login errors
      console.error('FRONTEND - Login error:', error);
      console.error('FRONTEND - Error details:', error.response?.data);
      console.error('FRONTEND - Status code:', error.response?.status);

      if (userType === 'Patient') {
        setNationalId(null);
        setFirstName('');
        setLastName('');
      } else if (userType === 'Doctor') {
        setDoctorId(null);
        setFirstName('');
        setLastName('');
      } else if (userType === 'Admin') {
        setIdAdmin(null);
      }
      throw error;
    }
  }

  function checkToken(userType) {
    if (localStorage.getItem('token')) {
      try {
        const decoded = jwtDecode(localStorage.getItem('token'));

        if (decoded.exp < Date.now() / 1000) {
          console.error('FRONTEND - Token expired');
          localStorage.removeItem('token');
          // Clear all state
          setNationalId('');
          setDoctorId('');
          setIdAdmin('');
          setFirstName('');
          setLastName('');
          setRole('');
          navigate('/');
        } else {
          switch (userType) {
            case 'Patient': // Patient
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
              setIdAdmin(decoded.id);
              setRole('Admin');
              break;
            default:
              throw new Error('Invalid user type');
          }
        }
      } catch (error) {
        console.error('FRONTEND - Error decoding token:', error);
        // Clear all state after token error
        setNationalId('');
        setDoctorId('');
        setIdAdmin('');
        setFirstName('');
        setLastName('');
        setRole('');
        navigate('/');
      }
    } else {
      // Clear all state when no token
      setNationalId('');
      setDoctorId('');
      setIdAdmin('');
      setFirstName('');
      setLastName('');
      setRole('');
    }
  }

  return (
    <AuthContext.Provider
      value={{
        login,
        checkToken,
        nationalId,
        doctorId,
        idAdmin,
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
