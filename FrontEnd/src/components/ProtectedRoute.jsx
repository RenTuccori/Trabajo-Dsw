import { useEffect } from 'react';
import { useAuth } from '../context/global/AuthProvider';
import PropTypes from 'prop-types';

export function ProtectedRoute({ children, requiredRole }) {
  const { checkToken } = useAuth();

  useEffect(() => {
    if (requiredRole) {
      checkToken(requiredRole);
    }
  }, [checkToken, requiredRole]);

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string.isRequired,
};


