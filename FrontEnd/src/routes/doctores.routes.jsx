import { Routes, Route } from 'react-router-dom';
import DoctoresProvider from '../context/doctores/DoctoresProvider.jsx';
import HomeDoctor from '../pages/doctors/homeDoctor.jsx';
import { TurnosDoctorFecha } from '../pages/doctors/turnosDoctorFecha.jsx';
import { TurnosDoctorHoy } from '../pages/doctors/turnosDoctorHoy.jsx';
import { TurnosDoctorHistorico } from '../pages/doctors/turnosDoctorHistorico.jsx';
import SubirEstudio from '../pages/doctors/subirEstudio.jsx';
import { Validacion } from './validacion.jsx';
import { ProtectedRoute } from '../components/ProtectedRoute.jsx';
import { useAuth } from '../context/global/AuthProvider.jsx';

export function DoctoresRoutes() {
  const { rol } = useAuth();
  return (
    <DoctoresProvider>
      <Routes>
        <Route path="/" element={<HomeDoctor />} />
        <Route
          path="/turnoshist"
          element={
            <Validacion rol={rol} esperado={'Doctor'}>
              <ProtectedRoute requiredRole="Doctor">
                <TurnosDoctorHistorico />
              </ProtectedRoute>
            </Validacion>
          }
        />
        <Route
          path="/turnoshoy"
          element={
            <Validacion rol={rol} esperado={'Doctor'}>
              <ProtectedRoute requiredRole="Doctor">
                <TurnosDoctorHoy />
              </ProtectedRoute>
            </Validacion>
          }
        />
        <Route
          path="/turnosfecha"
          element={
            <Validacion rol={rol} esperado={'Doctor'}>
              <ProtectedRoute requiredRole="Doctor">
                <TurnosDoctorFecha />
              </ProtectedRoute>
            </Validacion>
          }
        />
        <Route
          path="/estudios"
          element={
            <Validacion rol={rol} esperado={'Doctor'}>
              <ProtectedRoute requiredRole="Doctor">
                <SubirEstudio />
              </ProtectedRoute>
            </Validacion>
          }
        />
      </Routes>
    </DoctoresProvider>
  );
}
