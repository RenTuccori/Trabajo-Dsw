import { Routes, Route } from 'react-router-dom';
import AdministracionProvider from '../context/administracion/AdministracionProvider.jsx';
import HomeAdministracion from '../pages/administration/homeAdministracion.jsx';
import { CrearSede } from '../pages/administration/crearSede.jsx';
import { CrearEspecialidad } from '../pages/administration/crearEspecialidad.jsx';
import { CrearObraSocial } from '../pages/administration/crearObraSocial.jsx';
import { CrearCombinacion } from '../pages/administration/crearCombinacion.jsx';
import { CrearDoctor } from '../pages/administration/crearDoctor.jsx';
import { ActualizarDoctor } from '../pages/administration/actualizarDoctor.jsx';
import { CrearHorarios } from '../pages/administration/crearHorarios.jsx';
import { Validacion } from './validacion.jsx';
import { ProtectedRoute } from '../components/ProtectedRoute.jsx';
import { useAuth } from '../context/global/AuthProvider.jsx';

export function AdministracionRoutes() {
  const { rol } = useAuth();

  return (
    <AdministracionProvider>
      <Routes>
        <Route path="/" element={<HomeAdministracion />} />
        <Route
          path="/crearSede"
          element={
            <Validacion rol={rol} esperado={'A'}>
              <ProtectedRoute requiredRole="A">
                <CrearSede />
              </ProtectedRoute>
            </Validacion>
          }
        />
        <Route
          path="/crearEsp"
          element={
            <Validacion rol={rol} esperado={'A'}>
              <ProtectedRoute requiredRole="A">
                <CrearEspecialidad />
              </ProtectedRoute>
            </Validacion>
          }
        />
        <Route
          path="/crearOS"
          element={
            <Validacion rol={rol} esperado={'A'}>
              <ProtectedRoute requiredRole="A">
                <CrearObraSocial />
              </ProtectedRoute>
            </Validacion>
          }
        />
        <Route
          path="/combinacion"
          element={
            <Validacion rol={rol} esperado={'A'}>
              <ProtectedRoute requiredRole="A">
                <CrearCombinacion />
              </ProtectedRoute>
            </Validacion>
          }
        />
        <Route
          path="/horarios"
          element={
            <Validacion rol={rol} esperado={'A'}>
              <ProtectedRoute requiredRole="A">
                <CrearHorarios />
              </ProtectedRoute>
            </Validacion>
          }
        />
        <Route
          path="/crearDoc"
          element={
            <Validacion rol={rol} esperado={'A'}>
              <ProtectedRoute requiredRole="A">
                <CrearDoctor />
              </ProtectedRoute>
            </Validacion>
          }
        />
        <Route
          path="/actualizarDoc/:idDoctor"
          element={
            <Validacion rol={rol} esperado={'A'}>
              <ProtectedRoute requiredRole="A">
                <ActualizarDoctor />
              </ProtectedRoute>
            </Validacion>
          }
        />
      </Routes>
    </AdministracionProvider>
  );
}
