import { AuthContext } from './AuthContext.jsx';
import { useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { verifyDoctor } from '../../api/doctores.api.js';
import { getUserDniFecha } from '../../api/usuarios.api.js';
import { getAdmin } from '../../api/admin.api.js';
import { USER_TYPES } from '../../constants/userTypes.js';
import { notifyError } from '../../utils/notifications.js';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const clearAuthState = (setters) => {
  setters.setDni('');
  setters.setIdDoctor('');
  setters.setIdAdmin('');
  setters.setNombreUsuario('');
  setters.setApellidoUsuario('');
  setters.setRol('');
};

const AuthProvider = ({ children }) => {
  const [dni, setDni] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [apellidoUsuario, setApellidoUsuario] = useState('');
  const [idDoctor, setIdDoctor] = useState('');
  const [idAdmin, setIdAdmin] = useState('');
  const [rol, setRol] = useState('');
  const navigate = useNavigate();

  const stateSetters = { setDni, setIdDoctor, setIdAdmin, setNombreUsuario, setApellidoUsuario, setRol };

  const restoreSessionByRole = (decoded) => {
    switch (decoded.rol) {
      case USER_TYPES.PATIENT:
        setDni(decoded.dni);
        setNombreUsuario(decoded.nombre || '');
        setApellidoUsuario(decoded.apellido || '');
        setRol(USER_TYPES.PATIENT);
        break;
      case USER_TYPES.DOCTOR:
        setIdDoctor(decoded.idDoctor);
        setNombreUsuario(decoded.nombre || '');
        setApellidoUsuario(decoded.apellido || '');
        setRol(USER_TYPES.DOCTOR);
        break;
      case USER_TYPES.ADMIN:
        setIdAdmin(decoded.idAdmin);
        setRol(USER_TYPES.ADMIN);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp > Date.now() / 1000) {
          restoreSessionByRole(decoded);
        } else {
          localStorage.removeItem('token');
        }
      } catch {
        localStorage.removeItem('token');
      }
    }
  }, []);

  async function login({ identifier, credential, userType }) {
    try {
      let response;
      let token;

      switch (userType) {
        case USER_TYPES.PATIENT: {
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
          setRol(USER_TYPES.PATIENT);
          break;
        }
        case USER_TYPES.DOCTOR: {
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
          setRol(USER_TYPES.DOCTOR);
          break;
        }
        case USER_TYPES.ADMIN: {
          response = await getAdmin({
            usuario: identifier,
            contra: credential,
          });
          token = response.data;
          localStorage.setItem('token', token);
          const decodedAdmin = jwtDecode(token);
          setIdAdmin(decodedAdmin.idAdmin);
          setRol(USER_TYPES.ADMIN);
          break;
        }
        default:
          throw new Error('Tipo de usuario no válido');
      }
    } catch (error) {
      if (userType === USER_TYPES.PATIENT) {
        setDni(null);
        setNombreUsuario('');
        setApellidoUsuario('');
      } else if (userType === USER_TYPES.DOCTOR) {
        setIdDoctor(null);
        setNombreUsuario('');
        setApellidoUsuario('');
      } else if (userType === USER_TYPES.ADMIN) {
        setIdAdmin(null);
      }

      const errorMessage =
        error?.response?.data?.message || 'Credenciales inválidas. Verifique sus datos.';
      notifyError(errorMessage);
      throw error;
    }
  }

  function comprobarToken(userType) {
    if (localStorage.getItem('token')) {
      try {
        const decoded = jwtDecode(localStorage.getItem('token'));
        if (decoded.exp < Date.now() / 1000) {
          localStorage.removeItem('token');
          clearAuthState(stateSetters);
          navigate('/');
        } else {
          restoreSessionByRole({ ...decoded, rol: userType });
        }
      } catch {
        localStorage.removeItem('token');
        clearAuthState(stateSetters);
        navigate('/');
      }
    } else {
      clearAuthState(stateSetters);
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
