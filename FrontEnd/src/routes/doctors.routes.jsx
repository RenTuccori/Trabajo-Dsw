import { Routes, Route } from 'react-router-dom';
import DoctorsProvider from '../context/doctors/DoctorsProvider.jsx';
import DoctorHome from '../pages/doctors/doctorHome.jsx';
import { AppointmentsByDate } from '../pages/doctors/appointmentsByDate.jsx';
import { TodayAppointments } from '../pages/doctors/todayAppointments.jsx';
import { HistoricalAppointments } from '../pages/doctors/historicalAppointments.jsx';
import UploadStudy from '../pages/doctors/uploadStudy.jsx';
import { Validation } from './validation.jsx';
import { ProtectedRoute } from '../components/ProtectedRoute.jsx';
import { useAuth } from '../context/global/AuthProvider.jsx';

export function DoctoresRoutes() {
  const { rol } = useAuth();
  return (
    <DoctorsProvider>
      <Routes>
        <Route path="/" element={<DoctorHome />} />
        <Route
          path="/turnoshist"
          element={
            <Validation rol={rol} esperado={'Doctor'}>
              <ProtectedRoute requiredRole="Doctor">
                <HistoricalAppointments />
              </ProtectedRoute>
            </Validation>
          }
        />
        <Route
          path="/turnoshoy"
          element={
            <Validation rol={rol} esperado={'Doctor'}>
              <ProtectedRoute requiredRole="Doctor">
                <TodayAppointments />
              </ProtectedRoute>
            </Validation>
          }
        />
        <Route
          path="/turnosfecha"
          element={
            <Validation rol={rol} esperado={'Doctor'}>
              <ProtectedRoute requiredRole="Doctor">
                <AppointmentsByDate />
              </ProtectedRoute>
            </Validation>
          }
        />
        <Route
          path="/estudios"
          element={
            <Validation rol={rol} esperado={'Doctor'}>
              <ProtectedRoute requiredRole="Doctor">
                <UploadStudy />
              </ProtectedRoute>
            </Validation>
          }
        />
      </Routes>
    </DoctorsProvider>
  );
}
