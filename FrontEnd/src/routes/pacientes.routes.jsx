import { Routes, Route } from 'react-router-dom';
import PacientesProvider from '../context/paciente/PacientesProvider.jsx';
import HomeUsuario from '../pages/users/HomeUsuario.jsx';
import { SacarTurno } from '../pages/users/SacarTurno.jsx';
import { DatosPersonales } from '../pages/users/DatosPersonales.jsx';
import { ModificacionUsuario } from '../pages/users/ModificacionUsuario.jsx';
import { TurnosPaciente } from '../pages/users/TurnosPaciente.jsx';
import { ConfirmacionTurno } from '../pages/users/ConfirmacionTurno.jsx';
import VerEstudios from '../pages/users/VerEstudios.jsx';
import { Validacion } from './Validacion.jsx';
import { ProtectedRoute } from '../components/ProtectedRoute.jsx';
import { useAuth } from '../context/global/AuthProvider.jsx';
import { USER_TYPES } from '../constants/userTypes.js';

export function PacientesRoutes() {
  const { rol } = useAuth();
  return (
    <PacientesProvider>
      <Routes>
        <Route path="/" element={<HomeUsuario />} />
        <Route path="/datospersonales" element={<DatosPersonales />} />
        <Route
          path="/sacarturno"
          element={
            <Validacion rol={rol} esperado={USER_TYPES.PATIENT}>
              <ProtectedRoute requiredRole={USER_TYPES.PATIENT}>
                <SacarTurno />
              </ProtectedRoute>
            </Validacion>
          }
        />
        <Route
          path="/editardatospersonales"
          element={
            <Validacion rol={rol} esperado={USER_TYPES.PATIENT}>
              <ProtectedRoute requiredRole={USER_TYPES.PATIENT}>
                <ModificacionUsuario />
              </ProtectedRoute>
            </Validacion>
          }
        />
        <Route
          path="/confirmacionturno"
          element={
            <Validacion rol={rol} esperado={USER_TYPES.PATIENT}>
              <ProtectedRoute requiredRole={USER_TYPES.PATIENT}>
                <ConfirmacionTurno />
              </ProtectedRoute>
            </Validacion>
          }
        />
        <Route
          path="/verturnos"
          element={
            <Validacion rol={rol} esperado={USER_TYPES.PATIENT}>
              <ProtectedRoute requiredRole={USER_TYPES.PATIENT}>
                <TurnosPaciente />
              </ProtectedRoute>
            </Validacion>
          }
        />
        <Route
          path="/estudios"
          element={
            <Validacion rol={rol} esperado={USER_TYPES.PATIENT}>
              <ProtectedRoute requiredRole={USER_TYPES.PATIENT}>
                <VerEstudios />
              </ProtectedRoute>
            </Validacion>
          }
        />
      </Routes>
    </PacientesProvider>
  );
}
