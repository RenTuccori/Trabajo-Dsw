import { Routes, Route } from 'react-router-dom';
import DoctoresProvider from '../context/doctores/DoctoresProvider.jsx';
import HomeDoctor from '../pages/doctors/HomeDoctor.jsx';
import { TurnosDoctorFecha } from '../pages/doctors/TurnosDoctorFecha.jsx';
import { TurnosDoctorHoy } from '../pages/doctors/TurnosDoctorHoy.jsx';
import { TurnosDoctorHistorico } from '../pages/doctors/TurnosDoctorHistorico.jsx';
import SubirEstudio from '../pages/doctors/SubirEstudio.jsx';
import { Validacion } from './Validacion.jsx';
import { ProtectedRoute } from '../components/ProtectedRoute.jsx';
import { useAuth } from '../context/global/AuthProvider.jsx';
import { USER_TYPES } from '../constants/userTypes.js';

export function DoctoresRoutes() {
  const { rol } = useAuth();
  return (
    <DoctoresProvider>
      <Routes>
        <Route path="/" element={<HomeDoctor />} />
        <Route
          path="/turnoshist"
          element={
            <Validacion rol={rol} esperado={USER_TYPES.DOCTOR}>
              <ProtectedRoute requiredRole={USER_TYPES.DOCTOR}>
                <TurnosDoctorHistorico />
              </ProtectedRoute>
            </Validacion>
          }
        />
        <Route
          path="/turnoshoy"
          element={
            <Validacion rol={rol} esperado={USER_TYPES.DOCTOR}>
              <ProtectedRoute requiredRole={USER_TYPES.DOCTOR}>
                <TurnosDoctorHoy />
              </ProtectedRoute>
            </Validacion>
          }
        />
        <Route
          path="/turnosfecha"
          element={
            <Validacion rol={rol} esperado={USER_TYPES.DOCTOR}>
              <ProtectedRoute requiredRole={USER_TYPES.DOCTOR}>
                <TurnosDoctorFecha />
              </ProtectedRoute>
            </Validacion>
          }
        />
        <Route
          path="/estudios"
          element={
            <Validacion rol={rol} esperado={USER_TYPES.DOCTOR}>
              <ProtectedRoute requiredRole={USER_TYPES.DOCTOR}>
                <SubirEstudio />
              </ProtectedRoute>
            </Validacion>
          }
        />
      </Routes>
    </DoctoresProvider>
  );
}
