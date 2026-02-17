import { Routes, Route } from 'react-router-dom';
import AdministracionProvider from '../context/administracion/AdministracionProvider.jsx';
import HomeAdministracion from '../pages/administration/HomeAdministracion.jsx';
import { CrearSede } from '../pages/administration/CrearSede.jsx';
import { CrearEspecialidad } from '../pages/administration/CrearEspecialidad.jsx';
import { CrearObraSocial } from '../pages/administration/CrearObraSocial.jsx';
import { CrearCombinacion } from '../pages/administration/CrearCombinacion.jsx';
import { CrearDoctor } from '../pages/administration/CrearDoctor.jsx';
import { ActualizarDoctor } from '../pages/administration/ActualizarDoctor.jsx';
import { CrearHorarios } from '../pages/administration/CrearHorarios.jsx';
import { Validacion } from './Validacion.jsx';
import { ProtectedRoute } from '../components/ProtectedRoute.jsx';
import { useAuth } from '../context/global/AuthProvider.jsx';
import { USER_TYPES } from '../constants/userTypes.js';

export function AdministracionRoutes() {
  const { rol } = useAuth();

  return (
    <AdministracionProvider>
      <Routes>
        <Route path="/" element={<HomeAdministracion />} />
        <Route
          path="/crearSede"
          element={
            <Validacion rol={rol} expected={USER_TYPES.ADMIN}>
              <ProtectedRoute requiredRole={USER_TYPES.ADMIN}>
                <CrearSede />
              </ProtectedRoute>
            </Validacion>
          }
        />
        <Route
          path="/crearEsp"
          element={
            <Validacion rol={rol} expected={USER_TYPES.ADMIN}>
              <ProtectedRoute requiredRole={USER_TYPES.ADMIN}>
                <CrearEspecialidad />
              </ProtectedRoute>
            </Validacion>
          }
        />
        <Route
          path="/crearOS"
          element={
            <Validacion rol={rol} expected={USER_TYPES.ADMIN}>
              <ProtectedRoute requiredRole={USER_TYPES.ADMIN}>
                <CrearObraSocial />
              </ProtectedRoute>
            </Validacion>
          }
        />
        <Route
          path="/combinacion"
          element={
            <Validacion rol={rol} expected={USER_TYPES.ADMIN}>
              <ProtectedRoute requiredRole={USER_TYPES.ADMIN}>
                <CrearCombinacion />
              </ProtectedRoute>
            </Validacion>
          }
        />
        <Route
          path="/horarios"
          element={
            <Validacion rol={rol} expected={USER_TYPES.ADMIN}>
              <ProtectedRoute requiredRole={USER_TYPES.ADMIN}>
                <CrearHorarios />
              </ProtectedRoute>
            </Validacion>
          }
        />
        <Route
          path="/crearDoc"
          element={
            <Validacion rol={rol} expected={USER_TYPES.ADMIN}>
              <ProtectedRoute requiredRole={USER_TYPES.ADMIN}>
                <CrearDoctor />
              </ProtectedRoute>
            </Validacion>
          }
        />
        <Route
          path="/actualizarDoc/:idDoctor"
          element={
            <Validacion rol={rol} expected={USER_TYPES.ADMIN}>
              <ProtectedRoute requiredRole={USER_TYPES.ADMIN}>
                <ActualizarDoctor />
              </ProtectedRoute>
            </Validacion>
          }
        />
      </Routes>
    </AdministracionProvider>
  );
}
