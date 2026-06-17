import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/global/AuthProvider';
import PropTypes from 'prop-types';

export function ProtectedRoute({ children, requiredRole }) {
  const { comprobarToken } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    setIsAuthorized(comprobarToken(requiredRole));
  }, [comprobarToken, requiredRole]);

  if (isAuthorized === null) {
    return null;
  }

  if (!isAuthorized) {
    return (
      <div className="page-bg flex items-center justify-center p-6 min-h-[80vh]">
        <div className="max-w-md w-full glass-solid rounded-3xl overflow-hidden animate-slide-up">
          <div className="bg-gradient-to-r from-coral-500 to-rose-500 px-6 py-5 flex items-center justify-center">
            <svg
              className="h-6 w-6 text-white mr-2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h1 className="text-xl font-bold text-white">Acceso Denegado</h1>
          </div>
          <div className="px-6 py-6">
            <p className="text-gray-600 text-center mb-6">
              No tenés permisos para acceder a esta página.
            </p>
            <Link
              to="/"
              className="btn-primary block text-center"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string.isRequired,
};


