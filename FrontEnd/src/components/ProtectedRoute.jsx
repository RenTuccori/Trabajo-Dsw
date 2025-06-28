import { useEffect } from 'react';
import { useAuth } from '../context/global/AuthProvider';
import PropTypes from 'prop-types';

export function ProtectedRoute({ children, requiredRole }) {
  const { comprobarToken } = useAuth();

  useEffect(() => {
    if (requiredRole) {
      comprobarToken(requiredRole);
    }
  }, [comprobarToken, requiredRole]);

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string.isRequired,
};


