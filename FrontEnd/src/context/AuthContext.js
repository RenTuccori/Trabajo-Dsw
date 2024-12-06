import { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { getAdmin } from '../../api/admin.api'; // Función de login

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [idAdmin, setIdAdmin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    comprobarToken();
  }, []);

  const login = async ({ usuario, contra }) => {
    try {
      const response = await getAdmin({ usuario, contra });
      const token = response.data;
      localStorage.setItem('token', token);
      const decoded = jwtDecode(token);
      setIdAdmin(decoded.idAdmin);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIdAdmin('');
    setIsAuthenticated(false);
    navigate('/');
  };

  const comprobarToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp < Date.now() / 1000) {
          console.error('Token expirado');
          logout();
        } else {
          setIdAdmin(decoded.idAdmin);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        logout();
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        idAdmin,
        isAuthenticated,
        login,
        logout,
        comprobarToken,
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
