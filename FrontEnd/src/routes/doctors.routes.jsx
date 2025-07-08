import { Routes, Route } from 'react-router-dom';
import DoctorsProvider from '../context/doctors/DoctorsProvider.jsx';
import DoctorHome from '../pages/doctors/doctorHome.jsx';
import { AppointmentsByDate } from '../pages/doctors/appointmentsByDate.jsx';
import { TodayAppointments } from '../pages/doctors/todayAppointments.jsx';
import { HistoricalAppointments } from '../pages/doctors/historicalAppointments.jsx';
import UploadStudy from '../pages/doctors/uploadStudy.jsx';
import { validation } from './validation.jsx';
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
            <validation rol={rol} esperado={'Doctor'}>
              <ProtectedRoute requiredRole="Doctor">
                <HistoricalAppointments />
              </ProtectedRoute>
            </validation>
          }
        />
        <Route
          path="/turnoshoy"
          element={
            <validation rol={rol} esperado={'Doctor'}>
              <ProtectedRoute requiredRole="Doctor">
                <TodayAppointments />
              </ProtectedRoute>
            </validation>
          }
        />
        <Route
          path="/turnosfecha"
          element={
            <validation rol={rol} esperado={'Doctor'}>
              <ProtectedRoute requiredRole="Doctor">
                <AppointmentsByDate />
              </ProtectedRoute>
            </validation>
          }
        />
        <Route
          path="/estudios"
          element={
            <validation rol={rol} esperado={'Doctor'}>
              <ProtectedRoute requiredRole="Doctor">
                <UploadStudy />
              </ProtectedRoute>
            </validation>
          }
        />
      </Routes>
    </DoctorsProvider>
  );
}



