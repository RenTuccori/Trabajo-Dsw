import { Routes, Route } from 'react-router-dom';
import PacientesProvider from '../context/paciente/PacientesProvider.jsx';
import HomeUsuario from '../pages/users/homeUsuario.jsx';
import { SacarTurno } from '../pages/users/sacarturno.jsx';
import { DatosPersonales } from '../pages/users/datospersonales.jsx';
import { ModificacionUsuario } from '../pages/users/modificacionUsuario.jsx';
import { TurnosPaciente } from '../pages/users/turnosPaciente.jsx';
import { ConfirmacionTurno } from '../pages/users/confirmacionTurno';
import VerEstudios from '../pages/users/verEstudios.jsx';
import { Validacion } from './validacion.jsx';
import { ProtectedRoute } from '../components/ProtectedRoute.jsx';
import { useAuth } from '../context/global/AuthProvider.jsx';

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
            <Validacion rol={rol} esperado={'P'}>
              <ProtectedRoute requiredRole="P">
                <SacarTurno />
              </ProtectedRoute>
            </Validacion>
          }
        />
        <Route
          path="/editardatospersonales"
          element={
            <Validacion rol={rol} esperado={'P'}>
              <ProtectedRoute requiredRole="P">
                <ModificacionUsuario />
              </ProtectedRoute>
            </Validacion>
          }
        />
        <Route
          path="/confirmacionturno"
          element={
            <Validacion rol={rol} esperado={'P'}>
              <ProtectedRoute requiredRole="P">
                <ConfirmacionTurno />
              </ProtectedRoute>
            </Validacion>
          }
        />
        <Route
          path="/verturnos"
          element={
            <Validacion rol={rol} esperado={'P'}>
              <ProtectedRoute requiredRole="P">
                <TurnosPaciente />
              </ProtectedRoute>
            </Validacion>
          }
        />
        <Route
          path="/estudios"
          element={
            <Validacion rol={rol} esperado={'P'}>
              <ProtectedRoute requiredRole="P">
                <VerEstudios />
              </ProtectedRoute>
            </Validacion>
          }
        />
      </Routes>
    </PacientesProvider>
  );
}
