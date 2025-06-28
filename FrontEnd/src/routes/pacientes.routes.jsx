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
            <Validacion rol={rol} esperado={'Patient'}>
              <ProtectedRoute requiredRole="Patient">
                <SacarTurno />
              </ProtectedRoute>
            </Validacion>
          }
        />
        <Route
          path="/editardatospersonales"
          element={
            <Validacion rol={rol} esperado={'Patient'}>
              <ProtectedRoute requiredRole="Patient">
                <ModificacionUsuario />
              </ProtectedRoute>
            </Validacion>
          }
        />
        <Route
          path="/confirmacionturno"
          element={
            <Validacion rol={rol} esperado={'Patient'}>
              <ProtectedRoute requiredRole="Patient">
                <ConfirmacionTurno />
              </ProtectedRoute>
            </Validacion>
          }
        />
        <Route
          path="/verturnos"
          element={
            <Validacion rol={rol} esperado={'Patient'}>
              <ProtectedRoute requiredRole="Patient">
                <TurnosPaciente />
              </ProtectedRoute>
            </Validacion>
          }
        />
        <Route
          path="/estudios"
          element={
            <Validacion rol={rol} esperado={'Patient'}>
              <ProtectedRoute requiredRole="Patient">
                <VerEstudios />
              </ProtectedRoute>
            </Validacion>
          }
        />
      </Routes>
    </PacientesProvider>
  );
}
